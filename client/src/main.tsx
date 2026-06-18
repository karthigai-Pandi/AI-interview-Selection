import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { store } from './store';
import './index.css';

// Suppress ObjectMultiplex and EventEmitter warnings from browser extensions
const originalError = console.error;
const originalWarn = console.warn;

console.error = function(...args: any[]) {
  // Filter out known browser extension messages
  const message = args.join(' ');
  if (
    message.includes('ObjectMultiplex') ||
    message.includes('MaxListenersExceededWarning') ||
    message.includes('orphaned data') ||
    message.includes('malformed chunk')
  ) {
    return; // Suppress these messages
  }
  originalError.apply(console, args);
};

console.warn = function(...args: any[]) {
  const message = args.join(' ');
  if (
    message.includes('ObjectMultiplex') ||
    message.includes('MaxListenersExceededWarning') ||
    message.includes('orphaned data') ||
    message.includes('malformed chunk')
  ) {
    return; // Suppress these messages
  }
  originalWarn.apply(console, args);
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

