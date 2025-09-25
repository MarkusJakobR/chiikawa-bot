import { handleGuess } from "../services/hangman/gameLogic.js";

export default {
  name: "messageCreate",
  async execute(message) {
    await handleGuess(message);
  },
};
