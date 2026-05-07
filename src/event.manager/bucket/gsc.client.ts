import { Storage, Bucket } from "@google-cloud/storage";

export class GscClient {

    private storage: Storage;

    constructor(filename: string) {
        this.storage = new Storage({ keyFilename: filename });
    }

    public getBucket(bucketName: string): Bucket {
        return this.storage.bucket(bucketName);
    }

    public async write(bucket: Bucket, path: string, data: unknown): Promise<void> {
        
        await bucket.file(path).save(JSON.stringify(data, null, 2), {
            contentType: "application/json",
            resumable: false,
        });
    }
}
