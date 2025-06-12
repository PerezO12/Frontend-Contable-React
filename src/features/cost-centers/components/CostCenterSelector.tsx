import React, { useState, useMemo } from 'react';
import { useCostCenters } from '../hooks';
import type { CostCenter } from '../types';

interface CostCenterSelectorProps {
  value?: string;
  onChange: (costCenterId: string | null, costCenter?: CostCenter) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  showActiveOnly?: boolean;
  className?: string;
}

export const CostCenterSelector: React.FC<CostCenterSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Seleccionar centro de costo...',
  disabled = false,
  required = false,
  showActiveOnly = true,
  className = ''
}) => {
  const { costCenters, loading, error } = useCostCenters({
    is_active: showActiveOnly ? true : undefined
  });

  // Filtrar y organizar centros de costo jerárquicamente
  const organizedCostCenters = useMemo(() => {
    if (!costCenters) return [];

    const buildHierarchy = (parentId: string | null = null, level: number = 0): any[] => {
      const children = costCenters.filter(cc => cc.parent_id === parentId);
      
      return children.reduce((acc, costCenter) => {
        acc.push({
          ...costCenter,
          level,
          displayName: `${'  '.repeat(level)}${costCenter.code} - ${costCenter.name}`
        });
        
        // Añadir hijos recursivamente
        acc.push(...buildHierarchy(costCenter.id, level + 1));
        
        return acc;
      }, [] as any[]);
    };

    return buildHierarchy();
  }, [costCenters]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    
    if (!selectedId) {
      onChange(null);
      return;
    }

    const selectedCostCenter = costCenters?.find(cc => cc.id === selectedId);
    onChange(selectedId, selectedCostCenter);
  };

  const selectedCostCenter = costCenters?.find(cc => cc.id === value);

  return (
    <div className={className}>
      <select
        value={value || ''}
        onChange={handleChange}
        disabled={disabled || loading}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
      >
        <option value="">{loading ? 'Cargando...' : placeholder}</option>
        
        {organizedCostCenters.map((costCenter) => (
          <option 
            key={costCenter.id} 
            value={costCenter.id}
            disabled={!costCenter.is_active}
          >
            {costCenter.displayName}
            {!costCenter.is_active && ' (Inactivo)'}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-red-600">
          Error al cargar centros de costo: {error}
        </p>
      )}

      {selectedCostCenter && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md">
          <div className="text-sm">
            <span className="font-medium">Seleccionado:</span> {selectedCostCenter.code} - {selectedCostCenter.name}
          </div>          {selectedCostCenter.description && (
            <div className="text-xs text-gray-600 mt-1">
              {selectedCostCenter.description}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Componente simplificado para uso en formularios
interface SimpleCostCenterSelectorProps {
  value?: string;
  onChange: (costCenterId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export const SimpleCostCenterSelector: React.FC<SimpleCostCenterSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Centro de costo...',
  disabled = false,
  required = false,
  className = ''
}) => {
  const { costCenters, loading } = useCostCenters({ is_active: true });

  return (
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled || loading}
      required={required}
      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-50 disabled:text-gray-500 ${className}`}
    >
      <option value="">{loading ? 'Cargando...' : placeholder}</option>
      {costCenters?.map((costCenter) => (
        <option key={costCenter.id} value={costCenter.id}>
          {costCenter.code} - {costCenter.name}
        </option>
      ))}
    </select>
  );
};

// Hook para filtrar centros de costo
export const useCostCenterFilter = () => {
  const [selectedCostCenter, setSelectedCostCenter] = useState<string | null>(null);
  const { costCenters } = useCostCenters({ is_active: true });

  const clearFilter = () => setSelectedCostCenter(null);

  const selectedCostCenterData = costCenters?.find(cc => cc.id === selectedCostCenter);

  return {
    selectedCostCenter,
    setSelectedCostCenter,
    selectedCostCenterData,
    clearFilter,
    costCenters: costCenters || []
  };
};
