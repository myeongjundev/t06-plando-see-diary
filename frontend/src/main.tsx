import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { apply, readChoice } from "./theme";
import "./styles.css";

// Resolve the stored theme before the first render: the strict CSP forbids the
// usual inline pre-paint script, so this module is the earliest hook available.
apply(readChoice());

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
