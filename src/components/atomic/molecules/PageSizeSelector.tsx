import React from 'react';
import { Typography } from '../atoms/Typography';

export interface PageSizeSelectorProps {
  currentPageSize: number;
  pageSizeOptions: number[];
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}

export const PageSizeSelector: React.FC<PageSizeSelectorProps> = ({
  currentPageSize,
  pageSizeOptions,
  onPageSizeChange,
  className = '',
}) => {
  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(event.target.value, 10);
    onPageSizeChange(newPageSize);
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Typography variant="body2" color="secondary">
        Mostrar:
      </Typography>
      <select
        value={currentPageSize}
        onChange={handlePageSizeChange}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            {size}
          </option>
        ))}
      </select>
      <Typography variant="body2" color="secondary">
        por página
      </Typography>
    </div>
  );
};
