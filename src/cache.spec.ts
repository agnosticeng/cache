import { describe, it, expect, vi, beforeAll } from "vitest";
import { MemoryCache, IndexedDBCache } from "./cache";

describe("MemoryCache", () => {
  let cache: MemoryCache;

  beforeAll(() => {
    cache = new MemoryCache();
  });

  it("should store and retrieve values", async () => {
    await cache.set("key", "value");
    const result = await cache.get("key");
    expect(result).toBe("value");
  });

  it("should delete values", async () => {
    await cache.set("key", "value");
    await cache.delete("key");
    const result = await cache.get("key");
    expect(result).toBeNull();
  });

  it("should handle TTL expiry", async () => {
    vi.useFakeTimers();
    await cache.set("key", "value", 1000);
    const immediate = await cache.get("key");
    expect(immediate).toBe("value");

    vi.advanceTimersByTime(1500);
    const after = await cache.get("key");
    expect(after).toBeNull();
    vi.useRealTimers();
  });
});

describe("IndexedDBCache", () => {
  let cache: IndexedDBCache;
  const TEST_DB = "test-db";
  const TEST_STORE = "test-store";

  beforeAll(async () => {
    cache = new IndexedDBCache({
      dbName: TEST_DB,
      storeName: TEST_STORE,
    });
  });

  it("should store and retrieve values", async () => {
    await cache.set("key", "value");
    const result = await cache.get("key");
    expect(result).toBe("value");
  });

  it("should delete values", async () => {
    await cache.set("key", "value");
    await cache.delete("key");
    const result = await cache.get("key");
    expect(result).toBeNull();
  });

  it("should handle TTL expiry", async () => {
    vi.useFakeTimers();
    await cache.set("key", "value", 1000);
    const immediate = await cache.get("key");
    expect(immediate).toBe("value");

    vi.advanceTimersByTime(1500);
    const after = await cache.get("key");
    expect(after).toBeNull();
    vi.useRealTimers();
  });
});
