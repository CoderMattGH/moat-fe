import React from "react";

import { SGTimer } from "../../../services/sg-objects/SGTimer";
import { RoundTarget } from "../../../services/sg-objects/RoundTarget";
import { BulletTrail } from "../../../services/sg-objects/BulletTrail";
import { Score } from "../../../services/sg-objects/Score";
import { Sounds } from "../../../services/sg-objects/Sounds";
import { PointExplosion } from "../../../services/sg-objects/PointExplosion";
import { TargetExplosion } from "../../../services/sg-objects/TargetExplosion";
import { GameStats } from "../../../services/sg-objects/GameStats";

import { SavingScore } from "./SavingScore";
import { ErrorPopup } from "../../ErrorPopup";

import * as Constants from "../../../constants/constants";
import { Logger } from "../../../services/logger/Logger";
import { Difficulty } from "../../../constants/Difficulty";
import { UserContext } from "../../../context/UserContextProvider";

import "./index.css";

export class ShootingGallery extends React.Component {
  #CANVAS_INIT_WIDTH = 600;
  #CANVAS_INIT_HEIGHT = 800;

  #DEF_TARGET_RADIUS = 30;
  #FONT_STR =
    "apple-kit, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Ubuntu', Arial";
  #DEFAULT_FONT = "bold 18px " + this.#FONT_STR;
  #DEFAULT_FONT_SMALLER = "bold 17px " + this.#FONT_STR;
  #DEFAULT_SCORE_FONT = "bold 17px " + this.#FONT_STR;
  #DEFAULT_TIME_FONT = "bold 17px " + this.#FONT_STR;
  #DEFAULT_POINT_EXPL_FONT = "bold 14px " + this.#FONT_STR;

  #TARG_HIT_SCORE = 20;
  #TARG_MIDDLE_HIT_SCORE = 30;
  #TARG_INNER_HIT_SCORE = 40;
  #TARG_MISS_PENALTY = 40;

  #startTimestamp;
  #previousTimestamp;
  #elapsedTime = 0; // Elapsed game time in milliseconds.
  #lastTargetDrawn = 0; // Time in milliseconds since the last target was drawn.

  #canvas;
  #context;

  #canvasContainerDiv;

  #sounds; // Sounds class.
  #sGTimer; // SGTimer class.
  #score; // PlayerScore class.
  #bulletTrail;
  #pointExplosions; // Set to hold point explosion objects.
  #roundTargets; // Set to hold round targets.
  #targetExplosions; // Set to hold target explosion objects.
  #gameStarted; // Bool indicating if the game has been started.
  #gameEnded; // Bool indicating if the game has ended.
  #readyToRestart; // Boolean to indicate whether the game is ready to restart.
  #gameLength; // Time in seconds for duration of game.
  #targetsPerSecond; // Number of targets to spawn per second.

  #animFrameReqId; // Animation frame request ID for cancelling animation.

  #gameStats; // Stats class object for registering hits, etc.

  #handleResizeEvent;
  #prevHeight;
  #prevWidth;

  static contextType = UserContext;

  state = {
    savingScore: false,
    errorMessage: null,
  };

  constructor(props) {
    Logger.debug("Constructing ShootingGallery.");

    super(props);

    this.#handleResizeEvent = false;
    this.#prevHeight = this.#CANVAS_INIT_HEIGHT;
    this.#prevWidth = this.#CANVAS_INIT_WIDTH;

    this.#canvasContainerDiv = React.createRef();
    this.#canvas = React.createRef();

    this.#sounds = new Sounds();
    this.#sounds.setShouldPlayMusic(this.props.playMusic);
    this.#sounds.setShouldPlaySounds(this.props.playSounds);

    this.#gameStats = new GameStats();

    this.#gameLength = import.meta.env.VITE_GAME_TIME || 45;

    this.#gameStarted = false;
    this.#gameEnded = false;
    this.#readyToRestart = false;

    this.#pointExplosions = new Set();
    this.#roundTargets = new Set();
    this.#targetExplosions = new Set();

    this.#animFrameReqId = null;

    this.setDifficulty(props.difficulty);
  }

