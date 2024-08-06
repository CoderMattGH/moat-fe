import React from "react";
import { ShootingGallery } from "./ShootingGallery";

import "./index.css";

export class Body extends React.Component {
  render() {
    return (
      <div className="body">
        <ShootingGallery
          difficulty={this.props.difficulty}
          playMusic={this.props.playMusic}
          playSounds={this.props.playSounds}
          setLastGameStats={this.props.setLastGameStats}
          sendScoreToServer={this.props.sendScoreToServer}
        />
      </div>
    );
  }
}
