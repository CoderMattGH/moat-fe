import React from "react";

import { MOAT_VERSION } from "../../constants/constants";

import "./index.css";
import "../PopUpContainer/index.css";

export class About extends React.Component {
  render() {
    return (
      <div
        className="pop-up-container"
        onClick={(evt) => {
          if (evt.target !== evt.currentTarget) {
            return;
          }

          this.props.showAboutPage(false);
        }}
      >
        <div className="about pop-up-screen round-border">
          <h2>About</h2>
          <p className="about-para">
            <span className="about-app-title">
              MATT'S ONLINE AIM TRAINER v{MOAT_VERSION}
            </span>
          </p>
          <p classname="about-para">
            <span className="about-copyright">
              Copyright &copy; 2024 Matt Dixon
            </span>
          </p>
        </div>
      </div>
    );
  }
}
