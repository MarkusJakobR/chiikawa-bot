import { Client, GatewayIntentBits } from "discord.js";

// Creates a client with the following permissions
export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});
