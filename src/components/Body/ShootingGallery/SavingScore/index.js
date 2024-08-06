import React from "react";
import { Loading } from "../../../Loading";

import "./index.css";

export class SavingScore extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="pop-up-container">
          <div className="pop-up-screen round-border">
            <div className="saving-score">
              <Loading />
              <p className="saving-score-text">Saving Score</p>
            </div>
          </div>
        </div>
      </>
    );
  }
}
