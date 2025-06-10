import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AccountDetail } from '../components';
import { MainLayout } from '../../../components/layout/MainLayout';

export const AccountDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const handleEdit = () => {
    if (id) {
      navigate(`/accounts/${id}/edit`);
    }
  };

  const handleCreateChild = () => {
    if (id) {
      navigate(`/accounts/new?parentId=${id}`);
    }
  };

  const handleClose = () => {
    navigate('/accounts');
  };
  if (!id) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-red-600">ID de cuenta no válido</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AccountDetail
          accountId={id}
          onEdit={handleEdit}
          onCreateChild={handleCreateChild}
          onClose={handleClose}
        />
      </div>
    </MainLayout>
  );
};
