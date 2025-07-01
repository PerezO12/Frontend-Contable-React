import React from 'react';
import { Typography } from '../atoms/Typography';
import type { BreadcrumbItem } from '../types';

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  className = '',
}) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={`flex ${className}`}>
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={index} className="flex items-center">
              {index > 0 && (
                <svg
                  className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}

              {isLast ? (
                <Typography
                  variant="body2"
                  color="primary"
                  weight="medium"
                  className="cursor-default"
                  aria-current="page"
                >
                  {item.label}
                </Typography>
              ) : item.href ? (
                <a
                  href={item.href}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                >
                  {item.label}
                </a>
              ) : item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded"
                >
                  {item.label}
                </button>
              ) : (
                <Typography variant="body2" color="secondary">
                  {item.label}
                </Typography>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
