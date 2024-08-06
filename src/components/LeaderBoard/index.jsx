import axios from "axios";
import React from "react";

import { Loading } from "../Loading";

import { Logger } from "../../services/logger/Logger";
import * as UrlConsts from "../../constants/url-constants";
import * as Constants from "../../constants/constants";

import "./index.css";
import "../PopUpContainer/index.css";

export class LeaderBoard extends React.Component {
  LEADERBOARD_EMPTY_MSG = "Leaderboard is empty";

  state = {
    leaderBoard: [],
    leaderBoardLoading: false,
    leaderBoardErrorMsg: this.LEADERBOARD_EMPTY_MSG,
  };

  componentDidMount = () => {
    this.populateLeaderBoard();
  };

  populateLeaderBoard = () => {
    Logger.debug("Populating LeaderBoard data.");

    this.setState({ leaderBoardLoading: true });

    let url = UrlConsts.PATH_API_TOP_TEN_SCORES;
    axios
      .get(url)
      .then(({ data }) => {
        this.setState({ leaderBoard: data.scores });
      })
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 404) {
            this.setState({ leaderBoardErrorMsg: this.LEADERBOARD_EMPTY_MSG });
          } else {
            this.setState({
              leaderBoardErrorMsg: Constants.SERVER_ERROR,
            });
          }
        } else if (err.request) {
          this.setState({
            leaderBoardErrorMsg: Constants.SERVER_CONNECTION_ERROR,
          });
        } else {
          this.setState({
            leaderBoardErrorMsg: Constants.UNKNOWN_ERROR,
          });
        }
      })
      .finally(() => {
        this.setState({ leaderBoardLoading: false });
      });
  };

  render() {
    let i = 0;

    let content;
    if (this.state.leaderBoardLoading) {
      content = <Loading />;
    } else {
      if (this.state.leaderBoard.length) {
        content = this.state.leaderBoard.map((entry) => (
          <div key={i++} className="leader-board-entry">
            <span className="leader-board-name">{entry.username}</span>
            <span className="leader-board-score">{entry.score}</span>
          </div>
        ));
      } else {
        content = (
          <p className="leader-board-empty-msg">
            {this.state.leaderBoardErrorMsg}
          </p>
        );
      }
    }

    return (
      <div
        className="pop-up-container"
        onClick={(evt) => {
          if (evt.target !== evt.currentTarget) {
            return;
          }

          this.props.showLeaderBoard(false);
        }}
      >
        <div className="leader-board pop-up-screen round-border">
          <h2>Leaderboard</h2>
          {content}
        </div>
      </div>
    );
  }
}
