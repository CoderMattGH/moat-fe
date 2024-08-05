import axios from "axios";

import React from "react";
import Loading from "./Loading.js";
import "./css/LeaderBoard.css";
import "./css/PopUpContainer.css";
import { URLConsts } from "./constants/URLConsts.js";

class LeaderBoard extends React.Component {
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

    let url = URLConsts.PATH_API_TOP_TEN_SCORES;
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
          <div key={i++} className="LeaderBoardEntry">
            <span className="LeaderBoardName">{entry.username}</span>
            <span className="LeaderBoardScore">{entry.score}</span>
          </div>
        ));
      } else {
        content = <p className="LeaderBoardEmptyMsg">Leaderboard is empty</p>;
      }
    }

    return (
      <div
        className="PopUpContainer"
        onClick={(evt) => {
          if (evt.target !== evt.currentTarget) {
            return;
          }

          this.props.showLeaderBoard(false);
        }}
      >
        <div className="LeaderBoard PopUp-Screen RoundBorder">
          <h2>Leaderboard</h2>
          {content}
        </div>
      </div>
    );
  }
}

export default LeaderBoard;
