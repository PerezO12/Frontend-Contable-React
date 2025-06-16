import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductForm } from '../components/ProductForm';
import type { Product } from '../types';

export const ProductCreatePage: React.FC = () => {
  const navigate = useNavigate();

  const handleSuccess = (product: Product) => {
    console.log('Producto creado exitosamente:', product);
    navigate('/products');
  };

  const handleCancel = () => {
    navigate('/products');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver a Productos
        </button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Producto</h1>
        <p className="text-gray-600">Complete la información del nuevo producto</p>
      </div>

      <ProductForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};
