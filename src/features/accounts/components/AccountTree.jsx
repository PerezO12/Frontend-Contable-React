import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useAccountTree } from '../hooks';
import { formatCurrency } from '../../../shared/utils';
import { AccountType, ACCOUNT_TYPE_LABELS } from '../types';
var TreeNode = function (_a) {
    var account = _a.account, level = _a.level, onAccountSelect = _a.onAccountSelect, onCreateChild = _a.onCreateChild, expanded = _a.expanded, onToggleExpand = _a.onToggleExpand;
    var hasChildren = account.children && account.children.length > 0;
    var isExpanded = expanded.has(account.id);
    var indentLevel = level * 20;
    var getAccountTypeColor = function (accountType) {
        var _a;
        var colors = (_a = {},
            _a[AccountType.ACTIVO] = 'text-green-600',
            _a[AccountType.PASIVO] = 'text-red-600',
            _a[AccountType.PATRIMONIO] = 'text-blue-600',
            _a[AccountType.INGRESO] = 'text-purple-600',
            _a[AccountType.GASTO] = 'text-orange-600',
            _a[AccountType.COSTOS] = 'text-yellow-600',
            _a);
        return colors[accountType] || 'text-gray-600';
    };
    return (<div>
      <div className={"\n          flex items-center py-2 px-3 hover:bg-gray-50 border-l-2 transition-colors\n          ".concat(onAccountSelect ? 'cursor-pointer' : '', "\n          ").concat(getAccountTypeColor(account.account_type), " border-current\n        ")} style={{ paddingLeft: "".concat(indentLevel + 12, "px") }} onClick={function () { return onAccountSelect === null || onAccountSelect === void 0 ? void 0 : onAccountSelect(account); }}>
        {/* Expand/Collapse button */}
        <div className="w-6 flex justify-center">
          {hasChildren ? (<button onClick={function (e) {
                e.stopPropagation();
                onToggleExpand(account.id);
            }} className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700">
              {isExpanded ? (<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>) : (<svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                </svg>)}
            </button>) : (<div className="w-4 h-4 flex items-center justify-center">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>)}
        </div>

        {/* Account info */}
        <div className="flex-1 flex items-center justify-between min-w-0 ml-2">
          <div className="flex items-center space-x-3 min-w-0">
            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">
              {account.code}
            </code>
            <span className="font-medium text-gray-900 truncate">
              {account.name}
            </span>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              Nivel {account.level}
            </span>
            {!account.is_active && (<span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                Inactiva
              </span>)}
            {!account.allows_movements && (<span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                No permite mov.
              </span>)}
          </div>

          <div className="flex items-center space-x-3">
            <span className={"text-sm font-mono ".concat(parseFloat(account.balance) >= 0 ? 'text-green-600' : 'text-red-600')}>
              {formatCurrency(parseFloat(account.balance))}
            </span>
            
            {onCreateChild && account.allows_movements && (<Button size="sm" variant="secondary" onClick={function (e) {
                e.stopPropagation();
                onCreateChild(account);
            }} className="opacity-0 group-hover:opacity-100 transition-opacity">
                + Hija
              </Button>)}
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (<div>
          {account.children.map(function (child) { return (<TreeNode key={child.id} account={child} level={level + 1} onAccountSelect={onAccountSelect} onCreateChild={onCreateChild} expanded={expanded} onToggleExpand={onToggleExpand}/>); })}
        </div>)}
    </div>);
};
export var AccountTree = function (_a) {
    var onAccountSelect = _a.onAccountSelect, onCreateChild = _a.onCreateChild, selectedAccountType = _a.selectedAccountType, _b = _a.activeOnly, activeOnly = _b === void 0 ? true : _b;
    var _c = useState(new Set()), expanded = _c[0], setExpanded = _c[1];
    var _d = useAccountTree(selectedAccountType, activeOnly), accountTree = _d.accountTree, loading = _d.loading, error = _d.error, refetch = _d.refetch;
    var handleToggleExpand = function (accountId) {
        setExpanded(function (prev) {
            var newExpanded = new Set(prev);
            if (newExpanded.has(accountId)) {
                newExpanded.delete(accountId);
            }
            else {
                newExpanded.add(accountId);
            }
            return newExpanded;
        });
    };
    var expandAll = function () {
        var getAllAccountIds = function (accounts) {
            return accounts.reduce(function (ids, account) {
                ids.push(account.id);
                if (account.children) {
                    ids.push.apply(ids, getAllAccountIds(account.children));
                }
                return ids;
            }, []);
        };
        setExpanded(new Set(getAllAccountIds(accountTree)));
    };
    var collapseAll = function () {
        setExpanded(new Set());
    };
    if (error) {
        return (<Card>
        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">Error al cargar el árbol de cuentas: {error}</p>
          <Button onClick={function () { return refetch(); }}>
            Reintentar
          </Button>
        </div>
      </Card>);
    }
    return (<Card>
      <div className="card-header">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="card-title">Plan de Cuentas - Vista Jerárquica</h3>
            {selectedAccountType && (<p className="text-sm text-gray-600 mt-1">
                Mostrando: {ACCOUNT_TYPE_LABELS[selectedAccountType]}
              </p>)}
          </div>
          
          <div className="flex space-x-2">
            <Button size="sm" variant="secondary" onClick={expandAll} disabled={loading}>
              Expandir Todo
            </Button>
            <Button size="sm" variant="secondary" onClick={collapseAll} disabled={loading}>
              Contraer Todo
            </Button>
            <Button size="sm" variant="secondary" onClick={function () { return refetch(); }} disabled={loading}>
              Actualizar
            </Button>
          </div>
        </div>
      </div>

      <div className="card-body">
        {loading ? (<div className="text-center py-8">
            <Spinner size="lg"/>
            <p className="text-gray-600 mt-2">Cargando árbol de cuentas...</p>
          </div>) : accountTree.length === 0 ? (<div className="text-center py-8">
            <p className="text-gray-500">
              No se encontraron cuentas
              {selectedAccountType && " del tipo ".concat(ACCOUNT_TYPE_LABELS[selectedAccountType])}
            </p>
          </div>) : (<div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
            <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
              <div className="flex justify-between text-sm font-medium text-gray-700">
                <span>Cuenta</span>
                <span>Saldo</span>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {accountTree.map(function (account) { return (<div key={account.id} className="group">
                  <TreeNode account={account} level={0} onAccountSelect={onAccountSelect} onCreateChild={onCreateChild} expanded={expanded} onToggleExpand={handleToggleExpand}/>
                </div>); })}
            </div>
          </div>)}

        {/* Leyenda */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Leyenda</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
            {Object.entries(ACCOUNT_TYPE_LABELS).map(function (_a) {
            var type = _a[0], label = _a[1];
            return (<div key={type} className="flex items-center space-x-2">
                <div className={"w-3 h-0.5 ".concat(type === AccountType.ACTIVO ? 'bg-green-600' :
                    type === AccountType.PASIVO ? 'bg-red-600' :
                        type === AccountType.PATRIMONIO ? 'bg-blue-600' :
                            type === AccountType.INGRESO ? 'bg-purple-600' :
                                type === AccountType.GASTO ? 'bg-orange-600' :
                                    'bg-yellow-600')}></div>
                <span className="text-gray-600">{label}</span>
              </div>);
        })}
          </div>
        </div>
      </div>
    </Card>);
};
