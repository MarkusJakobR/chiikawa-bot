// function for testing the letter and check if the letter is included in the secret word
// returns a value for "correct" and also adjusts the hidden word or the wrong guesses
export function applyGuess(game, letter) {
  if (game.guessedLetters.includes(letter)) {
    return { alreadyGuessed: true };
  }

  game.guessedLetters.push(letter);

  if (game.secretWord.includes(letter)) {
    game.hiddenWord = game.secretWord
      .split("")
      .map((ch) =>
        ch === " " ? " " : game.guessedLetters.includes(ch) ? ch : "_",
      )
      .join(" ");
    return { correct: true };
  } else {
    game.wrongGuesses++;
    return { correct: false };
  }
}

// to check if game is won, sees if the hidden word does not include any "_" anymore
export function isWin(game) {
  return !game.hiddenWord.includes("_");
}

// to check if game is lost, compare current num of wrong guesses to max tries
export function isLose(game) {
  return game.wrongGuesses >= game.maxTries;
}
