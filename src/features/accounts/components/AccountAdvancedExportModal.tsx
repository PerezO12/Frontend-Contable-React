import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { useAccountExport } from '../hooks';
import { useToast } from '../../../shared/hooks';
import { 
  AccountType, 
  AccountCategory,
  ACCOUNT_TYPE_LABELS, 
  ACCOUNT_CATEGORY_LABELS 
} from '../types';

interface AccountAdvancedExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccountAdvancedExportModal: React.FC<AccountAdvancedExportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [filters, setFilters] = useState({
    account_type: '',
    category: '',
    is_active: '',
    search: '',
    date_from: '',
    date_to: ''
  });
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    'code', 'name', 'account_type', 'category', 'balance', 'is_active'
  ]);
  const [availableColumns, setAvailableColumns] = useState<Array<{
    name: string;
    data_type: string;
    include: boolean;
  }>>([]);
  const { 
    isExporting, 
    exportProgress, 
    exportAccountsAdvanced, 
    getExportSchema 
  } = useAccountExport({
    onSuccess: (_, format) => {
      success(`Exportación completada en formato ${format.toUpperCase()}`);
      onClose();
    },
    onError: (error) => {
      showError(error);
    }
  });  const { success, error: showError } = useToast();

  const loadExportSchema = async () => {
    try {
      const schema = await getExportSchema();
      if (schema) {
        setAvailableColumns(schema.available_columns);
      }
    } catch (error) {
      console.error('Error al cargar esquema:', error);
      // Usar columnas por defecto
      setAvailableColumns([
        { name: 'code', data_type: 'string', include: true },
        { name: 'name', data_type: 'string', include: true },
        { name: 'description', data_type: 'string', include: false },
        { name: 'account_type', data_type: 'string', include: true },
        { name: 'category', data_type: 'string', include: true },
        { name: 'parent_id', data_type: 'string', include: false },
        { name: 'level', data_type: 'number', include: false },
        { name: 'is_active', data_type: 'boolean', include: true },
        { name: 'allows_movements', data_type: 'boolean', include: false },
        { name: 'requires_third_party', data_type: 'boolean', include: false },
        { name: 'requires_cost_center', data_type: 'boolean', include: false },
        { name: 'balance', data_type: 'string', include: true },
        { name: 'debit_balance', data_type: 'string', include: false },
        { name: 'credit_balance', data_type: 'string', include: false },
        { name: 'notes', data_type: 'string', include: false },
        { name: 'created_at', data_type: 'string', include: false },
        { name: 'updated_at', data_type: 'string', include: false }      ]);
    }
  };

  // Cargar esquema de exportación al abrir el modal
  useEffect(() => {
    if (isOpen) {
      loadExportSchema();
    }
  }, [isOpen, loadExportSchema]);

  const handleColumnToggle = (columnName: string, checked: boolean) => {
    if (checked) {
      setSelectedColumns([...selectedColumns, columnName]);
    } else {
      setSelectedColumns(selectedColumns.filter(col => col !== columnName));
    }
  };

  const handleExport = async () => {
    const exportFilters = {
      ...filters,
      account_type: filters.account_type || undefined,
      category: filters.category || undefined,
      is_active: filters.is_active ? filters.is_active === 'true' : undefined,
      search: filters.search || undefined,
      date_from: filters.date_from || undefined,
      date_to: filters.date_to || undefined
    };

    // Filtrar filtros vacíos
    const cleanFilters = Object.fromEntries(
      Object.entries(exportFilters).filter(([_, value]) => value !== undefined)
    );

    await exportAccountsAdvanced(
      exportFormat,
      cleanFilters,
      selectedColumns.length > 0 ? selectedColumns : undefined
    );
  };

  const getCategoryOptions = () => {
    if (!filters.account_type) return [];
    
    const categoryMapping = {
      [AccountType.ACTIVO]: [
        AccountCategory.ACTIVO_CORRIENTE,
        AccountCategory.ACTIVO_NO_CORRIENTE
      ],
      [AccountType.PASIVO]: [
        AccountCategory.PASIVO_CORRIENTE,
        AccountCategory.PASIVO_NO_CORRIENTE
      ],
      [AccountType.PATRIMONIO]: [
        AccountCategory.CAPITAL,
        AccountCategory.RESERVAS,
        AccountCategory.RESULTADOS
      ],
      [AccountType.INGRESO]: [
        AccountCategory.INGRESOS_OPERACIONALES,
        AccountCategory.INGRESOS_NO_OPERACIONALES
      ],
      [AccountType.GASTO]: [
        AccountCategory.GASTOS_OPERACIONALES,
        AccountCategory.GASTOS_NO_OPERACIONALES
      ],
      [AccountType.COSTOS]: [
        AccountCategory.COSTO_VENTAS,
        AccountCategory.COSTOS_PRODUCCION
      ]
    };

    return categoryMapping[filters.account_type as AccountType] || [];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Exportación Avanzada de Cuentas</h2>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto space-y-6">
          {/* Formato */}
          <Card>
            <div className="card-body">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Formato de Exportación</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['csv', 'json', 'xlsx'] as const).map((format) => (
                  <label
                    key={format}
                    className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none ${
                      exportFormat === format
                        ? 'border-blue-600 ring-2 ring-blue-600'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format}
                      checked={exportFormat === format}
                      onChange={(e) => setExportFormat(e.target.value as any)}
                      className="sr-only"
                      disabled={isExporting}
                    />
                    <div className="flex flex-col">
                      <span className="block text-sm font-medium text-gray-900 uppercase">
                        {format}
                      </span>
                      <span className="block text-sm text-gray-500 mt-1">
                        {format === 'csv' && 'Compatible con Excel'}
                        {format === 'json' && 'Para APIs y sistemas'}
                        {format === 'xlsx' && 'Excel nativo'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </Card>

          {/* Filtros */}
          <Card>
            <div className="card-body">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filtros de Datos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Tipo de cuenta */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Cuenta
                  </label>
                  <select
                    value={filters.account_type}
                    onChange={(e) => {
                      setFilters({ ...filters, account_type: e.target.value, category: '' });
                    }}
                    disabled={isExporting}
                    className="form-select w-full"
                  >
                    <option value="">Todos los tipos</option>
                    {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Categoría */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                    disabled={isExporting || !filters.account_type}
                    className="form-select w-full"
                  >
                    <option value="">Todas las categorías</option>
                    {getCategoryOptions().map((category) => (
                      <option key={category} value={category}>
                        {ACCOUNT_CATEGORY_LABELS[category]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={filters.is_active}
                    onChange={(e) => setFilters({ ...filters, is_active: e.target.value })}
                    disabled={isExporting}
                    className="form-select w-full"
                  >
                    <option value="">Todos los estados</option>
                    <option value="true">Solo activas</option>
                    <option value="false">Solo inactivas</option>
                  </select>
                </div>

                {/* Búsqueda */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar
                  </label>
                  <Input
                    type="text"
                    placeholder="Buscar por código, nombre o descripción..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    disabled={isExporting}
                  />
                </div>

                {/* Rango de fechas */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha desde
                  </label>
                  <Input
                    type="date"
                    value={filters.date_from}
                    onChange={(e) => setFilters({ ...filters, date_from: e.target.value })}
                    disabled={isExporting}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Columnas */}
          <Card>
            <div className="card-body">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Columnas a Exportar ({selectedColumns.length} seleccionadas)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {availableColumns.map((column) => (
                  <label key={column.name} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedColumns.includes(column.name)}
                      onChange={(e) => handleColumnToggle(column.name, e.target.checked)}
                      disabled={isExporting}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 capitalize">
                      {column.name.replace(/_/g, ' ')}
                    </span>
                  </label>
                ))}
              </div>
              {selectedColumns.length === 0 && (
                <p className="text-sm text-amber-600 mt-2">
                  ⚠️ Si no selecciona columnas, se exportarán todas las disponibles
                </p>
              )}
            </div>
          </Card>

          {/* Progreso */}
          {exportProgress && (
            <Card>
              <div className="card-body">
                <div className="flex items-center space-x-3">
                  <Spinner size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {exportProgress.message}
                    </p>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${(exportProgress.current / exportProgress.total) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t bg-gray-50 space-x-3">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="min-w-[140px]"
          >
            {isExporting ? (
              <div className="flex items-center space-x-2">
                <Spinner size="sm" />
                <span>Exportando...</span>
              </div>
            ) : (
              `Exportar ${exportFormat.toUpperCase()}`
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
