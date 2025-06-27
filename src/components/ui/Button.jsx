var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import React from 'react';
var Spinner = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 'md' : _b;
    return (<div className={"spinner ".concat(size === 'sm' ? 'w-4 h-4' : 'w-5 h-5')}/>);
};
export var Button = function (_a) {
    var _b = _a.variant, variant = _b === void 0 ? 'primary' : _b, _c = _a.size, size = _c === void 0 ? 'md' : _c, _d = _a.isLoading, isLoading = _d === void 0 ? false : _d, children = _a.children, disabled = _a.disabled, _e = _a.className, className = _e === void 0 ? '' : _e, props = __rest(_a, ["variant", "size", "isLoading", "children", "disabled", "className"]);
    var baseClasses = 'btn';
    var variantClasses = "btn-".concat(variant);
    var sizeClasses = "btn-".concat(size);
    var combinedClasses = [
        baseClasses,
        variantClasses,
        sizeClasses,
        className
    ].filter(Boolean).join(' ');
    return (<button disabled={disabled || isLoading} className={combinedClasses} {...props}>
      {isLoading ? (<div className="flex items-center space-x-2">
          <Spinner size={size === 'sm' ? 'sm' : 'md'}/>
          <span>Cargando...</span>
        </div>) : (children)}
    </button>);
};
