import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { PaymentTermsForm } from './PaymentTermsForm';
export var PaymentTermsModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onSuccess = _a.onSuccess, initialData = _a.initialData, editingPaymentTerms = _a.editingPaymentTerms, title = _a.title;
    var _b = useState(false), isSubmitting = _b[0], setIsSubmitting = _b[1];
    var _c = useState(0), submitTrigger = _c[0], setSubmitTrigger = _c[1];
    var isEditing = !!editingPaymentTerms;
    var modalTitle = title || (isEditing ? 'Editar Condiciones de Pago' : 'Crear Condiciones de Pago');
    var buttonText = isEditing ? 'Guardar Cambios' : 'Crear Condiciones de Pago';
    // Preparar datos iniciales para edición
    var formInitialData = editingPaymentTerms ? {
        code: editingPaymentTerms.code,
        name: editingPaymentTerms.name,
        description: editingPaymentTerms.description,
        is_active: editingPaymentTerms.is_active,
        notes: editingPaymentTerms.notes,
        payment_schedules: editingPaymentTerms.payment_schedules || []
    } : initialData;
    var handleSuccess = function (paymentTerms) {
        setIsSubmitting(false);
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(paymentTerms);
        onClose();
    };
    var handleLoadingChange = function (loading) {
        setIsSubmitting(loading);
    };
    var handleSubmit = function () {
        setSubmitTrigger(function (prev) { return prev + 1; });
    };
    var handleFormError = function () {
        setIsSubmitting(false);
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{
            backgroundColor: 'transparent',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
        }} onClick={onClose}>
    <div className="w-[800px] max-w-[90vw] max-h-[90vh] overflow-hidden transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 zoom-in-95" onClick={function (e) { return e.stopPropagation(); }}>
        <Card>          <div className="card-header border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{modalTitle}</h2>
              <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-gray-600" disabled={isSubmitting}>
                ✕
              </Button>
            </div>
          </div>
          
          <div className="card-body max-h-[75vh] overflow-y-auto">            <PaymentTermsForm onSuccess={handleSuccess} onError={handleFormError} onLoadingChange={handleLoadingChange} initialData={formInitialData} editingPaymentTerms={editingPaymentTerms} submitTrigger={submitTrigger}/>
          </div>          <div className="card-footer border-t bg-gray-50 pt-4">
            <div className="flex justify-between">
              <Button variant="secondary" onClick={onClose} disabled={isSubmitting}>
                Cancelar
              </Button>

              <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? (<>
                    <Spinner size="sm" className="mr-2"/>
                    Creando...
                  </>) : (buttonText)}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>);
};
