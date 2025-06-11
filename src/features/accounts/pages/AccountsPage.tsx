import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { AccountList, AccountTreeComponent as AccountTree, AccountForm, AccountDetail } from '../components';
import type { Account } from '../types';

type ViewMode = 'list' | 'tree';
type PageMode = 'view' | 'create' | 'edit' | 'detail';

export const AccountsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [pageMode, setPageMode] = useState<PageMode>('view');
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [parentAccount, setParentAccount] = useState<Account | null>(null);// Helper function to convert tree item to Account for compatibility
  const convertToAccount = (item: any): Account => {
    if ('category' in item) {
      // It's already an Account
      return item;
    }
    // It's AccountTree, convert to Account with minimal required fields
    return {
      ...item,
      category: 'activo_corriente' as any, // Default category - this would need proper handling
      requires_third_party: false,
      requires_cost_center: false,
      debit_balance: '0.00',
      credit_balance: '0.00',
      description: '',
      notes: '',
      created_by_id: '',
      created_at: '',
      updated_at: '',
      parent_id: undefined
    };
  };

  const handleCreateAccount = (parent?: any) => {
    setParentAccount(parent ? convertToAccount(parent) : null);
    setSelectedAccount(null);
    setPageMode('create');
  };

  const handleEditAccount = (account: Account) => {
    setSelectedAccount(account);
    setParentAccount(null);
    setPageMode('edit');
  };

  const handleViewAccount = (account: any) => {
    setSelectedAccount(convertToAccount(account));
    setPageMode('detail');
  };

  const handleFormSuccess = (account: Account) => {
    setSelectedAccount(account);
    setPageMode('detail');
  };

  const handleCancel = () => {
    setPageMode('view');
    setSelectedAccount(null);
    setParentAccount(null);
  };

  const renderHeader = () => (
    <div className="mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plan de Cuentas</h1>
          <p className="text-gray-600 mt-2">
            Gestión completa del plan de cuentas contables
          </p>
        </div>

        {pageMode === 'view' && (
          <div className="flex space-x-3">
            <Button
              variant="secondary"
              onClick={() => handleCreateAccount()}
            >
              Nueva Cuenta Raíz
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
              Plan de Cuentas
            </button>
          </li>
          {pageMode === 'create' && (
            <>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">
                {parentAccount ? `Nueva cuenta hija de ${parentAccount.name}` : 'Nueva cuenta raíz'}
              </li>
            </>
          )}
          {pageMode === 'edit' && selectedAccount && (
            <>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Editar {selectedAccount.name}</li>
            </>
          )}
          {pageMode === 'detail' && selectedAccount && (
            <>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">{selectedAccount.name}</li>
            </>
          )}
        </ol>
      </nav>    </div>
  );

  const renderContent = () => {
    switch (pageMode) {
      case 'create':
        return (
          <AccountForm
            parentAccount={parentAccount || undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        );
        case 'edit':
        if (!selectedAccount) return null;
        return (
          <AccountForm
            isEditMode={true}
            accountId={selectedAccount.id}
            initialData={{
              code: selectedAccount.code,
              name: selectedAccount.name,
              description: selectedAccount.description,
              account_type: selectedAccount.account_type,
              category: selectedAccount.category,
              is_active: selectedAccount.is_active,
              allows_movements: selectedAccount.allows_movements,
              requires_third_party: selectedAccount.requires_third_party,
              requires_cost_center: selectedAccount.requires_cost_center,
              notes: selectedAccount.notes
            }}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        );
      
      case 'detail':
        if (!selectedAccount) return null;
        return (
          <AccountDetail
            accountId={selectedAccount.id}
            onEdit={handleEditAccount}
            onCreateChild={handleCreateAccount}
            onClose={handleCancel}
          />
        );
        default:
        return (
          <>
            {viewMode === 'list' ? (
              <AccountList
                onAccountSelect={handleViewAccount}
                onCreateAccount={() => handleCreateAccount()}
                onEditAccount={handleEditAccount}
              />
            ) : (
              <AccountTree
                onAccountSelect={handleViewAccount}
                onCreateChild={handleCreateAccount}
                activeOnly={true}
              />
            )}
          </>
        );    }
  };
  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderHeader()}
        {renderContent()}
      </div>
    </>
  );
};
