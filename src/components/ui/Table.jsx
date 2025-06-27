export function Table(_a) {
    var columns = _a.columns, data = _a.data, _b = _a.loading, loading = _b === void 0 ? false : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.emptyMessage, emptyMessage = _d === void 0 ? 'No hay datos disponibles' : _d;
    return (<div className={"overflow-x-auto ".concat(className)}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(function (column) { return (<th key={column.key} className={"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ".concat(column.className || '')}>
                {column.label}
              </th>); })}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (<tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-500">Cargando...</span>
                </div>
              </td>
            </tr>) : data.length === 0 ? (<tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                {emptyMessage}
              </td>
            </tr>) : (data.map(function (item, index) { return (<tr key={item.id || index} className="hover:bg-gray-50">
                {columns.map(function (column) { return (<td key={column.key} className={"px-6 py-4 whitespace-nowrap text-sm ".concat(column.className || '')}>
                    {column.render ? column.render(item) : item[column.key]}
                  </td>); })}
              </tr>); }))}
        </tbody>
      </table>
    </div>);
}
