export class Logger {
  // If no LOGL variable set, default to "error".
  static #logLevel =
    (import.meta.env.VITE_LOGL
      ? import.meta.env.VITE_LOGL.toLowerCase()
      : false) || "error";

  static debug = (message) => {
    if (this.#logLevel === "debug") {
      console.log(message);
    }
  };

  static info = (message) => {
    if (this.#logLevel === "info" || this.#logLevel === "debug") {
      console.log(message);
    }
  };

  static error = (message) => {
    if (
      this.#logLevel === "info" ||
      this.#logLevel === "error" ||
      this.#logLevel === "debug"
    ) {
      console.log(message);
    }
  };
}
