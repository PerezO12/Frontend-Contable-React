export function EmptyState(_a) {
    var title = _a.title, description = _a.description, icon = _a.icon, action = _a.action, _b = _a.className, className = _b === void 0 ? '' : _b;
    return (<div className={"text-center py-12 ".concat(className)}>
      {icon && (<div className="mx-auto h-12 w-12 text-gray-400 mb-4">
          {icon}
        </div>)}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (<p className="text-gray-500 mb-6 max-w-sm mx-auto">
          {description}
        </p>)}
      
      {action && action}
    </div>);
}
