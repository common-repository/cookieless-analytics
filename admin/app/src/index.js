import CKLS_Dashboard from "./dashboard.jsx";
import CKLS_Analytics from "./analytics.jsx";

import React from "react";
import ReactDOM from "react-dom/client";

document.addEventListener("DOMContentLoaded", () => {
  const dash = ReactDOM.createRoot(
    document.getElementById("cookieless-analytics")
  );
  if (dash) {
    dash.render(
      <React.StrictMode>
        <CKLS_Dashboard />
      </React.StrictMode>
    );
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const analytics = ReactDOM.createRoot(
    document.getElementById("ckls-analytics-page")
  );
  if (analytics) {
    analytics.render(
      <React.StrictMode>
        <CKLS_Analytics />
      </React.StrictMode>
    );
  }
});
