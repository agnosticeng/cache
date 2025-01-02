interface ICache {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

abstract class BaseCache implements ICache {
  protected async getHash(key: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  abstract get(key: string): Promise<any>;
  abstract set(key: string, value: any, ttl?: number): Promise<void>;
  abstract delete(key: string): Promise<void>;
  public abstract cleanup(): Promise<void>;
}

export class MemoryCache extends BaseCache {
  private cache: Map<string, { value: any; expiry: number | undefined }> =
    new Map();

  public async get(key: string): Promise<any> {
    const hashedKey = await this.getHash(key);
    const item = this.cache.get(hashedKey);
    if (!item) return null;

    if (item.expiry && item.expiry < Date.now()) {
      await this.delete(hashedKey);
      return null;
    }

    return item.value;
  }

  public async set(key: string, value: any, ttl?: number): Promise<void> {
    const hashedKey = await this.getHash(key);
    const expiry = ttl ? Date.now() + ttl : undefined;
    this.cache.set(hashedKey, { value, expiry });
  }

  public async delete(key: string): Promise<void> {
    const hashedKey = await this.getHash(key);
    this.cache.delete(hashedKey);
  }

  public async cleanup(): Promise<void> {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiry && item.expiry < now) {
        await this.delete(key);
      }
    }
  }
}

interface IndexedDBCacheOptions {
  dbName?: string;
  storeName?: string;
}

export class IndexedDBCache extends BaseCache {
  private dbName: string;
  private storeName: string;
  private db!: IDBDatabase;
  private dbInitialized: Promise<void>;

  constructor(options: IndexedDBCacheOptions = {}) {
    super();
    this.dbName = options.dbName || "default-db";
    this.storeName = options.storeName || "default-store";
    this.dbInitialized = this.initDB();
  }

  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as any).result;
        db.createObjectStore(this.storeName);
      };
    });
  }

  public async get(key: string): Promise<any> {
    await this.dbInitialized;
    const hashedKey = await this.getHash(key);
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readonly");
      const store = transaction.objectStore(this.storeName);
      const request = store.get(hashedKey);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const item = request.result;
        if (!item) resolve(null);
        else if (item.expiry && item.expiry < Date.now()) {
          this.delete(hashedKey).then(() => resolve(null));
        } else {
          resolve(item.value);
        }
      };
    });
  }

  public async set(key: string, value: any, ttl?: number): Promise<void> {
    await this.dbInitialized;
    const hashedKey = await this.getHash(key);
    const expiry = ttl ? Date.now() + ttl : undefined;

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.put({ value, expiry }, hashedKey);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async delete(key: string): Promise<void> {
    await this.dbInitialized;
    const hashedKey = await this.getHash(key);

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.delete(hashedKey);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  public async cleanup(): Promise<void> {
    await this.dbInitialized;
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(this.storeName, "readwrite");
      const store = transaction.objectStore(this.storeName);
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = async () => {
        const now = Date.now();
        const items = request.result;

        for (const item of items) {
          if (item.expiry && item.expiry < now) {
            await this.delete(item.key);
          }
        }
        resolve();
      };
    });
  }
}
