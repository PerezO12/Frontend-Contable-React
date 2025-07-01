import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { ExportModal } from '../atomic/organisms/ExportModal';
import { useProductsExport, useThirdPartiesExport, useCostCentersExport } from '../../hooks/useExport';

export const ExportModalExample: React.FC = () => {
  // Estados para controlar los modales
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [showThirdPartiesModal, setShowThirdPartiesModal] = useState(false);
  const [showCostCentersModal, setShowCostCentersModal] = useState(false);

  // Hooks de exportación
  const { isExporting: isExportingProducts, exportData: exportProducts } = useProductsExport();
  const { isExporting: isExportingThirdParties, exportData: exportThirdParties } = useThirdPartiesExport();
  const { isExporting: isExportingCostCenters, exportData: exportCostCenters } = useCostCentersExport();

  // Datos de ejemplo para demostrar el modal
  const exampleData = {
    products: {
      total: 150,
      selected: 5,
      filters: { search: 'laptop', category: 'electronics' }
    },
    thirdParties: {
      total: 89,
      selected: 3,
      filters: { search: 'empresa', type: 'customer' }
    },
    costCenters: {
      total: 25,
      selected: 2,
      filters: { search: 'ventas', is_active: true }
    }
  };

  // Handlers de exportación
  const handleExportProducts = async (format: string, options: any) => {
    try {
      await exportProducts(format, {
        ...options,
        filters: exampleData.products.filters,
        selectedItems: options.scope === 'selected' ? Array(exampleData.products.selected).fill(null).map((_, i) => ({ id: `prod_${i}` })) : undefined
      });
      console.log('Productos exportados exitosamente');
    } catch (error) {
      console.error('Error al exportar productos:', error);
      throw error;
    }
  };

  const handleExportThirdParties = async (format: string, options: any) => {
    try {
      await exportThirdParties(format, {
        ...options,
        filters: exampleData.thirdParties.filters,
        selectedItems: options.scope === 'selected' ? Array(exampleData.thirdParties.selected).fill(null).map((_, i) => ({ id: `tp_${i}` })) : undefined
      });
      console.log('Terceros exportados exitosamente');
    } catch (error) {
      console.error('Error al exportar terceros:', error);
      throw error;
    }
  };

  const handleExportCostCenters = async (format: string, options: any) => {
    try {
      await exportCostCenters(format, {
        ...options,
        filters: exampleData.costCenters.filters,
        selectedItems: options.scope === 'selected' ? Array(exampleData.costCenters.selected).fill(null).map((_, i) => ({ id: `cc_${i}` })) : undefined
      });
      console.log('Centros de costo exportados exitosamente');
    } catch (error) {
      console.error('Error al exportar centros de costo:', error);
      throw error;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Modal de Exportación Genérico
        </h1>
        <p className="text-gray-600 mb-8">
          Ejemplos de uso del modal de exportación para diferentes entidades del sistema.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Productos */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Exportar Productos
          </h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p>Total: <span className="font-medium">{exampleData.products.total.toLocaleString()}</span></p>
            <p>Seleccionados: <span className="font-medium">{exampleData.products.selected}</span></p>
            <p>Filtros activos: <span className="font-medium">Búsqueda y categoría</span></p>
          </div>
          <Button
            onClick={() => setShowProductsModal(true)}
            className="w-full"
            variant="primary"
          >
            Exportar Productos
          </Button>
        </div>

        {/* Terceros */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Exportar Terceros
          </h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p>Total: <span className="font-medium">{exampleData.thirdParties.total.toLocaleString()}</span></p>
            <p>Seleccionados: <span className="font-medium">{exampleData.thirdParties.selected}</span></p>
            <p>Filtros activos: <span className="font-medium">Búsqueda y tipo</span></p>
          </div>
          <Button
            onClick={() => setShowThirdPartiesModal(true)}
            className="w-full"
            variant="primary"
          >
            Exportar Terceros
          </Button>
        </div>

        {/* Centros de Costo */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Exportar Centros de Costo
          </h3>
          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <p>Total: <span className="font-medium">{exampleData.costCenters.total.toLocaleString()}</span></p>
            <p>Seleccionados: <span className="font-medium">{exampleData.costCenters.selected}</span></p>
            <p>Filtros activos: <span className="font-medium">Búsqueda y estado</span></p>
          </div>
          <Button
            onClick={() => setShowCostCentersModal(true)}
            className="w-full"
            variant="primary"
          >
            Exportar Centros de Costo
          </Button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">
          Características del Modal de Exportación
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Soporta múltiples formatos: CSV, Excel (XLSX) y JSON</li>
          <li>• Permite exportar todos los elementos o solo los seleccionados</li>
          <li>• Aplica filtros activos automáticamente</li>
          <li>• Descarga automática del archivo generado</li>
          <li>• Interfaz consistente y reutilizable</li>
          <li>• Manejo de estados de carga y errores</li>
        </ul>
      </div>

      {/* Modales de exportación */}
      <ExportModal
        isOpen={showProductsModal}
        onClose={() => setShowProductsModal(false)}
        title="Exportar Productos"
        description="Selecciona el formato y alcance de los productos que deseas exportar."
        onExport={handleExportProducts}
        loading={isExportingProducts}
        entityName="productos"
        totalItems={exampleData.products.total}
        selectedItems={exampleData.products.selected}
      />

      <ExportModal
        isOpen={showThirdPartiesModal}
        onClose={() => setShowThirdPartiesModal(false)}
        title="Exportar Terceros"
        description="Selecciona el formato y alcance de los terceros que deseas exportar."
        onExport={handleExportThirdParties}
        loading={isExportingThirdParties}
        entityName="terceros"
        totalItems={exampleData.thirdParties.total}
        selectedItems={exampleData.thirdParties.selected}
      />

      <ExportModal
        isOpen={showCostCentersModal}
        onClose={() => setShowCostCentersModal(false)}
        title="Exportar Centros de Costo"
        description="Selecciona el formato y alcance de los centros de costo que deseas exportar."
        onExport={handleExportCostCenters}
        loading={isExportingCostCenters}
        entityName="centros de costo"
        totalItems={exampleData.costCenters.total}
        selectedItems={exampleData.costCenters.selected}
      />
    </div>
  );
};
