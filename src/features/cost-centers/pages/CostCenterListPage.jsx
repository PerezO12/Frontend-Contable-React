import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { CostCenterList, CostCenterTreeComponent } from '../components';
export var CostCenterListPage = function () {
    var navigate = useNavigate();
    var _a = useState('list'), viewMode = _a[0], setViewMode = _a[1];
    var handleCostCenterSelect = function (costCenter) {
        // Convert tree item to CostCenter if needed
        var costCenterId = typeof costCenter === 'object' && costCenter.id ? costCenter.id : costCenter;
        navigate("/cost-centers/".concat(costCenterId));
    };
    var handleCreateCostCenter = function (parent) {
        if (parent) {
            // Si hay un parent, navegar con query param
            navigate("/cost-centers/new?parent=".concat(parent.id));
        }
        else {
            navigate('/cost-centers/new');
        }
    };
    return (<>
      <div className="mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Centros de Costo</h1>
            <p className="text-gray-600 mt-2">
              Gestión completa de centros de costo organizacionales
            </p>
          </div>

          <div className="flex space-x-3">
            <Button variant="secondary" onClick={function () { return handleCreateCostCenter(); }}>
              Nuevo Centro de Costo
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
          </div>
        </div>
      </div>

      {viewMode === 'list' ? (<CostCenterList onCostCenterSelect={handleCostCenterSelect} onCreateCostCenter={handleCreateCostCenter}/>) : (<CostCenterTreeComponent onCostCenterSelect={handleCostCenterSelect} onCreateChild={handleCreateCostCenter} activeOnly={true}/>)}
    </>);
};
