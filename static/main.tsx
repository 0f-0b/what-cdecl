/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="es2020" />
/* @jsxImportSource react */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
