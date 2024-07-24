import React from "react";
import MainMenu from "./MainMenu.js";
import "./css/Header.css";

/**
 * A class representing the Application Header that displays the Menu and Title.
 */
class Header extends React.Component {
  render() {
    return (
      <div className="Header">
        <header>
          <h1>
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                this.props.hideAdminPage();
              }}
            >
              Matt's Online Aim Trainer
            </a>
          </h1>
          <MainMenu
            showLeaderBoard={this.props.showLeaderBoard}
            showAboutPage={this.props.showAboutPage}
            showOptionsPage={this.props.showOptionsPage}
            showStatsPage={this.props.showStatsPage}
          />
        </header>
      </div>
    );
  }
}

export default Header;
