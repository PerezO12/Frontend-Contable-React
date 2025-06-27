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
import { useState } from 'react';
import { Card, Button } from '@/components/ui';
export function ImportConfigurationPanel(_a) {
    var configuration = _a.configuration, onConfigurationChange = _a.onConfigurationChange, onImport = _a.onImport, canImport = _a.canImport, isLoading = _a.isLoading, _b = _a.className, className = _b === void 0 ? '' : _b;
    var _c = useState(false), showAdvanced = _c[0], setShowAdvanced = _c[1];
    var handleConfigChange = function (field, value) {
        var _a;
        onConfigurationChange(__assign(__assign({}, configuration), (_a = {}, _a[field] = value, _a)));
    };
    var getDataTypeLabel = function (type) {
        return type === 'accounts' ? 'Cuentas Contables' : 'Asientos Contables';
    };
    return (<Card className={"p-6 ".concat(className)}>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Configuración de Importación
      </h3>

      <div className="space-y-6">
        {/* Configuración básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Datos
            </label>
            <div className="relative">
              <select value={configuration.data_type} onChange={function (e) { return handleConfigChange('data_type', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled>
                <option value="accounts">Cuentas Contables</option>
                <option value="journal_entries">Asientos Contables</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nivel de Validación
            </label>
            <select value={configuration.validation_level} onChange={function (e) { return handleConfigChange('validation_level', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="strict">Estricto - Detener en cualquier error</option>
              <option value="tolerant">Tolerante - Continuar con errores no críticos</option>
              <option value="preview">Vista Previa - Solo validar</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño de Lote
            </label>
            <input type="number" min="1" max="1000" value={configuration.batch_size} onChange={function (e) { return handleConfigChange('batch_size', parseInt(e.target.value) || 100); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
            <p className="text-xs text-gray-500 mt-1">
              Número de filas a procesar por lote (1-1000)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formato
            </label>
            <div className="relative">
              <select value={configuration.format} onChange={function (e) { return handleConfigChange('format', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled>
                <option value="csv">CSV</option>
                <option value="xlsx">Excel (XLSX)</option>
                <option value="json">JSON</option>
              </select>
            </div>
          </div>
        </div>

        {/* Opciones de manejo de datos */}
        <div className="space-y-4">
          <h4 className="text-md font-medium text-gray-900">
            Opciones de Manejo de Datos
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center">
              <input type="checkbox" checked={configuration.skip_duplicates} onChange={function (e) { return handleConfigChange('skip_duplicates', e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
              <span className="ml-2 text-sm text-gray-700">
                Omitir duplicados
              </span>
            </label>

            <label className="flex items-center">
              <input type="checkbox" checked={configuration.update_existing} onChange={function (e) { return handleConfigChange('update_existing', e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
              <span className="ml-2 text-sm text-gray-700">
                Actualizar existentes
              </span>
            </label>

            <label className="flex items-center">
              <input type="checkbox" checked={configuration.continue_on_error} onChange={function (e) { return handleConfigChange('continue_on_error', e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
              <span className="ml-2 text-sm text-gray-700">
                Continuar en caso de error
              </span>
            </label>
          </div>
        </div>

        {/* Configuración avanzada */}
        <div>
          <button type="button" onClick={function () { return setShowAdvanced(!showAdvanced); }} className="flex items-center text-sm text-blue-600 hover:text-blue-700">
            <span>Configuración Avanzada</span>
            <svg className={"ml-1 h-4 w-4 transform transition-transform ".concat(showAdvanced ? 'rotate-180' : '')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          {showAdvanced && (<div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
              {configuration.format === 'csv' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Delimitador CSV
                    </label>
                    <select value={configuration.csv_delimiter} onChange={function (e) { return handleConfigChange('csv_delimiter', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value=",">,  (Coma)</option>
                      <option value=";">; (Punto y coma)</option>
                      <option value="\t">Tab</option>
                      <option value="|">| (Pipe)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Codificación
                    </label>
                    <select value={configuration.csv_encoding} onChange={function (e) { return handleConfigChange('csv_encoding', e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="utf-8">UTF-8</option>
                      <option value="iso-8859-1">ISO-8859-1</option>
                      <option value="windows-1252">Windows-1252</option>
                    </select>
                  </div>
                </div>)}

              {configuration.format === 'xlsx' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre de Hoja
                    </label>
                    <input type="text" value={configuration.xlsx_sheet_name || ''} onChange={function (e) { return handleConfigChange('xlsx_sheet_name', e.target.value || null); }} placeholder="Primera hoja por defecto" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fila de Encabezados
                    </label>
                    <input type="number" min="1" value={configuration.xlsx_header_row || 1} onChange={function (e) { return handleConfigChange('xlsx_header_row', parseInt(e.target.value) || 1); }} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                  </div>
                </div>)}
            </div>)}
        </div>

        {/* Botón de importación */}
        <div className="pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {configuration.validation_level === 'preview' ? (<span>Solo se validarán los datos, no se importarán</span>) : (<span>
                  Los datos se importarán como{' '}
                  <strong>{getDataTypeLabel(configuration.data_type)}</strong>
                </span>)}
            </div>
            
            <Button onClick={onImport} disabled={!canImport || isLoading} variant="primary" className="min-w-32">
              {isLoading ? (<div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </div>) : configuration.validation_level === 'preview' ? ('Validar Datos') : ('Importar Datos')}
            </Button>
          </div>
        </div>
      </div>
    </Card>);
}
