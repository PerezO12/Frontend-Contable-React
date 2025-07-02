import React, { useState, useCallback } from 'react';
import { ListView } from '../organisms/ListView';
import { DeleteModal } from '../organisms/DeleteModal';
import { ExportModal } from '../organisms/ExportModal';
import { Badge } from '../../ui/Badge';
import { formatCurrency } from '../../../shared/utils/formatters';
import { useProductsExport } from '../../../hooks/useExport';
import { BulkActionsBar } from '../../../features/products/components/BulkActionsBar';
import type { ListViewColumn, ListViewFilter, ListViewAction } from '../types';
import type { Product, ProductFilters } from '../../../features/products/types';
import { ProductService } from '../../../features/products/services';
import { productDeletionService } from '../../../features/products/services/productDeletionService';
import { 
  ProductTypeLabels, 
  ProductStatusLabels,
  ProductType,
  ProductStatus
} from '../../../features/products/types';

// Iconos (usando los existentes del proyecto)
import { 
  PlusIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '../../../shared/components/icons';

export interface ProductListViewProps {
  onProductSelect?: (product: Product) => void;
  onCreateProduct?: () => void;
  initialFilters?: ProductFilters;
  showActions?: boolean;
}

export const ProductListView: React.FC<ProductListViewProps> = ({
  onProductSelect,
  onCreateProduct,
  initialFilters,
  showActions = true,
}) => {
  // Estado para selección (manejado por ListView)
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  
  // Estado para el modal de eliminación
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<Product[]>([]);

  // Estado para el modal de exportación
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [selectedForExport, setSelectedForExport] = useState<Product[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentFilters, setCurrentFilters] = useState<ProductFilters>({});

  // Estado para procesamiento de operaciones bulk
  const [isProcessingBulk, setIsProcessingBulk] = useState(false);

  // Crear funciones de bulk operations que usen la selección actual
  const handleBulkActivate = useCallback(async (options: { reason?: string }) => {
    if (selectedProducts.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      const operation = {
        operation: 'change_status' as const,
        products: selectedProducts.map(product => ({
          product_id: product.id,
          data: { 
            status: 'active',
            notes: options.reason ? `Activado masivamente: ${options.reason}` : 'Activado masivamente'
          }
        }))
      };

      const result = await ProductService.bulkOperation(operation);
      
      if (result.successful > 0) {
        console.log(`${result.successful} productos activados exitosamente`);
        // TODO: Show success toast and refresh data
      }
      
      if (result.failed > 0) {
        console.log(`${result.failed} productos fallaron en la activación`);
        // TODO: Show error toast
      }

      // Clear selection after operation
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error en activación masiva:', error);
      // TODO: Show error toast
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedProducts]);

  const handleBulkDeactivate = useCallback(async (_options: { reason?: string } = {}) => {
    if (selectedProducts.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      const selectedIds = selectedProducts.map(p => p.id);
      const result = await ProductService.bulkDeactivateProducts(selectedIds);
      
      if (result.successful > 0) {
        console.log(`${result.successful} productos desactivados exitosamente`);
        // TODO: Show success toast and refresh data
      }
      
      if (result.failed > 0) {
        console.log(`${result.failed} productos fallaron en la desactivación`);
        // TODO: Show error toast
      }

      // Clear selection after operation
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error en desactivación masiva:', error);
      // TODO: Show error toast
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedProducts]);

  const handleBulkDelete = useCallback(async (_options: { reason: string }) => {
    if (selectedProducts.length === 0) {
      return;
    }

    setIsProcessingBulk(true);
    try {
      const selectedIds = selectedProducts.map(p => p.id);
      const result = await ProductService.bulkDeleteProducts(selectedIds);
      
      if (result.total_processed > 0) {
        console.log(`${result.total_processed} productos eliminados exitosamente`);
        // TODO: Show success toast and refresh data
      }
      
      if (result.total_errors > 0) {
        console.log(`${result.total_errors} productos fallaron en la eliminación`);
        // TODO: Show error toast
      }

      // Clear selection after operation
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error en eliminación masiva:', error);
      // TODO: Show error toast
    } finally {
      setIsProcessingBulk(false);
    }
  }, [selectedProducts]);

  // Hook de exportación
  const { isExporting, exportData } = useProductsExport();

  // Handlers para exportación desde el bulk actions bar
  const handleBulkExport = useCallback((selectedProducts: Product[]) => {
    setSelectedForExport(selectedProducts);
    setExportModalOpen(true);
  }, []);

  // Función para mostrar el nombre del producto
  const getProductDisplayName = (product: Product): string => {
    return `${product.code} - ${product.name}`;
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
      console.error('Error al exportar productos:', error);
      throw error; // Re-throw para que el modal maneje el error
    }
  }, [exportData, currentFilters, selectedForExport]);

  // Handlers para el modal de eliminación
  const handleDeleteSuccess = useCallback((deletedProducts: Product[]) => {
    console.log('Productos eliminados exitosamente:', deletedProducts);
    // Aquí podrías mostrar un toast de éxito o refrescar la lista
    setDeleteModalOpen(false);
    setSelectedForDeletion([]);
  }, []);

  const handleDeleteError = useCallback((error: string) => {
    console.error('Error al eliminar productos:', error);
    // Aquí podrías mostrar un toast de error
  }, []);
  // Configuración de columnas
  const columns: ListViewColumn<Product>[] = [
    {
      key: 'code',
      header: 'Código',
      width: '150px',
      render: (product) => (
        <div className="font-medium text-secondary-900">
          {product.code}
        </div>
      ),
    },
    {
      key: 'name',
      header: 'Nombre',
      render: (product) => (
        <div>
          <div className="text-sm text-secondary-900">{product.name}</div>
          {product.description && (
            <div className="text-sm text-secondary-500 truncate max-w-xs">
              {product.description}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'product_type',
      header: 'Tipo',
      width: '120px',
      render: (product) => {
        const typeConfig = {
          [ProductType.PRODUCT]: {
            label: ProductTypeLabels[product.product_type],
            color: 'blue' as const
          },
          [ProductType.SERVICE]: {
            label: ProductTypeLabels[product.product_type],
            color: 'purple' as const
          },
          [ProductType.BOTH]: {
            label: ProductTypeLabels[product.product_type],
            color: 'green' as const
          }
        };
        
        const config = typeConfig[product.product_type];
        
        return (
          <Badge color={config.color} variant="subtle">
            {config.label}
          </Badge>
        );
      },
    },
    {
      key: 'sale_price',
      header: 'Precio Venta',
      width: '130px',
      render: (product) => (
        <span className="text-sm text-secondary-900">
          {product.sale_price ? formatCurrency(parseFloat(product.sale_price)) : '-'}
        </span>
      ),
    },
    {
      key: 'current_stock',
      header: 'Stock',
      width: '150px',
      render: (product) => {
        if (!product.current_stock) {
          return <span className="text-sm text-secondary-500">-</span>;
        }

        const stock = parseFloat(product.current_stock);
        const minStock = parseFloat(product.min_stock || '0');
        const maxStock = parseFloat(product.max_stock || '0');
        
        let badge = null;
        
        if (stock <= 0) {
          badge = (
            <Badge color="red" variant="subtle">
              <ExclamationCircleIcon className="h-3 w-3 mr-1" />
              Sin stock
            </Badge>
          );
        } else if (minStock > 0 && stock <= minStock) {
          badge = (
            <Badge color="yellow" variant="subtle">
              <ExclamationCircleIcon className="h-3 w-3 mr-1" />
              Stock bajo
            </Badge>
          );
        } else if (maxStock > 0 && stock >= maxStock) {
          badge = (
            <Badge color="blue" variant="subtle">
              Stock alto
            </Badge>
          );
        }

        return (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-secondary-900">
              {stock.toLocaleString('es-ES')}
            </span>
            {badge}
          </div>
        );
      },
    },
    {
      key: 'status',
      header: 'Estado',
      width: '120px',
      render: (product) => {
        const statusConfig = {
          [ProductStatus.ACTIVE]: {
            label: ProductStatusLabels[product.status],
            color: 'green' as const,
            icon: CheckCircleIcon
          },
          [ProductStatus.INACTIVE]: {
            label: ProductStatusLabels[product.status], 
            color: 'gray' as const,
            icon: XCircleIcon
          },
          [ProductStatus.DISCONTINUED]: {
            label: ProductStatusLabels[product.status],
            color: 'red' as const,
            icon: XCircleIcon
          }
        };
        
        const config = statusConfig[product.status];
        const Icon = config.icon;
        
        return (
          <Badge color={config.color} variant="subtle">
            <Icon className="h-3 w-3 mr-1" />
            {config.label}
          </Badge>
        );
      },
    },
  ];

  // Configuración de filtros
  const filters: ListViewFilter[] = [
    {
      key: 'search',
      type: 'text',
      label: 'Buscar',
      placeholder: 'Buscar por código, nombre o descripción...',
    },
    {
      key: 'product_type',
      type: 'select',
      label: 'Tipo de producto',
      placeholder: 'Todos los tipos',
      options: [
        { value: ProductType.PRODUCT, label: ProductTypeLabels[ProductType.PRODUCT] },
        { value: ProductType.SERVICE, label: ProductTypeLabels[ProductType.SERVICE] },
        { value: ProductType.BOTH, label: ProductTypeLabels[ProductType.BOTH] },
      ],
    },
    {
      key: 'status',
      type: 'select',
      label: 'Estado',
      placeholder: 'Todos los estados',
      options: [
        { value: ProductStatus.ACTIVE, label: ProductStatusLabels[ProductStatus.ACTIVE] },
        { value: ProductStatus.INACTIVE, label: ProductStatusLabels[ProductStatus.INACTIVE] },
        { value: ProductStatus.DISCONTINUED, label: ProductStatusLabels[ProductStatus.DISCONTINUED] },
      ],
    },
    {
      key: 'price_range',
      type: 'range',
      label: 'Rango de precio',
    },
    {
      key: 'low_stock',
      type: 'boolean',
      label: 'Solo productos con stock bajo',
    },
  ];

  // Configuración de acciones
  const actions: ListViewAction<Product>[] = showActions ? [
    {
      key: 'create',
      label: 'Nuevo Producto',
      icon: <PlusIcon className="w-4 h-4" />,
      variant: 'primary',
      onClick: () => onCreateProduct?.(),
    },
  ] : [];

  // Data fetcher
  const dataFetcher = useCallback(async (params: any) => {
    try {
      // Capturar filtros actuales para exportación
      setCurrentFilters(params.filters || {});
      
      // Mapear parámetros del ListView a la estructura esperada por ProductService
      const filters: any = {
        page: params.page,
        size: params.perPage, // ProductService usa 'size' en lugar de 'per_page'
        ...params.filters,
      };

      // Mapear ordenamiento si está presente
      if (params.sortBy) {
        filters.sort_by = params.sortBy;
        filters.sort_order = params.sortOrder || 'asc';
      }

      const response = await ProductService.getProducts(filters);
      
      // Capturar total de elementos para exportación
      setTotalItems(response.total || 0);
      
      // Actualizar la lista de productos para el hook bulk
      const productList = response.items || [];

      return {
        items: productList,
        total: response.total || 0,
        page: response.page || 1,
        pages: response.pages || 1,
        perPage: response.per_page || 25,
      };
    } catch (error) {
      console.error('Error al cargar productos:', error);
      throw new Error('No se pudieron cargar los productos. Por favor, intenta de nuevo.');
    }
  }, []);

  // Manejar cambios de selección desde ListView
  const handleSelectionChange = useCallback((selectedProducts: Product[]) => {
    // Update local selection state
    setSelectedProducts(selectedProducts);
  }, []);

  return (
    <>
      <ListView<Product>
        title="Productos"
        description="Gestiona tu catálogo de productos y servicios"
        breadcrumbs={[
          { label: 'Inicio', href: '/' },
          { label: 'Productos' },
        ]}
        columns={columns}
        filters={filters}
        initialFilters={initialFilters}
        actions={actions}
        dataFetcher={dataFetcher}
        selectionMode="multiple"
        onRowClick={onProductSelect}
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
        ariaLabel="Lista de productos"
        ariaDescription="Tabla con información de todos los productos del sistema"
      />

      {/* Barra flotante de acciones bulk */}
      <BulkActionsBar
        selectedCount={selectedProducts.length}
        selectedProducts={selectedProducts}
        isProcessing={isProcessingBulk}
        onBulkActivate={handleBulkActivate}
        onBulkDeactivate={handleBulkDeactivate}
        onBulkDelete={handleBulkDelete}
        onBulkExport={handleBulkExport}
        onClearSelection={() => {
          // Clear selection in ListView
          setSelectedProducts([]);
        }}
      />

      {/* Modal de eliminación */}
      <DeleteModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        selectedItems={selectedForDeletion}
        deletionService={productDeletionService}
        itemDisplayName={getProductDisplayName}
        itemTypeName="producto"
        onSuccess={handleDeleteSuccess}
        onError={handleDeleteError}
      />

      {/* Modal de exportación */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Exportar Productos"
        description="Selecciona el formato y alcance de los productos que deseas exportar."
        onExport={handleExport}
        loading={isExporting}
        entityName="productos"
        totalItems={totalItems}
        selectedItems={selectedForExport.length}
      />
    </>
  );
};
