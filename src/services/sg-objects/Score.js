export class Score {
  #playerScore;
  #xPos;
  #yPos;
  #fontStyle;

  constructor(xPos, yPos, fontStyle) {
    this.#playerScore = 0;
    this.#xPos = xPos;
    this.#yPos = yPos;
    this.#fontStyle = fontStyle;
  }

  draw = (context) => {
    let message = this.#playerScore + " POINTS";

    // Draw drop shadow.
    context.font = this.#fontStyle;
    context.textAlign = "right";
    context.textBaseLine = "middle";
    context.fillStyle = "#1f1f1f";
    context.fillText(message, this.#xPos + 2, this.#yPos + 2);

    context.fillStyle = "white";
    context.font = this.#fontStyle;
    context.textAlign = "right";
    context.textBaseLine = "middle";
    context.fillText(message, this.#xPos, this.#yPos);
  };

  increaseScore = (value) => {
    this.#playerScore = this.#playerScore + value;
  };

  decreaseScore = (value) => {
    let tempScore = this.#playerScore - value;

    if (tempScore < 0) {
      return;
    } else {
      this.#playerScore = tempScore;
    }
  };

  getPlayerScore = () => {
    return this.#playerScore;
  };

  setPlayerScore = (playerScore) => {
    this.#playerScore = playerScore;
  };

  setXPos = (xPos) => {
    this.#xPos = xPos;
  };

  setYPos = (yPos) => {
    this.#yPos = yPos;
  };
}
