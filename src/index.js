import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Import Bootstrap CSS
import "bootstrap/dist/css/bootstrap.min.css";
// Import Bootstrap Bundle JS (includes Popper)
import "bootstrap/dist/js/bootstrap.bundle.min";

// Create a root container for the React application
const container = document.getElementById('root');
const root = createRoot(container);

// Render the main App component
root.render(
  // Uncomment StrictMode if needed
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);
