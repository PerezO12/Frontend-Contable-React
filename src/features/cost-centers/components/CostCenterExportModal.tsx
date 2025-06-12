import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useCostCenterExport } from '../hooks';
import { useToast } from '../../../shared/hooks/useToast';
import type { CostCenter, CostCenterFilters } from '../types';

interface CostCenterExportModalProps {
  costCenters: CostCenter[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

type ExportFormat = 'csv' | 'json' | 'xlsx';

export const CostCenterExportModal: React.FC<CostCenterExportModalProps> = ({
  costCenters,
  isOpen,
  onClose,
  title = 'Exportar Centros de Costo'
}) => {
  const [selectedCostCenters, setSelectedCostCenters] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('xlsx');
  const [filters, setFilters] = useState<CostCenterFilters>({});
  const [searchTerm, setSearchTerm] = useState('');

  const { exportCostCenters, isExporting } = useCostCenterExport();
  const { success, error } = useToast();

  // Filtrar centros de costo
  const filteredCostCenters = useMemo(() => {
    return costCenters.filter(costCenter => {
      const matchesSearch = !searchTerm || 
        costCenter.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        costCenter.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesActive = filters.is_active === undefined || 
        costCenter.is_active === filters.is_active;
      
      const matchesParent = !filters.parent_id || 
        costCenter.parent_id === filters.parent_id;

      return matchesSearch && matchesActive && matchesParent;
    });
  }, [costCenters, searchTerm, filters]);

  // Actualizar estado de "seleccionar todo" cuando cambia la selección
  useEffect(() => {
    setSelectAll(selectedCostCenters.size === filteredCostCenters.length && filteredCostCenters.length > 0);
  }, [selectedCostCenters, filteredCostCenters.length]);

  // Manejar selección de todos los centros de costo filtrados
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allFilteredIds = new Set([...selectedCostCenters, ...filteredCostCenters.map(cc => cc.id)]);
      setSelectedCostCenters(allFilteredIds);
    } else {
      const filteredIds = new Set(filteredCostCenters.map(cc => cc.id));
      const newSelected = new Set([...selectedCostCenters].filter(id => !filteredIds.has(id)));
      setSelectedCostCenters(newSelected);
    }
    setSelectAll(checked);
  }, [filteredCostCenters, selectedCostCenters]);

  // Seleccionar solo centros de costo activos
  const handleSelectActiveOnly = useCallback(() => {
    const activeIds = new Set(costCenters.filter(cc => cc.is_active).map(cc => cc.id));
    setSelectedCostCenters(activeIds);
    setSelectAll(false);
    success(`✅ Seleccionados ${activeIds.size} centros de costo activos`);
  }, [costCenters, success]);

  // Manejar exportación
  const handleExport = async () => {
    if (selectedCostCenters.size === 0) {
      error('Debes seleccionar al menos un centro de costo para exportar');
      return;
    }

    try {      await exportCostCenters(
        Array.from(selectedCostCenters),
        exportFormat
      );
      
      success(`✅ Exportación iniciada - ${selectedCostCenters.size} centros de costo en formato ${exportFormat.toUpperCase()}`);
      onClose();
    } catch (err) {
      error(`❌ Error en la exportación: ${err}`);
    }
  };

  const handleClose = () => {
    if (isExporting) return;
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999999] overflow-y-auto">
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
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-xl">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-2xl">🏢</span>
                {title}
              </h2>
              <p className="text-indigo-100 mt-1">
                Selecciona los centros de costo que deseas exportar y el formato preferido
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isExporting}
              className="text-white hover:text-indigo-200 transition-colors disabled:opacity-50"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Contenido scrolleable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Filtros y búsqueda */}
            <Card>
              <div className="card-header">
                <h3 className="card-title">Filtros y Búsqueda</h3>
              </div>
              <div className="card-body space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Buscar por código o nombre
                    </label>
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Buscar..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Estado
                    </label>
                    <select
                      value={filters.is_active === undefined ? '' : String(filters.is_active)}
                      onChange={(e) => setFilters(prev => ({
                        ...prev,
                        is_active: e.target.value === '' ? undefined : e.target.value === 'true'
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Todos</option>
                      <option value="true">Activos</option>
                      <option value="false">Inactivos</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Formato de exportación
                    </label>
                    <select
                      value={exportFormat}
                      onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="excel">Excel (.xlsx)</option>
                      <option value="csv">CSV (.csv)</option>
                      <option value="pdf">PDF (.pdf)</option>
                    </select>
                  </div>
                </div>

                {/* Acciones rápidas de selección */}
                <div className="flex flex-wrap gap-2 pt-4 border-t">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={handleSelectActiveOnly}
                    disabled={isExporting}
                  >
                    Seleccionar solo activos
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => setSelectedCostCenters(new Set())}
                    disabled={isExporting}
                  >
                    Limpiar selección
                  </Button>
                </div>
              </div>
            </Card>

            {/* Lista de centros de costo */}
            <Card>
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h3 className="card-title">
                    Centros de Costo Disponibles
                    <span className="text-sm font-normal text-gray-500 ml-2">
                      ({filteredCostCenters.length} de {costCenters.length})
                    </span>
                  </h3>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectAll && filteredCostCenters.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      disabled={isExporting || filteredCostCenters.length === 0}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Seleccionar todos los filtrados
                    </span>
                  </label>
                </div>
              </div>
              <div className="card-body">
                {filteredCostCenters.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No se encontraron centros de costo con los filtros aplicados</p>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    <div className="space-y-2">
                      {filteredCostCenters.map((costCenter) => (
                        <div
                          key={costCenter.id}
                          className={`p-3 rounded-lg border transition-colors ${
                            selectedCostCenters.has(costCenter.id)
                              ? 'bg-indigo-50 border-indigo-200'
                              : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                          }`}
                        >
                          <label className="flex items-center space-x-3 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={selectedCostCenters.has(costCenter.id)}
                              onChange={(e) => {
                                const newSelected = new Set(selectedCostCenters);
                                if (e.target.checked) {
                                  newSelected.add(costCenter.id);
                                } else {
                                  newSelected.delete(costCenter.id);
                                }
                                setSelectedCostCenters(newSelected);
                              }}
                              disabled={isExporting}
                              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <code className="text-sm font-mono bg-white px-2 py-1 rounded border">
                                    {costCenter.code}
                                  </code>
                                  <span className="font-medium text-gray-900">
                                    {costCenter.name}
                                  </span>
                                  {!costCenter.is_active && (
                                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                                      Inactivo
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500 text-right">
                                  <div>Descripción: {costCenter.description || 'N/A'}</div>
                                  {costCenter.parent_id && (
                                    <div className="text-xs">Centro hijo</div>
                                  )}
                                </div>
                              </div>
                              {costCenter.description && (
                                <p className="text-sm text-gray-600 mt-1">{costCenter.description}</p>
                              )}
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Información de la selección */}
            {selectedCostCenters.size > 0 && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-indigo-900 mb-2">
                  📋 Resumen de la exportación
                </h4>
                <ul className="text-sm text-indigo-800 space-y-1">
                  <li>• {selectedCostCenters.size} centro{selectedCostCenters.size === 1 ? '' : 's'} de costo seleccionado{selectedCostCenters.size === 1 ? '' : 's'}</li>
                  <li>• Formato: {exportFormat.toUpperCase()}</li>
                  <li>• Incluye: código, nombre, descripción, presupuesto, estado y jerarquía</li>
                </ul>
              </div>
            )}
          </div>

          {/* Footer fijo */}
          <div className="border-t p-6 bg-gray-50 rounded-b-xl">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {selectedCostCenters.size > 0 ? (
                  <span className="font-medium text-indigo-600">
                    {selectedCostCenters.size} centro{selectedCostCenters.size === 1 ? '' : 's'} seleccionado{selectedCostCenters.size === 1 ? '' : 's'}
                  </span>
                ) : (
                  <span>Selecciona centros de costo para exportar</span>
                )}
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isExporting}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleExport}
                  disabled={isExporting || selectedCostCenters.size === 0}
                  className="flex items-center space-x-2"
                >
                  {isExporting ? (
                    <>
                      <Spinner size="sm" />
                      <span>Exportando...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                      </svg>
                      <span>Exportar {exportFormat.toUpperCase()}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
