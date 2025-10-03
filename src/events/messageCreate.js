import { handleGuess, getGame } from "../services/hangman/hangmanService.js";

// for creating a message using handleGuess
export default {
  name: "messageCreate",
  async execute(message) {
    const game = getGame(message.channel.id);
    if (game) {
      await handleGuess(message);
    }
  },
};
