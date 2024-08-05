import * as Constants from "../constants/Constants";

export class Validator {
  constructor() {
    throw new Error("Cannot instantiate Validator class!");
  }

  static validateUsername = (username) => {
    if (username === null) {
      return { valid: false, msg: "Username cannot be null" };
    }

    if (!(username instanceof String || typeof username === "string")) {
      return { valid: false, msg: "Username must be a string" };
    }

    if (username.trim().length === "") {
      return { valid: false, msg: "Username cannot be empty" };
    }

    if (
      username.length < Constants.USERNAME_MIN_LENGTH ||
      username.length > Constants.USERNAME_MAX_LENGTH
    ) {
      const msg =
        `Username must be between ${Constants.USERNAME_MIN_LENGTH} ` +
        `and ${Constants.USERNAME_MAX_LENGTH} characters`;

      return { valid: false, msg: msg };
    }

    if (!Constants.USERNAME_PATTERN.test(username)) {
      return { valid: false, msg: "Username contains invalid characters" };
    }

    return { valid: true };
  };

  static validatePassword = (password) => {
    if (password === null) {
      return { valid: false, msg: "Password cannot be null" };
    }

    if (!(password instanceof String || typeof password === "string")) {
      return { valid: false, msg: "Password must be a string" };
    }

    if (password.trim().length === "") {
      return { valid: false, msg: "Password cannot be empty" };
    }

    if (
      password.length < Constants.PASSWORD_MIN_LENGTH ||
      password.length > Constants.PASSWORD_MAX_LENGTH
    ) {
      const msg =
        `Password must be between ${Constants.PASSWORD_MIN_LENGTH} ` +
        `and ${Constants.PASSWORD_MAX_LENGTH} characters`;

      return { valid: false, msg: msg };
    }

    if (!Constants.PASSWORD_PATTERN.test(password)) {
      return { valid: false, msg: "Password contains invalid characters" };
    }

    return { valid: true };
  };

  static validateEmail = (email) => {
    if (email === null) {
      return { valid: false, msg: "Email cannot be null" };
    }

    if (!(email instanceof String || typeof email === "string")) {
      return { valid: false, msg: "Email must be a string" };
    }

    if (email.trim().length === "") {
      return { valid: false, msg: "Email cannot be empty" };
    }

    if (
      email.length < Constants.EMAIL_MIN_LENGTH ||
      email.length > Constants.EMAIL_MAX_LENGTH
    ) {
      const msg =
        `Email must be between ${Constants.EMAIL_MIN_LENGTH} ` +
        `and ${Constants.EMAIL_MAX_LENGTH} characters`;

      return { valid: false, msg: msg };
    }

    if (!Constants.EMAIL_PATTERN.test(email)) {
      return { valid: false, msg: "Email address is not valid" };
    }

    return { valid: true };
  };
}
