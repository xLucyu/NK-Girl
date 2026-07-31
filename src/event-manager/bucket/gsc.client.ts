import { Storage, Bucket } from "@google-cloud/storage";
import { EventType } from "@utils";

export type BucketRoot = "Event" | "Leaderboard";

interface CacheEntry {
  ids: string[];
  expiresAt: number;
}

const TTL = 1000 * 60 * 60 * 24;   // 1d

export class GscClient {

  private storage: Storage;
  private bucket: Bucket;
  private cache = new Map<string, CacheEntry>();

  constructor(filename: string, bucketName: string) {
    this.storage = new Storage({ keyFilename: filename });
    this.bucket = this.storage.bucket(bucketName);
  }

  public async write(path: string, data: unknown): Promise<void> {
    await this.bucket.file(path).save(JSON.stringify(data, null, 2), {
      contentType: "application/json",
      resumable: false,
    });
  }

  public async getEventIds(
    eventType: EventType,
    options: { root?: BucketRoot; refresh?: boolean } = {},
  ): Promise<string[]> {

    const { root = "Event", refresh = false } = options;
    const key = `${root}:${eventType}`;

    const cached = this.cache.get(key);
    if (!refresh && cached && cached.expiresAt > Date.now()) return cached.ids;

    const prefix = `${root}/${eventType}/`;
    const [files] = await this.bucket.getFiles({ prefix });

    const ids = new Set<string>();

    for (const file of files) {
      const parts = file.name.split("/");

      // prefix already guarantees parts[0]/parts[1]; we only need a
      // non-empty id and an actual file at the end, not a folder marker
      if (parts.length >= 4 && parts[2].trim().length > 0 && parts.at(-1)!.endsWith(".json")) {
        ids.add(parts[2]);
      }
    }

    const result = [...ids].sort();
    this.cache.set(key, { ids: result, expiresAt: Date.now() + TTL });

    return result;
  }

  public invalidate(eventType?: EventType, root?: BucketRoot): void {
    if (!eventType) return void this.cache.clear();
    if (root) return void this.cache.delete(`${root}:${eventType}`);
    for (const key of this.cache.keys()) {
      if (key.endsWith(`:${eventType}`)) this.cache.delete(key);
    }
  }
}

export const gsc = new GscClient("serviceAccount.json", "btd6api");
