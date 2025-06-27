var colorClasses = {
    gray: {
        subtle: 'bg-gray-50 text-gray-700 border-gray-200',
        solid: 'bg-gray-600 text-white'
    },
    red: {
        subtle: 'bg-red-50 text-red-700 border-red-200',
        solid: 'bg-red-600 text-white'
    },
    yellow: {
        subtle: 'bg-yellow-50 text-yellow-700 border-yellow-200',
        solid: 'bg-yellow-600 text-white'
    },
    green: {
        subtle: 'bg-green-50 text-green-700 border-green-200',
        solid: 'bg-green-600 text-white'
    },
    blue: {
        subtle: 'bg-blue-50 text-blue-700 border-blue-200',
        solid: 'bg-blue-600 text-white'
    },
    indigo: {
        subtle: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        solid: 'bg-indigo-600 text-white'
    },
    purple: {
        subtle: 'bg-purple-50 text-purple-700 border-purple-200',
        solid: 'bg-purple-600 text-white'
    },
    pink: {
        subtle: 'bg-pink-50 text-pink-700 border-pink-200',
        solid: 'bg-pink-600 text-white'
    },
    orange: {
        subtle: 'bg-orange-50 text-orange-700 border-orange-200',
        solid: 'bg-orange-600 text-white'
    },
    emerald: {
        subtle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        solid: 'bg-emerald-600 text-white'
    }
};
var sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-1.5 text-sm',
    lg: 'px-3 py-2 text-base'
};
export function Badge(_a) {
    var children = _a.children, _b = _a.variant, variant = _b === void 0 ? 'subtle' : _b, _c = _a.color, color = _c === void 0 ? 'gray' : _c, _d = _a.size, size = _d === void 0 ? 'sm' : _d, _e = _a.className, className = _e === void 0 ? '' : _e;
    var baseClasses = 'inline-flex items-center font-medium rounded-full border';
    var colorClass = colorClasses[color][variant];
    var sizeClass = sizeClasses[size];
    return (<span className={"".concat(baseClasses, " ").concat(colorClass, " ").concat(sizeClass, " ").concat(className)}>
      {children}
    </span>);
}
