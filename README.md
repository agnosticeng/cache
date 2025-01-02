# @agnosticeng/cache

A versatile caching library providing implementations for in-memory and IndexedDB storage with support for key-value pairs and TTL (Time To Live).

## Features

- Two cache implementations: Memory Cache and IndexedDB Cache
- Hashed keys for secure storage
- TTL support for auto-expiring entries
- Promise-based async API
- TypeScript support

## Installation

```bash
npm install @agnosticeng/cache
```

## Usage

### Memory Cache

```typescript
import { MemoryCache } from '@agnosticeng/cache';

const cache = new MemoryCache();

// Store a value
await cache.set('key', 'value');

// Store with TTL (Time To Live) in milliseconds
await cache.set('key', 'value', 60000); // Expires in 1 minute

// Retrieve a value
const value = await cache.get('key');

// Delete a value
await cache.delete('key');
```

### IndexedDB Cache

```typescript
import { IndexedDBCache } from '@agnosticeng/cache';

const cache = new IndexedDBCache({
  dbName: 'my-cache-db',
  storeName: 'my-store'
});

// Store a value
await cache.set('key', 'value');

// Store with TTL
await cache.set('key', 'value', 60000); // Expires in 1 minute

// Retrieve a value
const value = await cache.get('key');

// Delete a value
await cache.delete('key');
```

## API

### ICache Interface

```typescript
interface ICache {
  get(key: string): Promise<any>;
  set(key: string, value: any, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}
```

### MemoryCache Class

- `constructor()`: Creates a new in-memory cache instance
- `get(key: string): Promise<any>`: Retrieves a value by key
- `set(key: string, value: any, ttl?: number): Promise<void>`: Stores a value with optional TTL
- `delete(key: string): Promise<void>`: Deletes a value by key

### IndexedDBCache Class

- `constructor(options?: IndexedDBCacheOptions)`: Creates a new IndexedDB cache instance
- `get(key: string): Promise<any>`: Retrieves a value by key
- `set(key: string, value: any, ttl?: number): Promise<void>`: Stores a value with optional TTL
- `delete(key: string): Promise<void>`: Deletes a value by key

#### IndexedDBCacheOptions

```typescript
interface IndexedDBCacheOptions {
  dbName?: string;     // Database name (default: 'default-db')
  storeName?: string;  // Store name (default: 'default-store')
}
```

## Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Commit your changes: `git commit -m 'Add some amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

Please make sure to:
- Update the README.md with details of changes if applicable
- Update any documentation if needed
- Add tests for new features
- Follow the existing code style
- Reference any relevant issues in your PR

## License

MIT License

Copyright (c) 2024 Agnostic

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
