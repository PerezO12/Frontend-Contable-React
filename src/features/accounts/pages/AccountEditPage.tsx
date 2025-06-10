import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AccountForm } from '../components';
import { useAccount } from '../hooks';
import { Spinner } from '../../../components/ui/Spinner';
import { Card } from '../../../components/ui/Card';
import type { Account } from '../types';

export const AccountEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { account, loading, error } = useAccount(id);

  const handleSuccess = (account: Account) => {
    navigate(`/accounts/${account.id}`);
  };

  const handleCancel = () => {
    if (account) {
      navigate(`/accounts/${account.id}`);
    } else {
      navigate('/accounts');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-8">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-2">Cargando cuenta...</p>
        </div>
      </div>
    );
  }

  if (error || !account) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="card-body text-center py-8">
            <p className="text-red-600 mb-4">
              {error || 'No se pudo cargar la cuenta'}
            </p>
            <button
              onClick={() => navigate('/accounts')}
              className="text-blue-600 hover:text-blue-800"
            >
              Volver al listado
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <button
              onClick={() => navigate('/accounts')}
              className="text-blue-600 hover:text-blue-800"
            >
              Plan de Cuentas
            </button>
          </li>
          <li className="text-gray-500">/</li>
          <li>
            <button
              onClick={() => navigate(`/accounts/${account.id}`)}
              className="text-blue-600 hover:text-blue-800"
            >
              {account.name}
            </button>
          </li>
          <li className="text-gray-500">/</li>
          <li className="text-gray-700">Editar</li>
        </ol>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Editar Cuenta</h1>
        <p className="text-gray-600 mt-2">
          Modificar la información de la cuenta: {account.code} - {account.name}
        </p>
      </div>

      <AccountForm
        initialData={{
          code: account.code,
          name: account.name,
          description: account.description,
          account_type: account.account_type,
          category: account.category,
          parent_id: account.parent_id,
          is_active: account.is_active,
          allows_movements: account.allows_movements,
          requires_third_party: account.requires_third_party,
          requires_cost_center: account.requires_cost_center,
          notes: account.notes
        }}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
        isEditMode={true}
        accountId={account.id}
      />
    </div>
  );
};
