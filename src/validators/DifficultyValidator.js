import Difficulty from "../constants/Difficulty.js";

export class DifficultyValidator {
  constructor() {
    throw new Error("This class should not be initialised!");
  }

  static validateDifficulty = (difficulty) => {
    console.log("Validating difficulty!");
    if (difficulty === null || difficulty === undefined || difficulty === "")
      return false;

    if (
      difficulty < Difficulty.MIN_DIFFICULTY ||
      difficulty > Difficulty.MAX_DIFFICULTY
    )
      return false;
    else return true;
  };
}
