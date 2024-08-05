import React from "react";
import MainMenu from "./MainMenu.js";
import "./css/Header.css";
import { Link } from "react-router-dom";

class Header extends React.Component {
  render() {
    return (
      <div className="Header">
        <header>
          <h1>
            <Link to="/">Matt's Online Aim Trainer</Link>
          </h1>
          <MainMenu
            showLeaderBoard={this.props.showLeaderBoard}
            showAboutPage={this.props.showAboutPage}
            showOptionsPage={this.props.showOptionsPage}
            showStatsPage={this.props.showStatsPage}
            showLoginPage={this.props.showLoginPage}
            handleLogout={this.props.handleLogout}
            user={this.props.user}
          />
        </header>
      </div>
    );
  }
}

export default Header;
