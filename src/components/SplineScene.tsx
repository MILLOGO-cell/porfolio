"use client";

import Spline from '@splinetool/react-spline';
import { useState } from 'react';

interface SplineSceneProps {
  scene: string;
  className?: string;
  onLoad?: () => void;
  fallback?: React.ReactNode;
}

export default function SplineScene({ 
  scene, 
  className = "", 
  onLoad,
  fallback 
}: SplineSceneProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError && fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-lg">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <Spline
        scene={scene}
        onLoad={handleLoad}
        onError={handleError}
        className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}
      />
    </div>
  );
}