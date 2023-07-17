export interface Cache {
  get: <T>(key: string) => Promise<T>;
  set: <T>(
    key: string,
    data: T,
    options?: Partial<{ ttl: number }>,
  ) => Promise<void>;
}
