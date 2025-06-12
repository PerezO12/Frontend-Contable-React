import React, { useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';

interface ReasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  description: string;
  reasonLabel?: string;
  confirmButtonText?: string;
  confirmButtonVariant?: 'primary' | 'danger' | 'warning';
  isRequired?: boolean;
}

export const ReasonModal: React.FC<ReasonModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  reasonLabel = 'Razón',
  confirmButtonText = 'Confirmar',
  confirmButtonVariant = 'primary',
  isRequired = true
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRequired && !reason.trim()) {
      setError('La razón es obligatoria');
      return;
    }

    onConfirm(reason.trim());
    handleClose();
  };

  const handleClose = () => {
    setReason('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <Card>
          <div className="card-header">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          
          <form onSubmit={handleSubmit} className="card-body space-y-4">
            <p className="text-gray-600">{description}</p>
            
            <div>
              <label htmlFor="reason" className="form-label">
                {reasonLabel} {isRequired && '*'}
              </label>
              <Input
                id="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  if (error) setError('');
                }}
                placeholder={`Ingrese ${reasonLabel.toLowerCase()}...`}
                error={error}
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant={confirmButtonVariant}
              >
                {confirmButtonText}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
