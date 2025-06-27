import React from 'react';
export var Alert = function (_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'info' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var variantClasses = {
        info: 'bg-blue-50 text-blue-800 border-blue-200',
        success: 'bg-green-50 text-green-800 border-green-200',
        warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
        error: 'bg-red-50 text-red-800 border-red-200'
    };
    return (<div className={"p-4 border rounded-md ".concat(variantClasses[variant], " ").concat(className)} role="alert">
      {children}
    </div>);
};
