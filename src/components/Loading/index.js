import React from "react";

import "./index.css";

export class Loading extends React.Component {
  state = {};

  render() {
    return (
      <div className="loading-container">
        <img
          alt="Loading..."
          className="loading-image"
          src="/images/target.svg"
        />
      </div>
    );
  }
}
