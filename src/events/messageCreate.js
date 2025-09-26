import { handleGuess } from "../services/hangman/hangmanService.js";

// for creating a message using handleGuess
export default {
  name: "messageCreate",
  async execute(message) {
    await handleGuess(message);
  },
};
