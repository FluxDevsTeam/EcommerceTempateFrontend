// import React from 'react';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import App from "./App.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import ReactDOM from 'react-dom/client';
// import App from './App';

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ToastContainer position="top-center" />
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
