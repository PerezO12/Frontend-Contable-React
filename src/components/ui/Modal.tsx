import React, { useEffect } from 'react';
import type { ModalProps } from '../../shared/types';

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50" onClick={onClose}>
      <div 
        className={`bg-white rounded-lg shadow-lg w-full ${sizeClasses[size]} overflow-hidden`}
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >{title && (
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium">{title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>
        )}
        
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
};
