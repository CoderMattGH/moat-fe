import React from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../../context/UserContextProvider";

import "./index.css";

export class MainMenu extends React.Component {
  static contextType = UserContext;

  render() {
    const { user } = this.context;

    return (
      <div className="main-menu round-border">
        <ul className="main-menu-ul">
          {user && user.role === "ADMIN" ? null : (
            <li className="main-menu-li">
              <a
                className="main-menu-link"
                href="/"
                onClick={(evt) => {
                  evt.preventDefault();
                  this.props.showOptionsPage(true);
                }}
              >
                Options
              </a>
            </li>
          )}

          <li className="main-menu-li">
            <a
              className="main-menu-link"
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
            <li className="main-menu-li">
              <a
                className="main-menu-link"
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
            <li className="main-menu-li">
              <a
                className="main-menu-link"
                href="/"
                onClick={(evt) => {
                  evt.preventDefault();
                  this.props.handleLogout();
                }}
              >
                Logout{" "}
                <span className="main-menu-logout-username">
                  [{user.username}]
                </span>
              </a>
            </li>
          ) : (
            <>
              <li className="main-menu-li">
                <a
                  className="main-menu-link"
                  href="/"
                  onClick={(evt) => {
                    evt.preventDefault();
                    this.props.showRegisterPage(true);
                  }}
                >
                  Register
                </a>
              </li>

              <li className="main-menu-li">
                <a
                  className="main-menu-link"
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
            <li className="main-menu-li">
              <Link className="main-menu-link" to="/admin">
                ADMIN
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    );
  }
}
