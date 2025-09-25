import { applyGuess, isWin, isLose } from "gamelogic.js";
import {
  buildUpdateMessage,
  buildWinningMessage,
  buildLosingMessage,
} from "messages.js";
import { getPlaylistTracks } from "../spotify/spotifyApi.js";
import { isWin, isLose } from "../hangman/gameLogic.js";

const activeGames = {};
const MAX_TRIES = 7;

function getGame(channelId) {
  return activeGames[channelId];
}

async function startGame(interaction) {
  const channelId = interaction.channelId;

  const words = await getPlaylistTracks(MY_PLAYLIST);
  const tries = MAX_TRIES;
  const secretWord =
    words[Math.floor(Math.random() * words.length)].toUpperCase();
  const hiddenWord = secretWord
    .split("")
    .map((letter) => (letter === " " ? " " : "_"))
    .join("");

  console.log("secretWord: ", secretWord);
  console.log("hiddenWord: ", hiddenWord);

  const game = {
    secretWord: secretWord,
    hiddenWord: hiddenWord,
    guessedLetters: [],
    wrongGuesses: 0,
    maxTries: tries,
    playerId: interaction.user.id,
    gameId: interaction.id,
  };
  const startEmbed = buildUpdateMessage(game, 0x5865f2, "start");

  const startMsg = await interaction.channel.send({
    content: "A new game has started!",
    embeds: [startEmbed],
  });

  game.gameMsg = startMsg;
  activeGames[channelId] = game;

  return;
}
async function handleGuess(message) {
  const channelId = message.channel.id;
  const game = getGame(channelId);

  if (!game || message.author.id !== game.playerId || message.author.bot) {
    console.log("Detected invalid message");
    return;
  }

  if (
    message.content.length !== 1 ||
    !/[a-zA-Z0-9()-"']/i.test(message.content)
  ) {
    return;
  }

  const guessedLetter = message.content.toUpperCase();
  const { alreadyGuessed, correct } = applyGuess(game, guessedLetter);

  if (alreadyGuessed) {
    const reply = await message.reply(`You already guessed **${letter}**!`);
    setTimeout(() => reply.delete(), 3000);
    return;
  }

  if (isWin(game)) {
    const winEmbed = buildWinningMessage(game, 0x57f287, "win");
    await game.gameMsg.edit({
      content: "🎉 Congratulations! You saved Chiikawa!",
      embeds: [winEmbed],
    });
    delete activeGames[channelId];
  } else if (isLose(game)) {
    const loseEmbed = buildLosingMessage(game, 0xed4245, "lose");
    await game.gameMsg.edit({
      content: "💀 You lost! Chiikawa is stuck in jail..",
      embeds: [loseEmbed],
    });
    delete activeGames[channelId];
  } else {
    const color = correct ? 0x57f287 : 0xed4245;
    const type = correct ? "correct" : "wrong";
    const content = correct ? "✅ Correct Guess!" : "❌ Wrong Guess!";
    const updateEmbed = buildUpdateMessage(game, color, type);
    await game.gameMsg.edit({
      content: content,
      embeds: [updateEmbed],
    });
  }

  await message.delete();
}

export { handleGuess, startGame, getGame };
