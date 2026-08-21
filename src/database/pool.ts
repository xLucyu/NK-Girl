import { Pool, PoolClient } from "pg";
import { CONFIG } from "@app";

export const db = new Pool({
  host: CONFIG.HOST,
  port: Number(CONFIG.PORT),
  database: CONFIG.DATABASE,
  user: CONFIG.USER,
  password: CONFIG.PASSWORD,
  max: 5,
});

export async function withDb<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  
  const client = await db.connect();

  try {
    await client.query("BEGIN");
    const result = await callback(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}