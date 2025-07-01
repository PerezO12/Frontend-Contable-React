import React from 'react';
import { ThirdPartyListView } from '../templates/ThirdPartyListView';
import type { ThirdParty } from '../../../features/third-parties/types';

export const ThirdPartiesPageExample: React.FC = () => {
  const handleThirdPartySelect = (thirdParty: ThirdParty) => {
    // Navegar al detalle del tercero
    window.location.href = `/third-parties/${thirdParty.id}`;
  };

  const handleCreateThirdParty = () => {
    // Navegar al formulario de creación
    window.location.href = '/third-parties/new';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <ThirdPartyListView
          onThirdPartySelect={handleThirdPartySelect}
          onCreateThirdParty={handleCreateThirdParty}
          showActions={true}
          initialFilters={{
            // Filtros iniciales opcionales
            third_party_type: 'customer',
            is_active: true,
          }}
        />
      </div>
    </div>
  );
};
