import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { commandClasses } from "./command.decorator";

import { registry } from "./command.registry";

export async function loadCommands(): Promise<void> {

  const commandsPath = path.join(__dirname, "../../commands"); // in prod needs to be changed to /app/dist

  await loadDirectory(commandsPath);
  registry.register([...commandClasses].map(Command => new Command()));
}

async function loadDirectory(directory: string): Promise<void> {

  const entries = fs.readdirSync(directory, { withFileTypes: true });

  for (const entry of entries) {

    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      await loadDirectory(fullPath);
      continue;
    }

    if (!entry.name.endsWith(".command.js") && !entry.name.endsWith(".command.ts")) continue;

    await import(pathToFileURL(fullPath).href);
  }
}