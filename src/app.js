import "dotenv/config";
import { client } from "./bot.js";
import { loadEvents } from "./utils/eventLoader.js";
import { loadCommands } from "./utils/commandLoader.js";

async function main() {
  await loadCommands(client);
  await loadEvents(client);

  await client.login(process.env.DISCORD_TOKEN);
}

main().catch(console.error);
