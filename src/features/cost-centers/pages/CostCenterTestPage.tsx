import React from 'react';
import { CostCenterDebugTest } from '../components/CostCenterDebugTest';

/**
 * Página temporal para probar la corrección del problema de centros de costo
 */
export const CostCenterTestPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🧪 Prueba de Centros de Costo</h1>
        <p className="text-gray-600 mt-2">
          Esta página sirve para probar la corrección del problema donde los centros de costo 
          no se mostraban debido a la incompatibilidad entre 'items' vs 'data' en la respuesta del servidor.
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-blue-900 mb-2">📋 Problema identificado:</h2>
          <ul className="text-blue-800 space-y-1">
            <li>• El servidor devuelve: <code>{`{items: [...], total: 2, skip: 0, limit: 100}`}</code></li>
            <li>• El frontend espera: <code>{`{data: [...], total: 2, skip: 0, limit: 100}`}</code></li>
            <li>• Solución: Adaptador en el servicio para manejar ambas estructuras</li>
          </ul>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-green-900 mb-2">🔧 Corrección aplicada:</h2>
          <ul className="text-green-800 space-y-1">
            <li>• Agregado logging detallado en el servicio y hooks</li>
            <li>• Adaptador que convierte <code>items</code> a <code>data</code></li>
            <li>• Compatibilidad con ambas estructuras de respuesta</li>
          </ul>
        </div>

        <CostCenterDebugTest />
      </div>
    </div>
  );
};
