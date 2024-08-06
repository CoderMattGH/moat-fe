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
        <div className="PopUpContainer">
          <div className="PopUp-Screen RoundBorder">
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
