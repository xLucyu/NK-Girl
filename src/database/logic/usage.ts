// src/database/usage.table.ts
import { db } from "..";

export class UsageTable {

    
  public async increaseCommandUsage(command: string): Promise<void> {

    await db.query(
      `
      INSERT INTO usage (command, uses)
      VALUES ($1, 1)
      ON CONFLICT (command)
      DO UPDATE SET uses = usage.uses + 1
      `,
      [command]
    );
  }


  public async fetchCommands(): Promise<Array<{ command: string; uses: number }>> {

    const result = await db.query<{ command: string; uses: number }>(
      `SELECT command, uses FROM usage ORDER BY uses DESC`
    );

    return result.rows;
  }
}
