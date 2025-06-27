var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { Modal } from '../../../components/ui/Modal';
import { ThirdPartyDetail } from '../components';
import { useThirdParty, useDeleteThirdParty } from '../hooks';
export var ThirdPartyDetailPage = function () {
    var id = useParams().id;
    var navigate = useNavigate();
    var _a = useState(false), showDeleteConfirm = _a[0], setShowDeleteConfirm = _a[1];
    var _b = useThirdParty(id), thirdParty = _b.thirdParty, loading = _b.loading, error = _b.error;
    var _c = useDeleteThirdParty(), deleteThirdParty = _c.deleteThirdParty, deleteLoading = _c.loading, deleteError = _c.error;
    var handleEdit = function () {
        navigate("/third-parties/".concat(id, "/edit"));
    };
    var handleDelete = function () {
        setShowDeleteConfirm(true);
    };
    var handleConfirmDelete = function () { return __awaiter(void 0, void 0, void 0, function () {
        var success;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!id)
                        return [2 /*return*/];
                    return [4 /*yield*/, deleteThirdParty(id)];
                case 1:
                    success = _a.sent();
                    if (success) {
                        navigate('/third-parties');
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var handleBackToList = function () {
        navigate('/third-parties');
    };
    if (loading) {
        return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg"/>
        </div>
      </div>);
    }
    if (error || !thirdParty) {
        return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="card-body text-center py-8">
            <p className="text-red-600 mb-4">
              {error || 'No se pudo cargar la información del tercero'}
            </p>
            <Button onClick={handleBackToList}>
              Volver a la lista
            </Button>
          </div>
        </Card>
      </div>);
    }
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBackToList} className="mb-4">
          ← Volver a Terceros
        </Button>
      </div>

      {deleteError && (<div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{deleteError}</p>
        </div>)}

      <ThirdPartyDetail thirdParty={thirdParty} onEdit={handleEdit} onDelete={handleDelete} loading={deleteLoading}/>      {/* Modal de confirmación de eliminación */}
      <Modal isOpen={showDeleteConfirm} onClose={function () { return setShowDeleteConfirm(false); }} title="Confirmar Eliminación" size="sm">
        <div className="p-6 space-y-6">
          {/* Icono de advertencia */}
          <div className="flex justify-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
          </div>

          {/* Mensaje de confirmación */}
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-3">
              ¿Está seguro de que desea eliminar este tercero? Esta acción no se puede deshacer.
            </p>
            <p className="text-sm font-medium text-gray-900">
              {thirdParty.commercial_name || thirdParty.name}
            </p>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-3">
            <Button onClick={function () { return setShowDeleteConfirm(false); }} variant="outline" className="flex-1" disabled={deleteLoading}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} className="flex-1 bg-red-600 hover:bg-red-700" disabled={deleteLoading}>
              {deleteLoading ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>);
};
