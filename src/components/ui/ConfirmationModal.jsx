import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
export var ConfirmationModal = function (_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, onConfirm = _a.onConfirm, title = _a.title, message = _a.message, _b = _a.confirmText, confirmText = _b === void 0 ? 'Confirmar' : _b, _c = _a.cancelText, cancelText = _c === void 0 ? 'Cancelar' : _c, _d = _a.type, type = _d === void 0 ? 'info' : _d, _e = _a.isLoading, isLoading = _e === void 0 ? false : _e;
    var getIconAndColors = function () {
        switch (type) {
            case 'danger':
                return {
                    icon: (<svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>),
                    bgColor: 'bg-red-100',
                    confirmButtonVariant: 'danger'
                };
            case 'warning':
                return {
                    icon: (<svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>),
                    bgColor: 'bg-orange-100',
                    confirmButtonVariant: 'warning'
                };
            default:
                return {
                    icon: (<svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>),
                    bgColor: 'bg-blue-100',
                    confirmButtonVariant: 'primary'
                };
        }
    };
    var _f = getIconAndColors(), icon = _f.icon, bgColor = _f.bgColor, confirmButtonVariant = _f.confirmButtonVariant;
    return (<Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex">
        <div className={"mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ".concat(bgColor, " sm:mx-0 sm:h-10 sm:w-10")}>
          {icon}
        </div>
        <div className="ml-4 text-left">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {title}
          </h3>
          <div className="text-sm text-gray-500">
            {message.split('\n').map(function (line, index) { return (<p key={index} className={index > 0 ? 'mt-1' : ''}>
                {line}
              </p>); })}
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex space-x-3 justify-end">
        <Button variant="outline" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>        <Button variant={confirmButtonVariant} onClick={onConfirm} disabled={isLoading} isLoading={isLoading}>
          {confirmText}
        </Button>
      </div>
    </Modal>);
};
