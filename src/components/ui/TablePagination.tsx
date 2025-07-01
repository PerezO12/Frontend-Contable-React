import React from 'react';
import { Button } from './Button';

export interface TablePaginationProps {
  /**
   * Número total de registros
   */
  total: number;
  
  /**
   * Página actual
   */
  page: number;
  
  /**
   * Número total de páginas
   */
  pages: number;
  
  /**
   * Registros por página
   */
  perPage: number;
  
  /**
   * Función para cambiar de página
   */
  onPageChange: (page: number) => void;
}

export const TablePagination: React.FC<TablePaginationProps> = ({
  total,
  page,
  pages,
  perPage,
  onPageChange
}) => {
  if (pages <= 1) return null;
  
  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      {/* Versión móvil */}
      <div className="flex-1 flex justify-between sm:hidden">
        <Button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          variant="outline"
        >
          Anterior
        </Button>
        <Button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          variant="outline"
        >
          Siguiente
        </Button>
      </div>
      
      {/* Versión desktop */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando{' '}
            <span className="font-medium">
              {(page - 1) * perPage + 1}
            </span>{' '}
            a{' '}
            <span className="font-medium">
              {Math.min(page * perPage, total)}
            </span>{' '}
            de{' '}
            <span className="font-medium">{total}</span> resultados
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <Button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page <= 1}
              variant="outline"
              className="rounded-l-md"
            >
              Anterior
            </Button>
            <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
              Página {page} de {pages}
            </span>
            <Button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= pages}
              variant="outline"
              className="rounded-r-md"
            >
              Siguiente
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}; 