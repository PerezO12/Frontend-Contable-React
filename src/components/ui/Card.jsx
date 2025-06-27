import React from 'react';
export var Card = function (_a) {
    var children = _a.children, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.padding, padding = _c === void 0 ? 'md' : _c, onClick = _a.onClick;
    var paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8'
    };
    var combinedClasses = [
        'card',
        paddingClasses[padding],
        onClick ? 'cursor-pointer' : '',
        className
    ].filter(Boolean).join(' ');
    return (<div className={combinedClasses} onClick={onClick}>
      {children}
    </div>);
};
