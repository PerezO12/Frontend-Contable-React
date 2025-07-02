import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PaymentForm } from '../components/PaymentForm';
import type { Payment } from '../types';

export const PaymentCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (payment: Payment) => {
    console.log('Pago creado exitosamente:', payment);
    navigate('/payments/list');
  };

  const handleCancel = () => {
    navigate('/payments/list');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/payments/list')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Pagos
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Pago</h1>
        <p className="text-gray-600">Complete la información del nuevo pago</p>
      </div>

      <PaymentForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};
