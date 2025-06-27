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
 * Componente para mostrar información del asiento contable relacionado con una factura
 * Similar al que se usa en journal entries pero adaptado para facturas
 */
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CheckCircleIcon } from '@/shared/components/icons';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
import { apiClient } from '@/shared/api/client';
export var InvoiceJournalEntryInfo = function (_a) {
    var journalEntryId = _a.journalEntryId, _invoiceAmount = _a.invoiceAmount, invoiceType = _a.invoiceType, _thirdPartyName = _a.thirdPartyName;
    var navigate = useNavigate();
    var _b = useState(null), journalEntry = _b[0], setJournalEntry = _b[1];
    var _c = useState(true), loading = _c[0], setLoading = _c[1];
    var _d = useState(null), error = _d[0], setError = _d[1];
    useEffect(function () {
        var fetchJournalEntry = function () { return __awaiter(void 0, void 0, void 0, function () {
            var response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        setLoading(true);
                        setError(null);
                        return [4 /*yield*/, apiClient.get("/api/v1/journal-entries/".concat(journalEntryId))];
                    case 1:
                        response = _a.sent();
                        setJournalEntry(response.data);
                        return [3 /*break*/, 4];
                    case 2:
                        err_1 = _a.sent();
                        setError(err_1 instanceof Error ? err_1.message : 'Error al cargar asiento contable');
                        return [3 /*break*/, 4];
                    case 3:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        fetchJournalEntry();
    }, [journalEntryId]);
    if (loading) {
        return (<div className="flex items-center justify-center py-8">
        <LoadingSpinner size="md"/>
        <span className="ml-2 text-gray-600">Cargando asiento contable...</span>
      </div>);
    }
    if (error || !journalEntry) {
        return (<div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800 text-sm">
          {error || 'No se pudo cargar el asiento contable'}
        </p>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Estado del asiento */}
      <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg">
        <CheckCircleIcon className="h-5 w-5 text-green-600"/>
        <div>
          <p className="text-sm font-medium text-green-900">Factura Contabilizada</p>
          <p className="text-xs text-green-700">
            Asiento #{journalEntry.number} generado automáticamente
          </p>
        </div>
      </div>

      {/* Información del asiento */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Asiento Contable</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Número</label>
            <p className="text-gray-900 font-mono">{journalEntry.number}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Fecha</label>
            <p className="text-gray-900">{formatDate(journalEntry.entry_date)}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Estado</label>
            <p className="text-gray-900">{journalEntry.status}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Tipo</label>
            <p className="text-gray-900">{journalEntry.entry_type}</p>
          </div>
        </div>
        <div className="mt-4">
          <label className="text-sm font-medium text-gray-500">Descripción</label>
          <p className="text-gray-900">{journalEntry.description}</p>
        </div>
      </div>

      {/* Resumen contable */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Impacto Contable</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Débito:</span>
              <span className="font-mono text-green-700">
                {formatCurrency(parseFloat(journalEntry.total_debit))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Crédito:</span>
              <span className="font-mono text-blue-700">
                {formatCurrency(parseFloat(journalEntry.total_credit))}
              </span>
            </div>
            <div className="flex justify-between text-sm font-medium border-t pt-2">
              <span>Balance:</span>
              <span className="font-mono text-gray-900">
                {formatCurrency(parseFloat(journalEntry.total_debit) - parseFloat(journalEntry.total_credit))}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white border rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Cuentas Afectadas</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>• Cuenta por {invoiceType === 'customer_invoice' ? 'Cobrar' : 'Pagar'}</p>
            <p>• Cuenta de {invoiceType === 'customer_invoice' ? 'Ventas' : 'Compras'}</p>
            <p>• Cuentas de Impuestos</p>
            <p className="text-xs text-gray-500 mt-2">
              {journalEntry.lines.length} línea(s) contable(s)
            </p>
          </div>
        </div>
      </div>

      {/* Líneas del asiento (resumen) */}
      <Card className="p-0">
        <div className="px-4 py-3 border-b">
          <h4 className="font-medium text-gray-900">Líneas del Asiento Contable</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cuenta</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Débito</th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Crédito</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tercero</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {journalEntry.lines
            .sort(function (a, b) { return a.line_number - b.line_number; })
            .map(function (line) { return (<tr key={line.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-600">{line.line_number}</td>
                  <td className="px-4 py-2">
                    <div>
                      <p className="text-sm font-mono text-gray-900">{line.account_code}</p>
                      <p className="text-xs text-gray-600">{line.account_name}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">{line.description}</td>
                  <td className="px-4 py-2 text-right">
                    <span className={"text-sm font-mono ".concat(parseFloat(line.debit_amount) > 0 ? 'text-green-700 font-semibold' : 'text-gray-400')}>
                      {parseFloat(line.debit_amount) > 0
                ? formatCurrency(parseFloat(line.debit_amount))
                : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <span className={"text-sm font-mono ".concat(parseFloat(line.credit_amount) > 0 ? 'text-blue-700 font-semibold' : 'text-gray-400')}>
                      {parseFloat(line.credit_amount) > 0
                ? formatCurrency(parseFloat(line.credit_amount))
                : '-'}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {line.third_party_name && (<div>
                        <p className="text-sm text-gray-900">{line.third_party_code}</p>
                        <p className="text-xs text-gray-600">{line.third_party_name}</p>
                      </div>)}
                  </td>
                </tr>); })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Botón para ver asiento completo */}
      <div className="flex justify-center">        <Button onClick={function () { return navigate("/journal-entries/".concat(journalEntryId)); }} className="flex items-center gap-2">
          Ver Asiento Contable Completo
        </Button>
      </div>
    </div>);
};
