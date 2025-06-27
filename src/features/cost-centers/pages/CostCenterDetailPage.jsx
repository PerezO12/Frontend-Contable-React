import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CostCenterDetail } from '../components';
export var CostCenterDetailPage = function () {
    var navigate = useNavigate();
    var id = useParams().id;
    var handleEdit = function () {
        if (id) {
            navigate("/cost-centers/".concat(id, "/edit"));
        }
    };
    var handleClose = function () {
        navigate('/cost-centers');
    };
    var handleViewMovements = function () {
        if (id) {
            navigate("/cost-centers/".concat(id, "/movements"));
        }
    };
    var handleViewAnalysis = function () {
        if (id) {
            navigate("/cost-centers/".concat(id, "/analysis"));
        }
    };
    if (!id) {
        return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-red-600">ID de centro de costo no válido</p>
      </div>);
    }
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CostCenterDetail costCenterId={id} onEdit={handleEdit} onClose={handleClose} onViewMovements={handleViewMovements} onViewAnalysis={handleViewAnalysis}/>
    </div>);
};
