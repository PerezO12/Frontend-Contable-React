import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountListView } from '@/components/atomic/templates/AccountListView';
import type { Account } from '../types';

export const AccountListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAccountSelect = (account: Account) => {
    navigate(`/accounts/${account.id}`);
  };

  const handleCreateAccount = () => {
    navigate('/accounts/new');
  };

  return (
    <AccountListView 
      onAccountSelect={handleAccountSelect}
      onCreateAccount={handleCreateAccount}
      showActions={true}
    />
  );
};
