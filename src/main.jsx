import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./stylesheets/index.css";
import "react-circular-progressbar/dist/styles.css";
import { BrowserRouter } from "react-router-dom";
import { GlobalContextProvider } from "./context/globalContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <GlobalContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </GlobalContextProvider>
  // </React.StrictMode>
);
