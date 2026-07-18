import { Storage, Bucket } from "@google-cloud/storage";
import { EventType } from "@utils";

export class GscClient {

  private storage: Storage;
  private bucket: Bucket

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

  public async getEventIds(eventType: EventType) {

    const prefix = `Event/${eventType}/`;

    const [files] = await this.bucket.getFiles({ prefix });

    const ids = new Set<string>();

    for (const file of files) {

      const parts = file.name.split("/");
      if (
      parts.length === 4 &&
      parts[0] === "Event" &&
      parts[1] === eventType &&
      parts[2].trim().length > 0 &&
      parts[3] === "event.json"
    ) {
      ids.add(parts[2]);
    }
    }
    return [...ids].sort();
  }
}

export const gsc = new GscClient("serviceAccount.json", "btd6api");