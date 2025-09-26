import "dotenv/config";
import { client } from "./bot.js";
import { loadEvents } from "./utils/eventLoader.js";
import { loadCommands } from "./utils/commandLoader.js";

async function main() {
  await loadCommands(client); // loads the commands made to load in commandLoader
  await loadEvents(client); // loads the events made in eventLoader

  await client.login(process.env.DISCORD_TOKEN); // client login
}

main().catch(console.error); // catches error happening in main
