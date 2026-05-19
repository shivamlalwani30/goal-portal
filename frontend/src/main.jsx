import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import "./index.css";

/* CONTEXTS */
import { MicrosoftAuthProvider } from "./contexts/MicrosoftAuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { EscalationProvider } from "./contexts/EscalationContext";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <BrowserRouter>

      <NotificationProvider>

        <EscalationProvider>

          <MicrosoftAuthProvider>

            <Toaster
              position="top-right"
            />

            <App />

          </MicrosoftAuthProvider>

        </EscalationProvider>

      </NotificationProvider>

    </BrowserRouter>

  </React.StrictMode>
);