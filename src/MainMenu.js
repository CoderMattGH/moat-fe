import React from "react";
import "./css/MainMenu.css";
import { UserContext } from "./UserContextProvider";

class MainMenu extends React.Component {
  static contextType = UserContext;

  render() {
    const { user } = this.context;

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

          {user ? (
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
          ) : null}

          {user ? (
            <li>
              <a
                href="/"
                onClick={(evt) => {
                  evt.preventDefault();
                  this.props.handleLogout();
                }}
              >
                Logout [{user.username}]
              </a>
            </li>
          ) : (
            <>
              <li>
                <a
                  href="/"
                  onClick={(evt) => {
                    evt.preventDefault();
                    this.props.showRegisterPage(true);
                  }}
                >
                  Register
                </a>
              </li>

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
            </>
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
