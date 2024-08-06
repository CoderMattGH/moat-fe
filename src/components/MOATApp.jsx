import React from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Header } from "./Header";
import { Body } from "./Body";
import { Footer } from "./Footer";
import { LeaderBoard } from "./LeaderBoard";
import { About } from "./About";
import { Options } from "./Options";
import { Stats } from "./Stats";
import { Login } from "./Login";
import { ErrorPage } from "./ErrorPage";
import { Register } from "./Register";
import { AdminPage } from "./AdminPage";

import { Logger } from "../services/logger/Logger";
import { DeviceDetector } from "../services/device-detector/DeviceDetector";
import { DifficultyValidator } from "../services/validators/DifficultyValidator";
import { Cookies } from "../services/cookies/Cookies";
import { Difficulty } from "../constants/Difficulty";
import * as UtilFunctions from "../util/util-functions";
import * as UrlConsts from "../constants/url-constants";

import { UserContext } from "../context/UserContextProvider";

import "./MOATApp.css";

export class MOATApp extends React.Component {
  static contextType = UserContext;

  #cookies = new Cookies();

  state = {
    leaderBoardVisible: false,
    aboutPageVisible: false,
    optionsPageVisible: false,
    statsPageVisible: false,
    loginPageVisible: false,
    registerPageVisible: false,

    difficulty: Difficulty.DEFAULT_DIFFICULTY,

    playSounds: true,
    playMusic: false,
  };

  render() {
    return (
      <BrowserRouter>
        <div className="moat-app">
          <Header
            showLeaderBoard={this.showLeaderBoard}
            showAboutPage={this.showAboutPage}
            showOptionsPage={this.showOptionsPage}
            showStatsPage={this.showStatsPage}
            showRegisterPage={this.showRegisterPage}
            showLoginPage={this.showLoginPage}
            handleLogout={this.handleLogout}
          />

          <Routes>
            <Route
              path="/"
              element={
                <Body
                  difficulty={this.state.difficulty}
                  playMusic={this.state.playMusic}
                  playSounds={this.state.playSounds}
                  setLastGameStats={this.setLastGameStats}
                  sendScoreToServer={this.sendScoreToServer}
                  handleLogout={this.handleLogout}
                />
              }
            />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>

          <Footer />

          {this.state.leaderBoardVisible ? (
            <LeaderBoard showLeaderBoard={this.showLeaderBoard} />
          ) : null}

          {this.state.aboutPageVisible ? (
            <About showAboutPage={this.showAboutPage} />
          ) : null}

          {this.state.statsPageVisible ? (
            <Stats showStatsPage={this.showStatsPage} />
          ) : null}

          {this.state.optionsPageVisible ? (
            <Options
              showOptionsPage={this.showOptionsPage}
              setPlaySounds={this.setPlaySounds}
              setPlayMusic={this.setPlayMusic}
              playSounds={this.state.playSounds}
              playMusic={this.state.playMusic}
              difficulty={this.state.difficulty}
              setDifficulty={this.setDifficulty}
            />
          ) : null}

          {this.state.loginPageVisible ? (
            <Login
              showLoginPage={this.showLoginPage}
              handleLogin={this.handleLogin}
              saveUserToCookie={this.saveUserToCookie}
            />
          ) : null}

          {this.state.registerPageVisible ? (
            <Register
              showRegisterPage={this.showRegisterPage}
              handleLogin={this.handleLogin}
            />
          ) : null}
        </div>
      </BrowserRouter>
    );
  }

  componentDidMount = () => {
    this.loadOptionsFromCookie();
    this.loadUserFromCookie();

    // If mobile device, then disable sounds.
    if (DeviceDetector.isMobileDevice()) {
      this.setState({ playSounds: false });
      this.setState({ playMusic: false });
    }

    Logger.debug("Loading cookies: " + document.cookie);
  };

  componentDidUpdate(prevProps, prevState) {
    let optionsHaveChanged = false;

    if (prevState.playSounds !== this.state.playSounds) {
      optionsHaveChanged = true;
    }

    if (prevState.playMusic !== this.state.playMusic) {
      optionsHaveChanged = true;
    }

    if (prevState.difficulty !== this.state.difficulty) {
      optionsHaveChanged = true;
    }

    if (optionsHaveChanged) {
      this.saveOptionsToCookie();
    }
  }

