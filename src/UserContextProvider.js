import React from "react";

export const UserContext = React.createContext();

export class UserContextProvider extends React.Component {
  state = {
    user: null,
  };

  updateUser = (user) => {
    this.setState({ user: user });
  };

  render() {
    return (
      <UserContext.Provider
        value={{ user: this.state.user, updateUser: this.updateUser }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
