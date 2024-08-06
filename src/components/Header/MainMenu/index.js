import React from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/UserContextProvider";

import "./index.css";

export class MainMenu extends React.Component {
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

          {user && user.role === "ADMIN" ? (
            <li>
              <Link to="/admin">ADMIN</Link>
            </li>
          ) : null}
        </ul>
      </div>
    );
  }
}
