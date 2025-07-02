import React, { useState, useCallback } from 'react';
import { ListView } from '../organisms/ListView';
import { DeleteModal } from '../organisms/DeleteModal';
import { ExportModal } from '../organisms/ExportModal';
import { Badge } from '../../ui/Badge';
import { useThirdPartiesExport } from '../../../hooks/useExport';
import { ThirdPartyBulkActionsBar } from '../../../features/third-parties/components/ThirdPartyBulkActionsBar';
import type { ListViewColumn, ListViewFilter, ListViewAction } from '../types';
import type { ThirdParty, ThirdPartyFilters, ThirdPartyListResponse } from '../../../features/third-parties/types';
import { ThirdPartyService } from '../../../features/third-parties/services';
import { ThirdPartyDeletionService } from '../../../features/third-parties/services/thirdPartyDeletionService';
import { 
  ThirdPartyType,
  THIRD_PARTY_TYPE_LABELS,
  DOCUMENT_TYPE_LABELS
} from '../../../features/third-parties/types';

// Iconos (usando los existentes del proyecto)
import { 
  PlusIcon
} from '../../../shared/components/icons';

export interface ThirdPartyListViewProps {
  onThirdPartySelect?: (thirdParty: ThirdParty) => void;
  onCreateThirdParty?: () => void;
  initialFilters?: ThirdPartyFilters;
  showActions?: boolean;
}

