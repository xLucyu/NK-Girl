import { withDb } from "../pool";

type CommandUsage = {
  command: string;
  uses: number;
};

export class UsageTable {


  public async increaseCommandUsage(command: string): Promise<void> {

    await withDb(async (client) => {
      await client.query(
        `
        INSERT INTO usage (command, uses)
        VALUES ($1, 1)
        ON CONFLICT (command)
        DO UPDATE SET uses = usage.uses + 1
        `,
        [command]
      );
    });
  }

  public async fetchCommands(): Promise<CommandUsage[]> {

    return await withDb(async (client) => {
      const result = await client.query<CommandUsage>(
        `
        SELECT command, uses
        FROM usage
        ORDER BY uses DESC
        `
      );

      return result.rows;
    });
  }
}

export const usageTable = new UsageTable();