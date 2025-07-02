import React, { useState, useCallback } from 'react';
import { ListView } from '../organisms/ListView';
import { DeleteModal } from '../organisms/DeleteModal';
import { ExportModal } from '../organisms/ExportModal';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { useCostCentersExport } from '../../../hooks/useExport';
import { CostCenterBulkActionsBar } from '../../../features/cost-centers/components/CostCenterBulkActionsBar';
import type { ListViewColumn, ListViewFilter, ListViewAction, DataFetchParams, DataFetchResponse } from '../types';
import type { CostCenter, CostCenterFilters } from '../../../features/cost-centers/types';
import { CostCenterService, costCenterDeletionService } from '../../../features/cost-centers/services';

// Iconos
import { 
  PlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  CalculatorIcon
} from '../../../shared/components/icons';

export interface CostCenterListViewProps {
  onCostCenterSelect?: (costCenter: CostCenter) => void;
  onCreateCostCenter?: () => void;
  initialFilters?: CostCenterFilters;
  showActions?: boolean;
}

export const CostCenterListView: React.FC<CostCenterListViewProps> = ({
  onCostCenterSelect,
  onCreateCostCenter,
  initialFilters,
  showActions = true,
}) => {
  // Estado para selección (manejado por ListView)
  const [selectedCostCenters, setSelectedCostCenters] = useState<CostCenter[]>([]);
  
  // Estado para el modal de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<CostCenter[]>([]);

  // Estado para el modal de exportación
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedForExport, setSelectedForExport] = useState<CostCenter[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<CostCenterFilters>({});

  // Estado para procesamiento de operaciones bulk
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Crear funciones de bulk operations que usen la selección actual
  const handleBulkActivate = useCallback(async (_options: { reason?: string }) => {
    if (selectedCostCenters.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      // Activar cada centro de costo individualmente
      const results = await Promise.allSettled(
        selectedCostCenters.map(costCenter => 
          CostCenterService.updateCostCenter(costCenter.id, {
            ...costCenter,
            is_active: true
          })
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      if (successful > 0) {
        console.log(`${successful} centros de costo activados exitosamente`);
        // TODO: Show success toast and refresh data
      }
      
      if (failed > 0) {
        console.log(`${failed} centros de costo fallaron en la activación`);
        // TODO: Show error toast
      }

      // Clear selection after operation
      setSelectedCostCenters([]);
    } catch (error) {
      console.error('Error en activación masiva:', error);
      // TODO: Show error toast
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedCostCenters]);

  const handleBulkDeactivate = useCallback(async (_options: { reason?: string } = {}) => {
    if (selectedCostCenters.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      // Desactivar cada centro de costo individualmente
      const results = await Promise.allSettled(
        selectedCostCenters.map(costCenter => 
          CostCenterService.updateCostCenter(costCenter.id, {
            ...costCenter,
            is_active: false
          })
        )
      );

      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      if (successful > 0) {
        console.log(`${successful} centros de costo desactivados exitosamente`);
        // TODO: Show success toast and refresh data
      }
      
      if (failed > 0) {
        console.log(`${failed} centros de costo fallaron en la desactivación`);
        // TODO: Show error toast
      }

      // Clear selection after operation
      setSelectedCostCenters([]);
    } catch (error) {
      console.error('Error en desactivación masiva:', error);
      // TODO: Show error toast
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedCostCenters]);

  const handleBulkDelete = useCallback(async (_options: { reason: string }) => {
    if (selectedCostCenters.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      // Si hay más de uno, usar eliminación masiva
      if (selectedCostCenters.length > 1) {
        await CostCenterService.bulkDeleteCostCenters({
          cost_center_ids: selectedCostCenters.map(cc => cc.id),
          force_delete: false,
          delete_reason: _options.reason || 'Eliminación masiva desde interfaz de usuario'
        });
      } else {
        await CostCenterService.deleteCostCenter(selectedCostCenters[0].id);
      }
      
      console.log(`${selectedCostCenters.length} centros de costo eliminados exitosamente`);
      
      // Clear selection after operation
      setSelectedCostCenters([]);
    } catch (error) {
      console.error('Error en eliminación masiva:', error);
      // TODO: Show error toast
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedCostCenters]);

  // Hook de exportación
  const { isExporting, exportData } = useCostCentersExport();

  // Handlers para exportación desde el bulk actions bar
  const handleBulkExport = useCallback((selectedCostCenters: CostCenter[]) => {
    setSelectedForExport(selectedCostCenters);
    setExportModalOpen(true);
  }, []);

  // Función para mostrar el nombre del centro de costo
  const getCostCenterDisplayName = (costCenter: CostCenter): string => {
    return `${costCenter.code} - ${costCenter.name}`;
  };

  // Handlers para el modal de exportación
  const handleExport = useCallback(async (format: string, options: any) => {
    try {
      await exportData(format, {
        ...options,
        filters: currentFilters,
        selectedItems: options.scope === 'selected' ? selectedForExport : undefined
      });
    } catch (error) {
      console.error('Error al exportar centros de costo:', error);
      throw error; // Re-throw para que el modal maneje el error
    }
  }, [exportData, currentFilters, selectedForExport]);

  // Handlers para el modal de eliminación
  const handleDeleteSuccess = useCallback((deletedCostCenters: CostCenter[]) => {
    console.log('Centros de costo eliminados exitosamente:', deletedCostCenters);
    // Aquí podrías mostrar un toast de éxito o refrescar la lista
    setDeleteModalOpen(false);
    setSelectedForDeletion([]);
  }, []);

  const handleDeleteError = useCallback((error: string) => {
    console.error('Error al eliminar centros de costo:', error);
    // Aquí podrías mostrar un toast de error
  }, []);

  // Configuración de columnas
  const columns: ListViewColumn<CostCenter>[] = [
    {
      key: 'code',
      header: 'Código',
      sortable: true,
      width: '120px',
      render: (costCenter) => (
        <span className="font-mono text-sm text-gray-900">{costCenter.code}</span>
      ),
    },
    {
      key: 'name',
      header: 'Nombre',
      sortable: true,
      render: (costCenter) => (
        <div className="flex items-center space-x-3">
          <CalculatorIcon className="h-5 w-5 text-gray-400" />
          <div>
            <div className="font-medium text-gray-900">{costCenter.name}</div>
            {costCenter.description && (
              <div className="text-sm text-gray-500 truncate max-w-xs">
                {costCenter.description}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'full_code',
      header: 'Código Completo',
      sortable: true,
      width: '150px',
      render: (costCenter) => (
        <span className="font-mono text-xs text-gray-600">{costCenter.full_code}</span>
      ),
    },
    {
      key: 'parent_name',
      header: 'Centro Padre',
      sortable: false,
      width: '150px',
      render: (costCenter) => (
        <span className="text-sm text-gray-600">
          {costCenter.parent_name || 'Sin padre'}
        </span>
      ),
    },
    {
      key: 'level',
      header: 'Nivel',
      sortable: true,
      width: '80px',
      render: (costCenter) => (
        <Badge 
          color={costCenter.level === 1 ? 'blue' : costCenter.level === 2 ? 'green' : 'gray'}
          variant="subtle"
        >
          Nivel {costCenter.level}
        </Badge>
      ),
    },
    {
      key: 'children_count',
      header: 'Subcentros',
      sortable: true,
      width: '100px',
      render: (costCenter) => (
        <span className="text-sm text-gray-600">
          {costCenter.children_count}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Estado',
      sortable: true,
      width: '100px',
      render: (costCenter) => (
        <Badge 
          color={costCenter.is_active ? 'green' : 'red'}
          variant="subtle"
        >
          <div className="flex items-center space-x-1">
            {costCenter.is_active ? (
              <CheckCircleIcon className="h-3 w-3" />
            ) : (
              <XCircleIcon className="h-3 w-3" />
            )}
            <span>{costCenter.is_active ? 'Activo' : 'Inactivo'}</span>
          </div>
        </Badge>
      ),
    },
  ];

  // Configuración de filtros
  const filters: ListViewFilter[] = [
    {
      key: 'code',
      label: 'Código',
      type: 'text',
      placeholder: 'Buscar por código...',
    },
    {
      key: 'name',
      label: 'Nombre',
      type: 'text',
      placeholder: 'Buscar por nombre...',
    },
    {
      key: 'is_active',
      label: 'Estado',
      type: 'select',
      options: [
        { value: '', label: 'Todos' },
        { value: 'true', label: 'Activos' },
        { value: 'false', label: 'Inactivos' },
      ],
    },
    {
      key: 'level',
      label: 'Nivel',
      type: 'select',
      options: [
        { value: '', label: 'Todos los niveles' },
        { value: '1', label: 'Nivel 1' },
        { value: '2', label: 'Nivel 2' },
        { value: '3', label: 'Nivel 3' },
        { value: '4', label: 'Nivel 4' },
      ],
    },
    {
      key: 'has_children',
      label: 'Tipo',
      type: 'select',
      options: [
        { value: '', label: 'Todos' },
        { value: 'true', label: 'Con subcentros' },
        { value: 'false', label: 'Sin subcentros' },
      ],
    },
  ];

  // Configuración de acciones de fila
  const actions: ListViewAction<CostCenter>[] = [];

  // Función para obtener datos
  const dataFetcher = useCallback(async (params: DataFetchParams): Promise<DataFetchResponse<CostCenter>> => {
    const page = params.page || 1;
    const perPage = params.perPage || 25;
    
    const filters: CostCenterFilters = {
      skip: (page - 1) * perPage,
      limit: perPage,
      order_by: params.sortBy as 'code' | 'name' | 'created_at' | 'level' | undefined,
      order_desc: params.sortOrder === 'desc',
      ...params.filters
    };

    // Guardar filtros actuales para exportación
    setCurrentFilters(filters);
    
    const response = await CostCenterService.getCostCenters(filters);
    
    // Guardar total de items para exportación
    setTotalItems(response.total);
    
    return {
      items: response.data,
      total: response.total,
      page,
      pages: Math.ceil(response.total / perPage),
      perPage,
    };
  }, []);

  // Manejar selección múltiple
  const handleSelectionChange = useCallback((selected: CostCenter[]) => {
    setSelectedCostCenters(selected);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header con botón de crear */}
      {showActions && onCreateCostCenter && (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Centros de Costo</h1>
            <p className="text-gray-600">Gestión de centros de costo organizacionales</p>
          </div>
          <Button
            variant="primary"
            onClick={onCreateCostCenter}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="h-4 w-4" />
            <span>Nuevo Centro de Costo</span>
          </Button>
        </div>
      )}
      
      <ListView<CostCenter>
        title="Centros de Costo"
        description="Gestión de centros de costo organizacionales"
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Centros de Costo' },
        ]}
        columns={columns}
        filters={filters}
        initialFilters={initialFilters}
        actions={actions}
        dataFetcher={dataFetcher}
        selectionMode="multiple"
        onRowClick={onCostCenterSelect}
        onSelectionChange={handleSelectionChange}
        pagination={{
          pageSizeOptions: [10, 25, 50, 100, 250, 500, 1000],
          defaultPageSize: 25,
          showPageSizeSelector: true,
          showQuickJumper: true,
          showTotal: true,
        }}
        enableSearch={true}
        enableExport={true}
        exportFormats={['csv', 'xlsx', 'json']}
        ariaLabel="Lista de centros de costo"
        ariaDescription="Tabla con información de todos los centros de costo del sistema"
      />

      {/* Barra flotante de acciones bulk */}
      <CostCenterBulkActionsBar
        selectedCount={selectedCostCenters.length}
        selectedCostCenters={selectedCostCenters}
        isProcessing={isProcessingBulk}
        onBulkActivate={handleBulkActivate}
        onBulkDeactivate={handleBulkDeactivate}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        onClearSelection={() => {
          // Clear selection in ListView
          setSelectedCostCenters([]);
        }}
      />

      {/* Modal de eliminación */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selectedItems={selectedForDeletion}
        deletionService={costCenterDeletionService}
        itemDisplayName={getCostCenterDisplayName}
        itemTypeName="centro de costo"
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />

      {/* Modal de exportación */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Exportar Centros de Costo"
        description="Selecciona el formato y alcance de los centros de costo que deseas exportar."
        onExport={handleExport}
        loading={isExporting}
        entityName="centros de costo"
        totalItems={totalItems}
        selectedItems={selectedForExport.length}
      />
    </div>
  );
};
