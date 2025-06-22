import { useParams, useNavigate } from 'react-router-dom';
import { ProductEditForm } from '../components';
import type { Product } from '../types';

export function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleEditSuccess = (product: Product) => {
    console.log('Producto actualizado exitosamente:', product);
    // Redirigir de vuelta a la lista de productos
    navigate('/products', { 
      state: { 
        successMessage: `Producto "${product.name}" actualizado exitosamente` 
      }
    });
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">Error</h1>
            <p className="text-gray-600 mt-2">ID de producto no especificado</p>
            <button 
              onClick={handleCancel}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Volver a productos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ProductEditForm
          productId={id}
          onSuccess={handleEditSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}
