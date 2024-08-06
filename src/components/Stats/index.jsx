import React from "react";
import axios from "axios";

import { UserContext } from "../../context/UserContextProvider";
import { Loading } from "../Loading";

import { Logger } from "../../services/logger/Logger";
import { getAuthHeader } from "../../util/util-functions";
import * as UrlConsts from "../../constants/url-constants";

import "./index.css";
import "../PopUpContainer/index.css";

export class Stats extends React.Component {
  static contextType = UserContext;

  state = {
    stats: null,
    statsLoading: false,
  };

  componentDidMount = () => {
    Logger.debug("Mounting Stats.");

    this.getUserStats();
  };

  getUserStats = () => {
    this.setState({ statsLoading: true });

    const totalStatsUrl = `${UrlConsts.PATH_API_GET_TOTAL_STATS}${this.context.user.id}/`;
    const lastScoreUrl = `${UrlConsts.PATH_API_GET_LAST_SCORE}${this.context.user.id}/`;

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
        Logger.debug("Error getting stats.");
        Logger.debug(err);
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
          <div className="stat-row no-stats">
            <p>No previous games played</p>
          </div>
        );
      } else {
        content = (
          <>
            <h3 className="stats-title">Last Game</h3>
            <div className="stat-row">
              <span className="stat-row-name">Total Hits</span>
              <span className="stat-row-value">
                {this.state.stats.lastStats.hits}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-row-name">Total Misses</span>
              <span className="stat-row-value">
                {this.state.stats.lastStats.misses}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-row-name">Targets Not Hit</span>
              <span className="stat-row-value">
                {this.state.stats.lastStats.notHits}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-row-name">Accuracy</span>
              <span className="stat-row-value">
                {this.state.stats.lastStats.average}%
              </span>
            </div>
            <h3 className="stats-title">All Time</h3>
            <div className="stat-row">
              <span className="stat-row-name">Total Hits</span>
              <span className="stat-row-value">
                {this.state.stats.totalStats.totalHits}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-row-name">Total Misses</span>
              <span className="stat-row-value">
                {this.state.stats.totalStats.totalMisses}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-row-name">Targets Not Hit</span>
              <span className="stat-row-value">
                {this.state.stats.totalStats.totalNotHits}
              </span>
            </div>
            <div className="stat-row">
              <span className="stat-row-name">Avg. Accuracy</span>
              <span className="stat-row-value">
                {this.state.stats.totalStats.avgAccuracy}%
              </span>
            </div>
          </>
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

          this.props.showStatsPage(false);
        }}
      >
        <div className="stats pop-up-screen round-border">
          <h2>Stats</h2>
          {content}
        </div>
      </div>
    );
  };
}
