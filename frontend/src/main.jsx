import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@contexts/ThemeContext";
import { AuthProvider } from "@contexts/AuthContext";
import { UserProvider } from "@contexts/UserContext";
import { MessageProvider } from "@contexts/MessageContext";
import * as Sentry from "@sentry/react";
import App from "./App.jsx";
import "./index.css";

Sentry.init({
  dsn: "https://d786f6ed81fc3395b3f0c70eea5b25ec@o4507696238821376.ingest.de.sentry.io/4507798103785552",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/], // change
  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <App />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
