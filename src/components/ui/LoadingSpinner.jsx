var sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
};
export function LoadingSpinner(_a) {
    var _b = _a.size, size = _b === void 0 ? 'md' : _b, _c = _a.className, className = _c === void 0 ? '' : _c, _d = _a.color, color = _d === void 0 ? 'text-blue-600' : _d;
    var sizeClass = sizeClasses[size];
    return (<div className={"flex items-center justify-center ".concat(className)}>
      <div className={"animate-spin rounded-full border-2 border-t-transparent ".concat(sizeClass, " ").concat(color)} style={{ borderColor: 'currentColor', borderTopColor: 'transparent' }}/>
    </div>);
}
