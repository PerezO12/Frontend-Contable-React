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
import React, { useCallback, useState } from 'react';
import { Card } from '@/components/ui';
import { useDataImport } from '../hooks';
import { formatFileSize, validateFileFormat } from '../utils';
export function FileUpload(_a) {
    var _this = this;
    var onFileUploaded = _a.onFileUploaded, dataType = _a.dataType, _b = _a.validationLevel, validationLevel = _b === void 0 ? 'preview' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var _d = useState(false), dragActive = _d[0], setDragActive = _d[1];
    var _e = useState(0), uploadProgress = _e[0], setUploadProgress = _e[1];
    var _f = useDataImport(), uploadAndPreview = _f.uploadAndPreview, isLoading = _f.isLoading, errors = _f.errors;
    var allowedFormats = ['csv', 'xlsx', 'json'];
    var maxFileSize = 10 * 1024 * 1024; // 10MB
    var handleFileUpload = useCallback(function (file) { return __awaiter(_this, void 0, void 0, function () {
        var formatErrors, progressInterval_1, uploadData, previewData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formatErrors = validateFileFormat(file, allowedFormats);
                    if (formatErrors.length > 0) {
                        alert(formatErrors.map(function (e) { return e.message; }).join('\n'));
                        return [2 /*return*/];
                    }
                    if (file.size > maxFileSize) {
                        alert("El archivo es demasiado grande. Tama\u00F1o m\u00E1ximo: ".concat(formatFileSize(maxFileSize)));
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    setUploadProgress(0);
                    progressInterval_1 = setInterval(function () {
                        setUploadProgress(function (prev) {
                            if (prev >= 90) {
                                clearInterval(progressInterval_1);
                                return prev;
                            }
                            return prev + 10;
                        });
                    }, 100);
                    uploadData = {
                        file: file,
                        data_type: dataType,
                        validation_level: validationLevel,
                        preview_rows: 10,
                    };
                    console.log('Upload data:', uploadData);
                    console.log('Data type:', dataType);
                    console.log('Validation level:', validationLevel);
                    return [4 /*yield*/, uploadAndPreview(uploadData)];
                case 2:
                    previewData = _a.sent();
                    console.log('Preview data received:', previewData);
                    console.log('Preview data type:', typeof previewData);
                    console.log('Preview data keys:', previewData ? Object.keys(previewData) : 'null/undefined');
                    clearInterval(progressInterval_1);
                    setUploadProgress(100);
                    // Limpiar progreso después de un momento
                    setTimeout(function () { return setUploadProgress(0); }, 1000);
                    onFileUploaded(file, previewData);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error uploading file:', error_1);
                    // Log more detailed error information
                    if (error_1.response) {
                        console.error('Error response:', error_1.response.data);
                        console.error('Error status:', error_1.response.status);
                        console.error('Error headers:', error_1.response.headers);
                    }
                    setUploadProgress(0);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); }, [uploadAndPreview, onFileUploaded, dataType, validationLevel, allowedFormats, maxFileSize]);
    var handleDrop = useCallback(function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    }, [handleFileUpload]);
    var handleDragOver = useCallback(function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);
    var handleDragLeave = useCallback(function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);
    var handleFileInput = useCallback(function (e) {
        if (e.target.files && e.target.files[0]) {
            handleFileUpload(e.target.files[0]);
        }
    }, [handleFileUpload]);
    var getDataTypeLabel = function (type) {
        return type === 'accounts' ? 'Cuentas Contables' : 'Asientos Contables';
    };
    return (<Card className={"p-6 ".concat(className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Cargar Archivo de {getDataTypeLabel(dataType)}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Seleccione o arrastre un archivo para importar datos
        </p>
      </div>

      <div className={"\n          relative border-2 border-dashed rounded-lg p-8 text-center transition-colors\n          ".concat(dragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300', "\n          ").concat(isLoading ? 'opacity-50 pointer-events-none' : 'hover:border-gray-400', "\n        ")} onDrop={handleDrop} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
        {isLoading ? (<div className="space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600">Procesando archivo...</p>
            {uploadProgress > 0 && (<div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: "".concat(uploadProgress, "%") }}></div>
              </div>)}
          </div>) : (<>
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <p className="text-lg text-gray-600 mb-2">
              Arrastra tu archivo aquí o{' '}
              <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                selecciona un archivo
                <input type="file" className="hidden" accept=".csv,.xlsx,.xls,.json" onChange={handleFileInput}/>
              </label>
            </p>
            <p className="text-sm text-gray-500">
              Formatos soportados: {allowedFormats.map(function (f) { return f.toUpperCase(); }).join(', ')}
            </p>
            <p className="text-sm text-gray-500">
              Tamaño máximo: {formatFileSize(maxFileSize)}
            </p>
          </>)}
      </div>

      {errors.length > 0 && (<div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h4 className="text-sm font-medium text-red-800 mb-2">
            Errores de validación encontrados:
          </h4>
          <ul className="text-sm text-red-700 space-y-1">
            {errors.slice(0, 5).map(function (error, index) { return (<li key={index}>
                • Fila {error.row_number}: {error.message}
              </li>); })}
            {errors.length > 5 && (<li className="text-red-600 font-medium">
                ... y {errors.length - 5} errores más
              </li>)}
          </ul>
        </div>)}

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-medium text-blue-800 mb-2">
          💡 Consejos para una importación exitosa:
        </h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Descarga y usa las plantillas de ejemplo proporcionadas</li>
          <li>• Verifica que todos los campos obligatorios estén completos</li>
          <li>• Asegúrate de que los códigos de cuenta sean únicos</li>
          {dataType === 'journal_entries' && (<li>• Los asientos deben estar balanceados (débitos = créditos)</li>)}
        </ul>
      </div>
    </Card>);
}
