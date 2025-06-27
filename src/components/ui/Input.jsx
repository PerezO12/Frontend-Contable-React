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
import { forwardRef } from 'react';
export var Input = forwardRef(function (_a, ref) {
    var label = _a.label, error = _a.error, helperText = _a.helperText, _b = _a.className, className = _b === void 0 ? '' : _b, props = __rest(_a, ["label", "error", "helperText", "className"]);
    var inputClasses = [
        'input',
        error ? 'border-red-500 focus:ring-red-500' : '',
        className
    ].filter(Boolean).join(' ');
    return (<div className="space-y-1">
        {label && (<label className="block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>)}
        
        <input ref={ref} className={inputClasses} {...props}/>
        
        {error && (<p className="text-sm text-red-600 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {error}
          </p>)}
        
        {helperText && !error && (<p className="text-sm text-gray-500">{helperText}</p>)}
      </div>);
});
Input.displayName = 'Input';
