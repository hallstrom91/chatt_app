import React, { Component } from "react";
import { Link } from "react-router-dom";

class ErrroBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught error at:");
  }
  render() {
    if (this.state.hasError) {
      return (
        <>
          <div className="flex justify-center items-center h-screen">
            <div className="text-center">
              <h1 className="text-2xl lg:text-4xl font-semibold">
                Ett fel har inträffat...
              </h1>
              <p className="text-base">
                Var vänlig och orsaka inte mer problem än nödvändigt, tack.
              </p>
              <Link to="/*" className="px-2 py-1 border">
                Tillbaka Hem
              </Link>
            </div>
          </div>
        </>
      );
    }

    return this.props.children;
  }
}

export default ErrroBoundary;
