import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import Chart from "./Chart";

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
      "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
      sans-serif;
  }

  html,
  body,
  #root {
    height: 100%;
    width: 100%;
  }

`;

ReactDOM.render(
  <React.StrictMode>
    <>
      <GlobalStyle />
      <Chart />
    </>
  </React.StrictMode>,
  document.getElementById("root")
);
