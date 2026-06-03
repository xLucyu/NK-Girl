import { sleep } from "@utils";

type GetDataOptions = {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
};

export async function getData<T>(url: string, options: GetDataOptions = {}): Promise<T> {

  const { timeoutMs = 10_000, retries = 3, retryDelayMs = 2_000 } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (response.ok) {
        return await response.json() as T;
      }

      if (response.status === 429 || response.status >= 500 && attempt < retries) {
        console.warn(`GET ${url} -> ${response.status}, retry in ${retryDelayMs}ms`);
        await sleep(retryDelayMs);
        continue;
      }

      throw new Error(`GET ${url} failed: ${response.status} ${response.statusText}`);
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error?.name === "AbortError" && attempt < retries) {
        console.warn(`GET ${url} timed out, retry in ${retryDelayMs}ms`);
        await sleep(retryDelayMs);
        continue;
      }

      throw error;
    }
  }

  throw new Error(`GET ${url} failed after ${retries + 1} attempts`);
}
