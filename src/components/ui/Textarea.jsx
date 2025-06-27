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
export var Textarea = function (_a) {
    var label = _a.label, error = _a.error, helperText = _a.helperText, id = _a.id, _b = _a.className, className = _b === void 0 ? '' : _b, props = __rest(_a, ["label", "error", "helperText", "id", "className"]);
    var baseClasses = 'w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none';
    var errorClasses = error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300';
    return (<div className="mb-4">
      {label && (<label htmlFor={id} className="block mb-1 font-medium text-gray-700">
          {label}
        </label>)}
      
      <textarea id={id} className={"".concat(baseClasses, " ").concat(errorClasses, " ").concat(className)} {...props}/>
      
      {error && (<p className="mt-1 text-sm text-red-600">{error}</p>)}
      
      {helperText && !error && (<p className="mt-1 text-sm text-gray-500">{helperText}</p>)}
    </div>);
};
