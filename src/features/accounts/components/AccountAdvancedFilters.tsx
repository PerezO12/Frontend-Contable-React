/**
 * Componente de filtros avanzados para cuentas contables
 * Basado en ThirdPartyAdvancedFilters pero adaptado para accounts
 */
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { AccountFilters } from '../types';
import { 
  ACCOUNT_TYPE_LABELS,
  ACCOUNT_CATEGORY_LABELS,
  CASH_FLOW_CATEGORY_LABELS
} from '../types';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@/shared/components/icons';

interface AccountAdvancedFiltersProps {
  filters: AccountFilters;
  onFiltersChange: (filters: AccountFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

export function AccountAdvancedFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  loading = false
}: AccountAdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<AccountFilters>(filters);

  // Actualizar filtros locales cuando cambien los externos
  const updateLocalFilter = (key: keyof AccountFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value || undefined };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  // Aplicar filtros
  const handleApplyFilters = () => {
    onApplyFilters();
  };

  // Limpiar filtros
  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onClearFilters();
  };

  // Determinar si hay filtros activos
  const hasActiveFilters = Object.values(localFilters).some(
    value => value !== undefined && value !== '' && value !== null
  );

  return (
    <Card className="p-4 space-y-4">
      {/* Header con toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-500" />
          <h3 className="text-sm font-medium text-gray-900">Filtros de Búsqueda</h3>
          {hasActiveFilters && (
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
              {Object.values(localFilters).filter(v => v !== undefined && v !== '').length} activos
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            disabled={!hasActiveFilters || loading}
            className="text-xs"
          >
            <XMarkIcon className="h-4 w-4 mr-1" />
            Limpiar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Filtros básicos (siempre visibles) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Búsqueda rápida */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por código o nombre..."
            value={localFilters.search || ''}
            onChange={(e) => updateLocalFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tipo de cuenta */}
        <Select
          placeholder="Tipo"
          value={localFilters.account_type || ''}
          onChange={(value) => updateLocalFilter('account_type', value)}
          options={[
            { value: '', label: 'Todos los tipos' },
            ...Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => ({
              value,
              label
            }))
          ]}
        />

        {/* Estado */}
        <Select
          placeholder="Estado"
          value={localFilters.is_active?.toString() || ''}
          onChange={(value) => updateLocalFilter('is_active', value === '' ? undefined : value === 'true')}
          options={[
            { value: '', label: 'Todos los estados' },
            { value: 'true', label: 'Activas' },
            { value: 'false', label: 'Inactivas' }
          ]}
        />

        {/* Botón aplicar */}
        <Button
          onClick={handleApplyFilters}
          disabled={loading}
          className="w-full"
        >
          <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
          Buscar
        </Button>
      </div>

      {/* Filtros avanzados (expandibles) */}
      {isExpanded && (
        <div className="space-y-4 pt-4 border-t">
          {/* Categoría de cuenta y flujo de efectivo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría de Cuenta
              </label>
              <Select
                placeholder="Todas las categorías"
                value={localFilters.category || ''}
                onChange={(value) => updateLocalFilter('category', value)}
                options={[
                  { value: '', label: 'Todas las categorías' },
                  ...Object.entries(ACCOUNT_CATEGORY_LABELS).map(([value, label]) => ({
                    value,
                    label
                  }))
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                💧 Categoría de Flujo de Efectivo
              </label>
              <Select
                placeholder="Todas las categorías de flujo"
                value={localFilters.cash_flow_category || ''}
                onChange={(value) => updateLocalFilter('cash_flow_category', value)}
                options={[
                  { value: '', label: 'Todas las categorías' },
                  ...Object.entries(CASH_FLOW_CATEGORY_LABELS).map(([value, label]) => ({
                    value,
                    label
                  })),
                  { value: '__unassigned__', label: 'Sin asignar' }
                ]}
              />
            </div>
          </div>

          {/* Controles de paginación y elementos por página */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Elementos por página */}
            <Select
              placeholder="Elementos por página"
              value={localFilters.limit?.toString() || '50'}
              onChange={(value) => updateLocalFilter('limit', value ? parseInt(value) : 50)}
              options={[
                { value: '25', label: '25 por página' },
                { value: '50', label: '50 por página' },
                { value: '100', label: '100 por página' },
                { value: '200', label: '200 por página' }
              ]}
            />
            
            {/* Info de paginación */}
            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-500">
                Página actual: {Math.floor((localFilters.skip || 0) / (localFilters.limit || 50)) + 1}
              </span>
            </div>
          </div>

          {/* Controles de paginación */}
          <div className="flex items-center justify-center space-x-2 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentPage = Math.floor((localFilters.skip || 0) / (localFilters.limit || 50));
                const newSkip = Math.max(0, (currentPage - 1) * (localFilters.limit || 50));
                updateLocalFilter('skip', newSkip);
              }}
              disabled={!localFilters.skip || localFilters.skip <= 0}
              className="text-xs"
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentPage = Math.floor((localFilters.skip || 0) / (localFilters.limit || 50));
                const newSkip = (currentPage + 1) * (localFilters.limit || 50);
                updateLocalFilter('skip', newSkip);
              }}
              className="text-xs"
            >
              Siguiente
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateLocalFilter('skip', 0)}
              disabled={!localFilters.skip || localFilters.skip <= 0}
              className="text-xs"
            >
              Primera página
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
