import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CostCenterDetail } from '../components';

export const CostCenterDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleEdit = () => {
    if (id) {
      navigate(`/cost-centers/${id}/edit`);
    }
  };


  const handleClose = () => {
    navigate('/cost-centers');
  };

  const handleViewMovements = () => {
    if (id) {
      navigate(`/cost-centers/${id}/movements`);
    }
  };

  const handleViewAnalysis = () => {
    if (id) {
      navigate(`/cost-centers/${id}/analysis`);
    }
  };

  if (!id) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-red-600">ID de centro de costo no válido</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CostCenterDetail
        costCenterId={id}
        onEdit={handleEdit}
        onClose={handleClose}
        onViewMovements={handleViewMovements}
        onViewAnalysis={handleViewAnalysis}
      />
    </div>
  );
};
