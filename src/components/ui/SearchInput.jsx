export function SearchInput(_a) {
    var _b = _a.placeholder, placeholder = _b === void 0 ? 'Buscar...' : _b, value = _a.value, onChange = _a.onChange, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.disabled, disabled = _d === void 0 ? false : _d;
    var handleChange = function (e) {
        onChange(e.target.value);
    };
    return (<div className={"relative ".concat(className)}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg className="h-5 w-5 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
      
      <input type="text" placeholder={placeholder} value={value} onChange={handleChange} disabled={disabled} className={"\n          block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md\n          leading-5 bg-white placeholder-gray-500 \n          focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500\n          disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed\n          sm:text-sm\n        "}/>
    </div>);
}