  saveOptionsToCookie = () => {
    Logger.debug("Saving options to cookies.");

    this.#cookies.setCookie("difficulty", this.state.difficulty);
    this.#cookies.setCookie("playSounds", this.state.playSounds);
    this.#cookies.setCookie("playMusic", this.state.playMusic);
  };

  loadOptionsFromCookie = () => {
    Logger.debug("Loading options from cookies.");

    let difficulty = this.#cookies.getCookie("difficulty");
    let playSounds = this.#cookies.getCookie("playSounds");
    let playMusic = this.#cookies.getCookie("playMusic");

    if (difficulty !== null) {
      this.setDifficulty(difficulty);
    }

    if (playMusic !== null) {
      this.setPlayMusic(playMusic);
    }

    if (playSounds !== null) {
      this.setPlaySounds(playSounds);
    }
  };

  saveUserToCookie = (userObj) => {
    Logger.debug("Saving user to cookies.");

    const json = JSON.stringify(userObj);

    this.#cookies.setCookie("user", json);
  };

  loadUserFromCookie = () => {
    Logger.debug("Loading user from cookies.");

    let str = this.#cookies.getCookie("user");

    if (!str) {
      return;
    }

    const { updateUser } = this.context;

    try {
      let userObj = JSON.parse(str);

      // TODO: More robust validation.
      if (userObj.role && userObj.id && userObj.username && userObj.token) {
        updateUser(userObj);
      }
    } catch (err) {
      Logger.debug("Error parsing user from cookie!");

      return;
    }
  };

  showAdminPage = () => {
    this.setState({ adminPageVisible: true });
  };

  hideAdminPage = () => {
    this.setState({ adminPageVisible: false });
  };

  showLeaderBoard = (value) => {
    if (value) {
      this.setState({ leaderBoardVisible: true });
    } else {
      this.setState({ leaderBoardVisible: false });
    }
  };

  showStatsPage = (value) => {
    if (value) {
      this.setState({ statsPageVisible: true });
    } else {
      this.setState({ statsPageVisible: false });
    }
  };

  showAboutPage = (value) => {
    if (value) {
      this.setState({ aboutPageVisible: true });
    } else {
      this.setState({ aboutPageVisible: false });
    }
  };

  showOptionsPage = (value) => {
    if (value) {
      this.setState({ optionsPageVisible: true });
    } else {
      this.setState({ optionsPageVisible: false });
    }
  };

  showLoginPage = (value) => {
    if (value) {
      this.setState({ loginPageVisible: true });
    } else {
      this.setState({ loginPageVisible: false });
    }
  };

  showRegisterPage = (value) => {
    if (value) {
      this.setState({ registerPageVisible: true });
    } else {
      this.setState({ registerPageVisible: false });
    }
  };

  handleLogin = (userObj) => {
    this.context.updateUser(userObj);
    this.saveUserToCookie(userObj);
  };

  handleLogout = () => {
    this.context.updateUser(null);
    this.#cookies.deleteCookie("user");
  };

  setPlaySounds = (value) => {
    if (DeviceDetector.isMobileDevice()) {
      this.setState({ playSounds: false });

      return;
    }

    if (value === true || value === "true") {
      this.setState({ playSounds: true });
    } else {
      this.setState({ playSounds: false });
    }
  };

  setPlayMusic = (value) => {
    if (DeviceDetector.isMobileDevice()) {
      this.setState({ playMusic: false });

      return;
    }

    if (value === true || value === "true") {
      this.setState({ playMusic: true });
    } else {
      this.setState({ playMusic: false });
    }
  };

  setDifficulty = (value) => {
    if (DifficultyValidator.validateDifficulty(value)) {
      this.setState({ difficulty: value });
    } else {
      this.setState({ difficulty: Difficulty.DEFAULT_DIFFICULTY });
    }
  };

  sendScoreToServer = (score, hits, misses, notHits, user) => {
    Logger.debug("Posting score to server.");

    let url = UrlConsts.PATH_API_POST_SCORE;

    let scoreObj = {
      userId: user.id,
      score: score,
      hits: hits,
      misses: misses,
      notHits: notHits,
    };

    const headers = {
      headers: UtilFunctions.getAuthHeader(user.token),
    };

    return axios.post(url, scoreObj, headers);
  };
}
