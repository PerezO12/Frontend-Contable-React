import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { CostCenterList, CostCenterForm, CostCenterDetail, CostCenterTreeComponent as CostCenterTree } from '../components';
import { useCostCenters, useCostCenterListListener, type CostCenterEvent } from '../hooks';
import type { CostCenter } from '../types';

type ViewMode = 'list' | 'tree';
type PageMode = 'view' | 'create' | 'edit' | 'detail';

export const CostCentersPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [pageMode, setPageMode] = useState<PageMode>('view');
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);
    const { 
    deleteCostCenter 
  } = useCostCenters();  // Escuchar eventos para actualizar el selectedCostCenter si es necesario
  useCostCenterListListener((event: CostCenterEvent) => {
    if (selectedCostCenter && event.costCenterId === selectedCostCenter.id && event.costCenter) {
      setSelectedCostCenter(event.costCenter);
    }
  });

  // Helper function to convert tree item to CostCenter for compatibility
  const convertToCostCenter = (item: any): CostCenter => {
    if ('movements_count' in item) {
      // It's already a CostCenter
      return item;
    }
    // It's CostCenterTree, convert to CostCenter with minimal required fields
    return {
      ...item,
      parent_name: undefined,
      children_count: item.children?.length || 0,
      movements_count: 0,
      level: item.level,
      full_code: item.code, // Assuming full_code is same as code for tree items
      is_leaf: item.is_leaf,
      created_at: '',
      updated_at: ''
    };
  };

  const handleCreateCostCenter = (parent?: any) => {
    setSelectedCostCenter(parent ? convertToCostCenter(parent) : null);
    setPageMode('create');
  };

  const handleViewCostCenter = (costCenter: any) => {
    setSelectedCostCenter(convertToCostCenter(costCenter));
    setPageMode('detail');
  };  const handleFormSuccess = (costCenter: CostCenter) => {
    setSelectedCostCenter(costCenter);
    setPageMode('detail');
  };

  const handleCancel = () => {
    setSelectedCostCenter(null);
    setPageMode('view');
  };

  const handleEditFromDetail = (costCenter: CostCenter) => {
    setSelectedCostCenter(costCenter);
    setPageMode('edit');
  };

  const handleDeleteCostCenter = async (costCenter: CostCenter) => {
    const confirmed = window.confirm(
      `¿Está seguro de que desea eliminar el centro de costo ${costCenter.code} - ${costCenter.name}?`
    );

    if (confirmed) {
      await deleteCostCenter(costCenter.id);
      handleCancel(); // Regresar a la vista principal
    }
  };
  const renderHeader = () => (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {pageMode === 'create' && 'Nuevo Centro de Costo'}
            {pageMode === 'edit' && selectedCostCenter && `Editar ${selectedCostCenter.code}`}
            {pageMode === 'detail' && selectedCostCenter && `Centro de Costo ${selectedCostCenter.code}`}
            {pageMode === 'view' && 'Centros de Costo'}
          </h1>
          <p className="text-gray-600 mt-2">
            {pageMode === 'create' && 'Crear un nuevo centro de costo'}
            {pageMode === 'edit' && 'Modificar la información del centro de costo'}
            {pageMode === 'detail' && 'Información detallada del centro de costo'}
            {pageMode === 'view' && 'Gestión completa de centros de costo organizacionales'}
          </p>
        </div>

        {pageMode === 'view' && (
          <div className="flex space-x-3">
            <Button
              onClick={() => handleCreateCostCenter()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              + Nuevo Centro de Costo
            </Button>
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                  viewMode === 'list'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Lista
              </button>
              <button
                onClick={() => setViewMode('tree')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border-l-0 border ${
                  viewMode === 'tree'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Árbol
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <button
              onClick={handleCancel}
              className="text-blue-600 hover:text-blue-800"
            >
              Centros de Costo
            </button>
          </li>
          {pageMode === 'create' && (
            <>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Nuevo Centro de Costo</li>
            </>
          )}
          {pageMode === 'edit' && selectedCostCenter && (
            <>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Editar {selectedCostCenter.code}</li>
            </>
          )}
          {pageMode === 'detail' && selectedCostCenter && (
            <>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Centro {selectedCostCenter.code}</li>
            </>
          )}
        </ol>
      </nav>
    </div>
  );

  const renderContent = () => {
    switch (pageMode) {
      case 'create':
        return (
          <CostCenterForm
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        );
      
      case 'edit':
        if (!selectedCostCenter) return null;
        return (
          <CostCenterForm
            isEditMode={true}
            costCenterId={selectedCostCenter.id}
            initialData={{
              code: selectedCostCenter.code,
              name: selectedCostCenter.name,
              description: selectedCostCenter.description,
              parent_id: selectedCostCenter.parent_id,
              is_active: selectedCostCenter.is_active
            }}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        );
      
      case 'detail':
        if (!selectedCostCenter) return null;
        return (
          <CostCenterDetail
            costCenterId={selectedCostCenter.id}
            onEdit={handleEditFromDetail}
            onClose={handleCancel}
            onDelete={handleDeleteCostCenter}
          />
        );
        default:
        if (viewMode === 'tree') {
          return (
            <CostCenterTree
              onCostCenterSelect={handleViewCostCenter}
              onCreateChild={handleCreateCostCenter}
              activeOnly={true}
            />
          );
        }
        return (
          <CostCenterList
            onCostCenterSelect={handleViewCostCenter}
            onCreateCostCenter={handleCreateCostCenter}
          />
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderHeader()}
      {renderContent()}
    </div>
  );
};
