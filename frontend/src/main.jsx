import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";

import App from "./App";
import "./index.css";

// 🌐 GOOGLE CLIENT ID SAFE LOAD
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

// ✅ ROUTER CONFIG
const router = createBrowserRouter(
  [
    {
      path: "/*",
      element: <App />,
      errorElement: (
        <div className="h-screen flex items-center justify-center text-red-500">
          Something went wrong. Please refresh.
        </div>
      ),
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

// 🚀 APP RENDER
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    {GOOGLE_CLIENT_ID ? (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>
    ) : (
      <div className="h-screen flex items-center justify-center text-red-500">
        ❌ Google Client ID missing (.env)
      </div>
    )}

  </React.StrictMode>
);