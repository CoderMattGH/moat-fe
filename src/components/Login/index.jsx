import React from "react";
import axios from "axios";

import { Loading } from "../Loading";

import * as UrlConsts from "../../constants/url-constants";
import * as Constants from "../../constants/constants";

import "./index.css";

export class Login extends React.Component {
  state = {
    username: "",
    password: "",
    errorMessage: null,
    loginLoading: false,
  };

  handleUsernameInput = (evt) => {
    const pattern = /(^[A-Za-z0-9]*$)|(^$)/;

    let value = evt.target.value;

    if (!pattern.test(value)) {
      return;
    }

    this.setState({ username: value.toUpperCase() });
  };

  handlePasswordInput = (evt) => {
    let value = evt.target.value;

    this.setState({ password: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const username = this.state.username;
    const password = this.state.password;

    if (!username || !password) {
      this.setState({
        errorMessage: "Username or password cannot be empty!",
      });

      return;
    }

    this.setState({ errorMessage: null, loginLoading: true });

    let url = UrlConsts.PATH_API_LOGIN;

    let reqBody = {
      username: username,
      password: password,
    };

    let loginSuccess = false;
    axios
      .post(url, reqBody)
      .then(({ data }) => {
        loginSuccess = true;
        this.props.handleLogin(data.user);
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 401) {
            this.setState({ errorMessage: "Invalid username or password!" });
          } else {
            this.setState({ errorMessage: Constants.SERVER_ERROR });
          }
        } else if (err.request) {
          this.setState({ errorMessage: Constants.SERVER_CONNECTION_ERROR });
        } else {
          this.setState({ errorMessage: Constants.UNKNOWN_ERROR });
        }
      })
      .finally(() => {
        this.setState({ loginLoading: false });

        if (loginSuccess) {
          this.props.showLoginPage(false);
        }
      });
  };

  render() {
    return (
      <div
        className="pop-up-container"
        onClick={(evt) => {
          if (evt.target !== evt.currentTarget) {
            return;
          }

          if (this.state.loginLoading) {
            return;
          }

          this.props.showLoginPage(false);
        }}
      >
        <div className="pop-up-screen round-border">
          <h2>Login</h2>

          <form className="form form-login" onSubmit={this.handleSubmit}>
            <label for="username" className="form-label">
              Username:
            </label>
            <input
              className="input-text"
              type="text"
              name="username"
              value={this.state.username}
              onChange={this.handleUsernameInput}
              disabled={this.state.loginLoading}
            />
            <label for="password" className="form-label">
              Password:
            </label>
            <input
              className="input-text"
              type="password"
              name="password"
              value={this.state.password}
              onChange={this.handlePasswordInput}
              disabled={this.state.loginLoading}
            />

            {this.state.errorMessage ? (
              <p className="login-error-msg">{this.state.errorMessage}</p>
            ) : null}

            <button
              className="button login-button"
              disabled={this.state.loginLoading}
            >
              Login
            </button>
          </form>

          {this.state.loginLoading ? (
            <div className="login-loading-container">
              <Loading />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
