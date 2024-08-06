import React from "react";
import { Link } from "react-router-dom";
import { MainMenu } from "./MainMenu";

import "./index.css";

export class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <header>
          <h1>
            <Link className="header-title-link" to="/">
              Matt's Online Aim Trainer
            </Link>
          </h1>
          <MainMenu
            showLeaderBoard={this.props.showLeaderBoard}
            showAboutPage={this.props.showAboutPage}
            showOptionsPage={this.props.showOptionsPage}
            showStatsPage={this.props.showStatsPage}
            showRegisterPage={this.props.showRegisterPage}
            showLoginPage={this.props.showLoginPage}
            handleLogout={this.props.handleLogout}
          />
        </header>
      </div>
    );
  }
}
