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
import React, { useState, useCallback } from 'react';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { useCostCenterExport } from '../hooks';
export var SimpleCostCenterExportControls = function (_a) {
    var selectedCostCenterIds = _a.selectedCostCenterIds, costCenterCount = _a.costCenterCount, onExportStart = _a.onExportStart, onExportEnd = _a.onExportEnd;
    var _b = useState('xlsx'), exportFormat = _b[0], setExportFormat = _b[1];
    var _c = useCostCenterExport(), exportCostCenters = _c.exportCostCenters, isExporting = _c.isExporting;
    var handleExport = useCallback(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (selectedCostCenterIds.length === 0)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, , 3, 4]);
                    onExportStart === null || onExportStart === void 0 ? void 0 : onExportStart();
                    return [4 /*yield*/, exportCostCenters(selectedCostCenterIds, exportFormat)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    onExportEnd === null || onExportEnd === void 0 ? void 0 : onExportEnd();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [selectedCostCenterIds, exportFormat, exportCostCenters, onExportStart, onExportEnd]);
    if (selectedCostCenterIds.length === 0) {
        return null;
    }
    return (<div className="flex items-center space-x-3">
      <select value={exportFormat} onChange={function (e) { return setExportFormat(e.target.value); }} disabled={isExporting} className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent">        <option value="xlsx">Excel (.xlsx)</option>
        <option value="csv">CSV (.csv)</option>
        <option value="json">JSON (.json)</option>
      </select>
      
      <Button size="sm" onClick={handleExport} disabled={isExporting || selectedCostCenterIds.length === 0} className="flex items-center space-x-2">
        {isExporting ? (<>
            <Spinner size="sm"/>
            <span>Exportando...</span>
          </>) : (<>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"/>
            </svg>
            <span>Exportar {exportFormat.toUpperCase()}</span>
          </>)}
      </Button>
      
      {selectedCostCenterIds.length > 0 && (<span className="text-sm text-gray-600">
          ({costCenterCount} seleccionado{costCenterCount === 1 ? '' : 's'})
        </span>)}
    </div>);
};
