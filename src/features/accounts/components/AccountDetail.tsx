import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useAccount, useAccountBalance, useAccountMovements } from '../hooks';
import { formatCurrency, formatDate } from '../../../shared/utils';
import { 
  ACCOUNT_TYPE_LABELS, 
  ACCOUNT_CATEGORY_LABELS,
  getAccountTypeProperties,
  type Account 
} from '../types';

interface AccountDetailProps {
  accountId: string;
  onEdit?: (account: Account) => void;
  onCreateChild?: (account: Account) => void;
  onClose?: () => void;
}

export const AccountDetail: React.FC<AccountDetailProps> = ({
  accountId,
  onEdit,
  onCreateChild,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'balance' | 'movements'>('info');

  const { account, loading: accountLoading, error: accountError } = useAccount(accountId);
  const { balance, loading: balanceLoading } = useAccountBalance(accountId);
  const { 
    movements, 
    totalCount, 
    loading: movementsLoading 
  } = useAccountMovements(accountId);

  if (accountLoading) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <Spinner size="lg" />
          <p className="text-gray-600 mt-2">Cargando información de la cuenta...</p>
        </div>
      </Card>
    );
  }

  if (accountError || !account) {
    return (
      <Card>
        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">
            Error al cargar la cuenta: {accountError || 'Cuenta no encontrada'}
          </p>
          {onClose && (
            <Button onClick={onClose}>
              Cerrar
            </Button>
          )}
        </div>
      </Card>
    );
  }

  const accountTypeProps = getAccountTypeProperties(account.account_type);

  const getAccountTypeColor = () => {
    const colors = {
      activo: 'bg-green-100 text-green-800',
      pasivo: 'bg-red-100 text-red-800',
      patrimonio: 'bg-blue-100 text-blue-800',
      ingreso: 'bg-purple-100 text-purple-800',
      gasto: 'bg-orange-100 text-orange-800',
      costos: 'bg-yellow-100 text-yellow-800'
    };
    return colors[account.account_type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <code className="text-lg font-mono bg-gray-100 px-3 py-1 rounded">
                  {account.code}
                </code>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getAccountTypeColor()}`}>
                  {ACCOUNT_TYPE_LABELS[account.account_type]}
                </span>
                {!account.is_active && (
                  <span className="inline-flex px-3 py-1 text-sm font-medium rounded-full bg-red-100 text-red-800">
                    Inactiva
                  </span>
                )}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{account.name}</h1>
              {account.description && (
                <p className="text-gray-600 mt-1">{account.description}</p>
              )}
            </div>

            <div className="flex space-x-2">
              {onEdit && (
                <Button
                  variant="secondary"
                  onClick={() => onEdit(account)}
                >
                  Editar
                </Button>
              )}
              {onCreateChild && account.allows_movements && (
                <Button
                  onClick={() => onCreateChild(account)}
                >
                  Crear Cuenta Hija
                </Button>
              )}
              {onClose && (
                <Button
                  variant="secondary"
                  onClick={onClose}
                >
                  Cerrar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'info', label: 'Información' },
              { id: 'balance', label: 'Saldos' },
              { id: 'movements', label: 'Movimientos' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </Card>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Información básica */}
          <Card>
            <div className="card-header">
              <h3 className="card-title">Información Básica</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Código</label>
                  <p className="mt-1 font-mono text-gray-900">{account.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Nivel</label>
                  <p className="mt-1 text-gray-900">Nivel {account.level}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Tipo</label>
                  <p className="mt-1 text-gray-900">{ACCOUNT_TYPE_LABELS[account.account_type]}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Categoría</label>
                  <p className="mt-1 text-gray-900">{ACCOUNT_CATEGORY_LABELS[account.category]}</p>
                </div>
              </div>

              {account.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-700">Notas</label>
                  <p className="mt-1 text-gray-600">{account.notes}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Configuración */}
          <Card>
            <div className="card-header">
              <h3 className="card-title">Configuración</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Estado</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    account.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {account.is_active ? 'Activa' : 'Inactiva'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Permite movimientos</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    account.allows_movements ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {account.allows_movements ? 'Sí' : 'No'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Requiere tercero</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    account.requires_third_party ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {account.requires_third_party ? 'Sí' : 'No'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Requiere centro de costo</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    account.requires_cost_center ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {account.requires_cost_center ? 'Sí' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Propiedades contables */}
          <Card>
            <div className="card-header">
              <h3 className="card-title">Propiedades Contables</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Lado normal del balance</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {accountTypeProps.normalBalanceSide === 'debit' ? 'Débito' : 'Crédito'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Aumenta con</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {accountTypeProps.increasesWith === 'debit' ? 'Débito' : 'Crédito'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Disminuye con</span>
                  <span className="text-sm font-medium text-gray-900 capitalize">
                    {accountTypeProps.decreasesWith === 'debit' ? 'Débito' : 'Crédito'}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Estado financiero</span>
                  <span className="text-sm font-medium text-gray-900">
                    {accountTypeProps.statement === 'balance_sheet' ? 'Balance General' : 'Estado de Resultados'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Metadatos */}
          <Card>
            <div className="card-header">
              <h3 className="card-title">Metadatos</h3>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">Creado</label>
                  <p className="mt-1 text-sm text-gray-600">
                    {formatDate(account.created_at, 'long')}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Última actualización</label>
                  <p className="mt-1 text-sm text-gray-600">
                    {formatDate(account.updated_at, 'long')}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === 'balance' && (
        <Card>
          <div className="card-header">
            <h3 className="card-title">Saldos de la Cuenta</h3>
          </div>
          <div className="card-body">
            {balanceLoading ? (
              <div className="text-center py-8">
                <Spinner size="lg" />
                <p className="text-gray-600 mt-2">Cargando saldos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <h4 className="text-lg font-medium text-blue-900 mb-2">Saldo Neto</h4>
                  <p className={`text-2xl font-bold ${
                    parseFloat(account.balance) >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {formatCurrency(parseFloat(account.balance))}
                  </p>
                </div>
                
                <div className="text-center p-6 bg-green-50 rounded-lg">
                  <h4 className="text-lg font-medium text-green-900 mb-2">Total Débitos</h4>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(parseFloat(account.debit_balance))}
                  </p>
                </div>
                
                <div className="text-center p-6 bg-red-50 rounded-lg">
                  <h4 className="text-lg font-medium text-red-900 mb-2">Total Créditos</h4>
                  <p className="text-2xl font-bold text-red-600">
                    {formatCurrency(parseFloat(account.credit_balance))}
                  </p>
                </div>
              </div>
            )}

            {balance && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Saldos actualizados al: {formatDate(balance.as_of_date, 'long')}
                </p>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'movements' && (
        <Card>
          <div className="card-header">
            <h3 className="card-title">
              Movimientos de la Cuenta
              {totalCount > 0 && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({totalCount} total)
                </span>
              )}
            </h3>
          </div>
          <div className="card-body">
            {movementsLoading ? (
              <div className="text-center py-8">
                <Spinner size="lg" />
                <p className="text-gray-600 mt-2">Cargando movimientos...</p>
              </div>
            ) : movements.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay movimientos registrados para esta cuenta</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Fecha</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Descripción</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Débito</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Crédito</th>
                      <th className="text-right py-3 px-4 font-medium text-gray-900">Saldo</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {movements.map((movement) => (
                      <tr key={movement.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900">
                            {formatDate(movement.date)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-900">
                            {movement.description}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm font-mono text-green-600">
                            {parseFloat(movement.debit_amount) > 0 
                              ? formatCurrency(parseFloat(movement.debit_amount))
                              : '-'
                            }
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="text-sm font-mono text-red-600">
                            {parseFloat(movement.credit_amount) > 0 
                              ? formatCurrency(parseFloat(movement.credit_amount))
                              : '-'
                            }
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className={`text-sm font-mono ${
                            parseFloat(movement.balance) >= 0 ? 'text-gray-900' : 'text-red-600'
                          }`}>
                            {formatCurrency(parseFloat(movement.balance))}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
