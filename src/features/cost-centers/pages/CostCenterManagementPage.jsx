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
import { CostCenterList, CostCenterDetail, CostCenterForm, CostCenterMovements, CostCenterAnalysisComponent } from '../components';
import { useCostCenters } from '../hooks';
export var CostCenterManagementPage = function () {
    var _a = useState('list'), currentView = _a[0], setCurrentView = _a[1];
    var _b = useState(null), selectedCostCenter = _b[0], setSelectedCostCenter = _b[1];
    var _c = useCostCenters(), createCostCenter = _c.createCostCenter, updateCostCenter = _c.updateCostCenter, refetch = _c.refetch;
    var handleCostCenterSelect = function (costCenter) {
        setSelectedCostCenter(costCenter);
        setCurrentView('detail');
    };
    var handleCreateCostCenter = function () {
        setSelectedCostCenter(null);
        setCurrentView('create');
    };
    var handleEditCostCenter = function (costCenter) {
        setSelectedCostCenter(costCenter);
        setCurrentView('edit');
    };
    var handleViewMovements = function (costCenter) {
        setSelectedCostCenter(costCenter);
        setCurrentView('movements');
    };
    var handleViewAnalysis = function (costCenter) {
        setSelectedCostCenter(costCenter);
        setCurrentView('analysis');
    };
    var handleFormSubmit = function (data) { return __awaiter(void 0, void 0, void 0, function () {
        var result, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    if (!(currentView === 'create')) return [3 /*break*/, 2];
                    return [4 /*yield*/, createCostCenter(data)];
                case 1:
                    result = _a.sent();
                    if (result) {
                        setCurrentView('list');
                        refetch();
                    }
                    return [3 /*break*/, 4];
                case 2:
                    if (!(currentView === 'edit' && selectedCostCenter)) return [3 /*break*/, 4];
                    return [4 /*yield*/, updateCostCenter(selectedCostCenter.id, data)];
                case 3:
                    result = _a.sent();
                    if (result) {
                        setSelectedCostCenter(result);
                        setCurrentView('detail');
                        refetch();
                    }
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_1 = _a.sent();
                    console.error('Error in form submission:', error_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleBackToList = function () {
        setSelectedCostCenter(null);
        setCurrentView('list');
    };
    var renderCurrentView = function () {
        switch (currentView) {
            case 'list':
                return (<CostCenterList onCostCenterSelect={handleCostCenterSelect} onCreateCostCenter={handleCreateCostCenter} showActions={true}/>);
            case 'detail':
                return selectedCostCenter ? (<div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button onClick={handleBackToList} className="text-blue-600 hover:text-blue-700 font-medium">
                ← Volver a la lista
              </button>
            </div>            <CostCenterDetail costCenterId={selectedCostCenter.id} onEdit={handleEditCostCenter} onViewMovements={handleViewMovements} onViewAnalysis={handleViewAnalysis}/>
          </div>) : null;
            case 'create':
                return (<div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button onClick={handleBackToList} className="text-blue-600 hover:text-blue-700 font-medium">
                ← Volver a la lista
              </button>
            </div>            <CostCenterForm onSuccess={function (costCenter) {
                        handleFormSubmit(costCenter);
                    }} onCancel={handleBackToList}/>
          </div>);
            case 'edit':
                return selectedCostCenter ? (<div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button onClick={function () { return setCurrentView('detail'); }} className="text-blue-600 hover:text-blue-700 font-medium">
                ← Volver al detalle
              </button>
            </div>            <CostCenterForm costCenterId={selectedCostCenter.id} isEditMode={true} onSuccess={function (costCenter) {
                        handleFormSubmit(costCenter);
                        setCurrentView('detail');
                    }} onCancel={function () { return setCurrentView('detail'); }}/>
          </div>) : null;
            case 'movements':
                return selectedCostCenter ? (<div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button onClick={function () { return setCurrentView('detail'); }} className="text-blue-600 hover:text-blue-700 font-medium">
                ← Volver al detalle
              </button>
            </div>
            <CostCenterMovements costCenter={selectedCostCenter} onClose={function () { return setCurrentView('detail'); }}/>
          </div>) : null;
            case 'analysis':
                return selectedCostCenter ? (<div className="space-y-6">
            <div className="flex items-center space-x-4">
              <button onClick={function () { return setCurrentView('detail'); }} className="text-blue-600 hover:text-blue-700 font-medium">
                ← Volver al detalle
              </button>
            </div>            <CostCenterAnalysisComponent costCenter={selectedCostCenter} onClose={function () { return setCurrentView('detail'); }}/>
          </div>) : null;
            default:
                return null;
        }
    };
    return (<div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Centros de Costo</h1>
        <p className="text-gray-600 mt-2">
          Administra y analiza los centros de costo de tu organización
        </p>
      </div>

      {renderCurrentView()}
    </div>);
};
