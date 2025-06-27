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
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { JournalEntryDetail } from '../components';
import { useJournalEntries } from '../hooks';
import { Card } from '../../../components/ui/Card';
export var JournalEntryDetailPage = function () {
    var navigate = useNavigate();
    var id = useParams().id;
    var _a = useJournalEntries(), approveEntry = _a.approveEntry, postEntry = _a.postEntry, cancelEntry = _a.cancelEntry, reverseEntry = _a.reverseEntry, restoreEntryToDraft = _a.restoreEntryToDraft;
    var handleEdit = function (entry) {
        navigate("/journal-entries/".concat(entry.id, "/edit"));
    };
    var handleClose = function () {
        navigate('/journal-entries');
    };
    var handleApprove = function (entry) { return __awaiter(void 0, void 0, void 0, function () {
        var confirmed, success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    confirmed = window.confirm("\u00BFEst\u00E1 seguro de que desea aprobar el asiento contable ".concat(entry.number, "?"));
                    if (!confirmed) return [3 /*break*/, 2];
                    return [4 /*yield*/, approveEntry(entry.id)];
                case 1:
                    success = _a.sent();
                    if (success) {
                        // Refresh the page to show updated status
                        window.location.reload();
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handlePost = function (entry) { return __awaiter(void 0, void 0, void 0, function () {
        var confirmed, reason, success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    confirmed = window.confirm("\u00BFEst\u00E1 seguro de que desea contabilizar el asiento ".concat(entry.number, "?\n\nEsta acci\u00F3n afectar\u00E1 los saldos de las cuentas contables."));
                    if (!confirmed) return [3 /*break*/, 2];
                    reason = window.prompt("Ingrese una raz\u00F3n para la contabilizaci\u00F3n (opcional):");
                    return [4 /*yield*/, postEntry(entry.id, reason || undefined)];
                case 1:
                    success = _a.sent();
                    if (success) {
                        // Refresh the page to show updated status
                        window.location.reload();
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handleCancel = function (entry) { return __awaiter(void 0, void 0, void 0, function () {
        var reason, success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reason = window.prompt("Ingrese la raz\u00F3n para cancelar el asiento ".concat(entry.number, ":"));
                    if (!(reason !== null && reason.trim())) return [3 /*break*/, 2];
                    return [4 /*yield*/, cancelEntry(entry.id, reason.trim())];
                case 1:
                    success = _a.sent();
                    if (success) {
                        // Refresh the page to show updated status
                        window.location.reload();
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handleReverse = function (entry) { return __awaiter(void 0, void 0, void 0, function () {
        var reason, success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reason = window.prompt("Ingrese la raz\u00F3n para crear una reversi\u00F3n del asiento ".concat(entry.number, ":"));
                    if (!(reason !== null && reason.trim())) return [3 /*break*/, 2];
                    return [4 /*yield*/, reverseEntry(entry.id, reason.trim())];
                case 1:
                    success = _a.sent();
                    if (success) {
                        // Navigate back to list to see the new reversal entry
                        navigate('/journal-entries');
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handleRestore = function (entry) { return __awaiter(void 0, void 0, void 0, function () {
        var confirmed, reason, success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    confirmed = window.confirm("\u00BFEst\u00E1 seguro de que desea restaurar el asiento ".concat(entry.number, " a estado borrador?\n\nEsto permitir\u00E1 editar el asiento nuevamente."));
                    if (!confirmed) return [3 /*break*/, 2];
                    reason = window.prompt("Ingrese una raz\u00F3n para la restauraci\u00F3n a borrador (requerido):");
                    if (!reason || reason.trim() === '') {
                        alert('Debe ingresar una razón para restaurar el asiento a borrador.');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, restoreEntryToDraft(entry.id, reason)];
                case 1:
                    success = _a.sent();
                    if (success) {
                        window.location.reload();
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    if (!id) {
        return (<>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <div className="card-body text-center py-8">
              <p className="text-red-600 mb-4">ID de asiento contable no válido</p>
            </div>
          </Card>
        </div>
      </>);
    }
    return (<>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex mb-6" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <button onClick={function () { return navigate('/journal-entries'); }} className="text-blue-600 hover:text-blue-800">
                Asientos Contables
              </button>
            </li>
            <li className="text-gray-500">/</li>
            <li className="text-gray-700">Detalle</li>
          </ol>
        </nav>

        <JournalEntryDetail entryId={id} onEdit={handleEdit} onClose={handleClose} onApprove={handleApprove} onPost={handlePost} onCancel={handleCancel} onReverse={handleReverse} onRestore={handleRestore}/>
      </div>
    </>);
};
