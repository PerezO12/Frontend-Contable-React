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
/**
 * Componente de barra de acciones para operaciones bulk en terceros
 * Similar al de facturas pero adaptado a terceros
 */
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { BulkDeleteModal } from './BulkDeleteModal';
import { useThirdParties } from '../hooks/useThirdParties';
import { useToast } from '@/shared/contexts/ToastContext';
import { TrashIcon, DocumentDuplicateIcon, XMarkIcon } from '@/shared/components/icons';
export function ThirdPartyBulkActionsBar(_a) {
    var _this = this;
    var selectedCount = _a.selectedCount, selectedIds = _a.selectedIds, onClearSelection = _a.onClearSelection, onOperationComplete = _a.onOperationComplete;
    var _b = useState(false), showBulkDeleteModal = _b[0], setShowBulkDeleteModal = _b[1];
    var thirdParties = useThirdParties().thirdParties;
    var showToast = useToast().showToast;
    // Solo mostrar si hay elementos seleccionados
    if (selectedCount === 0) {
        return null;
    }
    // Obtener terceros seleccionados
    var selectedThirdParties = (thirdParties || []).filter(function (tp) {
        return selectedIds.has(tp.id);
    });
    var handleBulkDelete = function () {
        setShowBulkDeleteModal(true);
    };
    var handleBulkDeleteSuccess = function (result) {
        setShowBulkDeleteModal(false);
        onClearSelection();
        // Mostrar mensaje de éxito
        var deletedCount = (result === null || result === void 0 ? void 0 : result.deleted_count) || selectedCount;
        showToast("".concat(deletedCount, " tercero").concat(deletedCount !== 1 ? 's' : '', " eliminado").concat(deletedCount !== 1 ? 's' : '', " exitosamente"), 'success');
        // Refrescar datos
        onOperationComplete();
    };
    var handleBulkExport = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // TODO: Implementar exportación masiva
            console.log('Bulk export:', Array.from(selectedIds));
            return [2 /*return*/];
        });
    }); };
    return (<>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-blue-900">
              {selectedCount} tercero{selectedCount !== 1 ? 's' : ''} seleccionado{selectedCount !== 1 ? 's' : ''}
            </span>
            <Button variant="ghost" size="sm" onClick={onClearSelection} className="text-blue-700 hover:text-blue-900">
              <XMarkIcon className="h-4 w-4 mr-1"/>
              Limpiar selección
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={handleBulkExport} className="text-gray-600 hover:text-blue-600">
              <DocumentDuplicateIcon className="h-4 w-4 mr-1"/>
              Exportar
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleBulkDelete} className="border-red-300 text-red-700 hover:bg-red-100">
              <TrashIcon className="h-4 w-4 mr-1"/>
              Eliminar
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de eliminación masiva */}
      {showBulkDeleteModal && (<BulkDeleteModal selectedThirdParties={selectedThirdParties} onClose={function () { return setShowBulkDeleteModal(false); }} onSuccess={handleBulkDeleteSuccess}/>)}
    </>);
}
