import React from 'react';
export var BatchNavigation = function (_a) {
    var batchInfo = _a.batchInfo, onBatchChange = _a.onBatchChange, _b = _a.disabled, disabled = _b === void 0 ? false : _b, _c = _a.size, size = _c === void 0 ? 'medium' : _c;
    var current_batch = batchInfo.current_batch, total_batches = batchInfo.total_batches, batch_size = batchInfo.batch_size, total_rows = batchInfo.total_rows, current_batch_rows = batchInfo.current_batch_rows;
    var isFirstBatch = current_batch === 0;
    var isLastBatch = current_batch === total_batches - 1;
    var handleFirst = function () {
        if (!isFirstBatch && !disabled) {
            onBatchChange(0);
        }
    };
    var handlePrevious = function () {
        if (!isFirstBatch && !disabled) {
            onBatchChange(current_batch - 1);
        }
    };
    var handleNext = function () {
        if (!isLastBatch && !disabled) {
            onBatchChange(current_batch + 1);
        }
    };
    var handleLast = function () {
        if (!isLastBatch && !disabled) {
            onBatchChange(total_batches - 1);
        }
    };
    // Calcular el rango de filas del lote actual
    var startRow = current_batch * batch_size + 1;
    var endRow = startRow + current_batch_rows - 1;
    // Clases de tamaño
    var sizeClasses = {
        small: 'px-2 py-1 text-xs',
        medium: 'px-3 py-2 text-sm',
        large: 'px-4 py-3 text-base'
    };
    var buttonClass = "".concat(sizeClasses[size], " border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white");
    return (<div className="flex items-center justify-between gap-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Información del lote actual */}
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
          Lote {current_batch + 1} de {total_batches}
        </span>
        <span className="text-sm text-gray-600">
          Filas {startRow.toLocaleString()} - {endRow.toLocaleString()} de {total_rows.toLocaleString()}
        </span>
        <span className="text-sm text-gray-500">
          ({current_batch_rows} registros en este lote)
        </span>
      </div>
      
      {/* Controles de navegación */}
      {total_batches > 1 && (<div className="flex items-center gap-1">
          <button onClick={handleFirst} disabled={isFirstBatch || disabled} className={"".concat(buttonClass, " rounded-l-md flex items-center gap-1")} title="Primer lote">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
            </svg>
            Primero
          </button>
          <button onClick={handlePrevious} disabled={isFirstBatch || disabled} className={"".concat(buttonClass, " flex items-center gap-1")} title="Lote anterior">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
            </svg>
            Anterior
          </button>
          <button onClick={handleNext} disabled={isLastBatch || disabled} className={"".concat(buttonClass, " flex items-center gap-1")} title="Siguiente lote">
            Siguiente
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
            </svg>
          </button>
          <button onClick={handleLast} disabled={isLastBatch || disabled} className={"".concat(buttonClass, " rounded-r-md flex items-center gap-1")} title="Último lote">
            Último
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7"/>
            </svg>
          </button>
        </div>)}
    </div>);
};
export default BatchNavigation;
