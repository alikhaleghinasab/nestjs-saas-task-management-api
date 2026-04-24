export interface MessageConsumer {
  subscribe(
    event: string,
    handler: (payload: any) => Promise<void>,
  ): Promise<void>;
}
