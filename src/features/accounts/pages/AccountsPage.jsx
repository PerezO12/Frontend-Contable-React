var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { AccountListEnhanced, AccountTreeComponent as AccountTree, AccountForm, AccountDetail, CashFlowCategoryManager } from '../components';
import { ExportTestComponent } from '../components/ExportTestComponent';
export var AccountsPage = function () {
    var _a = useState('list'), viewMode = _a[0], setViewMode = _a[1];
    var _b = useState('view'), pageMode = _b[0], setPageMode = _b[1];
    var _c = useState(null), selectedAccount = _c[0], setSelectedAccount = _c[1];
    var _d = useState(null), parentAccount = _d[0], setParentAccount = _d[1];
    var _e = useState(false), showTestComponent = _e[0], setShowTestComponent = _e[1];
    // Helper function to convert tree item to Account for compatibility
    var convertToAccount = function (item) {
        if ('category' in item) {
            // It's already an Account
            return item;
        }
        // It's AccountTree, convert to Account with minimal required fields
        return __assign(__assign({}, item), { category: 'activo_corriente', requires_third_party: false, requires_cost_center: false, debit_balance: '0.00', credit_balance: '0.00', description: '', notes: '', created_by_id: '', created_at: '', updated_at: '', parent_id: undefined });
    };
    var handleCreateAccount = function (parent) {
        setParentAccount(parent ? convertToAccount(parent) : null);
        setSelectedAccount(null);
        setPageMode('create');
    };
    var handleViewAccount = function (account) {
        setSelectedAccount(convertToAccount(account));
        setPageMode('detail');
    };
    var handleEditAccount = function (account) {
        console.log('📝 Iniciando edición de cuenta:', account);
        console.log('📝 Cambiando a modo edit, accountId:', account.id);
        setSelectedAccount(account);
        setPageMode('edit');
    };
    var handleFormSuccess = function (account) {
        setSelectedAccount(account);
        setPageMode('detail');
    };
    var handleCancel = function () {
        setPageMode('view');
        setSelectedAccount(null);
        setParentAccount(null);
    };
    var renderHeader = function () { return (<div className="mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plan de Cuentas</h1>
          <p className="text-gray-600 mt-2">
            Gestión completa del plan de cuentas contables
          </p>
        </div>        {pageMode === 'view' && (<div className="flex space-x-3">
            <Button variant="ghost" onClick={function () { return setPageMode('cash-flow-manager'); }} className="flex items-center space-x-2" title="Gestor de categorías de flujo de efectivo">
              <span>💧</span>
              <span>Flujo de Efectivo</span>
            </Button>
            <Button variant="ghost" onClick={function () { return setShowTestComponent(true); }} className="flex items-center space-x-2" title="Componente de prueba para diagnóstico">
              <span>🧪</span>
              <span>Pruebas</span>
            </Button>
            <Button variant="secondary" onClick={function () { return handleCreateAccount(); }}>
              Nueva Cuenta Raíz
            </Button>
            <div className="flex rounded-md shadow-sm">
              <button onClick={function () { return setViewMode('list'); }} className={"px-4 py-2 text-sm font-medium rounded-l-md border ".concat(viewMode === 'list'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}>
                Lista
              </button>
              <button onClick={function () { return setViewMode('tree'); }} className={"px-4 py-2 text-sm font-medium rounded-r-md border-l-0 border ".concat(viewMode === 'tree'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50')}>
                Árbol
              </button>
            </div>
          </div>)}
      </div>

      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <button onClick={handleCancel} className="text-blue-600 hover:text-blue-800">
              Plan de Cuentas
            </button>
          </li>          {pageMode === 'create' && (<>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">
                {parentAccount ? "Nueva cuenta hija de ".concat(parentAccount.name) : 'Nueva cuenta raíz'}
              </li>
            </>)}
          {pageMode === 'edit' && selectedAccount && (<>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Editar {selectedAccount.name}</li>
            </>)}
          {pageMode === 'detail' && selectedAccount && (<>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">{selectedAccount.name}</li>
            </>)}
          {pageMode === 'cash-flow-manager' && (<>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">💧 Gestor de Flujo de Efectivo</li>
            </>)}
        </ol>
      </nav>    </div>); };
    var renderContent = function () {
        switch (pageMode) {
            case 'create':
                return (<AccountForm parentAccount={parentAccount || undefined} onSuccess={handleFormSuccess} onCancel={handleCancel}/>);
            case 'edit':
                if (!selectedAccount)
                    return null;
                return (<AccountForm initialData={{
                        code: selectedAccount.code,
                        name: selectedAccount.name,
                        description: selectedAccount.description,
                        account_type: selectedAccount.account_type,
                        category: selectedAccount.category,
                        cash_flow_category: selectedAccount.cash_flow_category,
                        parent_id: selectedAccount.parent_id,
                        is_active: selectedAccount.is_active,
                        allows_movements: selectedAccount.allows_movements,
                        requires_third_party: selectedAccount.requires_third_party,
                        requires_cost_center: selectedAccount.requires_cost_center,
                        notes: selectedAccount.notes
                    }} onSuccess={handleFormSuccess} onCancel={handleCancel} isEditMode={true} accountId={selectedAccount.id}/>);
            case 'detail':
                if (!selectedAccount)
                    return null;
                return (<AccountDetail accountId={selectedAccount.id} onEdit={handleEditAccount} onCreateChild={handleCreateAccount} onClose={handleCancel}/>);
            case 'cash-flow-manager':
                return (<CashFlowCategoryManager onClose={handleCancel}/>);
            default:
                return (<>            
          {viewMode === 'list' ? (<AccountListEnhanced onAccountSelect={handleViewAccount}/>) : (<AccountTree onAccountSelect={handleViewAccount} onCreateChild={handleCreateAccount} activeOnly={true}/>)}
          </>);
        }
    };
    return (<>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showTestComponent ? (<div>
            <div className="mb-6">
              <Button variant="secondary" onClick={function () { return setShowTestComponent(false); }} className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
                <span>Volver</span>
              </Button>
            </div>
            <ExportTestComponent />
          </div>) : (<>
            {renderHeader()}
            {renderContent()}
          </>)}
      </div>
    </>);
};
