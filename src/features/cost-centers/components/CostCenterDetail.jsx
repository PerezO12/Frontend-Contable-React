import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { useCostCenter } from '../hooks';
export var CostCenterDetail = function (_a) {
    var costCenterId = _a.costCenterId, onEdit = _a.onEdit, onClose = _a.onClose, onDelete = _a.onDelete, onViewMovements = _a.onViewMovements, onViewAnalysis = _a.onViewAnalysis;
    var _b = useCostCenter(costCenterId), costCenter = _b.costCenter, loading = _b.loading, error = _b.error;
    if (loading) {
        return (<Card>
        <div className="card-body text-center py-8">
          <Spinner size="lg"/>
          <p className="text-gray-600 mt-2">Cargando información del centro de costo...</p>
        </div>
      </Card>);
    }
    if (error || !costCenter) {
        return (<Card>
        <div className="card-body text-center py-8">
          <p className="text-red-600 mb-4">
            Error al cargar el centro de costo: {error || 'Centro de costo no encontrado'}
          </p>
          {onClose && (<Button onClick={onClose}>
              Cerrar
            </Button>)}
        </div>
      </Card>);
    }
    var getLevelColor = function (level) {
        var colors = ['bg-blue-100 text-blue-800', 'bg-green-100 text-green-800', 'bg-yellow-100 text-yellow-800', 'bg-purple-100 text-purple-800'];
        return colors[level % colors.length] || 'bg-gray-100 text-gray-800';
    };
    return (<div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="card-header">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                  {costCenter.code}
                </code>
                <span className={"inline-flex px-2 py-1 text-xs font-medium rounded-full ".concat(getLevelColor(costCenter.level))}>
                  Nivel {costCenter.level}
                </span>
                <span className={"inline-flex px-2 py-1 text-xs font-medium rounded-full ".concat(costCenter.is_active
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800')}>
                  {costCenter.is_active ? 'Activo' : 'Inactivo'}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {costCenter.name}
              </h1>
              {costCenter.description && (<p className="text-gray-600 mt-1">{costCenter.description}</p>)}
            </div>

            <div className="flex space-x-2">
              {onViewAnalysis && (<Button variant="secondary" onClick={function () { return onViewAnalysis(costCenter); }} className="text-sm">
                  Ver Análisis
                </Button>)}
              
              {onViewMovements && (<Button variant="secondary" onClick={function () { return onViewMovements(costCenter); }} className="text-sm">
                  Ver Movimientos
                </Button>)}
              
              {onEdit && (<Button variant="secondary" onClick={function () { return onEdit(costCenter); }} className="text-sm">
                  Editar
                </Button>)}
              
              {onDelete && (<Button variant="danger" onClick={function () { return onDelete(costCenter); }} className="text-sm">
                  Eliminar
                </Button>)}
            </div>
          </div>
        </div>

        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Información Básica</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-600">Código Completo:</dt>
                  <dd className="text-sm text-gray-900 font-mono">{costCenter.full_code}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Centro Padre:</dt>
                  <dd className="text-sm text-gray-900">{costCenter.parent_name || 'Centro raíz'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Tipo de Centro:</dt>
                  <dd className="text-sm text-gray-900">
                    {costCenter.is_leaf ? 'Centro hoja (sin subcategorías)' : 'Centro padre (con subcategorías)'}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Estadísticas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Estadísticas</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-600">Centros Hijos:</dt>
                  <dd className="text-sm text-gray-900">{costCenter.children_count}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Movimientos Contables:</dt>
                  <dd className="text-sm text-gray-900">{costCenter.movements_count}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Nivel Jerárquico:</dt>
                  <dd className="text-sm text-gray-900">{costCenter.level}</dd>
                </div>
              </dl>
            </div>

            {/* Fechas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Fechas</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm text-gray-600">Creado:</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(costCenter.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600">Última Actualización:</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(costCenter.updated_at).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </Card>
    </div>);
};
