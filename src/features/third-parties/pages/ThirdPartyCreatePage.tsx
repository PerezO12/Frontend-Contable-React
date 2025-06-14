import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ThirdPartyForm } from '../components';
import { useCreateThirdParty } from '../hooks';
import { useToast } from '../../../shared/contexts/ToastContext';
import type { ThirdPartyCreate, ThirdPartyUpdate } from '../types';

export const ThirdPartyCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const { createThirdParty, loading, error } = useCreateThirdParty();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (data: ThirdPartyCreate | ThirdPartyUpdate) => {
    try {
      const result = await createThirdParty(data as ThirdPartyCreate);
      if (result) {
        showSuccess(`Tercero "${result.name}" creado exitosamente`);
        navigate(`/third-parties/${result.id}`);
      }
    } catch (err) {
      showError('Error al crear el tercero. Por favor, intente nuevamente.');
    }
  };

  const handleCancel = () => {
    navigate('/third-parties');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Tercero</h1>
        <p className="text-gray-600">Complete la información para crear un nuevo tercero</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <ThirdPartyForm
        mode="create"
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  );
};
