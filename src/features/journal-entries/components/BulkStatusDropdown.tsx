import React, { useRef, useEffect } from 'react';
import { JournalEntryStatus, JOURNAL_ENTRY_STATUS_LABELS } from '../types';

interface StatusMenuOption {
  value: JournalEntryStatus;
  label: string;
  icon: string;
  requiresReason: boolean;
  disabled?: boolean;
  tooltip?: string;
}

const STATUS_OPTIONS: StatusMenuOption[] = [
  {
    value: JournalEntryStatus.DRAFT,
    label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.DRAFT],
    icon: '📝',
    requiresReason: true
  },
  {
    value: JournalEntryStatus.PENDING,
    label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.PENDING],
    icon: '⏳',
    requiresReason: false,
    disabled: true,
    tooltip: 'Esta funcionalidad no está disponible en el backend'
  },
  {
    value: JournalEntryStatus.APPROVED,
    label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.APPROVED],
    icon: '✅',
    requiresReason: false
  },
  {
    value: JournalEntryStatus.POSTED,
    label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.POSTED],
    icon: '📊',
    requiresReason: true
  },
  {
    value: JournalEntryStatus.CANCELLED,
    label: JOURNAL_ENTRY_STATUS_LABELS[JournalEntryStatus.CANCELLED],
    icon: '❌',
    requiresReason: true
  }
];

interface BulkStatusDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusSelect: (status: JournalEntryStatus, requiresReason: boolean) => void;
  buttonRef: React.RefObject<HTMLButtonElement>;
}

export const BulkStatusDropdown: React.FC<BulkStatusDropdownProps> = ({
  isOpen,
  onClose,
  onStatusSelect,
  buttonRef
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose, buttonRef]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  const handleOptionClick = (option: StatusMenuOption) => {
    if (option.disabled) {
      return; // No hacer nada si está deshabilitado
    }
    onStatusSelect(option.value, option.requiresReason);
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
      style={{
        // Posicionamiento relativo al botón
        minWidth: '200px'
      }}
    >      <div className="py-1">
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleOptionClick(option)}
            disabled={option.disabled}
            title={option.tooltip}
            className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center space-x-3 ${
              option.disabled 
                ? 'text-gray-400 cursor-not-allowed bg-gray-50' 
                : 'hover:bg-gray-100'
            }`}
          >
            <span className="text-base">{option.icon}</span>
            <span className="flex-1">{option.label}</span>
            {option.disabled && (
              <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                N/A
              </span>
            )}
            {!option.disabled && option.requiresReason && (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">
                Razón
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
