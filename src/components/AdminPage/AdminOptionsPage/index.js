import React from "react";

import "./index.css";

export class AdminOptionsPage extends React.Component {
  state = {
    ipBanList: "UNIMPLEMENTED FUNCTION",
    removeNickname: "",

    removeAllScoresBtnEnabled: true,
    removeScoresWNickBtnEnabled: true,
    banIpAddressBtnEnabled: true,
    unbanIpAddressBtnEnabled: true,
    logoutBtnEnabled: true,
  };

  render() {
    return (
      <div className="admin-options-page">
        <h2>Admin Options</h2>

        <div className="admin-options-form">
          <div className="admin-options-row RoundBorder">
            <button
              className="button button-admin-wide"
              disabled={!this.state.removeAllScoresBtnEnabled}
              onClick={() => {
                this.handleRemoveAllScores();
              }}
            >
              Remove All Scores
            </button>
          </div>

          <div className="admin-options-row RoundBorder">
            <h3 className="admin-options-title">Remove scores by username</h3>

            <input
              className="input-text"
              type="text"
              onChange={(event) => {
                this.setState({ removeNickname: event.target.value });
              }}
            />

            <button
              className="button"
              disabled={!this.state.removeScoresWNickBtnEnabled}
              onClick={() => {
                this.handleRemoveScoresWithNickname(this.state.removeNickname);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  disableAllButtons = () => {
    console.log("Disabling all buttons.");

    this.setState({
      removeAllScoresBtnEnabled: false,
      removeScoresWNickBtnEnabled: false,
      banIpAddressBtnEnabled: false,
      unbanIpAddressBtnEnabled: false,
      logoutBtnEnabled: false,
    });
  };

  enableAllButtons = () => {
    console.log("Enabling all buttons.");

    this.setState({
      removeAllScoresBtnEnabled: true,
      removeScoresWNickBtnEnabled: true,
      banIpAddressBtnEnabled: true,
      unbanIpAddressBtnEnabled: true,
      logoutBtnEnabled: true,
    });
  };

  handleAdminLogout = () => {
    console.log("Trying to log out current admin...");

    this.props.handleAdminLogout();
  };

  handleRemoveAllScores = async () => {
    alert("Unimplemented function!");
  };

  handleBanIpAddress = () => {
    alert("Unimplemented function!");
  };

  handleUnBanIpAddress = () => {
    alert("Unimplemented function!");
  };

  handleRemoveScoresWithNickname = async (nickname) => {
    alert("Unimplemented function!");
  };
}
