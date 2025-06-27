export function Select(_a) {
    var placeholder = _a.placeholder, value = _a.value, onChange = _a.onChange, options = _a.options, _b = _a.className, className = _b === void 0 ? '' : _b, _c = _a.disabled, disabled = _c === void 0 ? false : _c, error = _a.error;
    var handleChange = function (e) {
        onChange(e.target.value);
    };
    return (<div className={className}>
      <select value={value} onChange={handleChange} disabled={disabled} className={"\n          block w-full px-3 py-2 border border-gray-300 rounded-md\n          bg-white text-gray-900 placeholder-gray-500\n          focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500\n          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed\n          sm:text-sm\n          ".concat(error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '', "\n        ")}>
        {placeholder && (<option value="" disabled>
            {placeholder}
          </option>)}
        {options.map(function (option) { return (<option key={option.value} value={option.value}>
            {option.label}
          </option>); })}
      </select>
      
      {error && (<p className="mt-1 text-sm text-red-600">
          {error}
        </p>)}
    </div>);
}
