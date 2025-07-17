// src/components/ErrorMessage.jsx
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorMessage = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        {error?.error || 'Something went wrong'}
      </h3>
      <p className="text-red-600 mb-4">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </button>
      )}
    </div>
  );
};
