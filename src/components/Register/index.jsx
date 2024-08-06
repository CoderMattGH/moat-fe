import React from "react";
import axios from "axios";

import { UserContext } from "../../context/UserContextProvider";
import { Loading } from "../Loading";

import { Logger } from "../../services/logger/Logger";
import { Validator } from "../../services/validators/Validator";
import * as UrlConsts from "../../constants/url-constants";
import * as Constants from "../../constants/constants";

import "./index.css";

export class Register extends React.Component {
  static contextType = UserContext;

  state = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    usernameError: null,
    emailError: null,
    passwordError: null,
    confPasswordError: null,
    registerLoading: false,
  };

  handleUsernameInput = (event) => {
    let value = event.target.value.toUpperCase();

    const pattern = /^[A-Za-z0-9]*$/;

    if (!pattern.test(value)) {
      return;
    }

    this.setState({ username: value });
  };

  handleEmailInput = (event) => {
    let value = event.target.value.toUpperCase();

    const pattern = /^[*.!@#$%^&(){}\[\]:;,.?\/~_+\-=|A-Za-z0-9]*$/;

    if (!pattern.test(value)) {
      return;
    }

    this.setState({ email: value });
  };

  handlePasswordInput = (event) => {
    let value = event.target.value;

    this.setState({ password: value });
  };

  handleConfirmPasswordInput = (event) => {
    let value = event.target.value;

    this.setState({ confirmPassword: value });
  };

  clearErrorMessages = () => {
    this.setState({
      usernameError: null,
      emailError: null,
      passwordError: null,
      confPasswordError: null,
    });
  };

  // TODO: Error messages
  handleSubmit = (event) => {
    const username = this.state.username.trim();
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    const confirmPassword = this.state.confirmPassword.trim();

    event.preventDefault();

    this.clearErrorMessages();

    const usernameValObj = Validator.validateUsername(username);
    if (!usernameValObj.valid) {
      this.setState({ usernameError: usernameValObj.msg });

      return;
    }

    const emailValObj = Validator.validateEmail(email);
    if (!emailValObj.valid) {
      this.setState({ emailError: emailValObj.msg });

      return;
    }

    const passwordValObj = Validator.validatePassword(password);
    if (!passwordValObj.valid) {
      this.setState({ passwordError: passwordValObj.msg });

      return;
    }

    if (confirmPassword !== password) {
      this.setState({ confPasswordError: "Passwords do not match!" });

      return;
    }

    this.clearErrorMessages();

    this.registerUser(username, email, password);
  };

  registerUser = (username, email, password) => {
    Logger.debug("Registering user...");

    this.setState({ registerLoading: true });

    const registerUrl = UrlConsts.PATH_API_REGISTER;
    const loginUrl = UrlConsts.PATH_API_LOGIN;

    const userObj = {
      username: username,
      email: email,
      password: password,
    };

    let registerOk = false;
    let loginOk = false;
    axios
      .post(registerUrl, userObj)
      .then(({ data }) => {
        Logger.debug("Successfully registered!");

        const loginObj = { username: username, password: password };

        registerOk = true;

        return axios.post(loginUrl, loginObj);
      })
      .then(({ data }) => {
        Logger.debug("successfully logged in!");

        if (!data.user) {
          throw new Error("Returned user object was null");
        }

        this.props.handleLogin(data.user);

        loginOk = true;

        this.props.showRegisterPage(false);
      })
      .catch((err) => {
        if (!registerOk) {
          if (err.response && err.response.data) {
            if (err.response.status) {
              this.setState({ confPasswordError: err.response.data.message });
            } else {
              this.setState({ confPasswordError: Constants.SERVER_ERROR });
            }
          } else if (err.request) {
            this.setState({
              confPasswordError: Constants.SERVER_CONNECTION_ERROR,
            });
          } else {
            this.setState({ confPasswordError: Constants.UNKNOWN_ERROR });
          }

          return;
        }

        if (!loginOk) {
          if (err.response) {
            this.setState({
              confPasswordError: "Error logging in!",
            });
          } else if (err.request) {
            this.setState({
              confPasswordError: Constants.SERVER_CONNECTION_ERROR,
            });
          } else {
            this.setState({
              confPasswordError: Constants.UNKNOWN_ERROR,
            });
          }
        }
      })
      .finally(() => {
        this.setState({ registerLoading: false });
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

          if (this.state.registerLoading) {
            return;
          }

          this.props.showRegisterPage(false);
        }}
      >
        <div className="pop-up-screen round-border">
          <h2>Register</h2>
          <form className="form" onSubmit={this.handleSubmit}>
            <label className="form-label">Username:</label>
            <input
              className="input-text"
              type="text"
              value={this.state.username}
              onChange={this.handleUsernameInput}
              disabled={this.state.registerLoading}
            />

            {this.state.usernameError ? (
              <p className="register-err-msg">{this.state.usernameError}</p>
            ) : null}

            <label className="form-label">Email:</label>
            <input
              className="input-text"
              type="text"
              value={this.state.email}
              onChange={this.handleEmailInput}
              disabled={this.state.registerLoading}
            />

            {this.state.emailError ? (
              <p className="register-err-msg">{this.state.emailError}</p>
            ) : null}

            <label className="form-label">Password:</label>
            <input
              className="input-text"
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordInput}
              disabled={this.state.registerLoading}
            />

            {this.state.passwordError ? (
              <p className="register-err-msg">{this.state.passwordError}</p>
            ) : null}

            <label className="form-label">Confirm Password:</label>
            <input
              className="input-text"
              type="password"
              value={this.state.confirmPassword}
              onChange={this.handleConfirmPasswordInput}
              disabled={this.state.registerLoading}
            />

            {this.state.confPasswordError ? (
              <p className="register-err-msg">{this.state.confPasswordError}</p>
            ) : null}

            <button
              className="button register-button"
              disabled={this.state.registerLoading}
            >
              Register
            </button>
          </form>

          {this.state.registerLoading ? (
            <div className="register-loading-container">
              <Loading />
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
