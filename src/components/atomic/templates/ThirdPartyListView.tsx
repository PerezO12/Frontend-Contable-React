import React, { useState } from 'react';
import { ListView } from '../organisms/ListView';
import { DeleteModal } from '../organisms/DeleteModal';
import { ExportModal } from '../organisms/ExportModal';
import { Badge } from '../../ui/Badge';
import type { ListViewColumn, ListViewFilter, ListViewAction } from '../types';
import type { ThirdParty, ThirdPartyFilters, ThirdPartyListResponse } from '../../../features/third-parties/types';
import { ThirdPartyService } from '../../../features/third-parties/services';
import { ThirdPartyDeletionService } from '../../../features/third-parties/services/thirdPartyDeletionService';
import { useThirdPartiesExport } from '../../../hooks/useExport';
import { 
  ThirdPartyType,
  THIRD_PARTY_TYPE_LABELS,
  DOCUMENT_TYPE_LABELS,
  DocumentType
} from '../../../features/third-parties/types';

// Iconos (usando los existentes del proyecto)
import { PlusIcon } from '../../../shared/components/icons';

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
  // Estado para el modal de eliminación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<ThirdParty[]>([]);
  const [deletionService] = useState(() => new ThirdPartyDeletionService());

  // Estado para el modal de exportación
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedForExport, setSelectedForExport] = useState<ThirdParty[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<ThirdPartyFilters>({});

  // Hook de exportación
  const { isExporting, exportData } = useThirdPartiesExport();

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
          [ThirdPartyType.CUSTOMER]: {
            label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type],
            color: 'green' as const
          },
          [ThirdPartyType.SUPPLIER]: {
            label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type],
            color: 'blue' as const
          },
          [ThirdPartyType.EMPLOYEE]: {
            label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type],
            color: 'purple' as const
          },
          [ThirdPartyType.BANK]: {
            label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type],
            color: 'yellow' as const
          },
          [ThirdPartyType.GOVERNMENT]: {
            label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type],
            color: 'red' as const
          },
          [ThirdPartyType.SHAREHOLDER]: {
            label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type],
            color: 'indigo' as const
          },
          [ThirdPartyType.OTHER]: {
            label: THIRD_PARTY_TYPE_LABELS[thirdParty.third_party_type],
            color: 'gray' as const
          }
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
      key: 'phone',
      header: 'Teléfono',
      width: '130px',
      render: (thirdParty) => (
        <div>
          {thirdParty.phone && (
            <div className="text-sm text-secondary-900">{thirdParty.phone}</div>
          )}
          {thirdParty.mobile && (
            <div className="text-xs text-secondary-500">{thirdParty.mobile}</div>
          )}
          {!thirdParty.phone && !thirdParty.mobile && (
            <span className="text-sm text-secondary-500">-</span>
          )}
        </div>
      ),
    },
    {
      key: 'city',
      header: 'Ciudad',
      width: '150px',
      render: (thirdParty) => (
        <div>
          {thirdParty.city && (
            <div className="text-sm text-secondary-900">{thirdParty.city}</div>
          )}
          {thirdParty.state && (
            <div className="text-xs text-secondary-500">{thirdParty.state}</div>
          )}
          {!thirdParty.city && !thirdParty.state && (
            <span className="text-sm text-secondary-500">-</span>
          )}
        </div>
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
      key: 'document_type',
      type: 'select',
      label: 'Tipo de documento',
      placeholder: 'Todos los tipos',
      options: [
        { value: DocumentType.RUT, label: DOCUMENT_TYPE_LABELS[DocumentType.RUT] },
        { value: DocumentType.NIT, label: DOCUMENT_TYPE_LABELS[DocumentType.NIT] },
        { value: DocumentType.CUIT, label: DOCUMENT_TYPE_LABELS[DocumentType.CUIT] },
        { value: DocumentType.RFC, label: DOCUMENT_TYPE_LABELS[DocumentType.RFC] },
        { value: DocumentType.PASSPORT, label: DOCUMENT_TYPE_LABELS[DocumentType.PASSPORT] },
        { value: DocumentType.DNI, label: DOCUMENT_TYPE_LABELS[DocumentType.DNI] },
        { value: DocumentType.OTHER, label: DOCUMENT_TYPE_LABELS[DocumentType.OTHER] },
      ],
    },
    {
      key: 'city',
      type: 'text',
      label: 'Ciudad',
      placeholder: 'Filtrar por ciudad...',
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

  // Handlers para el modal de exportación
  const handleExportClick = (selectedItems: ThirdParty[]) => {
    setSelectedForExport(selectedItems);
    setExportModalOpen(true);
  };

  const handleExport = async (format: string, options: any) => {
    try {
      await exportData(format, {
        ...options,
        filters: currentFilters,
        selectedItems: options.scope === 'selected' ? selectedForExport : undefined
      });
    } catch (error) {
      console.error('Error al exportar terceros:', error);
      throw error; // Re-throw para que el modal maneje el error
    }
  };

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

  const bulkActions: ListViewAction<ThirdParty>[] = showActions ? [
    {
      key: 'export',
      label: 'Exportar',
      icon: <span>📤</span>,
      variant: 'secondary',
      requiresSelection: false,
      onClick: (selectedItems) => handleExportClick(selectedItems),
    },
    {
      key: 'activate',
      label: 'Activar',
      icon: <span>✅</span>,
      variant: 'success',
      requiresSelection: true,
      onClick: (selectedItems) => {
        console.log('Activar terceros:', selectedItems);
        // Aquí implementarías la lógica de activación
      },
    },
    {
      key: 'deactivate',
      label: 'Desactivar',
      icon: <span>⏸️</span>,
      variant: 'warning',
      requiresSelection: true,
      confirmMessage: '¿Estás seguro de que quieres desactivar los terceros seleccionados?',
      onClick: (selectedItems) => {
        console.log('Desactivar terceros:', selectedItems);
        // Aquí implementarías la lógica de desactivación
      },
    },
    {
      key: 'delete',
      label: 'Eliminar',
      icon: <span>🗑️</span>,
      variant: 'error',
      requiresSelection: true,
      onClick: (selectedItems) => {
        setSelectedForDeletion(selectedItems);
        setIsDeleteModalOpen(true);
      },
    },
  ] : [];

  // Data fetcher
  const dataFetcher = async (params: any) => {
    try {
      // Capturar filtros actuales
      setCurrentFilters(params.filters || {});

      const response: ThirdPartyListResponse = await ThirdPartyService.getThirdParties({
        page: params.page,
        per_page: params.perPage,
        sort_by: params.sortBy,
        sort_order: params.sortOrder,
        ...params.filters,
      });

      // Capturar total para exportación
      setTotalItems(response.total || 0);

      return {
        items: response.items || [],
        total: response.total || 0,
        page: Math.floor((response.skip || 0) / (response.limit || 25)) + 1,
        pages: Math.ceil((response.total || 0) / (response.limit || 25)),
        perPage: response.limit || 25,
      };
    } catch (error) {
      console.error('Error al cargar terceros:', error);
      throw new Error('No se pudieron cargar los terceros. Por favor, intenta de nuevo.');
    }
  };

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
        bulkActions={bulkActions}
        dataFetcher={dataFetcher}
        selectionMode="multiple"
        onRowClick={onThirdPartySelect}
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

      {/* Modal de eliminación */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        selectedItems={selectedForDeletion}
        deletionService={deletionService}
        itemDisplayName={(thirdParty) => ThirdPartyService.formatDisplayName(thirdParty)}
        itemTypeName="tercero"
        onSuccess={(deletedItems) => {
          console.log('Terceros eliminados exitosamente:', deletedItems);
          setIsDeleteModalOpen(false);
          setSelectedForDeletion([]);
          // Aquí podrías triggear un refresh de la lista
          // Por ejemplo, llamando a un callback o dispatch
        }}
        onError={(error) => {
          console.error('Error al eliminar terceros:', error);
          // Aquí podrías mostrar un toast de error
        }}
      />

      {/* Modal de exportación */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Exportar Terceros"
        description="Selecciona el formato y alcance de los datos que deseas exportar."
        onExport={handleExport}
        loading={isExporting}
        entityName="terceros"
        totalItems={totalItems}
        selectedItems={selectedForExport.length}
      />
    </>
  );
};
