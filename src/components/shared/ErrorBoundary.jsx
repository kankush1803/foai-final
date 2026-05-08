import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8 rounded-2xl bg-red-500/10 border border-red-500/20">
          <div className="text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Something went wrong
          </h3>
          <p className="text-sm text-neutral-400 mb-4 text-center max-w-md">
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.handleRetry}
            className="px-5 py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-medium text-sm"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
