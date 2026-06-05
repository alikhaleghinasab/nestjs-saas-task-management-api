import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { RabbitMQConfigType } from '../config/rabbitmq.config';
import { RabbitMQConnectionHandler } from '@rabbitmq/types/rabbitmq-connection-handler.type';

@Injectable()
export class RabbitMQConnectionManager
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RabbitMQConnectionManager.name);

  private static readonly BASE_DELAY_MS = 5000;

  private connection?: amqp.Connection;
  private channel?: amqp.Channel;
  private reconnectTimer?: NodeJS.Timeout;
  private readonly connectionHandlers = new Set<RabbitMQConnectionHandler>();

  private connectionUrl!: string;

  private connecting = false;
  private shuttingDown = false;
  private reconnectAttempts = 0;
  private retriesCount!: number;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit(): Promise<void> {
    const config = this.configService.get<RabbitMQConfigType>('rabbitMQ');

    this.connectionUrl = this.buildConnectionUrl(config);
    this.retriesCount = config.retriesCount;

    void this.establishConnection();
  }

  async onModuleDestroy(): Promise<void> {
    try {
      this.shuttingDown = true;

      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = undefined;
      }

      await this.channel?.close();
      await this.connection?.close();
      this.channel = undefined;
      this.connection = undefined;
    } catch (err) {
      this.logger.error('Error closing RabbitMQ connection', err);
    }
  }

  async waitUntilReady(): Promise<void> {
    if (this.isConnected()) {
      return;
    }

    this.logger.warn('RabbitMQ is unavailable; continuing in degraded mode');
  }

  getChannel(): amqp.Channel | undefined {
    return this.channel;
  }

  onConnected(handler: RabbitMQConnectionHandler): void {
    this.connectionHandlers.add(handler);
  }

  public isConnected(): boolean {
    return !!this.connection && !!this.channel && !this.connecting;
  }

  private async establishConnection(): Promise<void> {
    if (this.connecting) return;

    this.connecting = true;

    try {
      this.connection = await amqp.connect(this.connectionUrl);
      this.channel = await this.connection.createChannel();
      await this.channel.prefetch(10);

      this.attachListeners();

      this.reconnectAttempts = 0;
      this.logger.log('RabbitMQ connected');

      await this.runConnectionHandlers(this.channel);
    } catch (err) {
      this.logger.error('RabbitMQ connection failed', err);
      this.connection = undefined;
      this.channel = undefined;
      this.scheduleReconnect();
    } finally {
      this.connecting = false;
    }
  }

  private buildConnectionUrl(config: RabbitMQConfigType): string {
    const auth =
      config.user && config.password
        ? `${config.user}:${config.password}@`
        : '';

    return `${config.protocol}://${auth}${config.host}:${config.port}`;
  }

  private scheduleReconnect(): void {
    if (this.shuttingDown || this.reconnectTimer) {
      return;
    }

    this.reconnectAttempts++;

    if (this.shouldStopReconnect()) {
      return;
    }

    const delay = this.calculateBackoffDelay();

    this.logger.warn(
      `Reconnecting to RabbitMQ (attempt ${this.reconnectAttempts}) in ${delay}ms`,
    );

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined;
      void this.establishConnection();
    }, delay);
  }

  private async runConnectionHandlers(channel: amqp.Channel): Promise<void> {
    await Promise.allSettled(
      [...this.connectionHandlers].map((handler) =>
        this.runConnectionHandler(handler, channel),
      ),
    );
  }

  private async runConnectionHandler(
    handler: RabbitMQConnectionHandler,
    channel: amqp.Channel,
  ): Promise<void> {
    try {
      await handler(channel);
    } catch (err) {
      this.logger.error('RabbitMQ connection handler failed', err);
    }
  }

  private calculateBackoffDelay(): number {
    const base = RabbitMQConnectionManager.BASE_DELAY_MS;
    const attempt = this.reconnectAttempts;
    const exponential = base * 2 ** (attempt - 1);
    const maxDelay = 60000;
    const jitter = exponential * (Math.random() * 0.2 - 0.1); // ±10%
    return Math.min(exponential + jitter, maxDelay);
  }

  private shouldStopReconnect(): boolean {
    if (this.retriesCount > 0 && this.reconnectAttempts > this.retriesCount) {
      this.logger.error(
        `RabbitMQ failed after ${this.reconnectAttempts - 1} retries. Stopping reconnect.`,
      );
      return true;
    }

    return false;
  }

  private attachListeners(): void {
    if (!this.connection) return;

    this.connection.on('close', () => {
      this.logger.warn('RabbitMQ connection closed');
      // TODO: Reconnected channels currently do not restore active consumers.
      // Consumer re-registration should be implemented if automatic recovery is required.

      this.connection = undefined;
      this.channel = undefined;

      this.scheduleReconnect();
    });

    this.connection.on('error', (err) => {
      this.logger.error('RabbitMQ connection error', err);
    });
  }
}
