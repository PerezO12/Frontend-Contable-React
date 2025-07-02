import React from 'react';
import { CostCenterListView } from '../../../components/atomic/templatesViews/CostCenterListView';
import { useNavigate } from 'react-router-dom';
import type { CostCenter } from '../types';

export const CostCenterListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCostCenterSelect = (costCenter: CostCenter) => {
    navigate(`/cost-centers/${costCenter.id}`);
  };

  const handleCreateCostCenter = () => {
    navigate('/cost-centers/new');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CostCenterListView
        onCostCenterSelect={handleCostCenterSelect}
        onCreateCostCenter={handleCreateCostCenter}
        showActions={true}
      />
    </div>
  );
};
