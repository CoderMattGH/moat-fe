import React from "react";

import "./index.css";

export class ErrorPopup extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <>
        <div className="pop-up-container">
          <div className="pop-up-screen round-border">
            <div className="error-popup">
              <h2>Error</h2>
              <p className="error-popup-msg">{this.props.errorMessage}</p>
              <button
                onClick={(e) => {
                  e.preventDefault();

                  this.props.setErrorMessage(null);
                }}
                className="button error-popup-button"
              >
                OK!
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };
}
