import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Spinner } from '../../../components/ui/Spinner';
import { useToast } from '../../../shared/hooks';
import { ThirdPartyService } from '../services';
import { ExportService } from '../../../shared/services/exportService';
import { THIRD_PARTY_TYPE_LABELS, DOCUMENT_TYPE_LABELS } from '../types';
import type { ThirdParty } from '../types';

interface ThirdPartyExportModalProps {
  thirdParties: ThirdParty[];
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const ThirdPartyExportModal: React.FC<ThirdPartyExportModalProps> = ({
  thirdParties,
  isOpen,
  onClose,
  title = 'Exportar Terceros'
}) => {
  const [selectedThirdParties, setSelectedThirdParties] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'xlsx'>('csv');
  const [isExporting, setIsExporting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('');
  
  const { success, error: showError } = useToast();

  // Filtrar terceros por término de búsqueda y filtros
  const filteredThirdParties = useMemo(() => {
    return thirdParties.filter(thirdParty => {
      const matchesSearch = searchTerm === '' || 
        thirdParty.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thirdParty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thirdParty.commercial_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        thirdParty.document_number.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesActiveFilter = activeFilter === 'all' ||
        (activeFilter === 'active' && thirdParty.is_active) ||
        (activeFilter === 'inactive' && !thirdParty.is_active);
      
      const matchesTypeFilter = typeFilter === '' || thirdParty.third_party_type === typeFilter;
      
      return matchesSearch && matchesActiveFilter && matchesTypeFilter;
    });
  }, [thirdParties, searchTerm, activeFilter, typeFilter]);

  // Estadísticas de terceros seleccionados
  const selectedStats = useMemo(() => {
    const selected = thirdParties.filter(thirdParty => selectedThirdParties.has(thirdParty.id));
    const byType = selected.reduce((acc, thirdParty) => {
      acc[thirdParty.third_party_type] = (acc[thirdParty.third_party_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return {
      total: selected.length,
      active: selected.filter(tp => tp.is_active).length,
      inactive: selected.filter(tp => !tp.is_active).length,
      byType
    };
  }, [thirdParties, selectedThirdParties]);

  // Manejar selección individual
  const handleThirdPartySelect = useCallback((thirdPartyId: string, checked: boolean) => {
    const newSelected = new Set(selectedThirdParties);
    if (checked) {
      newSelected.add(thirdPartyId);
    } else {
      newSelected.delete(thirdPartyId);
    }
    setSelectedThirdParties(newSelected);
    
    // Actualizar estado de "seleccionar todo"
    setSelectAll(newSelected.size === filteredThirdParties.length && filteredThirdParties.length > 0);
  }, [selectedThirdParties, filteredThirdParties.length]);

  // Manejar selección de todos los terceros filtrados
  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      const allFilteredIds = new Set([...selectedThirdParties, ...filteredThirdParties.map(thirdParty => thirdParty.id)]);
      setSelectedThirdParties(allFilteredIds);
    } else {
      const filteredIds = new Set(filteredThirdParties.map(thirdParty => thirdParty.id));
      const newSelected = new Set([...selectedThirdParties].filter(id => !filteredIds.has(id)));
      setSelectedThirdParties(newSelected);
    }
    setSelectAll(checked);
  }, [filteredThirdParties, selectedThirdParties]);

  // Seleccionar solo terceros activos
  const handleSelectActiveOnly = useCallback(() => {
    const activeIds = new Set(thirdParties.filter(thirdParty => thirdParty.is_active).map(thirdParty => thirdParty.id));
    setSelectedThirdParties(activeIds);
    setSelectAll(false);
    success(`✅ Seleccionados ${activeIds.size} terceros activos`);
  }, [thirdParties, success]);

  // Seleccionar por tipo de tercero
  const handleSelectByType = useCallback((thirdPartyType: string) => {
    const typeIds = new Set(thirdParties.filter(thirdParty => thirdParty.third_party_type === thirdPartyType).map(thirdParty => thirdParty.id));
    setSelectedThirdParties(typeIds);
    setSelectAll(false);
    success(`✅ Seleccionados ${typeIds.size} terceros de tipo ${THIRD_PARTY_TYPE_LABELS[thirdPartyType as keyof typeof THIRD_PARTY_TYPE_LABELS]}`);
  }, [thirdParties, success]);

  // Exportar terceros seleccionados
  const handleExport = async () => {
    if (selectedThirdParties.size === 0) {
      showError('Debe seleccionar al menos un tercero para exportar');
      return;
    }

    setIsExporting(true);
    try {
      const selectedIds = Array.from(selectedThirdParties);
      const blob = await ThirdPartyService.exportThirdParties(selectedIds, exportFormat);
      
      // Generar nombre de archivo descriptivo
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      const fileName = `terceros_${selectedThirdParties.size}_registros_${timestamp}.${exportFormat}`;
      
      // Descargar archivo
      ExportService.downloadBlob(blob, fileName);
      
      success(`✅ Se exportaron ${selectedThirdParties.size} tercero${selectedThirdParties.size === 1 ? '' : 's'} exitosamente en formato ${exportFormat.toUpperCase()}`);
      onClose();
      
    } catch (error) {
      console.error('Error al exportar terceros:', error);
      showError('❌ Error al exportar los terceros. Verifique su conexión e inténtelo nuevamente.');
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
    setSelectedThirdParties(new Set());
    setSelectAll(false);
    success('🧹 Selección limpiada');
  }, [success]);

  // Limpiar filtros y selección al cerrar
  const handleClose = () => {
    setSelectedThirdParties(new Set());
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
          <div className="flex items-center justify-between p-6 border-b bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-xl">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="text-2xl">👥</span>
                {title}
              </h2>
              <p className="text-green-100 mt-1">
                Selecciona los terceros que deseas exportar y el formato preferido
              </p>
            </div>
            <button
              onClick={handleClose}
              disabled={isExporting}
              className="text-green-100 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
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
                            ? 'border-green-500 bg-green-50'
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
                      placeholder="Buscar por código, nombre, razón social o documento..."
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="all">Todos los terceros</option>
                      <option value="active">Solo activos</option>
                      <option value="inactive">Solo inactivos</option>
                    </select>
                  </div>
                  <div>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      disabled={isExporting}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="">Todos los tipos</option>
                      {Object.entries(THIRD_PARTY_TYPE_LABELS).map(([value, label]) => (
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
            {selectedThirdParties.size > 0 && (
              <div className="px-6 py-3 bg-green-50 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">
                    {selectedStats.total} tercero{selectedStats.total === 1 ? '' : 's'} seleccionado{selectedStats.total === 1 ? '' : 's'}
                  </span>
                  <div className="flex gap-4 text-xs text-green-700">
                    <span>{selectedStats.active} activos</span>
                    <span>{selectedStats.inactive} inactivos</span>
                  </div>
                </div>
              </div>
            )}

            {/* Controles de selección */}
            <div className="px-6 py-4 border-b bg-white flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Terceros ({filteredThirdParties.length})
                </h3>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSelectActiveOnly}
                    disabled={isExporting}
                  >
                    Seleccionar Activos
                  </Button>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectAll && filteredThirdParties.length > 0}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      disabled={isExporting || filteredThirdParties.length === 0}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />                    
                    <span className="text-sm font-medium">
                      {selectAll && filteredThirdParties.length > 0 ? `${selectedThirdParties.size} seleccionados` : "Seleccionar todos"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Selección rápida por tipo */}
              <div className="mt-4">
                <span className="text-sm text-gray-600 mr-3">Selección rápida:</span>
                <div className="inline-flex gap-2 flex-wrap">
                  {Object.entries(THIRD_PARTY_TYPE_LABELS).map(([type, label]) => {
                    const count = thirdParties.filter(tp => tp.third_party_type === type).length;
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

            {/* Lista de terceros - Con scroll independiente */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {filteredThirdParties.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔍</div>
                    <p className="text-gray-500 text-lg mb-2">No se encontraron terceros</p>
                    <p className="text-gray-400">Ajusta los filtros para ver más resultados</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredThirdParties.map((thirdParty) => (
                      <label
                        key={thirdParty.id}
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                          selectedThirdParties.has(thirdParty.id)
                            ? 'border-green-300 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedThirdParties.has(thirdParty.id)}
                          onChange={(e) => handleThirdPartySelect(thirdParty.id, e.target.checked)}
                          disabled={isExporting}
                          className="mt-1 rounded border-gray-300 text-green-600 focus:ring-green-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {thirdParty.code && (
                              <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-green-600 font-semibold">
                                {thirdParty.code}
                              </code>
                            )}
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              thirdParty.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {thirdParty.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                          <div className="font-medium text-gray-900 mb-1">
                            {thirdParty.name}
                          </div>
                          {thirdParty.commercial_name && thirdParty.commercial_name !== thirdParty.name && (
                            <div className="text-sm text-gray-600 mb-1">
                              {thirdParty.commercial_name}
                            </div>
                          )}
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                              {THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type]}
                            </span>
                            <span>{DOCUMENT_TYPE_LABELS[thirdParty.document_type]}: {thirdParty.document_number}</span>
                          </div>
                          {thirdParty.email && (
                            <p className="text-sm text-gray-500 mt-1 truncate">
                              {thirdParty.email}
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
                {selectedThirdParties.size > 0 ? (
                  <span className="font-medium text-green-600">
                    {selectedThirdParties.size} tercero{selectedThirdParties.size === 1 ? '' : 's'} seleccionado{selectedThirdParties.size === 1 ? '' : 's'}
                  </span>
                ) : (
                  'Selecciona al menos un tercero para continuar'
                )}
              </span>
              {selectedThirdParties.size > 0 && (
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
              <Button                onClick={handleExport}
                disabled={selectedThirdParties.size === 0 || isExporting}
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
