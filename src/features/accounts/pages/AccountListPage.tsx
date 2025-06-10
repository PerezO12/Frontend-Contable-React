import React from 'react';
import { AccountList } from '../components';
import { MainLayout } from '../../../components/layout/MainLayout';
import { useNavigate } from 'react-router-dom';
import type { Account } from '../types';

export const AccountListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAccountSelect = (account: Account) => {
    navigate(`/accounts/${account.id}`);
  };

  const handleCreateAccount = () => {
    navigate('/accounts/new');
  };

  const handleEditAccount = (account: Account) => {
    navigate(`/accounts/${account.id}/edit`);
  };
  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Plan de Cuentas</h1>
          <p className="text-gray-600 mt-2">
            Gestión completa del plan de cuentas contables
          </p>
        </div>

        <AccountList
          onAccountSelect={handleAccountSelect}
          onCreateAccount={handleCreateAccount}
          onEditAccount={handleEditAccount}
          showActions={true}
        />
      </div>
    </MainLayout>
  );
};