export const ThirdPartyListView: React.FC<ThirdPartyListViewProps> = ({
  onThirdPartySelect,
  onCreateThirdParty,
  initialFilters,
  showActions = true,
}) => {
  console.log('🔥 ThirdPartyListView renderizando con patrón atómico');
  
  // Estado para selección (manejado por ListView)
  const [selectedThirdParties, setSelectedThirdParties] = useState<ThirdParty[]>([]);
  
  // Estado para el modal de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<ThirdParty[]>([]);

  // Estado para el modal de exportación
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedForExport, setSelectedForExport] = useState<ThirdParty[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<ThirdPartyFilters>({});

  // Estado para procesamiento de operaciones bulk
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Configuración de columnas
  const columns: ListViewColumn<ThirdParty>[] = [
    {
      key: 'code',
      header: 'Código',
      width: '100px',
      render: (thirdParty) => (
        <div className="font-medium text-secondary-900">
          {thirdParty.code || '-'}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Nombre / Razón Social',
      render: (thirdParty) => (
        <div>
          <div className="text-sm font-medium text-secondary-900">{thirdParty.name}</div>
          {thirdParty.commercial_name && thirdParty.commercial_name !== thirdParty.name && (
            <div className="text-sm text-secondary-500">
              {thirdParty.commercial_name}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'third_party_type',
      header: 'Tipo',
      width: '120px',
      render: (thirdParty) => {
        const typeConfig = {
          [ThirdPartyType.CUSTOMER]: { label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type], color: 'green' as const },
          [ThirdPartyType.SUPPLIER]: { label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type], color: 'blue' as const },
          [ThirdPartyType.EMPLOYEE]: { label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type], color: 'purple' as const },
          [ThirdPartyType.BANK]: { label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type], color: 'yellow' as const },
          [ThirdPartyType.GOVERNMENT]: { label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type], color: 'red' as const },
          [ThirdPartyType.SHAREHOLDER]: { label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type], color: 'indigo' as const },
          [ThirdPartyType.OTHER]: { label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type], color: 'gray' as const }
        };
        const config = typeConfig[thirdParty.third_party_type] || typeConfig[ThirdPartyType.OTHER];
        return (
          <Badge color={config.color} variant="subtle">
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'document_number',
      header: 'Documento',
      width: '150px',
      render: (thirdParty) => (
        <div>
          <div className="text-sm text-secondary-900">{thirdParty.document_number}</div>
          <div className="text-xs text-secondary-500">
            {DOCUMENT_TYPE_LABELS[thirdParty.document_type] || thirdParty.document_type}
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      width: '200px',
      render: (thirdParty) => (
        <span className="text-sm text-secondary-700">
          {thirdParty.email || '-'}
        </span>
      ),
    },
    {
      key: 'is_active',
      header: 'Estado',
      width: '100px',
      render: (thirdParty) => (
        <Badge 
          color={thirdParty.is_active ? 'green' : 'gray'} 
          variant="subtle"
        >
          {thirdParty.is_active ? 'Activo' : 'Inactivo'}
        </Badge>
      ),
    },
  ];

  // Configuración de filtros
  const filters: ListViewFilter[] = [
    {
      key: 'search',
      type: 'text',
      label: 'Buscar',
      placeholder: 'Buscar por nombre, documento, email...',
    },
    {
      key: 'third_party_type',
      type: 'select',
      label: 'Tipo de tercero',
      placeholder: 'Todos los tipos',
      options: [
        { value: ThirdPartyType.CUSTOMER, label: THIRD_PARTY_TYPE_LABELS[ThirdPartyType.CUSTOMER] },
        { value: ThirdPartyType.SUPPLIER, label: THIRD_PARTY_TYPE_LABELS[ThirdPartyType.SUPPLIER] },
        { value: ThirdPartyType.EMPLOYEE, label: THIRD_PARTY_TYPE_LABELS[ThirdPartyType.EMPLOYEE] },
        { value: ThirdPartyType.BANK, label: THIRD_PARTY_TYPE_LABELS[ThirdPartyType.BANK] },
        { value: ThirdPartyType.GOVERNMENT, label: THIRD_PARTY_TYPE_LABELS[ThirdPartyType.GOVERNMENT] },
        { value: ThirdPartyType.SHAREHOLDER, label: THIRD_PARTY_TYPE_LABELS[ThirdPartyType.SHAREHOLDER] },
        { value: ThirdPartyType.OTHER, label: THIRD_PARTY_TYPE_LABELS[ThirdPartyType.OTHER] },
      ],
    },
    {
      key: 'is_active',
      type: 'select',
      label: 'Estado',
      placeholder: 'Todos los estados',
      options: [
        { value: 'true', label: 'Activo' },
        { value: 'false', label: 'Inactivo' },
      ],
    },
  ];

  // Crear funciones de bulk operations que usen la selección actual
  const handleBulkActivate = useCallback(async (_options: { reason?: string } = {}) => {
    if (selectedThirdParties.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      // TODO: Implementar endpoint real
      console.log('Activando terceros:', selectedThirdParties.map(tp => tp.id));
      
      // Simular operación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear selection after operation
      setSelectedThirdParties([]);
    } catch (error) {
      console.error('Error en activación masiva:', error);
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedThirdParties]);

  const handleBulkDeactivate = useCallback(async (_options: { reason?: string } = {}) => {
    if (selectedThirdParties.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      // TODO: Implementar endpoint real
      console.log('Desactivando terceros:', selectedThirdParties.map(tp => tp.id));
      
      // Simular operación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Clear selection after operation
      setSelectedThirdParties([]);
    } catch (error) {
      console.error('Error en desactivación masiva:', error);
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedThirdParties]);

  const handleBulkDelete = useCallback(async (_options: { reason: string }) => {
    if (selectedThirdParties.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      // TODO: Implementar endpoint real
      console.log('Eliminando terceros:', selectedThirdParties.map(tp => tp.id));
      
      // Simular operación
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Clear selection after operation
      setSelectedThirdParties([]);
    } catch (error) {
      console.error('Error en eliminación masiva:', error);
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedThirdParties]);

  // Hook de exportación
  const { isExporting, exportData } = useThirdPartiesExport();

  // Handlers para exportación desde el bulk actions bar
  const handleBulkExport = useCallback((selectedThirdParties: ThirdParty[]) => {
    setSelectedForExport(selectedThirdParties);
    setExportModalOpen(true);
  }, []);

  // Función para mostrar el nombre del tercero
  const getThirdPartyDisplayName = (thirdParty: ThirdParty): string => {
    return `${thirdParty.document_number} - ${thirdParty.name}`;
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
      console.error('Error al exportar terceros:', error);
      throw error;
    }
  }, [exportData, currentFilters, selectedForExport]);

  // Handlers para el modal de eliminación
  const handleDeleteSuccess = useCallback((deletedThirdParties: ThirdParty[]) => {
    console.log('Terceros eliminados exitosamente:', deletedThirdParties);
    setDeleteModalOpen(false);
    setSelectedForDeletion([]);
  }, []);

  const handleDeleteError = useCallback((error: any) => {
    console.error('Error al eliminar terceros:', error);
  }, []);

  // Manejar cambios de selección desde ListView
  const handleSelectionChange = useCallback((selectedThirdParties: ThirdParty[]) => {
    setSelectedThirdParties(selectedThirdParties);
  }, []);

  // Configuración de acciones
  const actions: ListViewAction<ThirdParty>[] = showActions ? [
    {
      key: 'create',
      label: 'Nuevo Tercero',
      icon: <PlusIcon className="w-4 h-4" />,
      variant: 'primary',
      onClick: () => onCreateThirdParty?.(),
    },
  ] : [];

  // Data fetcher
  const dataFetcher = useCallback(async (params: any) => {
    try {
      // Capturar filtros actuales
      setCurrentFilters(params.filters || {});

      // Convertir page/perPage a skip/limit como espera el backend
      const skip = (params.page - 1) * params.perPage;
      const limit = params.perPage;

      const filters: ThirdPartyFilters = {
        skip,
        limit,
        ...params.filters,
      };

      // Mapear ordenamiento si está presente
      if (params.sortBy) {
        filters.sort_by = params.sortBy;
        filters.sort_order = params.sortOrder || 'asc';
      }

      const response: ThirdPartyListResponse = await ThirdPartyService.getThirdParties(filters);

      // Capturar total para exportación
      setTotalItems(response.total || 0);

      // Obtener lista de terceros
      const thirdPartyList = response.items || [];

      return {
        items: thirdPartyList,
        total: response.total || 0,
        page: response.page || Math.floor((response.skip || 0) / (response.limit || 25)) + 1,
        pages: response.pages || Math.ceil((response.total || 0) / (response.limit || 25)),
        perPage: response.per_page || response.limit || params.perPage || 25,
      };
    } catch (error) {
      console.error('Error al cargar terceros:', error);
      throw new Error('No se pudieron cargar los terceros. Por favor, intenta de nuevo.');
    }
  }, []);

  return (
    <>
      <ListView<ThirdParty>
        title="Terceros"
        description="Gestiona clientes, proveedores y otros terceros"
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Terceros' },
        ]}
        columns={columns}
        filters={filters}
        initialFilters={initialFilters}
        actions={actions}
        dataFetcher={dataFetcher}
        selectionMode="multiple"
        onRowClick={onThirdPartySelect}
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
        ariaLabel="Lista de terceros"
        ariaDescription="Tabla con información de todos los terceros del sistema"
      />

      {/* Barra flotante de acciones bulk */}
      <ThirdPartyBulkActionsBar
        selectedCount={selectedThirdParties.length}
        selectedThirdParties={selectedThirdParties}
        isProcessing={isProcessingBulk}
        onBulkActivate={handleBulkActivate}
        onBulkDeactivate={handleBulkDeactivate}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        onClearSelection={() => {
          setSelectedThirdParties([]);
        }}
      />

      {/* Modal de eliminación */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selectedItems={selectedForDeletion}
        deletionService={new ThirdPartyDeletionService()}
        itemDisplayName={getThirdPartyDisplayName}
        itemTypeName="tercero"
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />

      {/* Modal de exportación */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Exportar Terceros"
        description="Selecciona el formato y alcance de los terceros que deseas exportar."
        onExport={handleExport}
        loading={isExporting}
        entityName="terceros"
        totalItems={totalItems}
        selectedItems={selectedForExport.length}
      />
    </>
  );
};
