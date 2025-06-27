import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AccountForm } from '../components';
export var AccountCreatePage = function () {
    var navigate = useNavigate();
    var handleSuccess = function (account) {
        navigate("/accounts/".concat(account.id));
    };
    var handleCancel = function () {
        navigate('/accounts');
    };
    return (<>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <button onClick={function () { return navigate('/accounts'); }} className="text-blue-600 hover:text-blue-800">
                Plan de Cuentas
              </button>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-700">
              Nueva Cuenta
            </li>
          </ol>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Nueva Cuenta</h1>
          <p className="text-gray-600 mt-2">
            Crear una nueva cuenta en el plan de cuentas
          </p>
        </div>

        <AccountForm onSuccess={handleSuccess} onCancel={handleCancel} isEditMode={false}/>
      </div>
    </>);
};
