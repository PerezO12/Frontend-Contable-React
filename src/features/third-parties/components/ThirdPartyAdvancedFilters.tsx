/**
 * Componente de filtros avanzados para terceros
 * Similar al de facturas pero adaptado a terceros
 */
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { ThirdPartyFilters } from '../types';
import { ThirdPartyType, DocumentType } from '../types';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@/shared/components/icons';

interface ThirdPartyAdvancedFiltersProps {
  filters: ThirdPartyFilters;
  onFiltersChange: (filters: ThirdPartyFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

export function ThirdPartyAdvancedFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  loading = false
}: ThirdPartyAdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<ThirdPartyFilters>(filters);

  // Actualizar filtros locales cuando cambien los externos
  const updateLocalFilter = (key: keyof ThirdPartyFilters, value: any) => {
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
    setLocalFilters({});
    onClearFilters();
  };

  // Verificar si hay filtros activos
  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== undefined && value !== '' && value !== null
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
        {/* Búsqueda rápida por nombre */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre..."
            value={localFilters.search || ''}
            onChange={(e) => updateLocalFilter('search', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tipo de tercero */}
        <Select
          placeholder="Tipo"
          value={localFilters.third_party_type || ''}
          onChange={(value) => updateLocalFilter('third_party_type', value)}
          options={[
            { value: '', label: 'Todos los tipos' },
            { value: ThirdPartyType.CUSTOMER, label: 'Cliente' },
            { value: ThirdPartyType.SUPPLIER, label: 'Proveedor' },
            { value: ThirdPartyType.EMPLOYEE, label: 'Empleado' }
          ]}
        />

        {/* Estado */}
        <Select
          placeholder="Estado"
          value={localFilters.is_active?.toString() || ''}
          onChange={(value) => updateLocalFilter('is_active', value === '' ? undefined : value === 'true')}
          options={[
            { value: '', label: 'Todos los estados' },
            { value: 'true', label: 'Activos' },
            { value: 'false', label: 'Inactivos' }
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
        <div className="border-t pt-4 space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Filtros Avanzados</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Ciudad */}
            <div className="relative">
              <Input
                placeholder="Ciudad..."
                value={localFilters.city || ''}
                onChange={(e) => updateLocalFilter('city', e.target.value)}
              />
            </div>

            {/* País */}
            <div className="relative">
              <Input
                placeholder="País..."
                value={localFilters.country || ''}
                onChange={(e) => updateLocalFilter('country', e.target.value)}
              />
            </div>

            {/* Tipo de documento - SOLO el filtro, no el número */}
            <Select
              placeholder="Tipo de documento"
              value={localFilters.document_type || ''}
              onChange={(value) => updateLocalFilter('document_type', value)}
              options={[
                { value: '', label: 'Todos los tipos' },
                { value: DocumentType.RUT, label: 'RUT' },
                { value: DocumentType.NIT, label: 'NIT' },
                { value: DocumentType.DNI, label: 'DNI' },
                { value: DocumentType.PASSPORT, label: 'Pasaporte' },
                { value: DocumentType.RFC, label: 'RFC' },
                { value: DocumentType.CUIT, label: 'CUIT' },
                { value: DocumentType.OTHER, label: 'Otro' }
              ]}
            />
          </div>

          {/* NOTA: Los siguientes campos NO están soportados por el backend y están comentados:
               - document_number, email, commercial_name, credit_limit_min, credit_limit_max
               - has_balance, order_by - estos están en la interfaz pero comentados */}

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
