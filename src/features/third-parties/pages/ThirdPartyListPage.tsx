import React from 'react';
import { ThirdPartyListView } from '../../../components/atomic/templates/ThirdPartyListView';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ThirdPartyListView
        onThirdPartySelect={handleThirdPartySelect}
        onCreateThirdParty={handleCreateThirdParty}
      />
    </div>
  );
};
