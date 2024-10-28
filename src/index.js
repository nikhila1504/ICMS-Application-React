import "primereact/resources/themes/lara-light-indigo/theme.css";
import React from "react";
import "react-bootstrap/dist/react-bootstrap.min.js";
import ReactDOM from "react-dom/client";
import "react-toastify/dist/ReactToastify.css";
import App from "./App";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/saga-blue/theme.css'; 
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'react-tooltip/dist/react-tooltip.css';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
