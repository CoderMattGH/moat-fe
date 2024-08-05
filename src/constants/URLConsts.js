export class URLConsts {
  // static #PROTOCOL = 'http'
  // static #HOSTNAME = 'aim-api.codermatt.com';
  // static #RPC_PORT = 80;

  static #API_PROTOCOL = process.env.REACT_APP_RPC_PROTOCOL;
  static #API_HOSTNAME = process.env.REACT_APP_RPC_HOSTNAME;
  static #API_PORT = process.env.REACT_APP_RPC_PORT;

  constructor() {
    throw new Error("URLConsts cannot be instantiated.");
  }

  static get API_BASE_URL() {
    return `${this.#API_PROTOCOL}://${this.#API_HOSTNAME}:${this.#API_PORT}`;
  }

  static get PATH_API_LOGIN() {
    return `${this.API_BASE_URL}/authenticate/`;
  }

  static get PATH_API_REGISTER() {
    return `${this.API_BASE_URL}/user/`;
  }

  static get PATH_API_TOP_TEN_SCORES() {
    return `${this.API_BASE_URL}/score/top-ten/`;
  }

  static get PATH_API_POST_SCORE() {
    return `${this.API_BASE_URL}/score/`;
  }

  static get PATH_API_GET_TOTAL_STATS() {
    return `${this.API_BASE_URL}/score/avg/`;
  }

  static get PATH_API_GET_LAST_SCORE() {
    return `${this.API_BASE_URL}/score/last/`;
  }
}
