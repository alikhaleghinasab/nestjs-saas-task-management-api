export interface CacheProviderInterface {
  set(key: string, value: string, ttl?: number): Promise<void>;

  get(key: string): Promise<string | null>;

  del(key: string): Promise<number>;

  exists(key: string): Promise<boolean>;

  expire(key: string, seconds: number): Promise<number>;
}
