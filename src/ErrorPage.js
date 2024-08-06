import React from "react";
import "./css/ErrorPage.css";

export class ErrorPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (this.props.errorMessage) {
      this.setState({ errorMessage: this.props.errorMessage });
    }
  }

  state = {
    errorMessage: "Page not found!",
  };

  render() {
    return (
      <div className="error-page-container RoundBorder">
        <h2>OOPS!</h2>
        <img className="error-page-img" src="/images/target.svg" />
        <p className="error-page-msg">{this.state.errorMessage}</p>
      </div>
    );
  }
}
