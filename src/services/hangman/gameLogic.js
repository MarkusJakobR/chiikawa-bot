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

export function isWin(game) {
  return !game.hiddenWord.includes("_");
}

export function isLose(game) {
  return game.wrongGuesses >= game.maxTries;
}
