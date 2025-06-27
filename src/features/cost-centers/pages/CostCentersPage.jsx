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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { CostCenterList, CostCenterForm, CostCenterDetail, CostCenterTreeComponent as CostCenterTree } from '../components';
import { useCostCenters, useCostCenterListListener } from '../hooks';
export var CostCentersPage = function () {
    var _a = useState('list'), viewMode = _a[0], setViewMode = _a[1];
    var _b = useState('view'), pageMode = _b[0], setPageMode = _b[1];
    var _c = useState(null), selectedCostCenter = _c[0], setSelectedCostCenter = _c[1];
    var deleteCostCenter = useCostCenters().deleteCostCenter; // Escuchar eventos para actualizar el selectedCostCenter si es necesario
    useCostCenterListListener(function (event) {
        if (selectedCostCenter && event.costCenterId === selectedCostCenter.id && event.costCenter) {
            setSelectedCostCenter(event.costCenter);
        }
    });
    // Helper function to convert tree item to CostCenter for compatibility
    var convertToCostCenter = function (item) {
        var _a;
        if ('movements_count' in item) {
            // It's already a CostCenter
            return item;
        }
        // It's CostCenterTree, convert to CostCenter with minimal required fields
        return __assign(__assign({}, item), { parent_name: undefined, children_count: ((_a = item.children) === null || _a === void 0 ? void 0 : _a.length) || 0, movements_count: 0, level: item.level, full_code: item.code, is_leaf: item.is_leaf, created_at: '', updated_at: '' });
    };
    var handleCreateCostCenter = function (parent) {
        setSelectedCostCenter(parent ? convertToCostCenter(parent) : null);
        setPageMode('create');
    };
    var handleViewCostCenter = function (costCenter) {
        setSelectedCostCenter(convertToCostCenter(costCenter));
        setPageMode('detail');
    };
    var handleFormSuccess = function (costCenter) {
        setSelectedCostCenter(costCenter);
        setPageMode('detail');
    };
    var handleCancel = function () {
        setSelectedCostCenter(null);
        setPageMode('view');
    };
    var handleEditFromDetail = function (costCenter) {
        setSelectedCostCenter(costCenter);
        setPageMode('edit');
    };
    var handleDeleteCostCenter = function (costCenter) { return __awaiter(void 0, void 0, void 0, function () {
        var confirmed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    confirmed = window.confirm("\u00BFEst\u00E1 seguro de que desea eliminar el centro de costo ".concat(costCenter.code, " - ").concat(costCenter.name, "?"));
                    if (!confirmed) return [3 /*break*/, 2];
                    return [4 /*yield*/, deleteCostCenter(costCenter.id)];
                case 1:
                    _a.sent();
                    handleCancel(); // Regresar a la vista principal
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var renderHeader = function () { return (<div className="mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {pageMode === 'create' && 'Nuevo Centro de Costo'}
            {pageMode === 'edit' && selectedCostCenter && "Editar ".concat(selectedCostCenter.code)}
            {pageMode === 'detail' && selectedCostCenter && "Centro de Costo ".concat(selectedCostCenter.code)}
            {pageMode === 'view' && 'Centros de Costo'}
          </h1>
          <p className="text-gray-600 mt-2">
            {pageMode === 'create' && 'Crear un nuevo centro de costo'}
            {pageMode === 'edit' && 'Modificar la información del centro de costo'}
            {pageMode === 'detail' && 'Información detallada del centro de costo'}
            {pageMode === 'view' && 'Gestión completa de centros de costo organizacionales'}
          </p>
        </div>

        {pageMode === 'view' && (<div className="flex space-x-3">
            <Button onClick={function () { return handleCreateCostCenter(); }} className="bg-blue-600 hover:bg-blue-700">
              + Nuevo Centro de Costo
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
              Centros de Costo
            </button>
          </li>
          {pageMode === 'create' && (<>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Nuevo Centro de Costo</li>
            </>)}
          {pageMode === 'edit' && selectedCostCenter && (<>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Editar {selectedCostCenter.code}</li>
            </>)}
          {pageMode === 'detail' && selectedCostCenter && (<>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Centro {selectedCostCenter.code}</li>
            </>)}
        </ol>
      </nav>
    </div>); };
    var renderContent = function () {
        switch (pageMode) {
            case 'create':
                return (<CostCenterForm onSuccess={handleFormSuccess} onCancel={handleCancel}/>);
            case 'edit':
                if (!selectedCostCenter)
                    return null;
                return (<CostCenterForm isEditMode={true} costCenterId={selectedCostCenter.id} initialData={{
                        code: selectedCostCenter.code,
                        name: selectedCostCenter.name,
                        description: selectedCostCenter.description,
                        parent_id: selectedCostCenter.parent_id,
                        is_active: selectedCostCenter.is_active
                    }} onSuccess={handleFormSuccess} onCancel={handleCancel}/>);
            case 'detail':
                if (!selectedCostCenter)
                    return null;
                return (<CostCenterDetail costCenterId={selectedCostCenter.id} onEdit={handleEditFromDetail} onClose={handleCancel} onDelete={handleDeleteCostCenter}/>);
            default:
                if (viewMode === 'tree') {
                    return (<CostCenterTree onCostCenterSelect={handleViewCostCenter} onCreateChild={handleCreateCostCenter} activeOnly={true}/>);
                }
                return (<CostCenterList onCostCenterSelect={handleViewCostCenter} onCreateCostCenter={handleCreateCostCenter}/>);
        }
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderHeader()}
      {renderContent()}
    </div>);
};
