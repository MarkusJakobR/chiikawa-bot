import { EmbedBuilder } from "discord.js";
import { randomGif } from "../../utils/gifs.js";

export function buildUpdateMessage(game, color, type) {
  return new EmbedBuilder()
    .setTitle("Guess the word to save Chiikawa!")
    .setDescription(
      `Category is top 50 songs in PH!\n\n \`\`\`\nWord: ${game.hiddenWord}\n\`\`\``,
    )
    .setColor(color)
    .addFields(
      {
        name: "Tries Left",
        value: (game.maxTries - game.wrongGuesses).toString(),
        inline: true,
      },
      {
        name: "Guesses Made",
        value: game.guessedLetters.join(", "),
      },
    )
    .setFooter({
      text: "Type a single letter in the chat to make a guess.",
    })
    .setImage(randomGif(type));
}

export function buildWinningMessage(game, color, type) {
  return new EmbedBuilder()
    .setTitle("🎉 Congratulations! You saved Chiikawa!")
    .setDescription(`\`\`\`\nWord: ${game.hiddenWord}\n\`\`\``)
    .setColor(color)
    .addFields(
      {
        name: "Tries Left",
        value: (game.maxTries - game.wrongGuesses).toString(),
        inline: true,
      },
      {
        name: "Guesses Made",
        value: game.guessedLetters.join(", "),
      },
    )
    .setImage(randomGif("win"));
}

export function buildLosingMessage(game, color, type) {
  return new EmbedBuilder()
    .setTitle("💀 You lost! Chiikawa is stuck in jail..")
    .setDescription(`\`\`\`\nThe word was: ${game.secretWord}\n\`\`\``)
    .setColor(color)
    .addFields(
      {
        name: "Tries Left",
        value: (game.maxTries - game.wrongGuesses).toString(),
        inline: true,
      },
      {
        name: "Guesses Made",
        value: game.guessedLetters.join(", "),
      },
    )
    .setImage(randomGif("lose"));
}
