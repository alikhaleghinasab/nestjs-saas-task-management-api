import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';
import { RabbitMQConfigType } from '../config/rabbitmq.config';
import { RabbitMQLifecycle } from '@rabbitmq/lifecycle/rabbitmq-lifecycle.service';

@Injectable()
export class RabbitMQConnectionManager
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(RabbitMQConnectionManager.name);

  private static readonly BASE_DELAY_MS = 5000;

  private connection?: amqp.ChannelModel;
  private channel?: amqp.Channel;
  private reconnectTimer?: NodeJS.Timeout;

  private connectionUrl!: string;

  private connecting = false;
  private shuttingDown = false;
  private reconnectAttempts = 0;
  private retriesCount!: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly lifecycle: RabbitMQLifecycle,
  ) {}

  async onModuleInit(): Promise<void> {
    const config = this.configService.get<RabbitMQConfigType>('rabbitMQ');

    this.connectionUrl = this.buildConnectionUrl(config);
    this.retriesCount = config.retriesCount;

    void this.establishConnection();
  }

  async onModuleDestroy(): Promise<void> {
    this.shuttingDown = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    await this.channel?.close();
    await this.connection?.close();

    this.lifecycle.reset();
  }

  getChannel(): amqp.Channel | undefined {
    return this.channel;
  }

  isConnected(): boolean {
    return !!this.connection && !!this.channel && !this.connecting;
  }

  private async establishConnection(): Promise<void> {
    if (this.connecting) {
      return;
    }

    this.connecting = true;

    try {
      this.connection = await amqp.connect(this.connectionUrl);

      this.channel = await this.connection.createChannel();

      await this.channel.prefetch(10);

      this.attachListeners();

      this.reconnectAttempts = 0;

      this.logger.log('RabbitMQ connected');

      await this.lifecycle.notifyConnected(this.channel);
    } catch (error) {
      this.logger.error('RabbitMQ connection failed', error);

      this.connection = undefined;
      this.channel = undefined;

      this.lifecycle.reset();

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

  private attachListeners(): void {
    if (!this.connection) {
      return;
    }

    this.connection.on('close', () => {
      this.logger.warn('RabbitMQ connection closed');

      this.connection = undefined;
      this.channel = undefined;

      this.lifecycle.reset();

      this.scheduleReconnect();
    });

    this.connection.on('error', (error) => {
      this.logger.error('RabbitMQ connection error', error);
    });
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
}
