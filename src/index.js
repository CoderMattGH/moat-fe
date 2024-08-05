import React from "react";
import ReactDOM from "react-dom/client";
import "./css/index.css";

import MOATApp from "./MOATApp.js";

import { UserContextProvider } from "./UserContextProvider.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserContextProvider>
      <MOATApp />
    </UserContextProvider>
  </React.StrictMode>
);
