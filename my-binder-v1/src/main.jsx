import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CardProvider from "./context/CardContext";
import BinderProvider from "./context/BinderContext";
import "./styles/design.css";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <CardProvider>
        <BinderProvider>
          <App />
        </BinderProvider>
      </CardProvider>
    </BrowserRouter>
  </StrictMode>
);