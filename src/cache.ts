export class Cache {
  private cache: Map<string, { value: any; expiry: number }> = new Map();

  public get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;

    if (item.expiry && item.expiry < Date.now()) {
      this.delete(key);
      return null;
    }

    return item.value;
  }

  public set(key: string, value: any, ttl?: number): void {
    const expiry = ttl ? Date.now() + ttl : undefined;
    this.cache.set(key, { value, expiry });
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry && item.expiry < now) {
        this.delete(key);
      }
    }
  }
}
