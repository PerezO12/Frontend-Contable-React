import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProductsMainPage } from './ProductsMainPage';
import { ProductCreatePage } from './ProductCreatePage';
import { ProductEditPage } from './ProductEditPage';

export const ProductsPage: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProductsMainPage />} />
      <Route path="/create" element={<ProductCreatePage />} />
      <Route path="/:id/edit" element={<ProductEditPage />} />
    </Routes>
  );
};
