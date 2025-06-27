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
import { useRef, useState } from 'react';
import { GenericImportService } from '../../services/GenericImportService';
import { TemplateInfoCard } from '../TemplateInfoCard';
import { ExampleDownloadButton } from '../ExampleDownloadButton';
export function FileUploadStep(_a) {
    var _this = this;
    var onFileUpload = _a.onFileUpload, isLoading = _a.isLoading, selectedModel = _a.selectedModel;
    var fileInputRef = useRef(null);
    var _b = useState(false), dragActive = _b[0], setDragActive = _b[1];
    var _c = useState(null), selectedFile = _c[0], setSelectedFile = _c[1];
    var _d = useState([]), validationErrors = _d[0], setValidationErrors = _d[1];
    var handleFileSelect = function (file) {
        var validation = GenericImportService.validateFile(file);
        if (validation.isValid) {
            setSelectedFile(file);
            setValidationErrors([]);
        }
        else {
            setSelectedFile(null);
            setValidationErrors(validation.errors);
        }
    };
    var handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        }
        else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };
    var handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };
    var handleInputChange = function (e) {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
    };
    var handleUpload = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!selectedFile) return [3 /*break*/, 2];
                    return [4 /*yield*/, onFileUpload(selectedFile)];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var formatFileSize = function (bytes) {
        return GenericImportService.formatFileSize(bytes);
    };
    var detectFileFormat = function (filename) {
        var format = GenericImportService.detectFileFormat(filename);
        var formatNames = {
            csv: 'CSV',
            xlsx: 'Excel',
            json: 'JSON',
            unknown: 'Desconocido'
        };
        return formatNames[format];
    };
    return (<div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Subir Archivo de Datos
        </h3>
        <p className="text-sm text-gray-600">
          Suba un archivo CSV, XLSX o JSON con los datos para importar al modelo {selectedModel}.
        </p>
      </div>

      {/* Tarjeta de información y descarga de plantilla */}
      <TemplateInfoCard modelName={selectedModel}/>

      {/* Botón de ejemplos (solo para facturas) */}
      {selectedModel === 'invoice' && (<div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-green-800">
                💡 ¿Necesitas ayuda con el formato?
              </h4>
              <p className="text-sm text-green-700 mt-1">
                Descarga ejemplos prácticos de facturas con diferentes casos de uso
              </p>
            </div>
            <ExampleDownloadButton modelName={selectedModel}/>
          </div>
        </div>)}

      {/* Zona de arrastre */}
      <div className={"relative border-2 border-dashed rounded-lg p-6 ".concat(dragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400')} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
        <div className="text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <div className="mt-4">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {dragActive
            ? 'Suelte el archivo aquí'
            : 'Arrastre un archivo aquí o haga clic para seleccionar'}
              </span>
            </label>
            <input id="file-upload" ref={fileInputRef} name="file-upload" type="file" className="sr-only" accept=".csv,.xlsx,.xls,.json" onChange={handleInputChange} disabled={isLoading}/>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            CSV, XLSX o JSON hasta 10MB
          </p>
        </div>
      </div>

      {/* Errores de validación */}
      {validationErrors.length > 0 && (<div className="border border-red-200 rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Error en el archivo seleccionado
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {validationErrors.map(function (error, index) { return (<li key={index}>{error}</li>); })}
                </ul>
              </div>
            </div>
          </div>
        </div>)}

      {/* Información del archivo seleccionado */}
      {selectedFile && validationErrors.length === 0 && (<div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-green-800">
                Archivo válido seleccionado
              </h3>
              <div className="mt-2 space-y-1 text-sm text-green-700">
                <div className="flex justify-between">
                  <span>Nombre:</span>
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tamaño:</span>
                  <span className="font-medium">{formatFileSize(selectedFile.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Formato:</span>
                  <span className="font-medium">{detectFileFormat(selectedFile.name)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de subida */}
          <div className="mt-4">
            <button type="button" onClick={handleUpload} disabled={isLoading} className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? (<>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando archivo...
                </>) : ('Subir y Analizar Archivo')}
            </button>
          </div>
        </div>)}

      {/* Información adicional */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">
          Requisitos del archivo
        </h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• El archivo debe tener una fila de encabezados con los nombres de columnas</li>
          <li>• Los datos deben estar en formato tabular (filas y columnas)</li>
          <li>• Tamaño máximo: 10MB</li>
          <li>• Formatos soportados: CSV, XLSX, JSON</li>
          <li>• Para CSV: use UTF-8 como codificación</li>
        </ul>
      </div>
    </div>);
}
