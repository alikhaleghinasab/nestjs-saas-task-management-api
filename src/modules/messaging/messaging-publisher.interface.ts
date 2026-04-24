export interface MessagePublisher {
  publish<T>(event: string, payload: T): Promise<void>;
}
