import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App Runtime Error Caught by Boundary:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-sand flex flex-col items-center justify-center p-6 text-center text-ink">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-xl border border-ink/10 space-y-4">
            <h2 className="text-2xl font-display font-bold text-ink">Something went wrong</h2>
            <p className="text-sm text-ink/65 leading-relaxed">
              An unexpected error occurred while loading this view.
            </p>
            {this.state.error && (
              <pre className="text-[11px] p-3 bg-red-50 text-red-600 rounded-xl text-left overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </pre>
            )}
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="gold-button w-full py-3 text-xs"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
