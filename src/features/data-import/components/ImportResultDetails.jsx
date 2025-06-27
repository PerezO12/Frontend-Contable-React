var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { useState } from 'react';
import { Card, Button } from '@/components/ui';
export function ImportResultDetails(_a) {
    var _b, _c, _d, _e, _f, _g;
    var importResult = _a.importResult;
    var _h = useState(false), showAllRows = _h[0], setShowAllRows = _h[1];
    var _j = useState('all'), selectedErrorType = _j[0], setSelectedErrorType = _j[1];
    var _k = useState('errors'), selectedRowType = _k[0], setSelectedRowType = _k[1]; // Nuevo filtro por tipo de resultado
    console.log('🔍 === IMPORT RESULT DETAILS DEBUG ===');
    console.log('📊 ImportResult completo:', JSON.stringify(importResult, null, 2));
    console.log('📈 Summary:', importResult.summary);
    console.log('🚨 Global errors:', importResult.global_errors);
    console.log('📋 Row results:', importResult.row_results);
    console.log('🎯 Row results length:', ((_b = importResult.row_results) === null || _b === void 0 ? void 0 : _b.length) || 0);
    if (importResult.row_results && importResult.row_results.length > 0) {
        console.log('🔬 Primera fila de resultados:', importResult.row_results[0]);
        console.log('🔬 Todas las filas de resultados:', importResult.row_results);
    }
    else {
        console.log('❌ No hay row_results o está vacío');
    }
    if (importResult.global_errors && importResult.global_errors.length > 0) {
        console.log('🚨 Global errors detallados:', importResult.global_errors);
    }
    else {
        console.log('✅ No hay global errors');
    }
    // Filtrar filas por tipo de error
    var errorRows = ((_c = importResult.row_results) === null || _c === void 0 ? void 0 : _c.filter(function (row) { return row.status === 'error'; })) || [];
    var warningRows = ((_d = importResult.row_results) === null || _d === void 0 ? void 0 : _d.filter(function (row) { return row.status === 'warning'; })) || [];
    var successRows = ((_e = importResult.row_results) === null || _e === void 0 ? void 0 : _e.filter(function (row) { return row.status === 'success'; })) || [];
    var skippedRows = ((_f = importResult.row_results) === null || _f === void 0 ? void 0 : _f.filter(function (row) { return row.status === 'skipped'; })) || [];
    console.log('📊 Filas filtradas:');
    console.log('  ❌ Error rows:', errorRows.length, errorRows);
    console.log('  ⚠️ Warning rows:', warningRows.length, warningRows);
    console.log('  ✅ Success rows:', successRows.length, successRows);
    console.log('  ⏭️ Skipped rows:', skippedRows.length, skippedRows); // Obtener tipos de errores únicos para el filtro
    var errorTypes = __spreadArray(['all'], Object.keys(((_g = importResult.summary) === null || _g === void 0 ? void 0 : _g.most_common_errors) || {}), true);
    // Obtener todas las filas según el tipo seleccionado
    var getRowsByType = function () {
        switch (selectedRowType) {
            case 'errors': return errorRows;
            case 'warnings': return warningRows;
            case 'skipped': return skippedRows;
            case 'success': return successRows;
            case 'all': return __spreadArray(__spreadArray(__spreadArray(__spreadArray([], errorRows, true), warningRows, true), skippedRows, true), successRows, true);
            default: return errorRows;
        }
    };
    var currentRows = getRowsByType();
    // Filtrar filas por tipo de error seleccionado (solo aplicable para errores)
    var filteredRows = selectedRowType === 'errors' && selectedErrorType !== 'all'
        ? currentRows.filter(function (row) { var _a; return (_a = row.errors) === null || _a === void 0 ? void 0 : _a.some(function (error) { return error.error_code === selectedErrorType; }); })
        : currentRows;
    // Mostrar solo primeras 10 filas por defecto
    var displayedRows = showAllRows ? filteredRows : filteredRows.slice(0, 10);
    console.log('🎯 Error types disponibles:', errorTypes);
    console.log('🔍 Filtered rows:', filteredRows);
    console.log('👀 Displayed rows:', displayedRows);
    // También revisar si hay errores globales que mostrar
    var globalErrors = importResult.global_errors || [];
    console.log('🌍 Global errors a mostrar:', globalErrors);
    var formatErrorMessage = function (error) {
        // Extraer información útil del mensaje de error de Pydantic
        var message = error.error_message;
        if (message.includes('validation errors for')) {
            // Parsear errores de Pydantic
            var lines = message.split('\n').filter(function (line) { return line.trim(); });
            var errors = [];
            for (var i = 1; i < lines.length; i += 3) {
                if (lines[i] && lines[i + 1]) {
                    var field = lines[i].trim();
                    var errorDetail = lines[i + 1].trim();
                    errors.push("".concat(field, ": ").concat(errorDetail));
                }
            }
            return errors.join('; ');
        }
        return message;
    };
    var getStatusColor = function (status) {
        switch (status) {
            case 'success': return 'text-green-600 bg-green-50';
            case 'error': return 'text-red-600 bg-red-50';
            case 'warning': return 'text-yellow-600 bg-yellow-50';
            case 'skipped': return 'text-gray-600 bg-gray-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };
    var getStatusIcon = function (status) {
        switch (status) {
            case 'success': return '✅';
            case 'error': return '❌';
            case 'warning': return '⚠️';
            case 'skipped': return '⏭️';
            default: return '❓';
        }
    };
    return (<div className="space-y-6">
      {/* Resumen de errores más comunes */}
      {Object.keys(importResult.summary.most_common_errors || {}).length > 0 && (<Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Errores Más Comunes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(importResult.summary.most_common_errors).map(function (_a) {
                var errorType = _a[0], count = _a[1];
                return (<div key={errorType} className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-red-800">
                    {errorType.replace(/_/g, ' ')}
                  </h4>
                  <span className="text-lg font-bold text-red-600">
                    {count}
                  </span>
                </div>
                <p className="text-xs text-red-600 mt-1">
                  {count === 1 ? 'fila afectada' : 'filas afectadas'}
                </p>
              </div>);
            })}
          </div>
        </Card>)}

      {/* Filtros */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Detalles por Fila
            </h3>            <p className="text-sm text-gray-600">
              {errorRows.length > 0 && "".concat(errorRows.length, " errores")}
              {errorRows.length > 0 && warningRows.length > 0 && ', '}
              {warningRows.length > 0 && "".concat(warningRows.length, " advertencias")}
              {(errorRows.length > 0 || warningRows.length > 0) && skippedRows.length > 0 && ', '}
              {skippedRows.length > 0 && "".concat(skippedRows.length, " omitidas")}
              {successRows.length > 0 && ", ".concat(successRows.length, " exitosas")}
            </p>
          </div>          <div className="flex flex-col sm:flex-row gap-2">
            {/* Filtro por tipo de resultado */}
            <select value={selectedRowType} onChange={function (e) {
            setSelectedRowType(e.target.value);
            setShowAllRows(false); // Reset pagination when changing filter
        }} className="form-select text-sm">
              <option value="errors">Solo Errores ({errorRows.length})</option>
              <option value="warnings">Solo Advertencias ({warningRows.length})</option>
              <option value="skipped">Solo Omitidas ({skippedRows.length})</option>
              <option value="success">Solo Exitosas ({successRows.length})</option>
              <option value="all">Todas las Filas ({errorRows.length + warningRows.length + skippedRows.length + successRows.length})</option>
            </select>

            {/* Filtro por tipo de error (solo visible para errores) */}
            {selectedRowType === 'errors' && (<select value={selectedErrorType} onChange={function (e) { return setSelectedErrorType(e.target.value); }} className="form-select text-sm">
                {errorTypes.map(function (errorType) { return (<option key={errorType} value={errorType}>
                    {errorType === 'all' ? 'Todos los errores' : errorType.replace(/_/g, ' ')}
                  </option>); })}              </select>)}
          </div>
        </div>
      </Card>

      {/* Lista de filas con errores */}
      {filteredRows.length > 0 ? (<Card className="p-6">
          <div className="space-y-4">
            {displayedRows.map(function (row) {
                var _a, _b;
                return (<div key={row.row_number} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{getStatusIcon(row.status)}</span>
                    <h4 className="font-medium text-gray-900">
                      Fila {row.row_number}
                    </h4>
                    <span className={"px-2 py-1 text-xs font-medium rounded-full ".concat(getStatusColor(row.status))}>
                      {row.status}
                    </span>
                  </div>
                  {row.entity_code && (<span className="text-sm text-gray-600 font-mono">
                      {row.entity_code}
                    </span>)}
                </div>                {/* Errores */}
                {((_a = row.errors) === null || _a === void 0 ? void 0 : _a.length) > 0 && (<div className="mb-3">
                    <h5 className="text-sm font-medium text-red-800 mb-2">
                      Errores ({row.errors.length}):
                    </h5>
                    <div className="space-y-2">
                      {row.errors.map(function (error, index) { return (<div key={index} className="bg-red-50 border border-red-200 rounded p-3">
                          {error.error_code && (<div className="text-xs font-medium text-red-700 mb-1">
                              {error.error_code}
                            </div>)}
                          <div className="text-sm text-red-800">
                            {formatErrorMessage(error)}
                          </div>
                        </div>); })}
                    </div>
                  </div>)}

                {/* Warnings */}
                {((_b = row.warnings) === null || _b === void 0 ? void 0 : _b.length) > 0 && (<div className="mb-3">
                    <h5 className="text-sm font-medium text-yellow-800 mb-2">
                      Advertencias ({row.warnings.length}):
                    </h5>
                    <div className="space-y-2">
                      {row.warnings.map(function (warning, index) { return (<div key={index} className="bg-yellow-50 border border-yellow-200 rounded p-3">
                          {warning.error_code && (<div className="text-xs font-medium text-yellow-700 mb-1">
                              {warning.error_code}
                            </div>)}
                          <div className="text-sm text-yellow-800">
                            {formatErrorMessage(warning)}
                          </div>
                        </div>); })}
                    </div>
                  </div>)}

                {/* Información adicional para filas omitidas */}
                {row.status === 'skipped' && (<div className="bg-blue-50 border border-blue-200 rounded p-3">
                    <div className="text-sm text-blue-800">
                      <strong>Razón:</strong> Esta fila fue omitida porque ya existe un registro con el mismo código.
                      {row.entity_code && (<div className="mt-1">
                          <strong>Código existente:</strong> <code className="bg-blue-100 px-1 rounded">{row.entity_code}</code>
                        </div>)}
                    </div>
                  </div>)}

                {/* Información adicional para filas exitosas */}
                {row.status === 'success' && (<div className="bg-green-50 border border-green-200 rounded p-3">
                    <div className="text-sm text-green-800">
                      <strong>✅ Procesada exitosamente</strong>
                      {row.entity_code && (<div className="mt-1">
                          <strong>Código:</strong> <code className="bg-green-100 px-1 rounded">{row.entity_code}</code>
                        </div>)}
                      {row.entity_id && (<div className="mt-1">
                          <strong>ID generado:</strong> <code className="bg-green-100 px-1 rounded">{row.entity_id}</code>
                        </div>)}
                    </div>
                  </div>)}
              </div>);
            })}

            {/* Botón para mostrar más */}
            {filteredRows.length > 10 && !showAllRows && (<div className="text-center">
                <Button onClick={function () { return setShowAllRows(true); }} variant="secondary">
                  Mostrar todas las filas ({filteredRows.length - 10} más)
                </Button>
              </div>)}
          </div>
        </Card>) : (<Card className="p-6 text-center">
          <div className="text-gray-500">
            {(function () {
                var typeLabels = {
                    errors: 'errores',
                    warnings: 'advertencias',
                    skipped: 'filas omitidas',
                    success: 'filas exitosas',
                    all: 'filas'
                };
                var currentLabel = typeLabels[selectedRowType] || 'filas';
                if (selectedRowType === 'errors' && selectedErrorType !== 'all') {
                    return "No hay errores del tipo \"".concat(selectedErrorType.replace(/_/g, ' '), "\"");
                }
                return "No hay ".concat(currentLabel, " que mostrar");
            })()}
          </div>
        </Card>)}      {/* Errores globales */}
      {globalErrors.length > 0 && (<Card className="p-6 bg-red-50 border-red-200">
          <h3 className="text-lg font-semibold text-red-800 mb-4">
            Errores Globales
          </h3>
          <div className="space-y-2">
            {globalErrors.map(function (error, index) { return (<div key={index} className="bg-red-100 border border-red-300 rounded p-3">
                <div className="text-sm text-red-800">
                  {formatErrorMessage(error)}
                </div>
              </div>); })}
          </div>        </Card>)}

      {/* Filas omitidas */}
      {skippedRows.length > 0 && (<Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">
            Filas Omitidas ({skippedRows.length})
          </h3>
          <p className="text-sm text-blue-700 mb-4">
            Estas filas fueron omitidas porque ya existen registros con el mismo código y la configuración está establecida para omitir duplicados.
          </p>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {skippedRows.slice(0, 20).map(function (row) {
                var _a;
                return (<div key={row.row_number} className="bg-blue-100 border border-blue-300 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">
                    Fila {row.row_number}
                  </span>
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                    ⏭️ Omitida
                  </span>
                </div>
                {row.entity_code && (<div className="text-sm text-blue-700">
                    <strong>Código:</strong> {row.entity_code}
                  </div>)}
                {((_a = row.errors) === null || _a === void 0 ? void 0 : _a.length) > 0 && (<div className="mt-2">
                    {row.errors.map(function (error, index) { return (<div key={index} className="text-sm text-blue-700">
                        {formatErrorMessage(error)}
                      </div>); })}
                  </div>)}
              </div>);
            })}
            {skippedRows.length > 20 && (<div className="text-center">
                <p className="text-sm text-blue-600">
                  ... y {skippedRows.length - 20} filas más omitidas
                </p>
              </div>)}
          </div>
        </Card>)}

      {/* Mostrar información adicional si no hay row_results */}
      {(!importResult.row_results || importResult.row_results.length === 0) && globalErrors.length === 0 && (<Card className="p-6 bg-blue-50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">
            Sin Detalles de Errores por Fila
          </h3>
          <div className="text-sm text-blue-700">
            <p>No se encontraron detalles específicos de errores por fila.</p>
            <p className="mt-2">Posibles razones:</p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>La importación se completó exitosamente</li>
              <li>Los errores se reportaron en un formato diferente</li>
              <li>Hay un problema en la comunicación con el servidor</li>
            </ul>
          </div>
        </Card>)}
    </div>);
}
