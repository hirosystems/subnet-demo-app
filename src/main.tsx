import React from "react";
import ReactDOM from "react-dom/client";

import { Container } from "./Root";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Container />,
  </React.StrictMode>,
);
