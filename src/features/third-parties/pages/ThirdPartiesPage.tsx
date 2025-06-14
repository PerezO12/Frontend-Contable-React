import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThirdPartyListPage } from './ThirdPartyListPage';
import { ThirdPartyCreatePage } from './ThirdPartyCreatePage';
import { ThirdPartyDetailPage } from './ThirdPartyDetailPage';
import { ThirdPartyEditPage } from './ThirdPartyEditPage';

export const ThirdPartiesPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ThirdPartyListPage />} />
      <Route path="/new" element={<ThirdPartyCreatePage />} />
      <Route path="/:id" element={<ThirdPartyDetailPage />} />
      <Route path="/:id/edit" element={<ThirdPartyEditPage />} />
    </Routes>
  );
};
