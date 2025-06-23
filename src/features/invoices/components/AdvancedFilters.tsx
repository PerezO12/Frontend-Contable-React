/**
 * Componente de filtros avanzados para facturas
 * Implementa todas las nuevas capacidades de búsqueda del backend
 */
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { InvoiceFilters } from '../types';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@/shared/components/icons';

interface AdvancedFiltersProps {
  filters: InvoiceFilters;
  onFiltersChange: (filters: InvoiceFilters) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

export function AdvancedFilters({
  filters,
  onFiltersChange,
  onApplyFilters,
  onClearFilters,
  loading = false
}: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState<InvoiceFilters>(filters);

  // Actualizar filtros locales cuando cambien los externos
  const updateLocalFilter = (key: keyof InvoiceFilters, value: any) => {
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
        {/* Búsqueda rápida */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por número..."
            value={localFilters.invoice_number || ''}
            onChange={(e) => updateLocalFilter('invoice_number', e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Estado */}
        <Select
          placeholder="Estado"
          value={localFilters.status || ''}
          onChange={(value) => updateLocalFilter('status', value)}
          options={[
            { value: '', label: 'Todos los estados' },
            { value: 'DRAFT', label: 'Borrador' },
            { value: 'POSTED', label: 'Contabilizada' },
            { value: 'CANCELLED', label: 'Cancelada' }
          ]}
        />

        {/* Tipo */}
        <Select
          placeholder="Tipo"
          value={localFilters.invoice_type || ''}
          onChange={(value) => updateLocalFilter('invoice_type', value)}
          options={[
            { value: '', label: 'Todos los tipos' },
            { value: 'CUSTOMER_INVOICE', label: 'Factura de Venta' },
            { value: 'SUPPLIER_INVOICE', label: 'Factura de Compra' },
            { value: 'CREDIT_NOTE', label: 'Nota de Crédito' },
            { value: 'DEBIT_NOTE', label: 'Nota de Débito' }
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
          {/* Fechas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha desde
              </label>
              <Input
                type="date"
                value={localFilters.date_from || ''}
                onChange={(e) => updateLocalFilter('date_from', e.target.value)}
                placeholder="Seleccionar fecha inicial"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha hasta
              </label>
              <Input
                type="date"
                value={localFilters.date_to || ''}
                onChange={(e) => updateLocalFilter('date_to', e.target.value)}
                placeholder="Seleccionar fecha final"
              />
            </div>
          </div>

          {/* Búsquedas de texto */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del tercero
              </label>
              <Input
                placeholder="Buscar por cliente/proveedor..."
                value={localFilters.third_party_name || ''}
                onChange={(e) => updateLocalFilter('third_party_name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <Input
                placeholder="Buscar en descripción..."
                value={localFilters.description || ''}
                onChange={(e) => updateLocalFilter('description', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Referencia
              </label>
              <Input
                placeholder="Buscar por referencia..."
                value={localFilters.reference || ''}
                onChange={(e) => updateLocalFilter('reference', e.target.value)}
              />
            </div>
          </div>

          {/* Filtros de monto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto desde
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={localFilters.amount_from || ''}
                onChange={(e) => updateLocalFilter('amount_from', parseFloat(e.target.value) || undefined)}
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monto hasta
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={localFilters.amount_to || ''}
                onChange={(e) => updateLocalFilter('amount_to', parseFloat(e.target.value) || undefined)}
                min="0"
                step="0.01"
              />
            </div>
          </div>

          {/* Ordenamiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordenar por
              </label>
              <Select
                value={localFilters.sort_by || 'invoice_date'}
                onChange={(value) => updateLocalFilter('sort_by', value)}
                options={[
                  { value: 'invoice_date', label: 'Fecha de factura' },
                  { value: 'number', label: 'Número' },
                  { value: 'total_amount', label: 'Monto total' },
                  { value: 'status', label: 'Estado' },
                  { value: 'created_at', label: 'Fecha de creación' },
                  { value: 'due_date', label: 'Fecha de vencimiento' }
                ]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección
              </label>
              <Select
                value={localFilters.sort_order || 'desc'}
                onChange={(value) => updateLocalFilter('sort_order', value)}
                options={[
                  { value: 'desc', label: 'Descendente' },
                  { value: 'asc', label: 'Ascendente' }
                ]}
              />
            </div>
          </div>

          {/* Otros filtros */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Moneda
              </label>
              <Select
                placeholder="Todas las monedas"
                value={localFilters.currency_code || ''}
                onChange={(value) => updateLocalFilter('currency_code', value)}
                options={[
                  { value: '', label: 'Todas las monedas' },
                  { value: 'USD', label: 'USD - Dólar' },
                  { value: 'COP', label: 'COP - Peso Colombiano' },
                  { value: 'EUR', label: 'EUR - Euro' }
                ]}
              />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
