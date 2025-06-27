/**
 * Dropdown menu component for bulk actions
 */
import React, { useState, useRef, useEffect } from 'react';
export function DropdownMenu(_a) {
    var trigger = _a.trigger, children = _a.children, _b = _a.align, align = _b === void 0 ? 'right' : _b;
    var _c = useState(false), isOpen = _c[0], setIsOpen = _c[1];
    var dropdownRef = useRef(null);
    useEffect(function () {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return function () {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    var closeDropdown = function () { return setIsOpen(false); };
    // Clonar los children y pasar la función closeDropdown a cada DropdownItem
    var childrenWithProps = React.Children.map(children, function (child) {
        if (React.isValidElement(child)) {
            return React.cloneElement(child, {
                onClose: closeDropdown
            });
        }
        return child;
    });
    return (<div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={function () { return setIsOpen(!isOpen); }}>
        {trigger}
      </div>

      {isOpen && (<div className={"absolute z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ".concat(align === 'right' ? 'right-0' : 'left-0')}>
          <div className="py-1">
            {childrenWithProps}
          </div>
        </div>)}
    </div>);
}
export function DropdownItem(_a) {
    var onClick = _a.onClick, icon = _a.icon, children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'default' : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c, onClose = _a.onClose;
    var baseClasses = "flex w-full items-center px-4 py-2 text-sm";
    var variantClasses = {
        default: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        danger: "text-red-700 hover:bg-red-50 hover:text-red-900"
    };
    var disabledClasses = "opacity-50 cursor-not-allowed";
    var handleClick = function () {
        if (!disabled) {
            onClick();
            onClose === null || onClose === void 0 ? void 0 : onClose(); // Cierra el dropdown después de hacer click
        }
    };
    return (<button className={"".concat(baseClasses, " ").concat(variantClasses[variant], " ").concat(disabled ? disabledClasses : '')} onClick={handleClick} disabled={disabled}>
      {icon && <span className="mr-3 h-4 w-4">{icon}</span>}
      {children}
    </button>);
}
