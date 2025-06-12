import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../shared/hooks';
import { AccountService } from '../services';
import { ExportService } from '../../../shared/services/exportService';
import { ACCOUNT_TYPE_LABELS } from '../types';
import type { Account } from '../types';

interface AccountExportModalProps {
  accounts: Account[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const AccountExportModal: React.FC<AccountExportModalProps> = ({
  accounts,
  isOpen,
  onClose,
  title = 'Exportar Cuentas'
}) => {
  const [selectedAccounts, setSelectedAccounts] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('');
  
  const { success, error: showError } = useToast();

  // Filtrar cuentas por término de búsqueda y filtros
  const filteredAccounts = useMemo(() => {
    return accounts.filter(account => {
      const matchesSearch = searchTerm === '' || 
        account.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesActiveFilter = activeFilter === 'all' ||
        (activeFilter === 'active' && account.is_active) ||
        (activeFilter === 'inactive' && !account.is_active);
      
      const matchesTypeFilter = typeFilter === '' || account.account_type === typeFilter;
      
      return matchesSearch && matchesActiveFilter && matchesTypeFilter;
    });
  }, [accounts, searchTerm, activeFilter, typeFilter]);

  // Estadísticas de cuentas seleccionadas
  const selectedStats = useMemo(() => {
    const selected = accounts.filter(account => selectedAccounts.has(account.id));
    const byType = selected.reduce((acc, account) => {
      acc[account.account_type] = (acc[account.account_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: selected.length,
      active: selected.filter(a => a.is_active).length,
      inactive: selected.filter(a => !a.is_active).length,
      byType
    };
  }, [accounts, selectedAccounts]);

  // Manejar selección individual
  const handleAccountSelect = useCallback((accountId: string, checked: boolean) => {
    const newSelected = new Set(selectedAccounts);
    if (checked) {
      newSelected.add(accountId);
    } else {
      newSelected.delete(accountId);
    }
    setSelectedAccounts(newSelected);
    
    // Actualizar estado de "seleccionar todo"
    setSelectAll(newSelected.size === filteredAccounts.length && filteredAccounts.length > 0);
  }, [selectedAccounts, filteredAccounts.length]);

  // Manejar selección de todas las cuentas filtradas
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allFilteredIds = new Set([...selectedAccounts, ...filteredAccounts.map(account => account.id)]);
      setSelectedAccounts(allFilteredIds);
    } else {
      const filteredIds = new Set(filteredAccounts.map(account => account.id));
      const newSelected = new Set([...selectedAccounts].filter(id => !filteredIds.has(id)));
      setSelectedAccounts(newSelected);
    }
    setSelectAll(checked);
  }, [filteredAccounts, selectedAccounts]);

  // Seleccionar solo cuentas activas
  const handleSelectActiveOnly = useCallback(() => {
    const activeIds = new Set(accounts.filter(account => account.is_active).map(account => account.id));
    setSelectedAccounts(activeIds);
    setSelectAll(false);
    success(`✅ Seleccionadas ${activeIds.size} cuentas activas`);
  }, [accounts, success]);

  // Seleccionar por tipo de cuenta
  const handleSelectByType = useCallback((accountType: string) => {
    const typeIds = new Set(accounts.filter(account => account.account_type === accountType).map(account => account.id));
    setSelectedAccounts(typeIds);
    setSelectAll(false);
    success(`✅ Seleccionadas ${typeIds.size} cuentas de tipo ${ACCOUNT_TYPE_LABELS[accountType as keyof typeof ACCOUNT_TYPE_LABELS]}`);
  }, [accounts, success]);

  // Exportar cuentas seleccionadas
  const handleExport = async () => {
    if (selectedAccounts.size === 0) {
      showError('Debe seleccionar al menos una cuenta para exportar');
      return;
    }

    setIsExporting(true);
    try {
      const selectedIds = Array.from(selectedAccounts);
      const blob = await AccountService.exportAccounts(selectedIds, exportFormat);
      
      // Generar nombre de archivo descriptivo
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const fileName = `cuentas_${selectedAccounts.size}_registros_${timestamp}.${exportFormat}`;
      
      // Descargar archivo
      ExportService.downloadBlob(blob, fileName);
      
      success(`✅ Se exportaron ${selectedAccounts.size} cuenta${selectedAccounts.size === 1 ? '' : 's'} exitosamente en formato ${exportFormat.toUpperCase()}`);
      onClose();
      
    } catch (error) {
      console.error('Error al exportar cuentas:', error);
      showError('❌ Error al exportar las cuentas. Verifique su conexión e inténtelo nuevamente.');
    } finally {
      setIsExporting(false);
    }
  };

  // Obtener descripción del formato
  const getFormatInfo = (format: string) => {
    const formats = {
      csv: {
        icon: '📊',
        name: 'CSV',
        description: 'Compatible con Excel',
        detail: 'Archivo separado por comas, ideal para análisis'
      },
      json: {
        icon: '🔧',
        name: 'JSON',
        description: 'Para APIs y sistemas',
        detail: 'Formato estructurado para integraciones'
      },
      xlsx: {
        icon: '📗',
        name: 'Excel',
        description: 'Archivo nativo de Excel',
        detail: 'Mantiene formato y fórmulas'
      }
    };
    return formats[format as keyof typeof formats];
  };

  // Limpiar selección
  const handleClearSelection = useCallback(() => {
    setSelectedAccounts(new Set());
    setSelectAll(false);
    success('🧹 Selección limpiada');
  }, [success]);

  // Limpiar filtros y selección al cerrar
  const handleClose = () => {
    setSelectedAccounts(new Set());
    setSelectAll(false);
    setSearchTerm('');
    setActiveFilter('all');
    setTypeFilter('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    // Portal de máximo z-index
    <div className="fixed inset-0 z-[999999] overflow-hidden">
      {/* Backdrop oscuro con blur */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Contenedor del modal centrado */}
      <div className="relative z-[999999] h-full flex items-center justify-center p-6">
        {/* Modal principal */}
        <div 
          className="bg-white rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header fijo */}
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-xl">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-2xl">📊</span>
                {title}
              </h2>
              <p className="text-blue-100 mt-1">
                Selecciona las cuentas que deseas exportar y el formato preferido
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isExporting}
              className="text-blue-100 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenido principal con scroll */}
          <div className="flex-1 min-h-0 flex flex-col">
            
            {/* Configuración - Fija */}
            <div className="p-6 border-b bg-gray-50 flex-shrink-0">
              {/* Selección de formato */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Formato de Exportación</h3>
                <div className="grid grid-cols-3 gap-4">
                  {(['csv', 'json', 'xlsx'] as const).map((format) => {
                    const formatInfo = getFormatInfo(format);
                    return (
                      <label
                        key={format}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          exportFormat === format
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="format"
                          value={format}
                          checked={exportFormat === format}
                          onChange={(e) => setExportFormat(e.target.value as any)}
                          disabled={isExporting}
                          className="sr-only"
                        />
                        <div className="flex items-center gap-3 w-full">
                          <span className="text-2xl">{formatInfo.icon}</span>
                          <div>
                            <div className="font-semibold text-gray-900">{formatInfo.name}</div>
                            <div className="text-sm text-gray-600">{formatInfo.description}</div>
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Filtros */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Filtros</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      type="text"
                      placeholder="Buscar por código, nombre o descripción..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      disabled={isExporting}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <select
                      value={activeFilter}
                      onChange={(e) => setActiveFilter(e.target.value as any)}
                      disabled={isExporting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">Todas las cuentas</option>
                      <option value="active">Solo activas</option>
                      <option value="inactive">Solo inactivas</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      disabled={isExporting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Todos los tipos</option>
                      {Object.entries(ACCOUNT_TYPE_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas */}
            {selectedAccounts.size > 0 && (
              <div className="px-6 py-3 bg-blue-50 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-900">
                    {selectedStats.total} cuenta{selectedStats.total === 1 ? '' : 's'} seleccionada{selectedStats.total === 1 ? '' : 's'}
                  </span>
                  <div className="flex gap-4 text-xs text-blue-700">
                    <span>{selectedStats.active} activas</span>
                    <span>{selectedStats.inactive} inactivas</span>
                  </div>
                </div>
              </div>
            )}

            {/* Controles de selección */}
            <div className="px-6 py-4 border-b bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Cuentas ({filteredAccounts.length})
                </h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectActiveOnly}
                    disabled={isExporting}
                  >
                    Seleccionar Activas
                  </Button>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectAll && filteredAccounts.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      disabled={isExporting || filteredAccounts.length === 0}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />                    
                    <span className="text-sm font-medium">
                      {selectAll && filteredAccounts.length > 0 ? `${selectedAccounts.size} seleccionadas` : "Seleccionar todas"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Selección rápida por tipo */}
              <div className="mt-4">
                <span className="text-sm text-gray-600 mr-3">Selección rápida:</span>
                <div className="inline-flex gap-2 flex-wrap">
                  {Object.entries(ACCOUNT_TYPE_LABELS).map(([type, label]) => {
                    const count = accounts.filter(acc => acc.account_type === type).length;
                    if (count === 0) return null;
                    return (
                      <Button
                        key={type}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectByType(type)}
                        disabled={isExporting}
                        className="text-xs"
                      >
                        {label} ({count})
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Lista de cuentas - Con scroll independiente */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {filteredAccounts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 text-lg mb-2">No se encontraron cuentas</p>
                    <p className="text-gray-400">Ajusta los filtros para ver más resultados</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredAccounts.map((account) => (
                      <label
                        key={account.id}
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                          selectedAccounts.has(account.id)
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedAccounts.has(account.id)}
                          onChange={(e) => handleAccountSelect(account.id, e.target.checked)}
                          disabled={isExporting}
                          className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-blue-600 font-semibold">
                              {account.code}
                            </code>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              account.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {account.is_active ? 'Activa' : 'Inactiva'}
                            </span>
                          </div>
                          <div className="font-medium text-gray-900 mb-1">
                            {account.name}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                              {ACCOUNT_TYPE_LABELS[account.account_type]}
                            </span>
                            <span>Nivel {account.level}</span>
                            {account.allows_movements && <span>Permite movimientos</span>}
                          </div>
                          {account.description && (
                            <p className="text-sm text-gray-500 mt-1 truncate">
                              {account.description}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer fijo */}
          <div className="flex items-center justify-between p-6 border-t bg-gray-50 rounded-b-xl flex-shrink-0">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {selectedAccounts.size > 0 ? (
                  <span className="font-medium text-blue-600">
                    {selectedAccounts.size} cuenta{selectedAccounts.size === 1 ? '' : 's'} seleccionada{selectedAccounts.size === 1 ? '' : 's'}
                  </span>
                ) : (
                  'Selecciona al menos una cuenta para continuar'
                )}
              </span>
              {selectedAccounts.size > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSelection}
                  disabled={isExporting}
                >
                  Limpiar selección
                </Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={handleClose}
                disabled={isExporting}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleExport}
                disabled={selectedAccounts.size === 0 || isExporting}
                className="min-w-[120px]"
              >
                {isExporting ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span>Exportando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>{getFormatInfo(exportFormat).icon}</span>
                    <span>Exportar {exportFormat.toUpperCase()}</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
