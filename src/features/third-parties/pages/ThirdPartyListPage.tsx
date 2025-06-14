import React from 'react';
import { ThirdPartyList } from '../components';
import { useNavigate } from 'react-router-dom';
import type { ThirdParty } from '../types';

export const ThirdPartyListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleThirdPartySelect = (thirdParty: ThirdParty) => {
    navigate(`/third-parties/${thirdParty.id}`);
  };

  const handleCreateThirdParty = () => {
    navigate('/third-parties/new');
  };

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Terceros</h1>
          <p className="text-gray-600 mt-2">
            Gestión completa de clientes, proveedores y empleados
          </p>
        </div>

        <ThirdPartyList
          onThirdPartySelect={handleThirdPartySelect}
          onCreateThirdParty={handleCreateThirdParty}
          showActions={true}
        />
      </div>
    </>
  );
};
