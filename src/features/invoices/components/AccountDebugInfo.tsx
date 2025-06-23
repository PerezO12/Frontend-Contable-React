/**
 * Componente temporal de debug para verificar datos de cuentas
 */
import { useAccounts } from '@/features/accounts/hooks/useAccounts';

export function AccountDebugInfo() {
  const { accounts, loading, error } = useAccounts();

  if (loading) {
    return <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
      🔄 Cargando cuentas...
    </div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 border border-red-300 rounded">
      ❌ Error: {error}
    </div>;
  }

  const accountTypes = [...new Set(accounts.map(acc => acc.account_type))];
  const sampleAccounts = accounts.slice(0, 5);

  return (
    <div className="p-4 bg-blue-100 border border-blue-300 rounded space-y-2">
      <h3 className="font-bold">🔍 Debug Info - Cuentas Contables</h3>
      <p><strong>Total cuentas:</strong> {accounts.length}</p>
      <p><strong>Tipos disponibles:</strong> {accountTypes.join(', ')}</p>
      
      <div>
        <strong>Muestra de cuentas:</strong>
        <ul className="ml-4">
          {sampleAccounts.map(acc => (
            <li key={acc.id} className="text-sm">
              {acc.code} - {acc.name} [{acc.account_type}]
            </li>
          ))}
        </ul>
      </div>
      
      <div className="text-xs text-gray-600">
        Este componente es temporal para debugging. Se puede remover una vez solucionado el problema.
      </div>
    </div>
  );
}
