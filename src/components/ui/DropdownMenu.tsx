/**
 * Dropdown menu component for bulk actions
 */
import React, { useState, useRef, useEffect } from 'react';

interface DropdownMenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
}

export function DropdownMenu({ trigger, children, align = 'right' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const closeDropdown = () => setIsOpen(false);
  // Clonar los children y pasar la función closeDropdown a cada DropdownItem
  const childrenWithProps = React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<DropdownItemProps>, {
        onClose: closeDropdown
      });
    }
    return child;
  });

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          <div className="py-1">
            {childrenWithProps}
          </div>
        </div>
      )}
    </div>
  );
}

interface DropdownItemProps {
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  onClose?: () => void;
}

export function DropdownItem({ onClick, icon, children, variant = 'default', disabled = false, onClose }: DropdownItemProps) {
  const baseClasses = "flex w-full items-center px-4 py-2 text-sm";
  const variantClasses = {
    default: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
    danger: "text-red-700 hover:bg-red-50 hover:text-red-900"
  };
  const disabledClasses = "opacity-50 cursor-not-allowed";

  const handleClick = () => {
    if (!disabled) {
      onClick();
      onClose?.(); // Cierra el dropdown después de hacer click
    }
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? disabledClasses : ''}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {icon && <span className="mr-3 h-4 w-4">{icon}</span>}
      {children}
    </button>
  );
}
