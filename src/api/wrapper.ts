import { 
  RequestNoSuccess, 
  ServerDown, 
  sleep 
} from "@utils";

const RETRIES = 3;
const RETRY_DELAY = 2_000;
const TIMEOUT = 10_000

export async function getData<T>(url: string, headers?: HeadersInit): Promise<T> {

  for (let attempt = 0; attempt <= RETRIES; attempt++) {

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    try {
      const response = await fetch(url, {
        headers,
        signal: controller.signal 
      });
      clearTimeout(timeoutId);

      switch (response.status) {

        case 200:
          return await response.json() as T;
        
        case 400:
        case 403:
        case 404:
          throw new RequestNoSuccess()

        case 429:
          if (attempt < RETRIES) {
            await sleep(RETRY_DELAY);
            continue;
          }
          throw new ServerDown();

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
        clearTimeout(timeoutId);
        throw new Error();
    }
  }
  throw new ServerDown();
}