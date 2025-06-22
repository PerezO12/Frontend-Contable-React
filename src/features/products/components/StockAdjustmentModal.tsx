import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Spinner } from '../../../components/ui/Spinner';
import { useStockOperations } from '../hooks';
import type { Product } from '../types';

interface StockAdjustmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  product: Product;
}

export const StockAdjustmentModal: React.FC<StockAdjustmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  product
}) => {
  const [adjustmentType, setAdjustmentType] = useState<'increase' | 'decrease' | 'set'>('increase');
  const [quantity, setQuantity] = useState('');
  const [unitCost, setUnitCost] = useState('');
  const [reason, setReason] = useState('');
  const [reference, setReference] = useState('');
  
  const { adjustStock, loading, error } = useStockOperations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!quantity || !reason) {
      return;
    }

    try {
      await adjustStock(product.id, {
        adjustment_type: adjustmentType,
        quantity: parseFloat(quantity),
        reason,
        unit_cost: unitCost ? parseFloat(unitCost) : undefined,
        reference_document: reference || undefined
      });
      
      onSuccess();
      onClose();
      
      // Reset form
      setQuantity('');
      setUnitCost('');
      setReason('');
      setReference('');
      setAdjustmentType('increase');
    } catch (err) {
      console.error('Error al ajustar stock:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 4V2" />
                  </svg>
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Ajustar Stock
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      <strong>{product.name}</strong> (Código: {product.code})
                    </p>
                    <p className="text-sm text-gray-500">
                      Stock actual: <span className="font-medium">{product.current_stock || '0'}</span>
                    </p>
                  </div>

                  {error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  <div className="mt-4 space-y-4">                    <div>
                      <label htmlFor="adjustmentType" className="block text-sm font-medium text-gray-700">
                        Tipo de Ajuste
                      </label>
                      <select
                        id="adjustmentType"
                        value={adjustmentType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setAdjustmentType(e.target.value as 'increase' | 'decrease' | 'set')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="increase">Incrementar Stock</option>
                        <option value="decrease">Decrementar Stock</option>
                        <option value="set">Establecer Stock</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                        Cantidad *
                      </label>
                      <Input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min="0"
                        step="0.01"
                        required
                        className="mt-1"
                        placeholder="Ingrese la cantidad"
                      />
                    </div>

                    {adjustmentType === 'increase' && (
                      <div>
                        <label htmlFor="unitCost" className="block text-sm font-medium text-gray-700">
                          Costo Unitario
                        </label>
                        <Input
                          type="number"
                          id="unitCost"
                          value={unitCost}
                          onChange={(e) => setUnitCost(e.target.value)}
                          min="0"
                          step="0.01"
                          className="mt-1"
                          placeholder="Costo por unidad"
                        />
                      </div>
                    )}

                    <div>
                      <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                        Motivo *
                      </label>
                      <Textarea
                        id="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="mt-1"
                        placeholder="Explique el motivo del ajuste"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                        Documento de Referencia
                      </label>
                      <Input
                        type="text"
                        id="reference"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        className="mt-1"
                        placeholder="Número de documento o referencia"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <Button
                type="submit"
                variant="primary"
                disabled={loading || !quantity || !reason}
                className="w-full sm:ml-3 sm:w-auto"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="ml-2">Ajustando...</span>
                  </>
                ) : (
                  'Ajustar Stock'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="mt-3 w-full sm:mt-0 sm:w-auto"
              >
                Cancelar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
