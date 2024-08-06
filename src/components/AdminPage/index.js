import React from "react";

import { UserContext } from "../../context/UserContextProvider";
import { ErrorPage } from "../ErrorPage";
import { AdminOptionsPage } from "./AdminOptionsPage";

export class AdminPage extends React.Component {
  static contextType = UserContext;

  render() {
    const { user } = this.context;

    let isAdmin;
    if (!user || (user && user.role !== "ADMIN")) {
      isAdmin = false;
    } else {
      isAdmin = true;
    }

    return (
      <>
        {isAdmin ? (
          <div>
            <AdminOptionsPage />
          </div>
        ) : (
          <div>
            <ErrorPage errorMessage="Access denied!" />
          </div>
        )}
      </>
    );
  }
}
