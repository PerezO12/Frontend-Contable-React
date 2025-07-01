import React from 'react';
import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import type { PaginationInfo } from '../types';

export interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  pagination,
  onPageChange,
  showQuickJumper = false,
  showTotal = true,
  className = '',
}) => {
  const { total, page, pages, perPage } = pagination;

  const generatePageNumbers = () => {
    const delta = 2; // Número de páginas a mostrar a cada lado de la página actual
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, page - delta);
      i <= Math.min(pages - 1, page + delta);
      i++
    ) {
      range.push(i);
    }

    if (page - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (page + delta < pages - 1) {
      rangeWithDots.push('...', pages);
    } else if (pages > 1) {
      rangeWithDots.push(pages);
    }

    return rangeWithDots;
  };

  const startItem = (page - 1) * perPage + 1;
  const endItem = Math.min(page * perPage, total);

  if (total === 0) {
    return null;
  }

  return (
    <div className={`flex items-center justify-between bg-white px-4 py-3 border-t border-gray-100 ${className}`}>
      <div className="flex items-center space-x-4">
        {showTotal && (
          <Typography variant="body2" color="secondary">
            Mostrando {startItem.toLocaleString()} a {endItem.toLocaleString()} de {total.toLocaleString()} resultados
          </Typography>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center space-x-1">
          {/* Botón anterior */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="mr-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Anterior
          </Button>

          {/* Números de página */}
          <div className="flex items-center space-x-1">
            {generatePageNumbers().map((pageNumber, index) => (
              <React.Fragment key={index}>
                {pageNumber === '...' ? (
                  <span className="px-2 py-1 text-secondary-500">...</span>
                ) : (
                  <Button
                    variant={pageNumber === page ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => onPageChange(pageNumber as number)}
                    className="min-w-[2rem]"
                  >
                    {pageNumber}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Botón siguiente */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page === pages}
            className="ml-1"
          >
            Siguiente
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Button>

          {/* Salto rápido a página */}
          {showQuickJumper && (
            <div className="flex items-center space-x-2 ml-4">
              <Typography variant="body2" color="secondary">
                Ir a:
              </Typography>
              <input
                type="number"
                min={1}
                max={pages}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm w-16 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const targetPage = parseInt((e.target as HTMLInputElement).value, 10);
                    if (targetPage >= 1 && targetPage <= pages) {
                      onPageChange(targetPage);
                      (e.target as HTMLInputElement).value = '';
                    }
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};
