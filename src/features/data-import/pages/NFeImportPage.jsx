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
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/components/ui';
export function NFeImportPage() {
    var _this = this;
    var navigate = useNavigate();
    var fileInputRef = useRef(null);
    var _a = useState(false), isUploading = _a[0], setIsUploading = _a[1];
    var _b = useState(null), selectedFiles = _b[0], setSelectedFiles = _b[1];
    var _c = useState(null), importResult = _c[0], setImportResult = _c[1];
    var _d = useState(false), showConfig = _d[0], setShowConfig = _d[1];
    var _e = useState({
        batch_size: 20,
        skip_duplicates: true,
        auto_create_third_parties: true,
        auto_create_products: true,
        create_invoices: true,
        create_journal_entries: false,
        default_revenue_account: "410001",
        default_customer_account: "130001",
        default_supplier_account: "210001",
        default_sales_journal: "VEN",
        default_purchase_journal: "COM",
        currency_code: "BRL",
        time_zone: "America/Sao_Paulo"
    }), config = _e[0], setConfig = _e[1];
    var handleFileSelect = function (event) {
        var files = event.target.files;
        if (files && files.length > 0) {
            // Validar tipos de archivo
            var validFiles = Array.from(files).filter(function (file) {
                return file.name.toLowerCase().endsWith('.xml') ||
                    file.name.toLowerCase().endsWith('.zip');
            });
            if (validFiles.length !== files.length) {
                alert('Solo se permiten archivos XML y ZIP');
                return;
            }
            if (files.length > 1000) {
                alert('Máximo 1000 archivos permitidos');
                return;
            }
            setSelectedFiles(files);
            setImportResult(null);
        }
    };
    var handleImport = function () { return __awaiter(_this, void 0, void 0, function () {
        var formData_1, token, response, errorData, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedFiles || selectedFiles.length === 0) {
                        alert('Por favor selecciona archivos para importar');
                        return [2 /*return*/];
                    }
                    setIsUploading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    formData_1 = new FormData();
                    // Agregar archivos
                    Array.from(selectedFiles).forEach(function (file) {
                        formData_1.append('files', file);
                    });
                    // Agregar configuración
                    formData_1.append('config', JSON.stringify(config));
                    token = localStorage.getItem('access_token');
                    if (!token) {
                        throw new Error('No se encontró token de autenticación');
                    }
                    return [4 /*yield*/, fetch('http://localhost:8000/api/v1/nfe/bulk-import', {
                            method: 'POST',
                            headers: {
                                'Authorization': "Bearer ".concat(token)
                            },
                            body: formData_1
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.text()];
                case 3:
                    errorData = _a.sent();
                    throw new Error("Error ".concat(response.status, ": ").concat(errorData));
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    result = _a.sent();
                    setImportResult(result);
                    return [3 /*break*/, 8];
                case 6:
                    error_1 = _a.sent();
                    console.error('Error en la importación:', error_1);
                    alert("Error en la importaci\u00F3n: ".concat(error_1 instanceof Error ? error_1.message : 'Error desconocido'));
                    return [3 /*break*/, 8];
                case 7:
                    setIsUploading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var resetImport = function () {
        setSelectedFiles(null);
        setImportResult(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <button onClick={function () { return navigate('/import-export'); }} className="text-gray-600 hover:text-gray-900 transition-colors duration-200">
                Importación de Datos
              </button>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
              <span className="text-gray-900 font-medium">Importación de NFe</span>
            </nav>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={function () { return setShowConfig(!showConfig); }}>
                ⚙️ Configuración
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Importación Masiva de NFe Brasileñas
          </h1>
          <p className="text-lg text-gray-600">
            Importa hasta 1000 Notas Fiscais Eletrônicas (NFe) de una sola vez
          </p>
        </div>

        {/* Configuration Panel */}
        {showConfig && (<Card className="mb-6">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Configuración de Importación</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tamaño de lote
                  </label>
                  <input type="number" value={config.batch_size} onChange={function (e) { return setConfig(__assign(__assign({}, config), { batch_size: parseInt(e.target.value) || 20 })); }} className="w-full border border-gray-300 rounded-md px-3 py-2" min="1" max="100"/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuenta de ingresos por defecto
                  </label>
                  <input type="text" value={config.default_revenue_account} onChange={function (e) { return setConfig(__assign(__assign({}, config), { default_revenue_account: e.target.value })); }} className="w-full border border-gray-300 rounded-md px-3 py-2"/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diario de ventas por defecto
                  </label>
                  <input type="text" value={config.default_sales_journal} onChange={function (e) { return setConfig(__assign(__assign({}, config), { default_sales_journal: e.target.value })); }} className="w-full border border-gray-300 rounded-md px-3 py-2"/>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Moneda
                  </label>
                  <input type="text" value={config.currency_code} onChange={function (e) { return setConfig(__assign(__assign({}, config), { currency_code: e.target.value })); }} className="w-full border border-gray-300 rounded-md px-3 py-2"/>
                </div>
              </div>
              
              <div className="mt-4 space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" checked={config.skip_duplicates} onChange={function (e) { return setConfig(__assign(__assign({}, config), { skip_duplicates: e.target.checked })); }} className="mr-2"/>
                  Omitir duplicados
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" checked={config.auto_create_third_parties} onChange={function (e) { return setConfig(__assign(__assign({}, config), { auto_create_third_parties: e.target.checked })); }} className="mr-2"/>
                  Crear terceros automáticamente
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" checked={config.auto_create_products} onChange={function (e) { return setConfig(__assign(__assign({}, config), { auto_create_products: e.target.checked })); }} className="mr-2"/>
                  Crear productos automáticamente
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" checked={config.create_invoices} onChange={function (e) { return setConfig(__assign(__assign({}, config), { create_invoices: e.target.checked })); }} className="mr-2"/>
                  Crear facturas automáticamente
                </label>
              </div>
            </div>
          </Card>)}

        {/* Upload Section */}
        {!importResult && (<Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Seleccionar Archivos</h3>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                </svg>
                
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Arrastra archivos aquí o haz clic para seleccionar
                </h3>
                
                <p className="text-sm text-gray-500 mb-4">
                  Archivos XML individuales o ZIP con múltiples XMLs de NFe
                </p>
                
                <input ref={fileInputRef} type="file" multiple accept=".xml,.zip" onChange={handleFileSelect} className="hidden"/>
                
                <Button onClick={function () { var _a; return (_a = fileInputRef.current) === null || _a === void 0 ? void 0 : _a.click(); }} disabled={isUploading}>
                  Seleccionar Archivos
                </Button>
                
                <p className="text-xs text-gray-400 mt-2">
                  Máximo 1000 archivos | Formatos: XML, ZIP
                </p>
              </div>
              
              {selectedFiles && selectedFiles.length > 0 && (<div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {selectedFiles.length} archivo(s) seleccionado(s)
                  </p>
                  
                  <div className="bg-gray-50 rounded-md p-3 max-h-32 overflow-y-auto">
                    {Array.from(selectedFiles).slice(0, 10).map(function (file, index) { return (<div key={index} className="text-sm text-gray-700 py-1">
                        📄 {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </div>); })}
                    {selectedFiles.length > 10 && (<div className="text-sm text-gray-500 py-1">
                        ... y {selectedFiles.length - 10} archivos más
                      </div>)}
                  </div>
                  
                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={resetImport} disabled={isUploading}>
                      Limpiar
                    </Button>
                    
                    <Button onClick={handleImport} disabled={isUploading}>
                      {isUploading ? 'Procesando...' : 'Iniciar Importación'}
                    </Button>
                  </div>
                </div>)}
              
              {isUploading && (<div className="mt-4">
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
                      <span className="text-sm text-blue-700">
                        Procesando archivos NFe... Esto puede tomar varios minutos.
                      </span>
                    </div>
                  </div>
                </div>)}
            </div>
          </Card>)}

        {/* Results Section */}
        {importResult && (<Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Resultado de la Importación</h3>
                <Button variant="outline" onClick={resetImport}>
                  Nueva Importación
                </Button>
              </div>
              
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {importResult.summary.total_files}
                  </div>
                  <div className="text-sm text-blue-700">Total Archivos</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {importResult.summary.processed_successfully}
                  </div>
                  <div className="text-sm text-green-700">Procesados</div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {importResult.summary.processed_with_errors}
                  </div>
                  <div className="text-sm text-red-700">Con Errores</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {importResult.summary.success_rate.toFixed(1)}%
                  </div>
                  <div className="text-sm text-purple-700">Éxito</div>
                </div>
              </div>
              
              {/* Created Entities */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Entidades Creadas</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {importResult.created_entities.invoices}
                    </div>
                    <div className="text-sm text-gray-600">Facturas</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {importResult.created_entities.third_parties}
                    </div>
                    <div className="text-sm text-gray-600">Terceros</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">
                      {importResult.created_entities.products}
                    </div>
                    <div className="text-sm text-gray-600">Productos</div>
                  </div>
                </div>
              </div>
              
              {/* Errors */}
              {importResult.errors.length > 0 && (<div className="mb-4">
                  <h4 className="font-medium text-red-900 mb-3">
                    Errores ({importResult.errors.length})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {importResult.errors.slice(0, 10).map(function (error, index) { return (<div key={index} className="bg-red-50 border border-red-200 rounded-md p-3">
                        <div className="text-sm font-medium text-red-900">
                          {error.file_name}
                        </div>
                        <div className="text-sm text-red-700">
                          {error.error_message}
                        </div>
                      </div>); })}
                    {importResult.errors.length > 10 && (<div className="text-sm text-gray-500 text-center">
                        ... y {importResult.errors.length - 10} errores más
                      </div>)}
                  </div>
                </div>)}
              
              {/* Success Message */}
              {importResult.summary.processed_successfully > 0 && (<div className="bg-green-50 border border-green-200 rounded-md p-4">
                  <div className="flex">
                    <svg className="w-5 h-5 text-green-400 mt-0.5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <div>
                      <h3 className="text-sm font-medium text-green-800">
                        Importación completada con éxito
                      </h3>
                      <div className="text-sm text-green-700 mt-1">
                        Se procesaron {importResult.summary.processed_successfully} archivos NFe 
                        en {importResult.summary.processing_time_seconds.toFixed(2)} segundos.
                        Las facturas, terceros y productos han sido creados automáticamente.
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </Card>)}
      </div>
    </div>);
}
