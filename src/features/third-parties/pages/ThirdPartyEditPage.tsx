import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { ThirdPartyForm } from '../components';
import { useThirdParty, useUpdateThirdParty } from '../hooks';
import type { ThirdPartyCreate, ThirdPartyUpdate } from '../types';

export const ThirdPartyEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { thirdParty, loading, error } = useThirdParty(id);
  const { updateThirdParty, loading: updateLoading, error: updateError } = useUpdateThirdParty();

  const handleSubmit = async (data: ThirdPartyCreate | ThirdPartyUpdate) => {
    if (!id) return;
    
    const result = await updateThirdParty(id, data as ThirdPartyUpdate);
    if (result) {
      navigate(`/third-parties/${id}`);
    }
  };

  const handleCancel = () => {
    navigate(`/third-parties/${id}`);
  };

  const handleBackToDetail = () => {
    navigate(`/third-parties/${id}`);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-center items-center py-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error || !thirdParty) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <div className="card-body text-center py-8">
            <p className="text-red-600 mb-4">
              {error || 'No se pudo cargar la información del tercero'}
            </p>
            <Button onClick={handleBackToDetail}>
              Volver al detalle
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={handleBackToDetail}
          className="mb-4"
        >
          ← Volver al Detalle
        </Button>
      </div>

      {updateError && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">{updateError}</p>
        </div>
      )}
      
      <ThirdPartyForm
        mode="edit"
        thirdParty={thirdParty}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={updateLoading}
      />
    </div>
  );
};
