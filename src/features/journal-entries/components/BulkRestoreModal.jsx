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
import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { Modal } from '../../../components/ui/Modal';
import { Alert } from '../../../components/ui/Alert';
import { Textarea } from '../../../components/ui/Textarea';
export var BulkRestoreModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, selectedEntryIds = _a.selectedEntryIds, onBulkRestore = _a.onBulkRestore, onSuccess = _a.onSuccess;
    var _b = useState(false), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useState(''), restoreReason = _d[0], setRestoreReason = _d[1];
    var _e = useState(false), forceReset = _e[0], setForceReset = _e[1];
    var _f = useState(false), showResults = _f[0], setShowResults = _f[1];
    var _g = useState(null), restoreResult = _g[0], setRestoreResult = _g[1];
    // Log para depurar los IDs recibidos
    console.log('BulkRestoreModal - IDs recibidos:', selectedEntryIds);
    // Resetear estado cuando se abre el modal
    useEffect(function () {
        if (isOpen) {
            setError(null);
            setRestoreReason('');
            setForceReset(false);
            setShowResults(false);
            setRestoreResult(null);
        }
    }, [isOpen]);
    // Manejar la restauración masiva
    var handleRestore = function () { return __awaiter(void 0, void 0, void 0, function () {
        var cleanedIds, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!restoreReason.trim()) {
                        setError('La razón de restauración es requerida');
                        return [2 /*return*/];
                    }
                    // Verificar si hay IDs seleccionados
                    if (!selectedEntryIds || selectedEntryIds.length === 0) {
                        setError('No hay asientos seleccionados para restaurar');
                        return [2 /*return*/];
                    }
                    console.log('BulkRestoreModal - Iniciando restauración para IDs:', selectedEntryIds);
                    setLoading(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    cleanedIds = selectedEntryIds.filter(function (id) { return typeof id === 'string' && id.trim() !== ''; });
                    if (cleanedIds.length === 0) {
                        throw new Error('No hay IDs válidos para restaurar');
                    }
                    if (cleanedIds.length !== selectedEntryIds.length) {
                        console.warn("Se filtraron ".concat(selectedEntryIds.length - cleanedIds.length, " IDs inv\u00E1lidos"));
                    }
                    return [4 /*yield*/, onBulkRestore(cleanedIds, restoreReason.trim(), forceReset)];
                case 2:
                    result = _a.sent();
                    console.log('BulkRestoreModal - Resultado de la restauración:', result);
                    setRestoreResult(result);
                    setShowResults(true);
                    if (onSuccess) {
                        onSuccess(result);
                    }
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    console.error('Error al restaurar asientos:', err_1);
                    setError(err_1 instanceof Error ? err_1.message : 'Error al restaurar asientos');
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Renderizar contenido del modal según el estado actual
    var renderContent = function () {
        if (loading) {
            return (<div className="flex flex-col items-center justify-center p-6">
          <Spinner size="md"/>
          <p className="mt-4 text-gray-600">Restaurando asientos contables...</p>
        </div>);
        }
        if (showResults) {
            return renderResults();
        }
        return renderForm();
    };
    // Renderizar formulario de restauración
    var renderForm = function () {
        return (<div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Restaurar {selectedEntryIds.length} asiento(s) a borrador</h2>
        
        <p className="mb-4 text-gray-600">
          Esta acción restaurará el estado de los asientos seleccionados a "Borrador", 
          permitiendo su edición y modificación. Los asientos volverán a requerir aprobación.
        </p>
        
        {error && (<Alert variant="error" className="mb-4">
            {error}
          </Alert>)}
        
        <div className="mb-4">
          <label htmlFor="restore-reason" className="block mb-2 font-medium text-gray-700">
            Razón de la restauración <span className="text-red-500">*</span>
          </label>
          <Textarea id="restore-reason" value={restoreReason} onChange={function (e) { return setRestoreReason(e.target.value); }} placeholder="Ingrese la razón para restaurar estos asientos a borrador..." className="w-full" rows={3}/>          <p className="mt-1 text-sm text-gray-500">
            Esta información quedará registrada en el historial de cambios.
          </p>
        </div>
        
        {/* Checkbox para forzar el reset */}
        <div className="mb-6">
          <label className="flex items-start space-x-3">
            <input type="checkbox" checked={forceReset} onChange={function (e) { return setForceReset(e.target.checked); }} className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"/>
            <div className="flex-1">
              <span className="text-sm font-medium text-gray-700">
                Forzar restauración
              </span>
              <p className="text-xs text-gray-500 mt-1">
                Activa esta opción para forzar la restauración de asientos que normalmente no pueden ser restaurados a borrador. 
                <span className="text-yellow-600 font-medium"> Usar con precaución.</span>
              </p>
            </div>
          </label>
        </div>
        
        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleRestore} disabled={!restoreReason.trim() || loading}>
            Restaurar a borrador
          </Button>
        </div>
      </div>);
    };
    // Renderizar resultados de la restauración
    var renderResults = function () {
        if (!restoreResult)
            return null;
        var total_requested = restoreResult.total_requested, total_restored = restoreResult.total_restored, total_failed = restoreResult.total_failed, failed_entries = restoreResult.failed_entries;
        return (<div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Resultados de la restauración</h2>
        
        <div className="p-4 rounded-md bg-gray-50 mb-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-500">Solicitados</p>
              <p className="text-xl font-semibold">{total_requested}</p>
            </div>
            <div>
              <p className="text-green-500">Restaurados</p>
              <p className="text-xl font-semibold text-green-600">{total_restored}</p>
            </div>
            <div>
              <p className="text-red-500">Fallidos</p>
              <p className="text-xl font-semibold text-red-600">{total_failed}</p>
            </div>
          </div>
        </div>
        
        {failed_entries.length > 0 && (<div className="mb-4">
            <h3 className="font-medium mb-2">Asientos que no pudieron restaurarse:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {failed_entries.map(function (entry) { return (<li key={entry.id} className="text-red-600">
                  {entry.id}: {entry.error}
                </li>); })}
            </ul>
          </div>)}
        
        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>);
    };
    return (<Modal isOpen={isOpen} onClose={onClose} size="lg">
      {renderContent()}
    </Modal>);
};
