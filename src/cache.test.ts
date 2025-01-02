import { Cache } from "./cache";
import { describe, it, expect, beforeEach } from "vitest";

describe("Cache", () => {
  let cache: Cache;

  beforeEach(() => {
    cache = new Cache();
  });

  it("should store and retrieve values", () => {
    cache.set("key1", "value1");
    expect(cache.get("key1")).toBe("value1");
  });

  it("should return null for non-existent keys", () => {
    expect(cache.get("nonexistent")).toBeNull();
  });

  it("should delete values", () => {
    cache.set("key1", "value1");
    cache.delete("key1");
    expect(cache.get("key1")).toBeNull();
  });

  it("should expire values after TTL", async () => {
    const ttl = 100; // 100ms
    cache.set("key1", "value1", ttl);
    expect(cache.get("key1")).toBe("value1");

    await new Promise((resolve) => setTimeout(resolve, ttl + 10));
    expect(cache.get("key1")).toBeNull();
  });

  it("should not expire values when TTL is not set", async () => {
    cache.set("key1", "value1");
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(cache.get("key1")).toBe("value1");
  });

  it("should handle multiple values with different TTLs", async () => {
    cache.set("key1", "value1", 100);
    cache.set("key2", "value2", 200);
    cache.set("key3", "value3");

    await new Promise((resolve) => setTimeout(resolve, 150));

    expect(cache.get("key1")).toBeNull();
    expect(cache.get("key2")).toBe("value2");
    expect(cache.get("key3")).toBe("value3");
  });
});
