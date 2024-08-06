import axios from "axios";
import React from "react";

import { Loading } from "../Loading";
import * as UrlConsts from "../../constants/url-constants";

import "./index.css";
import "../PopUpContainer/index.css";

export class LeaderBoard extends React.Component {
  constructor(props) {
    console.log("Constructing LeaderBoard.");

    super(props);
  }

  state = {
    leaderBoard: [],
    leaderBoardLoading: false,
  };

  componentDidMount = () => {
    console.log("Mounting component!");

    this.populateLeaderBoard();
  };

  populateLeaderBoard = () => {
    console.log("Populating leaderboard data.");

    this.setState({ leaderBoardLoading: true });

    let url = UrlConsts.PATH_API_TOP_TEN_SCORES;
    axios
      .get(url)
      .then(({ data }) => {
        this.setState({ leaderBoard: data.scores });
      })
      .catch((err) => {
        console.log("Error loading leaderboard!");
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
          <p className="leader-board-empty-msg">Leaderboard is empty</p>
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
