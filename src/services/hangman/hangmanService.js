import { applyGuess, isWin, isLose } from "./gameLogic.js";
import {
  buildUpdateMessage,
  buildWinningMessage,
  buildLosingMessage,
} from "./messages.js";
import { getPlaylistTracks, MY_PLAYLIST } from "../spotify/playlistService.js";

// holds the active games array and the max tries
const activeGames = {};
const MAX_TRIES = 7;

// to get a certain game based on their channel id, this means that players can use the bot on simultaneously on different channels because there are different channel id
// TODO: make it so users can play a game inside the same channel by also using a user id
function getGame(channelId) {
  return activeGames[channelId];
}

// function called for starting the game
async function startGame(interaction) {
  const channelId = interaction.channelId;
  // to get access with the channel
  const channel = await interaction.client.channels.fetch(channelId);

  // gets a list of words from the api for calling the tracks of my playlist
  // TODO: make different categories/use better examples
  const words = await getPlaylistTracks(MY_PLAYLIST);
  const tries = MAX_TRIES;

  // pick a word from the list and make it all upper case
  const secretWord =
    words[Math.floor(Math.random() * words.length)].toUpperCase();

  // convert the secret word to all "_" except the spaces
  const hiddenWord = secretWord
    .split("")
    .map((letter) => (letter === " " ? " " : "_"))
    .join("");

  // for debugging
  console.log("secretWord: ", secretWord);
  console.log("hiddenWord: ", hiddenWord);

  // structure for the passable objects in the game
  const game = {
    secretWord: secretWord,
    hiddenWord: hiddenWord,
    guessedLetters: [],
    wrongGuesses: 0,
    maxTries: tries,
    playerId: interaction.user.id,
    gameId: interaction.id,
  };

  // creates a starting embed message
  const startEmbed = buildUpdateMessage(game, 0x5865f2, "start");

  // send a message to the channel with the content
  const startMsg = await channel.send({
    content: "A new game has started!",
    embeds: [startEmbed],
  });

  // store the starting msg to update later after interaction
  game.gameMsg = startMsg;

  // store the game instance in the list
  activeGames[channelId] = game;

  return;
}

// function for handling the guess of the player
async function handleGuess(message) {
  const channelId = message.channel.id;
  const game = getGame(channelId);

  // for debugging
  console.log("Recieved: ", message.content);

  // checks if there is no current game, or the author of a message and the id in a game is different, or the author is a bot
  if (!game || message.author.id !== game.playerId || message.author.bot) {
    console.log("Detected invalid message");
    return;
  }

  // checks if the message is not equal to 1 valid character
  if (
    message.content.length !== 1 ||
    !/[a-zA-Z0-9()\-"']/i.test(message.content)
  ) {
    return;
  }

  // convert to upper case
  const guessedLetter = message.content.toUpperCase();

  // apply the guess and take the result
  const { alreadyGuessed, correct } = applyGuess(game, guessedLetter);

  // checks if the letter has already been guessed
  if (alreadyGuessed) {
    const reply = await message.reply(
      `You already guessed **${guessedLetter}**!`,
    );
    // delete after a short time
    setTimeout(() => reply.delete(), 3000);
    return;
  }

  // checks if the game has won
  if (isWin(game)) {
    // create a message for winning and edit the current game message
    const winEmbed = buildWinningMessage(game, 0x57f287, "win");
    await game.gameMsg.edit({
      content: "🎉 Congratulations! You saved Chiikawa!",
      embeds: [winEmbed],
    });
    // deletes the game in the list
    delete activeGames[channelId];
    // if game is lost, do the same but with different message
  } else if (isLose(game)) {
    const loseEmbed = buildLosingMessage(game, 0xed4245, "lose");
    await game.gameMsg.edit({
      content: "💀 You lost! Chiikawa is stuck in jail..",
      embeds: [loseEmbed],
    });
    delete activeGames[channelId];
    // if not, then the game continues depending on the result of correct
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

  // this deletes the message in the channel to keep the channel readable
  await message.delete();
}

export { handleGuess, startGame, getGame };
