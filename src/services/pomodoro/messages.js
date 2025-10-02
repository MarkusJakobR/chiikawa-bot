import { EmbedBuilder } from "discord.js";
import { randomGif } from "../../utils/gifs.js";

// for building the messages that is always updated
export function buildStartTimer(timer, color, type) {
  return new EmbedBuilder()
    .setTitle(`Timer starts now! Good luck, ${timer.displayName}!`)
    .setDescription(
      `Timer will last for ${timer.studyMinutes} minutes. You have until ${timer.endTime} to focus!`,
    )
    .setColor(color)
    .setFooter({
      text: "Chiikawa will remind you to take a break, so just focus on your studies!",
    })
    .setImage(randomGif(type));
}

export function buildBreakTimer(timer, color, type) {
  return new EmbedBuilder()
    .setTitle(`Break time! Great work, ${timer.displayName}!`)
    .setDescription(
      `Break will last for ${timer.breakMinutes} minutes. You have until ${timer.endTime} to rest and recover!`,
    )
    .setColor(color)
    .setFooter({
      text: "I'm proud of you 😊",
    })
    .setImage(randomGif(type));
}
