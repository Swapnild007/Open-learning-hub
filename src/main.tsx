import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles.css";
class ErrorBoundary extends React.Component<
  React.PropsWithChildren,
  { error: boolean }
> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? (
      <main className="panel">
        <h1>The learning space couldn’t load.</h1>
        <p>
          Your saved progress has not been cleared. Reload to try again, or keep
          a backup before changing browser data.
        </p>
        <button onClick={() => location.reload()}>Reload</button>
      </main>
    ) : (
      this.props.children
    );
  }
}
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>,
);
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch(() => {
      window.dispatchEvent(new CustomEvent("olh-offline-error"));
    });
  });
}
