import React from 'react';
import { RequestStatus } from '../types';
import { STATUS_CONFIG } from '../constants';

interface StatusBadgeProps {
  status: RequestStatus;
  size?: 'sm' | 'md';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  if (!config) return <span className="text-gray-500">Unknown</span>;

  const baseClasses = "inline-flex items-center space-x-1.5 rounded-full font-medium transition-colors";
  const sizeClasses = size === 'sm' ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span className={`${baseClasses} ${sizeClasses} ${config.color}`}>
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
}
