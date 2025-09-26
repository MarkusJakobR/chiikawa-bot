import { handleGuess } from "../services/hangman/hangmanService.js";

export default {
  name: "messageCreate",
  async execute(message) {
    await handleGuess(message);
  },
};
