import React from "react";
import "./css/MainMenu.css";

class MainMenu extends React.Component {
  render() {
    return (
      <div className="MainMenu RoundBorder">
        <ul>
          <li>
            <a
              href="/"
              onClick={(evt) => {
                evt.preventDefault();
                this.props.showOptionsPage(true);
              }}
            >
              Options
            </a>
          </li>

          <li>
            <a
              href="/"
              onClick={(evt) => {
                evt.preventDefault();
                this.props.showLeaderBoard(true);
              }}
            >
              Leaderboard
            </a>
          </li>

          <li>
            <a
              href="/"
              onClick={(evt) => {
                evt.preventDefault();
                this.props.showStatsPage(true);
              }}
            >
              Stats
            </a>
          </li>

          {this.props.user ? (
            <li>
              <a
                href="/"
                onClick={(evt) => {
                  evt.preventDefault();
                  this.props.handleLogout();
                }}
              >
                Logout
              </a>
            </li>
          ) : (
            <li>
              <a
                href="/"
                onClick={(evt) => {
                  evt.preventDefault();
                  this.props.showLoginPage(true);
                }}
              >
                Login
              </a>
            </li>
          )}

          {/* <li>
            <a
              href="/"
              onClick={(evt) => {
                evt.preventDefault();
                this.props.showAboutPage(true);
              }}
            >
              About
            </a>
          </li> */}
        </ul>
      </div>
    );
  }
}

export default MainMenu;
