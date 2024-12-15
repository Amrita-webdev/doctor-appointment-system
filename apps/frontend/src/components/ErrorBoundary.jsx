import React, { useState } from "react";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#fce4e4",
        color: "#d32f2f",
        borderRadius: "5px",
      }}
    >
      <h2>Something went wrong.</h2>
      <details style={{ whiteSpace: "pre-wrap" }}>
        {error?.message}
      </details>
      <button
        style={{
          marginTop: "20px",
          padding: "10px 15px",
          backgroundColor: "#d32f2f",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={resetErrorBoundary}
      >
        Try Again
      </button>
    </div>
  );
};

export const ErrorBoundary = ({ children }) => {
  const [error, setError] = useState(null);

  const resetErrorBoundary = () => {
    setError(null);
  };

  if (error) {
    return (
      <ErrorFallback error={error} resetErrorBoundary={resetErrorBoundary} />
    );
  }

  return (
    <ErrorCatcher onError={setError}>
      {children}
    </ErrorCatcher>
  );
};

class ErrorCatcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    this.props.onError(error);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
