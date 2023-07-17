export interface Data {
  insert: <T>(table: string, document: T) => Promise<T>;
  update: <T>(table: string, id: string, document: Partial<T>) => Promise<T>;
}
