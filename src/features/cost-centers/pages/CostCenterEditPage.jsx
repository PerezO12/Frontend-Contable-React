import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CostCenterForm } from '../components';
import { useCostCenter } from '../hooks';
import { Spinner } from '../../../components/ui/Spinner';
import { Card } from '../../../components/ui/Card';
export var CostCenterEditPage = function () {
    var navigate = useNavigate();
    var id = useParams().id;
    var _a = useCostCenter(id), costCenter = _a.costCenter, loading = _a.loading, error = _a.error;
    var handleSuccess = function (costCenter) {
        navigate("/cost-centers/".concat(costCenter.id));
    };
    var handleCancel = function () {
        if (costCenter) {
            navigate("/cost-centers/".concat(costCenter.id));
        }
        else {
            navigate('/cost-centers');
        }
    };
    if (!id) {
        return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-red-600">ID de centro de costo no válido</p>
      </div>);
    }
    if (loading) {
        return (<>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-8">
            <Spinner size="lg"/>
            <p className="text-gray-600 mt-2">Cargando centro de costo...</p>
          </div>
        </div>
      </>);
    }
    if (error || !costCenter) {
        return (<>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <div className="card-body text-center py-8">
              <p className="text-red-600 mb-4">
                {error || 'No se pudo cargar el centro de costo'}
              </p>
              <button onClick={function () { return navigate('/cost-centers'); }} className="text-blue-600 hover:text-blue-800">
                Volver al listado
              </button>
            </div>
          </Card>
        </div>
      </>);
    }
    return (<>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <button onClick={function () { return navigate('/cost-centers'); }} className="hover:text-blue-600">
              Centros de Costo
            </button>
            <span>›</span>
            <button onClick={function () { return navigate("/cost-centers/".concat(costCenter.id)); }} className="hover:text-blue-600">
              {costCenter.name}
            </button>
            <span>›</span>
            <span className="text-gray-900">Editar</span>
          </div>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Editar Centro de Costo
          </h1>
          <p className="text-gray-600 mt-1">
            Modifica la información del centro de costo seleccionado
          </p>
        </div>

        <Card>
          <div className="card-body">
            <CostCenterForm onSuccess={handleSuccess} onCancel={handleCancel} isEditMode={true} costCenterId={id}/>
          </div>
        </Card>
      </div>
    </>);
};
