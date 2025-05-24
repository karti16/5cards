/* eslint-disable react/prop-types */
import React from 'react';
import { RotateCw } from 'lucide-react';

export default function LoadingSpinner({ size = 6, color = 'text-gray-500' }) {
  const sizeClasses = `w-${size} h-${size} ${color}`;
  return (
    <div className={`flex justify-center p-2`}>
      <RotateCw className={`animate-spin transition-all ${sizeClasses}`} />
    </div>
  );
}
