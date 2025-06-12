import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useAccounts } from '../hooks';
import { 
  CashFlowCategory, 
  CASH_FLOW_CATEGORY_LABELS,
  CASH_FLOW_CATEGORY_DESCRIPTIONS,
  getDefaultCashFlowCategory
} from '../types';

interface CashFlowCategoryManagerProps {
  onClose?: () => void;
}

export const CashFlowCategoryManager: React.FC<CashFlowCategoryManagerProps> = ({
  onClose
}) => {
  const { accounts, loading, updateAccount, refetch } = useAccounts({ is_active: true });
  const [pendingUpdates, setPendingUpdates] = useState<Map<string, CashFlowCategory>>(new Map());
  const [processing, setProcessing] = useState(false);

  // Filter accounts without cash flow category
  const uncategorizedAccounts = accounts.filter(account => !account.cash_flow_category);

  // Generate automatic suggestions
  const suggestions = uncategorizedAccounts.map(account => {
    const suggestedCategory = getDefaultCashFlowCategory(account.account_type, account.category);
    return {
      account,
      suggestedCategory,
      confidence: suggestedCategory ? 'alta' : 'baja'
    };
  });

  const handleCategoryChange = (accountId: string, category: CashFlowCategory | '') => {
    const newPending = new Map(pendingUpdates);
    if (category === '') {
      newPending.delete(accountId);
    } else {
      newPending.set(accountId, category);
    }
    setPendingUpdates(newPending);
  };

  const handleApplyAutoSuggestions = () => {
    const newPending = new Map(pendingUpdates);
    suggestions.forEach(({ account, suggestedCategory }) => {
      if (suggestedCategory && !newPending.has(account.id)) {
        newPending.set(account.id, suggestedCategory);
      }
    });
    setPendingUpdates(newPending);
  };

  const handleSaveChanges = async () => {
    if (pendingUpdates.size === 0) return;
    
    setProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    for (const [accountId, category] of pendingUpdates.entries()) {
      try {
        const success = await updateAccount(accountId, { cash_flow_category: category });
        if (success) {
          successCount++;
        } else {
          errorCount++;
        }
      } catch (error) {
        console.error('Error updating account:', error);
        errorCount++;
      }
    }

    setProcessing(false);
    setPendingUpdates(new Map());
    
    // Show notification
    if (successCount > 0) {
      alert(`✅ Se actualizaron ${successCount} cuenta${successCount === 1 ? '' : 's'} exitosamente.`);
    }
    if (errorCount > 0) {
      alert(`❌ Error al actualizar ${errorCount} cuenta${errorCount === 1 ? '' : 's'}.`);
    }

    // Refresh data
    await refetch();
  };

  const getCategoryColor = (category: CashFlowCategory) => {
    const colors = {
      [CashFlowCategory.OPERATING]: 'bg-blue-100 text-blue-800',
      [CashFlowCategory.INVESTING]: 'bg-orange-100 text-orange-800',
      [CashFlowCategory.FINANCING]: 'bg-purple-100 text-purple-800',
      [CashFlowCategory.CASH_EQUIVALENTS]: 'bg-green-100 text-green-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-2">Cargando cuentas...</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                💧 Gestor de Categorías de Flujo de Efectivo
              </h2>
              <p className="text-gray-600 mt-1">
                Asigna categorías de flujo de efectivo a las cuentas para mejorar los reportes
              </p>
            </div>
            {onClose && (
              <Button variant="secondary" onClick={onClose}>
                Cerrar
              </Button>
            )}
          </div>
        </div>

        <div className="card-body">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Cuentas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Con Categoría Asignada</p>
              <p className="text-2xl font-bold text-green-700">
                {accounts.length - uncategorizedAccounts.length}
              </p>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Sin Categoría</p>
              <p className="text-2xl font-bold text-orange-700">
                {uncategorizedAccounts.length}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Cambios Pendientes</p>
              <p className="text-2xl font-bold text-blue-700">
                {pendingUpdates.size}
              </p>
            </div>
          </div>

          {/* Actions */}
          {uncategorizedAccounts.length > 0 && (
            <div className="flex justify-between items-center mb-6 p-4 bg-blue-50 rounded-lg">
              <div>
                <h3 className="font-medium text-blue-900">Sugerencias Automáticas</h3>
                <p className="text-sm text-blue-700">
                  Se pueden aplicar {suggestions.filter(s => s.suggestedCategory).length} sugerencias automáticas
                </p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="secondary"
                  onClick={handleApplyAutoSuggestions}
                  disabled={processing}
                >
                  Aplicar Sugerencias
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  disabled={pendingUpdates.size === 0 || processing}
                >
                  {processing ? <Spinner size="sm" /> : `Guardar ${pendingUpdates.size} Cambios`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Accounts list */}
      {uncategorizedAccounts.length === 0 ? (
        <Card>
          <div className="card-body text-center py-8">
            <div className="text-green-600 text-6xl mb-4">✅</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¡Todas las cuentas están categorizadas!
            </h3>
            <p className="text-gray-600">
              Todas las cuentas activas tienen una categoría de flujo de efectivo asignada.
            </p>
          </div>
        </Card>
      ) : (
        <Card>
          <div className="card-header">
            <h3 className="card-title">
              Cuentas Sin Categoría de Flujo ({uncategorizedAccounts.length})
            </h3>
          </div>
          <div className="card-body">
            <div className="space-y-4">
              {suggestions.map(({ account, suggestedCategory }) => {
                const pendingCategory = pendingUpdates.get(account.id);
                const currentSelection = pendingCategory || suggestedCategory || '';

                return (
                  <div
                    key={account.id}
                    className={`p-4 border rounded-lg ${
                      pendingUpdates.has(account.id) ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                            {account.code}
                          </code>
                          <span className="font-medium text-gray-900">{account.name}</span>
                          {suggestedCategory && !pendingUpdates.has(account.id) && (
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                              Sugerencia automática
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          Tipo: {account.account_type} | Categoría: {account.category}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <select
                          value={currentSelection}
                          onChange={(e) => handleCategoryChange(account.id, e.target.value as CashFlowCategory | '')}
                          className="form-select w-64"
                        >
                          <option value="">Seleccionar categoría...</option>
                          {Object.entries(CASH_FLOW_CATEGORY_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>
                              {label}
                            </option>
                          ))}
                        </select>

                        {currentSelection && (
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(currentSelection as CashFlowCategory)}`}>
                            {CASH_FLOW_CATEGORY_LABELS[currentSelection as CashFlowCategory]}
                          </span>
                        )}
                      </div>
                    </div>

                    {currentSelection && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-600">
                        {CASH_FLOW_CATEGORY_DESCRIPTIONS[currentSelection as CashFlowCategory]}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
