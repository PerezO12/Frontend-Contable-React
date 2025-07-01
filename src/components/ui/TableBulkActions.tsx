import React from 'react';
import type { ReactNode } from 'react';
import { Card } from './Card';

export interface TableBulkActionsProps {
  /**
   * Número de elementos seleccionados
   */
  selectedCount: number;
  
  /**
   * Acciones para realizar con los elementos seleccionados
   */
  actions: ReactNode;
  
  /**
   * Texto personalizado para mostrar (por defecto: "elementos seleccionados")
   */
  selectionText?: string;
}

export const TableBulkActions: React.FC<TableBulkActionsProps> = ({
  selectedCount,
  actions,
  selectionText = 'elementos'
}) => {
  if (selectedCount === 0) return null;
  
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-700">
          {selectedCount} {selectionText} seleccionado(s)
        </span>
        <div className="flex space-x-2">
          {actions}
        </div>
      </div>
    </Card>
  );
}; 