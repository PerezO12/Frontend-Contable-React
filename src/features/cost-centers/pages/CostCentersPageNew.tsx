import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CostCenterListPage } from './CostCenterListPageNew';
import { CostCenterCreatePage } from './CostCenterCreatePage';
import { CostCenterDetailPage } from './CostCenterDetailPage';
import { CostCenterEditPage } from './CostCenterEditPage';

export const CostCentersPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<CostCenterListPage />} />
      <Route path="/new" element={<CostCenterCreatePage />} />
      <Route path="/:id" element={<CostCenterDetailPage />} />
      <Route path="/:id/edit" element={<CostCenterEditPage />} />
    </Routes>
  );
};
