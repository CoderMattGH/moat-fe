import React from "react";
import axios from "axios";

import { UserContext } from "../../context/UserContextProvider";
import { Loading } from "../Loading";
import { Validator } from "../../validators/Validator";
import * as UrlConsts from "../../constants/url-constants";

import "./index.css";

export class Register extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    console.log("Constructing Register.");

    super(props);
  }

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

  // TODO: Fix email validation
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
    console.log("In handleSubmit() in Register.");

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
    this.setState({ registerLoading: true });

    const updateUser = this.context.updateUser;

    console.log("In registerUser() in Register.");

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
        const loginObj = { username: username, password: password };

        registerOk = true;

        return axios.post(loginUrl, loginObj);
      })
      .then(({ data }) => {
        console.log("successfully logged in!");

        updateUser(data.user);

        loginOk = true;

        this.props.showRegisterPage(false);
      })
      .catch((err) => {
        console.log(err);

        if (!registerOk) {
          if (err.response && err.response.data) {
            let status = err.response.status;
            let message = err.response.data.message;

            if (status === 400 && message) {
              this.setState({ confPasswordError: message });

              return;
            }
          }

          this.setState({ confPasswordError: "Error registering user!" });

          return;
        }

        this.setState({ confPasswordError: "Error logging in!" });
      })
      .finally(() => {
        this.setState({ registerLoading: false });
      });
  };

  render() {
    return (
      <div
        className="PopUpContainer"
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
        <div className="PopUp-Screen RoundBorder">
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
