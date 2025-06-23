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
  
  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
      onClick={onClose}
    >
      <div 
        className={`w-full ${sizeClasses[size]} max-h-[90vh] flex flex-col transform transition-all duration-300 ease-out animate-in slide-in-from-top-4 zoom-in-95`}
        role="dialog"
        aria-modal="true"
        onClick={e => e.stopPropagation()}
      >
        <div 
          className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          style={{
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}
        >
          {title && (
            <div className="flex-shrink-0 p-4 border-b flex justify-between items-center bg-white">
              <h2 className="text-lg font-medium text-gray-900">{title}</h2>
              <button 
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors text-2xl leading-none font-light"
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
