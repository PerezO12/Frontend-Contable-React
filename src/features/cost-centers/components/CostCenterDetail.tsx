import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import type { CostCenter } from '../types';

interface CostCenterDetailProps {
  costCenter: CostCenter;
  onEdit?: (costCenter: CostCenter) => void;
  onDelete?: (costCenter: CostCenter) => void;
  onViewMovements?: (costCenter: CostCenter) => void;
  onViewAnalysis?: (costCenter: CostCenter) => void;
}

export const CostCenterDetail: React.FC<CostCenterDetailProps> = ({
  costCenter,
  onEdit,
  onDelete,
  onViewMovements,
  onViewAnalysis
}) => {
  const getLevelColor = (level: number) => {
    const colors = [
      'bg-blue-100 text-blue-800',   // Nivel 0
      'bg-green-100 text-green-800', // Nivel 1
      'bg-yellow-100 text-yellow-800', // Nivel 2
      'bg-purple-100 text-purple-800', // Nivel 3
      'bg-pink-100 text-pink-800',   // Nivel 4
      'bg-gray-100 text-gray-800'    // Nivel 5+
    ];
    return colors[level] || colors[colors.length - 1];
  };

  return (
    <div className="space-y-6">
      {/* Header con información principal */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="card-title">{costCenter.name}</h2>
              <div className="flex items-center space-x-4 mt-2">
                <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {costCenter.code}
                </code>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getLevelColor(costCenter.level)}`}>
                  Nivel {costCenter.level}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                  costCenter.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {costCenter.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
            
            <div className="flex space-x-2">
              {onViewAnalysis && (
                <Button
                  variant="secondary"
                  onClick={() => onViewAnalysis(costCenter)}
                  className="text-purple-600 hover:text-purple-700 border-purple-300 hover:border-purple-400"
                >
                  📊 Análisis
                </Button>
              )}
              {onViewMovements && (
                <Button
                  variant="secondary"
                  onClick={() => onViewMovements(costCenter)}
                  className="text-blue-600 hover:text-blue-700 border-blue-300 hover:border-blue-400"
                >
                  📝 Movimientos
                </Button>
              )}
              {onEdit && (
                <Button
                  variant="secondary"
                  onClick={() => onEdit(costCenter)}
                  className="text-green-600 hover:text-green-700 border-green-300 hover:border-green-400"
                >
                  ✏️ Editar
                </Button>
              )}
              {onDelete && (
                <Button
                  variant="danger"
                  onClick={() => onDelete(costCenter)}
                  className="text-red-600 hover:text-red-700 border-red-300 hover:border-red-400"
                >
                  🗑️ Eliminar
                </Button>
              )}
            </div>
          </div>
        </div>
        
        <div className="card-body">
          {costCenter.description && (
            <p className="text-gray-600 mb-4">{costCenter.description}</p>
          )}
          
          {/* Información jerárquica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Información Jerárquica</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Código completo</span>
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {costCenter.full_code}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Centro padre</span>
                  <span className="text-sm font-medium text-gray-900">
                    {costCenter.parent_name || 'Centro raíz'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Es hoja</span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    costCenter.is_leaf 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {costCenter.is_leaf ? 'Sí (sin hijos)' : 'No (tiene hijos)'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Centros hijos</span>
                  <span className="text-sm font-medium text-gray-900">
                    {costCenter.children_count}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">Estadísticas</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Total de movimientos</span>
                  <span className="text-sm font-medium text-gray-900">
                    {costCenter.movements_count}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Fecha de creación</span>
                  <span className="text-sm text-gray-600">
                    {new Date(costCenter.created_at).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Última actualización</span>
                  <span className="text-sm text-gray-600">
                    {new Date(costCenter.updated_at).toLocaleDateString('es-CO', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tarjetas de métricas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {costCenter.movements_count}
            </div>
            <p className="text-sm text-gray-600">Movimientos Registrados</p>
            {costCenter.movements_count > 0 && onViewMovements && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewMovements(costCenter)}
                className="mt-2 text-blue-600 hover:text-blue-700"
              >
                Ver Detalle
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {costCenter.children_count}
            </div>
            <p className="text-sm text-gray-600">Centros Dependientes</p>
            <p className="text-xs text-gray-500 mt-1">
              {costCenter.is_leaf ? 'Centro hoja' : 'Centro padre'}
            </p>
          </div>
        </Card>

        <Card>
          <div className="card-body text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {costCenter.level}
            </div>
            <p className="text-sm text-gray-600">Nivel Jerárquico</p>
            {onViewAnalysis && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewAnalysis(costCenter)}
                className="mt-2 text-purple-600 hover:text-purple-700"
              >
                Ver Análisis
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* Información adicional */}
      <Card>
        <div className="card-header">
          <h3 className="card-title">Información del Sistema</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 font-medium">ID del Centro:</span>
              <p className="font-mono text-xs text-gray-800 mt-1">{costCenter.id}</p>
            </div>
            {costCenter.parent_id && (
              <div>
                <span className="text-gray-600 font-medium">ID del Padre:</span>
                <p className="font-mono text-xs text-gray-800 mt-1">{costCenter.parent_id}</p>
              </div>
            )}
            <div>
              <span className="text-gray-600 font-medium">Creado:</span>
              <p className="text-gray-800 mt-1">
                {new Date(costCenter.created_at).toLocaleString('es-CO')}
              </p>
            </div>
            <div>
              <span className="text-gray-600 font-medium">Actualizado:</span>
              <p className="text-gray-800 mt-1">
                {new Date(costCenter.updated_at).toLocaleString('es-CO')}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
