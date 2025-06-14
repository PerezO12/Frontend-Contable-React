import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CostCenterForm } from '../components';
import type { CostCenter } from '../types';

export const CostCenterCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (costCenter: CostCenter) => {
    navigate(`/cost-centers/${costCenter.id}`);
  };

  const handleCancel = () => {
    navigate('/cost-centers');
  };

  return (
    <>
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <button
              onClick={() => navigate('/cost-centers')}
              className="text-blue-600 hover:text-blue-800"
            >
              Centros de Costo
            </button>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700">Nuevo Centro</li>
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Centro de Costo</h1>
        <p className="text-gray-600 mt-2">
          Crear un nuevo centro de costo organizacional
        </p>
      </div>

      <CostCenterForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </>
  );
};
