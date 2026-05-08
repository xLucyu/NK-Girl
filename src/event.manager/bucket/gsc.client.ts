import { Storage, Bucket } from "@google-cloud/storage";

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
}

const gsc = new GscClient("serviceAccount.json", "btd6api");
