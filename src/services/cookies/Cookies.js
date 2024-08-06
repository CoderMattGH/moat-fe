import { Logger } from "../logger/Logger";

export class Cookies {
  COOKIE_MAX_AGE = "2147483647";
  COOKIE_PATH = "/";

  setCookie = (name, value) => {
    Logger.debug("Setting cookie: " + name + "=" + value);

    if (
      name === undefined ||
      name === null ||
      value === undefined ||
      value === null
    ) {
      Logger.debug("Error setting cookie!");

      return;
    }

    let cName = encodeURIComponent(name);
    let cValue = encodeURIComponent(value);

    let cookieString = `${cName}=${cValue}; max-age=${this.COOKIE_MAX_AGE}; path=${this.COOKIE_PATH};`;

    document.cookie = cookieString;
  };

  /**
   * Returns a cookie with the specified name.
   *
   * @param name The name of the cookie.
   * @return The value of the cookie or 'null' if not found.
   */
  getCookie = (name) => {
    let decodedCookies = decodeURIComponent(document.cookie);

    let cookieArray = decodedCookies.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      cookie = cookie.trim();

      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length + 1, cookie.length);
      }
    }

    return null;
  };

  deleteCookie = (name) => {
    Logger.debug("Deleting cookie: " + name);

    let cName = encodeURIComponent(name);
    let cookieString = `${cName}=0; max-age=0; path=${this.COOKIE_PATH}`;

    document.cookie = cookieString;
  };
}
