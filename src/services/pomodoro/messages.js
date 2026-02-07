import { EmbedBuilder } from "discord.js";
import { randomGif } from "../../utils/gifs.js";

// for building the messages that is always updated
export function buildStartTimer(timer, color, type) {
  return new EmbedBuilder()
    .setTitle(`Timer starts now! Good luck, ${timer.displayName}!`)
    .setDescription(
      `Timer will last for ${timer.studyMinutes} min. You have until ${timer.endTime} to focus!`,
    )
    .addFields(
      {
        name: "Study Time",
        value:
          `${timer.studyMinutes}` +
          (timer.studyMinutes == 1 ? " minute" : " minutes"),
        inline: true,
      },
      { name: "Study Until", value: `${timer.endTime}`, inline: true },
      { name: "Current Cycle", value: `${timer.currCycle}`, inline: true },
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
      `Break will last for ${timer.breakMinutes} min. You have until ${timer.endTime} to rest and recover!`,
    )
    .addFields(
      {
        name: "Break Time",
        value:
          `${timer.breakMinutes}` +
          (timer.breakMinutes == 1 ? " minute" : " minutes"),
        inline: true,
      },
      {
        name: "Rest Until",
        value: `${timer.endTime}`,
        inline: true,
      },
    )
    .setColor(color)
    .setFooter({
      text: "I'm proud of you 😊",
    })
    .setImage(randomGif(type));
}

export function buildEndTimer(timer, color, type) {
  return new EmbedBuilder()
    .setTitle(`Good job, ${timer.displayName}!`)
    .setDescription(`I hope you were able to study well during this session 😊`)
    .addFields(
      {
        name: "Total Study Time",
        value:
          `${timer.studyMinutes * timer.currCycle}` +
          (timer.studyMinutes == 1 ? " minute" : " minutes"),
        inline: true,
      },
      {
        name: "Total Rest Time",
        value:
          `${timer.breakMinutes * (timer.currCycle - 1)}` +
          (timer.breakMinutes == 1 ? " minute" : " minutes"),
        inline: true,
      },
    )
    .setColor(color)
    .setFooter({
      text: "I'm proud of you 😊",
    })
    .setImage(randomGif(type));
}
