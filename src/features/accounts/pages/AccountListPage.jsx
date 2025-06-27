import React from 'react';
import { AccountList } from '../components';
import { useNavigate } from 'react-router-dom';
export var AccountListPage = function () {
    var navigate = useNavigate();
    var handleAccountSelect = function (account) {
        navigate("/accounts/".concat(account.id));
    };
    var handleCreateAccount = function () {
        navigate('/accounts/new');
    };
    return (<>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Plan de Cuentas</h1>
          <p className="text-gray-600 mt-2">
            Gestión completa del plan de cuentas contables
          </p>
        </div>

        <AccountList onAccountSelect={handleAccountSelect} onCreateAccount={handleCreateAccount} showActions={true}/>
      </div>
    </>);
};
