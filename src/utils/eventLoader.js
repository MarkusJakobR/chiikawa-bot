import fs from "fs";
import path from "path";

// loads the events found in the /events directory
export async function loadEvents(client) {
  const eventsPath = path.join(process.cwd(), "src", "events");
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".js"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = (await import(`file://${filePath}`)).default;
    // checks if an event only happens once or not
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }
}
