import React, { useState } from 'react';
import { CostCenterList, CostCenterDetail, CostCenterForm, CostCenterMovements, CostCenterAnalysisComponent } from '../components';
import { useCostCenters } from '../hooks';
import type { CostCenter, CostCenterCreate, CostCenterUpdate } from '../types';

type ViewMode = 'list' | 'detail' | 'create' | 'edit' | 'movements' | 'analysis';

export const CostCenterManagementPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>('list');
  const [selectedCostCenter, setSelectedCostCenter] = useState<CostCenter | null>(null);

  const { createCostCenter, updateCostCenter, refetch } = useCostCenters();
  const handleCostCenterSelect = (costCenter: CostCenter) => {
    setSelectedCostCenter(costCenter);
    setCurrentView('detail');
  };

  const handleCreateCostCenter = () => {
    setSelectedCostCenter(null);
    setCurrentView('create');
  };

  const handleEditCostCenter = (costCenter: CostCenter) => {
    setSelectedCostCenter(costCenter);
    setCurrentView('edit');
  };

  const handleViewMovements = (costCenter: CostCenter) => {
    setSelectedCostCenter(costCenter);
    setCurrentView('movements');
  };

  const handleViewAnalysis = (costCenter: CostCenter) => {
    setSelectedCostCenter(costCenter);
    setCurrentView('analysis');
  };
  const handleFormSubmit = async (data: CostCenterCreate | CostCenterUpdate) => {
    try {
      if (currentView === 'create') {
        const result = await createCostCenter(data as CostCenterCreate);
        if (result) {
          setCurrentView('list');
          refetch();
        }
      } else if (currentView === 'edit' && selectedCostCenter) {
        const result = await updateCostCenter(selectedCostCenter.id, data as CostCenterUpdate);
        if (result) {
          setSelectedCostCenter(result);
          setCurrentView('detail');
          refetch();
        }
      }
    } catch (error) {
      console.error('Error in form submission:', error);
    }
  };

  const handleBackToList = () => {
    setSelectedCostCenter(null);
    setCurrentView('list');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'list':
        return (          <CostCenterList
            onCostCenterSelect={handleCostCenterSelect}
            onCreateCostCenter={handleCreateCostCenter}
            showActions={true}
          />
        );

      case 'detail':
        return selectedCostCenter ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToList}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Volver a la lista
              </button>
            </div>            <CostCenterDetail
              costCenterId={selectedCostCenter.id}
              onEdit={handleEditCostCenter}
              onViewMovements={handleViewMovements}
              onViewAnalysis={handleViewAnalysis}
            />
          </div>
        ) : null;

      case 'create':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToList}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Volver a la lista
              </button>
            </div>            <CostCenterForm
              onSuccess={(costCenter) => {
                handleFormSubmit(costCenter);
              }}
              onCancel={handleBackToList}
            />
          </div>
        );

      case 'edit':
        return selectedCostCenter ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('detail')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Volver al detalle
              </button>
            </div>            <CostCenterForm
              costCenterId={selectedCostCenter.id}
              isEditMode={true}
              onSuccess={(costCenter) => {
                handleFormSubmit(costCenter);
                setCurrentView('detail');
              }}
              onCancel={() => setCurrentView('detail')}
            />
          </div>
        ) : null;

      case 'movements':
        return selectedCostCenter ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('detail')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Volver al detalle
              </button>
            </div>
            <CostCenterMovements
              costCenter={selectedCostCenter}
              onClose={() => setCurrentView('detail')}
            />
          </div>
        ) : null;

      case 'analysis':
        return selectedCostCenter ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('detail')}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                ← Volver al detalle
              </button>
            </div>            <CostCenterAnalysisComponent
              costCenter={selectedCostCenter}
              onClose={() => setCurrentView('detail')}
            />
          </div>
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Centros de Costo</h1>
        <p className="text-gray-600 mt-2">
          Administra y analiza los centros de costo de tu organización
        </p>
      </div>

      {renderCurrentView()}
    </div>
  );
};
