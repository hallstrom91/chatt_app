import React, { Component } from "react";
import ErrorFallback from "@shared/ErrorFallback";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error at:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <ErrorFallback onReset={() => this.setState({ hasError: false })} />
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
