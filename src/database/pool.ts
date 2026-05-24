import { Pool, PoolClient } from "pg";
import { config } from "../config";

export const db = new Pool({
  host: config.HOST,
  port: Number(config.PORT),
  database: config.DATABASE,
  user: config.USER,
  password: config.PASSWORD,
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
