const MAX_CACHE_BYTES = 512 * 1024 * 1024;

class ImageBufferCache {

  private readonly cache = new Map<string, Buffer>();
  private readonly inFlight = new Map<string, Promise<Buffer>>();
  private currentBytes = 0;

  public async getOrSet(key: string, factory: () => Promise<Buffer>): Promise<Buffer> {

    const cached = this.cache.get(key);

    if (cached) {
      this.cache.delete(key);
      this.cache.set(key, cached);
      return cached;
    }

    const pending = this.inFlight.get(key);
    if (pending) return pending;

    const promise = factory().then(buffer => {
      this.set(key, buffer);
      return buffer;
    }).finally(() => {
      this.inFlight.delete(key);
    });

    this.inFlight.set(key,promise);
    return promise;
  }


  private set(key: string, buffer: Buffer): void {

    const existing = this.cache.get(key);

    if (existing) {
      this.currentBytes -= existing.byteLength;
      this.cache.delete(key);
    }

    this.cache.set(key, buffer);
    this.currentBytes += buffer.byteLength;

    while (this.currentBytes > MAX_CACHE_BYTES && this.cache.size > 0) {

      const oldestKey = this.cache.keys().next().value;
      if (!oldestKey) break;

      const oldestBuffer = this.cache.get(oldestKey);
      if (oldestBuffer) this.currentBytes -= oldestBuffer.byteLength;
      
      this.cache.delete(oldestKey);
    }
  }


  public clear(): void {

    this.cache.clear();
    this.currentBytes = 0;
  }
}


export function createImageCacheKey(scope: string, identity: string, options?: unknown): string {

  return [
    scope,
    identity,
    JSON.stringify(options ?? {})
  ].join("|");
}

export const imageBufferCache = new ImageBufferCache();
