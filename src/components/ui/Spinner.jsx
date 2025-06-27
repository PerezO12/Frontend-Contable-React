import React from 'react';
export var Spinner = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 'md' : _b, _c = _a.className, className = _c === void 0 ? '' : _c;
    var sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };
    var combinedClasses = [
        'spinner',
        sizeClasses[size],
        className
    ].filter(Boolean).join(' ');
    return <div className={combinedClasses}/>;
};