  render() {
    Logger.debug("In render() in ShootingGallery.");

    return (
      <>
        {this.state.savingScore ? <SavingScore /> : null}
        {this.state.errorMessage ? (
          <ErrorPopup
            errorMessage={this.state.errorMessage}
            setErrorMessage={this.setErrorMessage}
          />
        ) : null}

        <div className="shooting-gallery-game" ref={this.#canvasContainerDiv}>
          <canvas
            width={this.#CANVAS_INIT_WIDTH}
            height={this.#CANVAS_INIT_HEIGHT}
            id="shooting-gallery-canvas"
            className="round-border"
            ref={this.#canvas}
            onClick={(evt) => {
              evt.preventDefault();
              this.#handleClick(evt);
            }}
          ></canvas>
        </div>
      </>
    );
  }

  setErrorMessage = (errorMessage) => {
    this.setState({ errorMessage: errorMessage });
  };

  componentDidMount = () => {
    Logger.debug("In componentDidMount() in ShootingGallery.");

    this.#initCanvas();

    window.addEventListener("resize", this.#resizeEventListener);
  };

  componentWillUnmount = () => {
    Logger.debug("Cleaning up ShootingGallery before unmount.");

    window.removeEventListener("resize", this.#resizeEventListener);

    this.#sounds.stopMusic();

    // Stop the animation.
    cancelAnimationFrame(this.#animFrameReqId);
  };

  shouldComponentUpdate = (newProps, newState) => {
    // If play music option has changed.
    if (this.props.playMusic !== newProps.playMusic) {
      if (this.#gameStarted === true) {
        this.#sounds.setShouldPlayMusic(newProps.playMusic, true);
      } else {
        this.#sounds.setShouldPlayMusic(newProps.playMusic, false);
      }
    }

    // If play sounds option has changed.
    if (this.props.playSounds !== newProps.playSounds) {
      this.#sounds.setShouldPlaySounds(newProps.playSounds);
    }

    return true;
  };

  componentDidUpdate = (prevProps, prevState) => {
    Logger.debug("In componentDidUpdate() in ShootingGallery.");

    // Prevents current context from becoming stale and throwing an error.
    // this.#initCanvas();
    this.#restoreCanvas();
  };

  #restoreCanvas = () => {
    Logger.debug("Restoring ShootingGallery canvas.");

    this.#getAndSetCanvasContext();

    this.#drawBackground();

    // Draw welcome message.
    if (this.#gameStarted === false) {
      this.#drawWelcomeMessage();
    } else if (this.#gameEnded === true) {
      this.#drawFinishedMessage();
    }

    // Redraw score and timer.
    this.#sGTimer = new SGTimer(
      this.#canvas.current.width - 10,
      19,
      this.#DEFAULT_SCORE_FONT
    );

    this.#score.setXPos(this.#canvas.current.width - 10);
    this.#score.setYPos(45);
  };

  #initCanvas = () => {
    Logger.debug("Initialising ShootingGallery canvas.");

    this.#getAndSetCanvasContext();
    this.#drawBackground();

    // Draw welcome message.
    if (this.#gameStarted === false) {
      this.#drawWelcomeMessage();
    } else if (this.#gameEnded === true) {
      this.#drawFinishedMessage();
    }

    this.#resetTimerAndScore();
  };

  #getAndSetCanvasContext = () => {
    // Check that the browser supports canvas.
    if (this.#canvas.current.getContext) {
      Logger.debug("Getting 2D canvas context.");

      this.#context = this.#canvas.current.getContext("2d");

      // Set the size of the canvas to the containing div size.
      this.#resizeCanvas(
        this.#canvasContainerDiv.current.clientWidth,
        this.#canvasContainerDiv.current.clientHeight
      );
    } else {
      Logger.error("Canvas not supported!");

      throw new Error("Canvas not supported!");
    }
  };

  #resetTimerAndScore = () => {
    this.#sGTimer = new SGTimer(
      this.#canvas.current.width - 10,
      19,
      this.#DEFAULT_SCORE_FONT
    );
    this.#score = new Score(
      this.#canvas.current.width - 10,
      45,
      this.#DEFAULT_SCORE_FONT
    );
  };

  #resizeEventListener = (evt) => {
    Logger.debug("Shooting Gallery container div was resized.");

    this.#handleResizeEvent = true;

    // this.#initCanvas();
    this.#restoreCanvas();
  };

  #resizeCanvas = (width, height) => {
    this.#prevHeight = this.#canvas.current.height;
    this.#prevWidth = this.#canvas.current.width;

    this.#canvas.current.height = height;
    this.#canvas.current.width = width;

    Logger.debug("Resized canvas height: " + this.#canvas.current.height);
    Logger.debug("Resized canvas width: " + this.#canvas.current.width);
  };

  setDifficulty = (value) => {
    let difficulty;
    try {
      difficulty = parseInt(value);
    } catch (error) {
      Logger.error("Error parsing difficulty!");
      difficulty = Difficulty.DEFAULT_DIFFICULTY;
    }

    let difficulties = Difficulty.getDifficulties();

    this.#targetsPerSecond = difficulties.get(difficulty).tps;

    Logger.debug(difficulties.get(difficulty).name + " difficulty selected.");
  };

  #drawBackground = () => {
    if (this.#canvas.current !== null) {
      this.#context.fillStyle = "black";
      this.#context.fillRect(
        0,
        0,
        this.#canvas.current.width,
        this.#canvas.current.height
      );
    }
  };

  #drawBackgroundOverlay = () => {
    if (this.#canvas.current !== null) {
      this.#context.fillStyle = "rgba(0,0,0,0.5)";
      this.#context.fillRect(
        0,
        0,
        this.#canvas.current.width,
        this.#canvas.current.height
      );
    }
  };

  #drawWelcomeMessage = () => {
    let message = "CLICK TO CONTINUE";
    this.#drawShadowedText(
      message,
      this.#canvas.current.width / 2,
      this.#canvas.current.height / 2,
      this.#DEFAULT_FONT,
      "yellow",
      "#525005"
    );
  };

  #drawFinishedMessage = () => {
    let message = "TIMER EXPIRED";
    let messageYPos = this.#canvas.current.height / 2 - 50;
    this.#drawShadowedText(
      message,
      this.#canvas.current.width / 2,
      messageYPos,
      this.#DEFAULT_FONT,
      "yellow",
      "#525005"
    );

    let scoreMessage = `YOU SCORED ${this.#score.getPlayerScore()} POINTS!`;
    let scrMessageYPos = this.#canvas.current.height / 2;
    this.#drawShadowedText(
      scoreMessage,
      this.#canvas.current.width / 2,
      scrMessageYPos,
      this.#DEFAULT_FONT,
      "yellow",
      "#525005"
    );
  };

  #drawShadowedText = (message, x, y, font, colour, shadowColour) => {
    // Draw drop shadow.
    this.#context.font = font;
    this.#context.textAlign = "center";
    this.#context.textBaseLine = "middle";
    this.#context.fillStyle = shadowColour;
    this.#context.fillText(message, x + 2, y + 2);

    // Draw main text.
    this.#context.font = font;
    this.#context.textAlign = "center";
    this.#context.textBaseLine = "middle";
    this.#context.fillStyle = colour;
    this.#context.fillText(message, x, y);
  };

  #beginAnimation = () => {
    Logger.debug("Starting Shooting Gallery animation!");

    this.#sounds.playMusic();
    this.setDifficulty(this.props.difficulty);

    this.#updateProgress();
  };

  #restartGame = () => {
    if (this.#readyToRestart === true) {
      this.#sounds.stopMusic();

      this.#resetTimerAndScore();

      this.#gameStarted = false;
      this.#gameEnded = false;
      this.#readyToRestart = false;

      this.#pointExplosions = new Set();
      this.#roundTargets = new Set();
      this.#targetExplosions = new Set();

      this.#gameStats = new GameStats();

      this.#animFrameReqId = null;

      this.#gameStarted = true;

      this.#startTimestamp = undefined;
      this.#previousTimestamp = undefined;
      this.#elapsedTime = 0;
      this.#lastTargetDrawn = 0;

      this.#beginAnimation();
    } else {
      Logger.debug("Game is not ready to restart!");
    }
  };

  #finishGame = () => {
    const user = this.context.user;
    this.#gameEnded = true;

    // End animation.
    if (this.#animFrameReqId != null) {
      Logger.debug("Cancelling animation frame!");

      cancelAnimationFrame(this.#animFrameReqId);
    }

    // Overlay canvas with transparent black rectangle.
    this.#drawBackgroundOverlay();

    // Show finish message and high scores
    this.#drawFinishedMessage();
    this.#sleepSetReadyToStart();

    Logger.debug(
      `Hits: ${this.#gameStats.getHits()} Misses: ${this.#gameStats.getMisses()} ` +
        `Disappeared: ${this.#gameStats.getTargetsDisappeared()}`
    );

    if (user) {
      this.setState({ savingScore: true });

      this.props
        .sendScoreToServer(
          this.#score.getPlayerScore(),
          this.#gameStats.getHits(),
          this.#gameStats.getMisses(),
          this.#gameStats.getTargetsDisappeared(),
          user
        )
        .then(({ data }) => {
          Logger.debug("Score was successfully posted!");
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            this.setState({
              errorMessage: "Your credentials are invalid or expired!",
            });

            this.props.handleLogout();
          } else {
            this.setState({ errorMessage: "Error saving score!" });
          }
        })
        .finally(() => {
          this.setState({ savingScore: false });
        });
    }
  };

  /**
   * Sleep for 1 second, then set the game to be able to restart.
   * Avoids the user clicking to restart the game too fast.
   */
  #sleepSetReadyToStart = async () => {
    await new Promise((r) => setTimeout(r, 1000 * 1));
    this.#readyToRestart = true;

    let clickMessage = "CLICK TO PLAY AGAIN";
    let clickMessageYPos = this.#canvas.current.height / 2 + 50;
    this.#drawShadowedText(
      clickMessage,
      this.#canvas.current.width / 2,
      clickMessageYPos,
      this.#DEFAULT_FONT_SMALLER,
      "white",
      "#1f1f1f"
    );

    Logger.debug("Game is now ready to restart!");
  };

  #updateProgress = (timestamp) => {
    if (timestamp !== undefined) {
      if (this.#startTimestamp === undefined) {
        this.#startTimestamp = timestamp;
      }

      // Timestamp is in milliseconds.
      this.#elapsedTime = timestamp - this.#startTimestamp;
    }

    // Check that the game time hasn't expired.
    let gameLengthInMilliS = this.#gameLength * 1000;
    if (gameLengthInMilliS < this.#elapsedTime) {
      Logger.debug("Game timer has expired!");

      this.#finishGame();

      return;
    }

    // Clear screen.
    this.#drawBackground();

    this.#drawTargetExplosions(timestamp);
    this.#drawRoundTargets(timestamp);
    this.#drawBulletTrail(timestamp);
    this.#drawPointsExplosions(timestamp);
    this.#sGTimer.drawTimer(
      this.#context,
      (this.#gameLength - this.#getGameTime()).toFixed(1)
    );
    this.#score.draw(this.#context);

    if (this.#lastTargetDrawn === undefined) {
      this.#createRoundTarget(timestamp);
      this.#lastTargetDrawn = timestamp;
    } else {
      // Calculate when to create a new target (in milliseconds).
      let drawTargetInterval = 1000 / this.#targetsPerSecond;

      if (this.#elapsedTime - this.#lastTargetDrawn > drawTargetInterval) {
        this.#createRoundTarget(timestamp);
        this.#lastTargetDrawn = this.#elapsedTime;
      }
    }

    // Finished handling resize event.
    if (this.#handleResizeEvent === true) this.#handleResizeEvent = false;

    // Animation callback function.
    this.#animFrameReqId = requestAnimationFrame(this.#updateProgress);

    this.#previousTimestamp = timestamp;
  };

  /**
   * Returns the Game Time in seconds.
   */
  #getGameTime = () => {
    let gameTime = this.#elapsedTime / 1000;

    return gameTime;
  };

  #getTargetRadius = () => {
    let targetRadius = this.#DEF_TARGET_RADIUS * this.#getAvgResizeRatio();

    return targetRadius;
  };

  /**
   * Returns the average ratio between the Game canvas size and the default Game canvas size.
   * This is used to resize targets and other elements on the Game canvas after a resize event.
   * @returns A number representing the current Resize Ratio.
   */
  #getAvgResizeRatio = () => {
    let heightRatio = this.#getResizeHeightRatio();
    let widthRatio = this.#getResizeWidthRatio();

    let average = (heightRatio + widthRatio) / 2;

    return average;
  };

  /**
   * Returns the average ratio between Game canvas height and the default Game canvas height.
   * @returns A number representing the current Resize Ratio height.
   */
  #getResizeHeightRatio = () => {
    if (this.#canvas.current !== null)
      return this.#canvas.current.height / this.#CANVAS_INIT_HEIGHT;
  };

  /**
   * Returns the average ratio between Game canvas width and the default Game canvas width.
   * @returns A number representing the current Resize Ratio width.
   */
  #getResizeWidthRatio = () => {
    if (this.#canvas.current !== null)
      return this.#canvas.current.width / this.#CANVAS_INIT_WIDTH;
  };

  #createRoundTarget = (timestamp) => {
    if (this.#canvas.current !== null) {
      let targetRadius = this.#getTargetRadius();

      let randX = Math.floor(Math.random() * this.#canvas.current.width);
      let randY = Math.floor(Math.random() * this.#canvas.current.height);

      let coorObj = this.#checkAndReposOffScreenTarget(
        randX,
        randY,
        targetRadius
      );

      let roundTarget = new RoundTarget(
        coorObj.xPos,
        coorObj.yPos,
        targetRadius,
        timestamp
      );
      this.#roundTargets.add(roundTarget);
    }
  };

  /**
   * Checks whether the supplied coordinate position is onscreen. If it is offscreen, then
   * the coordinates are transformed to give onscreen locations.  The function also takes into
   * account the radius of the Round Target.
   * @param xPos An integer representing the current x coordinate.
   * @param yPos An integer representing the current y coordinate.
   * @param targetRadius An integer representing the current Round Target's radius.
   * @returns an Object {xPos, yPos} representing the new transformed onscreen coordinates.
   */
  #checkAndReposOffScreenTarget = (xPos, yPos, targetRadius) => {
    // Bounds checking
    if (xPos + targetRadius >= this.#canvas.current.width)
      xPos = xPos - targetRadius;

    if (xPos - targetRadius <= 0) xPos = xPos + targetRadius;

    if (yPos + targetRadius >= this.#canvas.current.height)
      yPos = yPos - targetRadius;

    if (yPos - targetRadius <= 0) yPos = yPos + targetRadius;

    return { xPos, yPos };
  };

  /**
   * Loops through the Round Target list and draws them on the Game canvas.
   * @param timestamp An integer representing the current Game time in milliseconds.
   */
  #drawRoundTargets = (timestamp) => {
    // Loop through round targets set and draw them.
    const myIterator = this.#roundTargets.values();

    for (const roundTarget of myIterator) {
      // Check if the target is marked for destuction
      if (roundTarget.isMarkedForDestruct()) {
        // Was target hit or left to disappear?
        if (!roundTarget.wasTargetHit())
          this.#gameStats.registerTargetDisappeared();

        this.#roundTargets.delete(roundTarget);
        this.#sounds.playDisappear();

        break;
      }

      // Handle a canvas resize event.
      if (this.#handleResizeEvent === true) {
        Logger.debug("Handling ShootingGallery canvas resize!");

        const targetRadius = this.#getTargetRadius();

        // Set the target radius incase the canvas has been resized.
        if (roundTarget.getRadius() !== targetRadius)
          roundTarget.setRadius(targetRadius);

        // Reposition the targets incase the canvas has been resized.
        let xPos = roundTarget.getXPos();
        let yPos = roundTarget.getYPos();

        // Calculate the difference between previous height ratio and current.
        let prevHeightRatio = this.#prevHeight / this.#CANVAS_INIT_HEIGHT;
        let prevWidthRatio = this.#prevWidth / this.#CANVAS_INIT_WIDTH;

        let heightRatioDiff = prevHeightRatio - this.#getResizeHeightRatio();
        let widthRatioDiff = prevWidthRatio - this.#getResizeWidthRatio();

        let newXPos = (1 - widthRatioDiff) * xPos;
        let newYPos = (1 - heightRatioDiff) * yPos;

        roundTarget.setXPos(newXPos);
        roundTarget.setYPos(newYPos);

        // Reposition any targets that may be offscreen after a canvas resize.
        let coorObj = this.#checkAndReposOffScreenTarget(
          roundTarget.getXPos(),
          roundTarget.getYPos(),
          targetRadius
        );

        roundTarget.setXPos(coorObj.xPos);
        roundTarget.setYPos(coorObj.yPos);
      }

      // Finally, draw the target.
      roundTarget.draw(this.#context, timestamp);
    }
  };

  /**
   * Loops through the list of Point Explosions and draws them.
   * @param timestamp An integer representing the current Game time in milliseconds.
   */
  #drawPointsExplosions = (timestamp) => {
    const myIterator = this.#pointExplosions.values();

    for (const pointExplosion of myIterator) {
      if (pointExplosion.isMarkedForDestruct())
        this.#pointExplosions.delete(pointExplosion);
      else pointExplosion.draw(this.#context, timestamp);
    }
  };

  /**
   * Loops through the list of Target Explosions and draws them.
   * @param timestamp An integer representing the current Game time in milliseconds.
   */
  #drawTargetExplosions = (timestamp) => {
    const myIterator = this.#targetExplosions.values();

    for (const targetExplosion of myIterator) {
      if (targetExplosion.isMarkedForDestruct())
        this.#targetExplosions.delete(targetExplosion);
      else targetExplosion.draw(this.#context, timestamp);
    }
  };

  /**
   * Draws a bullet effect on the Game canvas.
   * @param timestamp An integer representing the current Game time in milliseconds.
   */
  #drawBulletTrail = (timestamp) => {
    if (this.#bulletTrail !== undefined && this.#bulletTrail !== null) {
      if (this.#bulletTrail.isMarkedForDestruct() === true) {
        this.#bulletTrail = null;
      } else {
        // Calculate Bullet Trail scale factor.
        this.#bulletTrail.draw(this.#context, timestamp);
      }
    }
  };

  /**
   * Calculates the x and y coordinates on the Game canvas where the User has clicked the mouse
   * pointer.
   * @param clientX An integer representing the x position on the client.
   * @param clientY An integer representing the y position on the client.
   * @returns An object {xPos, yPos} containing the Game canvas x and y coordinates.
   */
  #calcClickPosition = (clientX, clientY) => {
    let rect = this.#canvas.current.getBoundingClientRect();
    let x = clientX - rect.left;
    let y = clientY - rect.top;

    let coorObj = {
      xPos: x,
      yPos: y,
    };

    return coorObj;
  };

  #handleClick = (event) => {
    if (this.#gameStarted === false) {
      this.#gameStarted = true;
      this.#beginAnimation();

      return;
    }

    // If on the End screen.
    if (this.#gameStarted === true && this.#gameEnded === true) {
      this.#restartGame();

      return;
    }

    this.#sounds.playShot();
    let coorObj = this.#calcClickPosition(event.clientX, event.clientY);

    /* Collision detection. */
    // If click hit a target.
    let targetWasHit = false;

    const myIterator = this.#roundTargets.values();

    for (const roundTarget of myIterator) {
      let resultObj = roundTarget.isPosInTarget(coorObj.xPos, coorObj.yPos);

      // Check if any of the target's outer or inner circles were hit.
      if (resultObj.innerTarget === true) {
        targetWasHit = true;

        this.#playerHitTarget(
          coorObj.xPos,
          coorObj.yPos,
          this.#TARG_INNER_HIT_SCORE,
          roundTarget
        );
      } else if (resultObj.middleTarget === true) {
        targetWasHit = true;

        this.#playerHitTarget(
          coorObj.xPos,
          coorObj.yPos,
          this.#TARG_MIDDLE_HIT_SCORE,
          roundTarget
        );
      } else if (resultObj.outerTarget === true) {
        targetWasHit = true;

        this.#playerHitTarget(
          coorObj.xPos,
          coorObj.yPos,
          this.#TARG_HIT_SCORE,
          roundTarget
        );
      }
    }

    // Create bullet trail.
    this.#bulletTrail = new BulletTrail(
      coorObj.xPos,
      coorObj.yPos,
      this.#previousTimestamp
    );

    if (targetWasHit) {
      this.#gameStats.registerHit();
      this.#sounds.playHit();
    } else {
      this.#score.decreaseScore(this.#TARG_MISS_PENALTY);
      this.#gameStats.registerMiss();
      this.#sounds.playMiss();

      // Create point explosion for lost points.
      const pointExplosion = new PointExplosion(
        this.#TARG_MISS_PENALTY,
        coorObj.xPos,
        coorObj.yPos,
        this.#DEFAULT_POINT_EXPL_FONT,
        false
      );
      this.#pointExplosions.add(pointExplosion);
    }
  };

  /**
   * Creates a points explosion at the specific point, increments the score, and destroys the
   * target.
   */
  #playerHitTarget = (x, y, score, target) => {
    // Create target explosion.
    const targetExplosion = new TargetExplosion(x, y, this.#previousTimestamp);
    this.#targetExplosions.add(targetExplosion);

    // Create point explosion.
    const pointExplosion = new PointExplosion(
      score,
      x,
      y,
      this.#DEFAULT_POINT_EXPL_FONT,
      true,
      this.#previousTimestamp
    );
    this.#pointExplosions.add(pointExplosion);

    this.#score.increaseScore(score);
    target.destroyTarget();
  };
}
