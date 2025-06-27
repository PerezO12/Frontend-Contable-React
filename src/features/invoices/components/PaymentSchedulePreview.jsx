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
 * Componente para mostrar la vista previa de payment schedule
 * Implementa el flujo Odoo de múltiples vencimientos
 */
import { useState, useEffect } from 'react';
import { InvoiceAPI } from '../api/invoiceAPI';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { DocumentTextIcon } from '@/shared/components/icons';
import { formatCurrency, formatDate } from '@/shared/utils/formatters';
export function PaymentSchedulePreview(_a) {
    var _this = this;
    var invoiceId = _a.invoiceId, invoiceAmount = _a.invoiceAmount, paymentTermsId = _a.paymentTermsId, _invoiceDate = _a.invoiceDate, // Marked as unused with underscore prefix
    onRefresh = _a.onRefresh, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useState([]), schedule = _c[0], setSchedule = _c[1];
    var _d = useState(false), loading = _d[0], setLoading = _d[1];
    var _e = useState(null), error = _e[0], setError = _e[1];
    useEffect(function () {
        if (invoiceId) {
            loadPaymentSchedule();
        }
    }, [invoiceId, paymentTermsId]);
    var loadPaymentSchedule = function () { return __awaiter(_this, void 0, void 0, function () {
        var data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!invoiceId)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    setLoading(true);
                    setError(null);
                    return [4 /*yield*/, InvoiceAPI.getPaymentSchedulePreview(invoiceId)];
                case 2:
                    data = _a.sent();
                    setSchedule(data);
                    return [3 /*break*/, 5];
                case 3:
                    err_1 = _a.sent();
                    setError(err_1.message || 'Error al cargar la vista previa de pagos');
                    setSchedule([]);
                    return [3 /*break*/, 5];
                case 4:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleRefresh = function () {
        loadPaymentSchedule();
        onRefresh === null || onRefresh === void 0 ? void 0 : onRefresh();
    };
    var totalAmount = schedule.reduce(function (sum, item) { return sum + item.amount; }, 0);
    if (!invoiceId && !paymentTermsId) {
        return (<Card className={"p-4 ".concat(className)}>        <div className="text-center text-gray-500">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-2 text-gray-300"/>
          <p>Selecciona condiciones de pago para ver la vista previa</p>
        </div>
      </Card>);
    }
    return (<Card className={"p-4 ".concat(className)}>
      <div className="flex items-center justify-between mb-4">        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          📅 Vista Previa de Vencimientos
        </h3>
        <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading}>
          {loading ? <LoadingSpinner size="sm"/> : 'Actualizar'}
        </Button>
      </div>

      {loading && schedule.length === 0 ? (<div className="text-center py-8">
          <LoadingSpinner size="lg"/>
          <p className="mt-2 text-gray-500">Calculando vencimientos...</p>
        </div>) : error ? (<div className="text-center py-8">
          <div className="text-red-600 mb-2">
            ⚠️ Error al cargar vencimientos
          </div>
          <p className="text-gray-500 text-sm">{error}</p>
          <Button variant="outline" size="sm" onClick={handleRefresh} className="mt-2">
            Reintentar
          </Button>
        </div>) : schedule.length === 0 ? (<div className="text-center py-8 text-gray-500">
          <DocumentTextIcon className="h-12 w-12 mx-auto mb-2 text-gray-300"/>
          <p>No hay vencimientos configurados</p>
        </div>) : (<div className="space-y-3">
          {/* Resumen */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-blue-900">
                Total: {schedule.length} vencimiento{schedule.length !== 1 ? 's' : ''}
              </span>
              <span className="text-lg font-bold text-blue-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>

          {/* Lista de vencimientos */}
          <div className="space-y-2">
            {schedule.map(function (item) { return (<div key={item.sequence} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                      {item.sequence}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {item.percentage}% del total
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {formatCurrency(item.amount)}
                    </div>                    <div className="text-sm text-gray-500 flex items-center">
                      📅 {formatDate(item.due_date)}
                    </div>
                  </div>
                </div>
              </div>); })}
          </div>

          {/* Validación de totales */}
          {invoiceAmount && Math.abs(totalAmount - invoiceAmount) > 0.01 && (<div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
              <div className="flex items-center">
                <span className="text-yellow-600">⚠️</span>
                <div className="ml-2 text-sm">
                  <p className="font-medium text-yellow-800">
                    Advertencia: Los vencimientos no coinciden con el total
                  </p>
                  <p className="text-yellow-700">
                    Total factura: {formatCurrency(invoiceAmount)} | 
                    Total vencimientos: {formatCurrency(totalAmount)}
                  </p>
                </div>
              </div>
            </div>)}
        </div>)}
    </Card>);
}
