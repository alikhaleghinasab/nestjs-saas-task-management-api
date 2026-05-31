import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { RabbitMQConfigType } from '../config/rabbitmq.config';

@Injectable()
export class RabbitMQConnectionManager
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RabbitMQConnectionManager.name);

  private static readonly MAX_RECONNECT_ATTEMPTS = 5;
  private static readonly BASE_DELAY_MS = 5000;

  private connection?: amqp.Connection;
  private channel?: amqp.Channel;

  private connectionUrl!: string;

  private connecting = false;
  private reconnectAttempts = 0;

  private connectionReady: Promise<void>;
  private resolveConnectionReady?: () => void;

  constructor(private readonly configService: ConfigService) {
    this.connectionReady = new Promise((resolve) => {
      this.resolveConnectionReady = resolve;
    });
  }

  async onModuleInit(): Promise<void> {
    const config = this.configService.get<RabbitMQConfigType>('rabbitMQ');

    this.connectionUrl = this.buildConnectionUrl(config);

    await this.establishConnection();
  }

  async onModuleDestroy(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (err) {
      this.logger.error('Error closing RabbitMQ connection', err);
    }
  }

  async waitUntilReady(): Promise<void> {
    return this.connectionReady;
  }

  getChannel(): amqp.Channel {
    if (!this.channel) {
      throw new Error('RabbitMQ channel is not initialized');
    }
    return this.channel;
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

      if (this.resolveConnectionReady) {
        this.resolveConnectionReady();
        this.resolveConnectionReady = undefined;
      }
    } catch (err) {
      this.logger.error('RabbitMQ connection failed', err);
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
    if (
      this.reconnectAttempts >= RabbitMQConnectionManager.MAX_RECONNECT_ATTEMPTS
    ) {
      this.logger.error(
        `RabbitMQ failed to reconnect after ${this.reconnectAttempts} attempts`,
      );
      return;
    }

    this.reconnectAttempts++;

    const delay = this.calculateBackoffDelay();

    this.logger.warn(
      `Reconnecting to RabbitMQ (attempt ${this.reconnectAttempts}) in ${delay}ms`,
    );

    setTimeout(() => this.establishConnection(), delay);
  }

  private calculateBackoffDelay(): number {
    const base = RabbitMQConnectionManager.BASE_DELAY_MS;
    const attempt = this.reconnectAttempts;
    const exponential = base * 2 ** (attempt - 1);
    const maxDelay = 60000;
    const jitter = exponential * (Math.random() * 0.2 - 0.1); // ±10%
    return Math.min(exponential + jitter, maxDelay);
  }

  private attachListeners(): void {
    if (!this.connection) return;

    this.connection.on('close', () => {
      this.logger.warn('RabbitMQ connection closed');
      // TODO: Reconnected channels currently do not restore active consumers.
      // Consumer re-registration should be implemented if automatic recovery is required.
      this.scheduleReconnect();
    });

    this.connection.on('error', (err) => {
      this.logger.error('RabbitMQ connection error', err);
    });
  }
}
