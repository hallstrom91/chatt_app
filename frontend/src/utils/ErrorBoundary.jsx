import React, { Component } from "react";
import ErrorFallback from "@shared/ErrorFallback";
import * as Sentry from "@sentry/react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error);
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
