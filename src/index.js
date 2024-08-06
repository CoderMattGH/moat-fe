import React from "react";
import ReactDOM from "react-dom/client";

import { UserContextProvider } from "./context/UserContextProvider";
import MOATApp from "./components/MOATApp";

import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <MOATApp />
    </UserContextProvider>
  </React.StrictMode>
);
