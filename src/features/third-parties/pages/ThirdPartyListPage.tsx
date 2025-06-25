import React from 'react';
import { ThirdPartyListEnhanced } from '../components/ThirdPartyListEnhanced';
import { useNavigate } from 'react-router-dom';
import type { ThirdParty } from '../types';

export const ThirdPartyListPage: React.FC = () => {
  const navigate = useNavigate();

  const handleThirdPartySelect = (thirdParty: ThirdParty) => {
    navigate(`/third-parties/${thirdParty.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ThirdPartyListEnhanced
        onThirdPartySelect={handleThirdPartySelect}
      />
    </div>
  );
};
