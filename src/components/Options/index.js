import React from "react";

import { Difficulty } from "../../constants/Difficulty";

import "./index.css";
import "../PopUpContainer/index.css";

export class Options extends React.Component {
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
        <div className="options PopUp-Screen RoundBorder">
          <h2>Options</h2>
          <div className="option">
            <label className="form-label">Play Sounds</label>
            <input
              type="checkbox"
              checked={this.props.playSounds ? true : false}
              onChange={(evt) => {
                this.props.setPlaySounds(evt.target.checked);
              }}
            />
          </div>

          <div className="option">
            <label className="form-label">Play Music</label>
            <input
              type="checkbox"
              checked={this.props.playMusic ? true : false}
              onChange={(evt) => {
                this.props.setPlayMusic(evt.target.checked);
              }}
            />
          </div>

          <div className="option">
            <label className="form-label">Difficulty</label>
            <select
              name="difficulty"
              className="select"
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
