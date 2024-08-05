import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./Header.js";
import Body from "./Body.js";
import Footer from "./Footer.js";
import LeaderBoard from "./LeaderBoard.js";
import About from "./About.js";
import Options from "./Options.js";
import Stats from "./Stats.js";
import { Login } from "./Login.js";
import AdminPage from "./admin/AdminPage.js";

import Cookies from "./cookies/Cookies.js";

import Difficulty from "./constants/Difficulty.js";
import { URLConsts } from "./constants/URLConsts.js";

import Validator from "./validators/Validator.js";
import DeviceDetector from "./device_detection/DeviceDetector.js";

import "./css/MOATApp.css";
import ErrorPage from "./ErrorPage.js";

class MOATApp extends React.Component {
  #cookies = new Cookies();

  state = {
    user: null,

    leaderBoardVisible: false,
    aboutPageVisible: false,
    optionsPageVisible: false,
    statsPageVisible: false,
    loginPageVisible: false,

    difficulty: Difficulty.DEFAULT_DIFFICULTY,

    playSounds: true,
    playMusic: false,
  };

  render() {
    return (
      <BrowserRouter>
        <div className="MOATApp">
          <Header
            showLeaderBoard={this.showLeaderBoard}
            showAboutPage={this.showAboutPage}
            showOptionsPage={this.showOptionsPage}
            showStatsPage={this.showStatsPage}
            showLoginPage={this.showLoginPage}
            handleLogout={this.handleLogout}
            user={this.state.user}
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
                />
              }
            />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>

          <Footer />

          {this.state.leaderBoardVisible ? (
            <LeaderBoard
              showLeaderBoard={this.showLeaderBoard}
              leaderBoardLoading={this.state.leaderBoardLoading}
              leaderBoard={this.state.leaderBoard}
            />
          ) : null}

          {this.state.aboutPageVisible ? (
            <About showAboutPage={this.showAboutPage} />
          ) : null}

          {this.state.statsPageVisible ? (
            <Stats
              showStatsPage={this.showStatsPage}
              lastGameStats={this.state.lastGameStats}
              totalGameStats={this.state.totalGameStats}
            />
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
            />
          ) : null}
        </div>
      </BrowserRouter>
    );
  }

  componentDidMount = () => {
    console.log("Loading cookies.");

    this.loadOptionsFromCookie();

    // If mobile device, then disable sounds.
    if (DeviceDetector.isMobileDevice()) {
      this.setState({ playSounds: false });
      this.setState({ playMusic: false });
    }

    console.log("Cookies: " + document.cookie);
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

    if (optionsHaveChanged) this.saveOptionsToCookie();
  }

  saveOptionsToCookie = () => {
    console.log("Saving options cookies.");

    this.#cookies.setCookie("difficulty", this.state.difficulty);
    this.#cookies.setCookie("playSounds", this.state.playSounds);
    this.#cookies.setCookie("playMusic", this.state.playMusic);
  };

  loadOptionsFromCookie = () => {
    console.log("Loading options cookies.");

    let difficulty = this.#cookies.getCookie("difficulty");
    let playSounds = this.#cookies.getCookie("playSounds");
    let playMusic = this.#cookies.getCookie("playMusic");

    if (difficulty !== null) this.setDifficulty(difficulty);

    if (playMusic !== null) this.setPlayMusic(playMusic);

    if (playSounds !== null) this.setPlaySounds(playSounds);
  };

  showAdminPage = () => {
    console.log("Trying to load Admin Page...");

    this.setState({ adminPageVisible: true });
  };

  hideAdminPage = () => {
    console.log("Hiding Admin Page...");

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

  handleLogin = (userObj) => {
    this.setState({ user: userObj });
  };

  handleLogout = () => {
    this.setState({ user: null });
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
    if (Validator.validateDifficulty(value))
      this.setState({ difficulty: value });
    else this.setState({ difficulty: Difficulty.DEFAULT_DIFFICULTY });
  };

  sendScoreToServer = (score) => {
    console.log("Sending score to server.");

    let url = URLConsts.PATH_API_POST_SCORE;

    let scoreObj = {
      score: score,
    };

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(scoreObj),
      headers: {
        "Content-Type": "application/json",
      },
    };

    fetch(url, fetchOptions)
      .then((response) => {
        response
          .json()
          .then((wasHighScore) => {
            // TODO: If was a high score then do something here.  Celebration animation?
            if (wasHighScore) {
              console.log("High score registered!");
            }
          })
          .catch(() => {
            console.log("ERROR: Cannot parse response from server.");
          });
      })
      .catch(() => {
        console.log("ERROR: Cannot connect to server.");
      });
  };
}

export default MOATApp;
