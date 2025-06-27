import React, { useEffect } from 'react';
import { useCostCenters } from '../hooks';
/**
 * Componente de debug para probar la carga de centros de costo
 */
export var CostCenterDebugTest = function () {
    var _a = useCostCenters(), costCenters = _a.costCenters, total = _a.total, loading = _a.loading, error = _a.error, refetch = _a.refetch;
    useEffect(function () {
        console.log('🏢🧪 === COMPONENTE DE PRUEBA ===');
        console.log('🏢📊 costCenters:', costCenters);
        console.log('🏢🔢 total:', total);
        console.log('🏢⏳ loading:', loading);
        console.log('🏢❌ error:', error);
        console.log('🏢📏 costCenters.length:', costCenters === null || costCenters === void 0 ? void 0 : costCenters.length);
        if (costCenters && costCenters.length > 0) {
            console.log('🏢✅ Primer centro de costo:', costCenters[0]);
        }
    }, [costCenters, total, loading, error]);
    return (<div className="p-4 border border-gray-300 rounded-lg bg-yellow-50">
      <h3 className="text-lg font-bold mb-4">🧪 Debug Test - Centros de Costo</h3>
      
      <div className="space-y-2">
        <div>
          <strong>Loading:</strong> {loading ? 'SÍ' : 'NO'}
        </div>
        
        <div>
          <strong>Error:</strong> {error || 'Ninguno'}
        </div>
        
        <div>
          <strong>Total del servidor:</strong> {total}
        </div>
        
        <div>
          <strong>Centros recibidos:</strong> {(costCenters === null || costCenters === void 0 ? void 0 : costCenters.length) || 0}
        </div>
        
        <div>
          <strong>Datos de centros:</strong>
          <pre className="bg-gray-100 p-2 rounded text-xs mt-1 max-h-40 overflow-y-auto">
            {JSON.stringify(costCenters, null, 2)}
          </pre>
        </div>
        
        <button onClick={refetch} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" disabled={loading}>
          {loading ? 'Cargando...' : 'Recargar'}
        </button>
      </div>
    </div>);
};
