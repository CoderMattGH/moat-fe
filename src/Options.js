import React from "react";
import "./css/Options.css";
import "./css/PopUpContainer.css";

import Difficulty from "./constants/Difficulty.js";

class Options extends React.Component {
  #drawDifficulties = () => {
    let difficulties = Difficulty.getDifficulties();

    let diffArray = [];

    difficulties.forEach((value, key) => {
      diffArray.push(
        <option key={key} value={key}>
          {value.name}
        </option>
      );
    });

    return <>{diffArray}</>;
  };

  render() {
    return (
      <div
        className="PopUpContainer"
        onClick={(evt) => {
          if (evt.target !== evt.currentTarget) {
            return;
          }

          this.props.showOptionsPage(false);
        }}
      >
        <div className="Options PopUp-Screen RoundBorder">
          <h2>Options</h2>
          <div className="Option">
            <label>Play Sounds</label>
            <input
              type="checkbox"
              checked={this.props.playSounds ? true : false}
              onChange={(evt) => {
                this.props.setPlaySounds(evt.target.checked);
              }}
            />
          </div>

          <div className="Option">
            <label>Play Music</label>
            <input
              type="checkbox"
              checked={this.props.playMusic ? true : false}
              onChange={(evt) => {
                this.props.setPlayMusic(evt.target.checked);
              }}
            />
          </div>

          <div className="Option">
            <label>Difficulty</label>
            <select
              name="difficulty"
              defaultValue={this.props.difficulty}
              onChange={(evt) => this.props.setDifficulty(evt.target.value)}
            >
              {this.#drawDifficulties()}
            </select>
          </div>
        </div>
      </div>
    );
  }
}

export default Options;
