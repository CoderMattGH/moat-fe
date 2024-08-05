import React from "react";
import axios from "axios";

import "./css/Stats.css";
import "./css/PopUpContainer.css";

import { URLConsts } from "./constants/URLConsts";
import { UserContext } from "./UserContextProvider";

import { getAuthHeader } from "./util/util-functions";
import Loading from "./Loading";

class Stats extends React.Component {
  static contextType = UserContext;

  state = {
    stats: null,
    statsLoading: false,
  };

  componentDidMount = () => {
    console.log("Mounting Stats.");

    this.getUserStats();
  };

  getUserStats = () => {
    this.setState({ statsLoading: true });

    const totalStatsUrl = `${URLConsts.PATH_API_GET_TOTAL_STATS}${this.context.user.id}/`;
    const lastScoreUrl = `${URLConsts.PATH_API_GET_LAST_SCORE}${this.context.user.id}/`;

    const token = this.context.user.token;
    const headers = {
      headers: {
        Authorization: getAuthHeader(token),
      },
    };

    const stats = {
      lastStats: null,
      totalStats: null,
    };

    axios
      .get(totalStatsUrl, headers)
      .then(({ data }) => {
        stats.totalStats = data.score;

        return axios.get(lastScoreUrl, headers);
      })
      .then(({ data }) => {
        stats.lastStats = data.score;

        this.setState({ stats: stats });
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        this.setState({ statsLoading: false });
      });
  };

  // TODO: Add total games played
  render = () => {
    const { user } = this.context;

    let content;
    if (this.state.statsLoading) {
      content = <Loading />;
    } else {
      if (!this.state.stats) {
        content = (
          <div className="StatRow NoStats">
            <p>No previous games played</p>
          </div>
        );
      } else {
        content = (
          <>
            <h3>Last Game</h3>
            <div className="StatRow">
              <span className="StatName">Total Hits</span>
              <span className="StatValue">
                {this.state.stats.lastStats.hits}
              </span>
            </div>
            <div className="StatRow">
              <span className="StatName">Total Misses</span>
              <span className="StatValue">
                {this.state.stats.lastStats.misses}
              </span>
            </div>
            <div className="StatRow">
              <span className="StatName">Targets Not Hit</span>
              <span className="StatValue">
                {this.state.stats.lastStats.notHits}
              </span>
            </div>
            <div className="StatRow">
              <span className="StatName">Accuracy</span>
              <span className="StatValue">
                {this.state.stats.lastStats.average}%
              </span>
            </div>
            <h3>All Time</h3>
            <div className="StatRow">
              <span className="StatName">Total Hits</span>
              <span className="StatValue">
                {this.state.stats.totalStats.totalHits}
              </span>
            </div>
            <div className="StatRow">
              <span className="StatName">Total Misses</span>
              <span className="StatValue">
                {this.state.stats.totalStats.totalMisses}
              </span>
            </div>
            <div className="StatRow">
              <span className="StatName">Targets Not Hit</span>
              <span className="StatValue">
                {this.state.stats.totalStats.totalNotHits}
              </span>
            </div>
            <div className="StatRow">
              <span className="StatName">Avg. Accuracy</span>
              <span className="StatValue">
                {this.state.stats.totalStats.avgAccuracy}%
              </span>
            </div>
          </>
        );
      }
    }

    return (
      <div
        className="PopUpContainer"
        onClick={(evt) => {
          if (evt.target !== evt.currentTarget) {
            return;
          }

          this.props.showStatsPage(false);
        }}
      >
        <div className="Stats PopUp-Screen RoundBorder">
          <h2>Stats</h2>
          {content}
        </div>
      </div>
    );
  };
}

export default Stats;
