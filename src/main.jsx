import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");

const root = createRoot(container);
console.log("Frontend cargado desde main.jsx")
root.render(
    <React.StrictMode>
    <App />
    </React.StrictMode>
);
