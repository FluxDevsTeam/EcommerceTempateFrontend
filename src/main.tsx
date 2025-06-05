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
    <GoogleOAuthProvider clientId="485842892175-0nkg2jk57m9jrr1f21qgikeijsddmh5t.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
