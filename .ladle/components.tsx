import type { GlobalProvider } from "@ladle/react";
import React, { useEffect } from "react";
import { ThemeProvider } from "../src/components/ThemeProvider";
import "./theme.css";

export const Provider: GlobalProvider = ({ children, globalState }) => {
  useEffect(() => {
    if (globalState.theme === "dark") {
      document.documentElement.classList.add("vkui:dark");
    } else {
      document.documentElement.classList.remove("vkui:dark");
    }
  }, [globalState.theme]);
  return <ThemeProvider>{children}</ThemeProvider>;
};
