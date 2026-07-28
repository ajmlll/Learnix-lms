import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // In production, send to error tracking service (e.g., Sentry)
    console.error('[Learnix ErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F8F9FC] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-[12px] border border-red-100 shadow-soft-lg p-8 text-center space-y-5">
            {/* Error Icon */}
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto border border-red-100">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-bold bg-red-50 text-red-600 border border-red-100 rounded-md tracking-wide">
                RUNTIME ERROR
              </span>
              <h1 className="text-xl font-extrabold font-heading text-gray-900">
                Something Went Wrong
              </h1>
              <p className="text-xs text-gray-500 leading-relaxed">
                An unexpected error occurred in the Learnix application. Your learning progress is safe — this is a display error only.
              </p>
            </div>

            {/* Error Message (dev only) */}
            {this.state.error && (
              <div className="bg-[#0F172A] text-red-300 rounded-[8px] p-3 text-left font-mono text-[11px] overflow-auto max-h-28 border border-slate-700">
                <span className="text-slate-400">Error: </span>
                {this.state.error.message}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-[#F8F9FC] text-gray-700 border border-gray-200 rounded-[8px] hover:bg-gray-100 transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 outline-none"
              >
                <RefreshCw className="w-4 h-4" />
                Reload Page
              </button>
              <button
                onClick={this.handleReset}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold bg-[#4F46E5] text-white rounded-[8px] hover:bg-[#4338CA] transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 outline-none"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
