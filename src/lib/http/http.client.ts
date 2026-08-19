import { 
  RequestNoSuccess, 
  ServerDown, 
  sleep 
} from "@lib";

const RETRIES = 3;
const RETRY_DELAY = 2_000;
const TIMEOUT = 10_000;

export async function getData<T>(url: string, headers?: HeadersInit): Promise<T> {

  for (let attempt = 0; attempt <= RETRIES; attempt++) {

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {

      const response = await fetch(url, {
        headers,
        signal: controller.signal,
      });

      if (response.ok) return await response.json() as T;
      
      switch (response.status) {

        case 400:
        case 403:
        case 404:
          throw new RequestNoSuccess();

        case 429:
        case 500:
        case 502:
        case 503:
        case 504:
          if (attempt < RETRIES) {
            await sleep(RETRY_DELAY);
            continue;
          }

          throw new ServerDown();

        default:
          throw new RequestNoSuccess();
      }
    } catch (error) {

      if (error instanceof RequestNoSuccess || error instanceof ServerDown) {
        throw error;
      }

      if (attempt < RETRIES) {
        await sleep(RETRY_DELAY);
        continue;
      }

      throw new ServerDown();
    } finally {
      clearTimeout(timeoutId);
    }
  }
  throw new ServerDown();
}