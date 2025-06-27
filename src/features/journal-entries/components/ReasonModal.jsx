import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
export var ReasonModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onConfirm = _a.onConfirm, title = _a.title, description = _a.description, _b = _a.reasonLabel, reasonLabel = _b === void 0 ? 'Razón' : _b, _c = _a.confirmButtonText, confirmButtonText = _c === void 0 ? 'Confirmar' : _c, _d = _a.confirmButtonVariant, confirmButtonVariant = _d === void 0 ? 'primary' : _d, _e = _a.isRequired, isRequired = _e === void 0 ? true : _e;
    var _f = useState(''), reason = _f[0], setReason = _f[1];
    var _g = useState(''), error = _g[0], setError = _g[1];
    var handleSubmit = function (e) {
        e.preventDefault();
        if (isRequired && !reason.trim()) {
            setError('La razón es obligatoria');
            return;
        }
        onConfirm(reason.trim());
        handleClose();
    };
    var handleClose = function () {
        setReason('');
        setError('');
        onClose();
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <Card>
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="card-body space-y-4">
            <p className="text-gray-600">{description}</p>
            
            <div>
              <label htmlFor="reason" className="form-label">
                {reasonLabel} {isRequired && '*'}
              </label>
              <Input id="reason" value={reason} onChange={function (e) {
            setReason(e.target.value);
            if (error)
                setError('');
        }} placeholder={"Ingrese ".concat(reasonLabel.toLowerCase(), "...")} error={error} autoFocus/>
              {error && (<p className="text-red-600 text-sm mt-1">{error}</p>)}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" variant={confirmButtonVariant}>
                {confirmButtonText}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>);
};
