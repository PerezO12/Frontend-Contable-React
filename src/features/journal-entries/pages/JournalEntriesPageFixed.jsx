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
import { JournalEntryList, JournalEntryForm, JournalEntryDetail } from '../components';
import { useJournalEntries } from '../hooks';
import { useJournalEntryListListener } from '../hooks/useJournalEntryEvents';
export var JournalEntriesPage = function () {
    var _a = useState('view'), pageMode = _a[0], setPageMode = _a[1];
    var _b = useState(null), selectedEntry = _b[0], setSelectedEntry = _b[1];
    var _c = useJournalEntries(), approveEntry = _c.approveEntry, postEntry = _c.postEntry, cancelEntry = _c.cancelEntry, reverseEntry = _c.reverseEntry;
    // Escuchar eventos para actualizar el selectedEntry si es necesario
    useJournalEntryListListener(function (event) {
        if (selectedEntry && event.entryId === selectedEntry.id && event.entry) {
            // Actualizar el asiento seleccionado con los nuevos datos
            setSelectedEntry(event.entry);
        }
    });
    var handleCreateEntry = function () {
        setSelectedEntry(null);
        setPageMode('create');
    };
    var handleEditEntry = function (entry) {
        setSelectedEntry(entry);
        setPageMode('edit');
    };
    var handleViewEntry = function (entry) {
        setSelectedEntry(entry);
        setPageMode('detail');
    };
    var handleFormSuccess = function (entry) {
        setSelectedEntry(entry);
        setPageMode('detail');
    };
    var handleCancel = function () {
        setPageMode('view');
        setSelectedEntry(null);
    };
    var handleApproveEntry = function (entry) { return __awaiter(void 0, void 0, void 0, function () {
        var confirmed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    confirmed = window.confirm("\u00BFEst\u00E1 seguro de que desea aprobar el asiento contable ".concat(entry.number, "?"));
                    if (!confirmed) return [3 /*break*/, 2];
                    return [4 /*yield*/, approveEntry(entry.id)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handlePostEntry = function (entry) { return __awaiter(void 0, void 0, void 0, function () {
        var confirmed;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    confirmed = window.confirm("\u00BFEst\u00E1 seguro de que desea contabilizar el asiento ".concat(entry.number, "?\n\nEsta acci\u00F3n afectar\u00E1 los saldos de las cuentas contables."));
                    if (!confirmed) return [3 /*break*/, 2];
                    return [4 /*yield*/, postEntry(entry.id)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handleCancelEntry = function (entry) { return __awaiter(void 0, void 0, void 0, function () {
        var reason;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    reason = window.prompt("Ingrese la raz\u00F3n para cancelar el asiento ".concat(entry.number, ":"));
                    if (!(reason !== null && reason.trim())) return [3 /*break*/, 2];
                    return [4 /*yield*/, cancelEntry(entry.id, reason.trim())];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var handleReverseEntry = function (entry) { return __awaiter(void 0, void 0, void 0, function () {
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
                        // Go back to view mode to see the new reversal entry
                        setPageMode('view');
                        setSelectedEntry(null);
                    }
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var renderHeader = function () { return (<div className="mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Asientos Contables</h1>
          <p className="text-gray-600 mt-2">
            Gestión completa de asientos contables y partida doble
          </p>
        </div>

        {pageMode === 'view' && (<Button onClick={handleCreateEntry} className="bg-blue-600 hover:bg-blue-700">
            + Nuevo Asiento
          </Button>)}
      </div>

      {/* Breadcrumb */}
      <nav className="flex" aria-label="Breadcrumb">
        <ol className="flex items-center space-x-2">
          <li>
            <button onClick={handleCancel} className="text-blue-600 hover:text-blue-800">
              Asientos Contables
            </button>
          </li>
          {pageMode === 'create' && (<>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Nuevo Asiento</li>
            </>)}
          {pageMode === 'edit' && selectedEntry && (<>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Editar {selectedEntry.number}</li>
            </>)}
          {pageMode === 'detail' && selectedEntry && (<>
              <li className="text-gray-500">/</li>
              <li className="text-gray-700">Asiento {selectedEntry.number}</li>
            </>)}
        </ol>
      </nav>
    </div>); };
    var renderContent = function () {
        switch (pageMode) {
            case 'create':
                return (<JournalEntryForm onSuccess={handleFormSuccess} onCancel={handleCancel}/>);
            case 'edit':
                if (!selectedEntry)
                    return null;
                return (<JournalEntryForm isEditMode={true} entryId={selectedEntry.id} initialData={{
                        reference: selectedEntry.reference,
                        description: selectedEntry.description,
                        entry_type: selectedEntry.entry_type,
                        entry_date: selectedEntry.entry_date,
                        notes: selectedEntry.notes,
                        external_reference: selectedEntry.external_reference,
                        lines: selectedEntry.lines.map(function (line) { return ({
                            account_id: line.account_id,
                            account_code: line.account_code,
                            account_name: line.account_name,
                            debit_amount: line.debit_amount,
                            credit_amount: line.credit_amount,
                            description: line.description,
                            reference: line.reference,
                            third_party_id: line.third_party_id,
                            cost_center_id: line.cost_center_id
                        }); })
                    }} onSuccess={handleFormSuccess} onCancel={handleCancel}/>);
            case 'detail':
                if (!selectedEntry)
                    return null;
                return (<JournalEntryDetail entryId={selectedEntry.id} onEdit={handleEditEntry} onClose={handleCancel} onApprove={handleApproveEntry} onPost={handlePostEntry} onCancel={handleCancelEntry} onReverse={handleReverseEntry}/>);
            default:
                return (<JournalEntryList onEntrySelect={handleViewEntry} onCreateEntry={handleCreateEntry}/>);
        }
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {renderHeader()}
      {renderContent()}
    </div>);
};
