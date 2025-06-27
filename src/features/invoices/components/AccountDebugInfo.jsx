var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * Componente temporal de debug para verificar datos de cuentas
 */
import { useAccounts } from '@/features/accounts/hooks/useAccounts';
export function AccountDebugInfo() {
    var _a = useAccounts(), accounts = _a.accounts, loading = _a.loading, error = _a.error;
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
    var accountTypes = __spreadArray([], new Set(accounts.map(function (acc) { return acc.account_type; })), true);
    var sampleAccounts = accounts.slice(0, 5);
    return (<div className="p-4 bg-blue-100 border border-blue-300 rounded space-y-2">
      <h3 className="font-bold">🔍 Debug Info - Cuentas Contables</h3>
      <p><strong>Total cuentas:</strong> {accounts.length}</p>
      <p><strong>Tipos disponibles:</strong> {accountTypes.join(', ')}</p>
      
      <div>
        <strong>Muestra de cuentas:</strong>
        <ul className="ml-4">
          {sampleAccounts.map(function (acc) { return (<li key={acc.id} className="text-sm">
              {acc.code} - {acc.name} [{acc.account_type}]
            </li>); })}
        </ul>
      </div>
      
      <div className="text-xs text-gray-600">
        Este componente es temporal para debugging. Se puede remover una vez solucionado el problema.
      </div>
    </div>);
}
