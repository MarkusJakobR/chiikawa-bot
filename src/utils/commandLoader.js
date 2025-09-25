import { Collection } from "discord.js";
import fs from "fs";
import path from "path";

export async function loadCommands(client) {
  client.commands = new Collection();
  const commandsPath = path.join(process.cwd(), "src", "commands");
  const commandsFolder = fs.readdirSync(commandsPath);
  for (const folder of commandsFolder) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".js"));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = (await import(`file://${filePath}`)).default;
      if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command);
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`,
        );
      }
    }
  }
}
