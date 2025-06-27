import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AccountDetail } from '../components';
export var AccountDetailPage = function () {
    var navigate = useNavigate();
    var id = useParams().id;
    var handleEdit = function () {
        if (id) {
            navigate("/accounts/".concat(id, "/edit"));
        }
    };
    var handleCreateChild = function () {
        if (id) {
            navigate("/accounts/new?parentId=".concat(id));
        }
    };
    var handleClose = function () {
        navigate('/accounts');
    };
    if (!id) {
        return (<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-red-600">ID de cuenta no válido</p>
      </div>);
    }
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <AccountDetail accountId={id} onEdit={handleEdit} onCreateChild={handleCreateChild} onClose={handleClose}/>
    </div>);
};
