import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './global.css';
import { App } from "./App";
import { DarkModeProvider } from "./context/darkModeContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DarkModeProvider>
    <App /> 
    </DarkModeProvider>
  </StrictMode>
);
