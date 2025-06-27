var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
/**
 * Componente principal de listado de journals
 * Similar al diseño de facturas pero adaptado para journals
 */
import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournals } from '../hooks/useJournals';
import { JournalTypeLabels, JournalTypeColors, JournalTypeConst } from '../types';
import { formatDate } from '@/shared/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useToast } from '@/shared/contexts/ToastContext';
import { PlusIcon, MagnifyingGlassIcon, DocumentTextIcon, } from '@/shared/components/icons';
export function JournalList(_a) {
    var _this = this;
    var onJournalSelect = _a.onJournalSelect, _b = _a.showActions, showActions = _b === void 0 ? true : _b;
    var navigate = useNavigate();
    var _c = useToast(), showSuccess = _c.showSuccess, showError = _c.showError;
    // Estados locales
    var _d = useState(0), currentPage = _d[0], setCurrentPage = _d[1];
    var _e = useState(50), pageSize = _e[0], setPageSize = _e[1];
    var _f = useState(''), searchTerm = _f[0], setSearchTerm = _f[1];
    var _g = useState(''), typeFilter = _g[0], setTypeFilter = _g[1];
    var _h = useState(''), activeFilter = _h[0], setActiveFilter = _h[1];
    var _j = useState(false), showFilters = _j[0], setShowFilters = _j[1];
    // Memoizar filtros para evitar recreación en cada render
    var filters = useMemo(function () { return (__assign(__assign(__assign({}, (searchTerm && { search: searchTerm })), (typeFilter && { type: typeFilter })), (activeFilter && { is_active: activeFilter === 'true' }))); }, [searchTerm, typeFilter, activeFilter]);
    // Memoizar paginación para evitar recreación en cada render
    var pagination = useMemo(function () { return ({
        skip: currentPage * pageSize,
        limit: pageSize,
        order_by: 'name',
        order_dir: 'asc',
    }); }, [currentPage, pageSize]);
    // Hook para journals con autoFetch deshabilitado para control manual
    var _k = useJournals(undefined, undefined, false), journals = _k.journals, loading = _k.loading, error = _k.error, total = _k.total, fetchJournals = _k.fetchJournals, clearError = _k.clearError, refresh = _k.refresh;
    // Función memoizada para fetch de journals
    var performFetch = useCallback(function (newFilters, newPagination) {
        fetchJournals(newFilters, newPagination);
    }, [fetchJournals]);
    // Efecto inicial para cargar datos
    useEffect(function () {
        performFetch(filters, pagination);
    }, []); // Solo ejecutar una vez al montar
    // Manejar cambios en filtros con debounce
    useEffect(function () {
        var timeoutId = setTimeout(function () {
            setCurrentPage(0); // Reset a primera página cuando cambian filtros
            var resetPagination = __assign(__assign({}, pagination), { skip: 0 });
            performFetch(filters, resetPagination);
        }, 300); // Debounce
        return function () { return clearTimeout(timeoutId); };
    }, [searchTerm, typeFilter, activeFilter, pageSize]); // Solo dependencias de filtros
    // Manejar cambio de página
    useEffect(function () {
        if (currentPage > 0) { // Solo fetch si no es página inicial
            performFetch(filters, pagination);
        }
    }, [currentPage]); // Solo dependencia de página
    // Limpiar errores solo al montar
    useEffect(function () {
        clearError();
    }, []); // Solo ejecutar una vez
    // Handlers
    var handleJournalClick = function (journal) {
        if (onJournalSelect) {
            onJournalSelect(journal);
        }
        else {
            navigate("/journals/".concat(journal.id));
        }
    };
    var handleCreateJournal = function () {
        navigate('/journals/new');
    };
    var handleRefresh = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, refresh()];
                case 1:
                    _a.sent();
                    showSuccess('Lista de journals actualizada');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    showError('Error al actualizar la lista');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Calcular paginación
    var totalPages = Math.ceil(total / pageSize);
    var startItem = currentPage * pageSize + 1;
    var endItem = Math.min((currentPage + 1) * pageSize, total);
    // Opciones para filtros
    var typeOptions = [
        { value: '', label: 'Todos los tipos' },
        { value: JournalTypeConst.SALE, label: JournalTypeLabels.sale },
        { value: JournalTypeConst.PURCHASE, label: JournalTypeLabels.purchase },
        { value: JournalTypeConst.CASH, label: JournalTypeLabels.cash },
        { value: JournalTypeConst.BANK, label: JournalTypeLabels.bank },
        { value: JournalTypeConst.MISCELLANEOUS, label: JournalTypeLabels.miscellaneous },
    ];
    var activeOptions = [
        { value: '', label: 'Todos' },
        { value: 'true', label: 'Activos' },
        { value: 'false', label: 'Inactivos' },
    ];
    var pageSizeOptions = [
        { value: '25', label: '25 por página' },
        { value: '50', label: '50 por página' },
        { value: '100', label: '100 por página' },
    ];
    if (error) {
        return (<div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={handleRefresh} variant="outline">
          Reintentar
        </Button>
      </div>);
    }
    return (<div className="space-y-6">
      {/* Header con título y acciones */}
      <div className="flex justify-between items-center">        <div className="flex items-center space-x-3">
          <DocumentTextIcon className="h-8 w-8 text-blue-600"/>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Journals</h1>
            <p className="text-gray-600">
              Gestión de diarios contables
            </p>
          </div>
        </div>
        
        {showActions && (<div className="flex items-center space-x-3">
            <Button onClick={handleRefresh} variant="outline" disabled={loading}>
              Actualizar
            </Button>
            <Button onClick={handleCreateJournal} className="bg-blue-600 hover:bg-blue-700">
              <PlusIcon className="h-4 w-4 mr-2"/>
              Nuevo Journal
            </Button>
          </div>)}
      </div>

      {/* Filtros y búsqueda */}
      <Card className="p-4">
        <div className="space-y-4">
          {/* Barra de búsqueda principal */}
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
              <Input type="text" placeholder="Buscar journals por nombre, código o descripción..." value={searchTerm} onChange={function (e) { return setSearchTerm(e.target.value); }} className="pl-10"/>
            </div>
            <Button onClick={function () { return setShowFilters(!showFilters); }} variant="outline" className="flex items-center space-x-2">
              <DocumentTextIcon className="h-4 w-4"/>
              <span>Filtros</span>
            </Button>
          </div>

          {/* Filtros expandidos */}
          {showFilters && (<div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Journal
                </label>                <Select value={typeFilter} onChange={setTypeFilter} options={typeOptions}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>                <Select value={activeFilter} onChange={setActiveFilter} options={activeOptions}/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resultados por página
                </label>                <Select value={pageSize.toString()} onChange={function (value) {
                setPageSize(Number(value));
                setCurrentPage(0);
            }} options={pageSizeOptions}/>
              </div>
            </div>)}
        </div>
      </Card>

      {/* Información de resultados */}
      {!loading && (<div className="flex justify-between items-center text-sm text-gray-600">
          <div>
            Mostrando {startItem} a {endItem} de {total} resultados
          </div>
          <div>
            Página {currentPage + 1} de {totalPages}
          </div>
        </div>)}

      {/* Lista de journals */}
      {loading ? (<div className="flex justify-center py-12">
          <LoadingSpinner size="lg"/>
        </div>) : journals.length === 0 ? (<EmptyState title="No hay journals" description="No se encontraron journals que coincidan con los criterios de búsqueda." action={showActions ? (<Button onClick={handleCreateJournal}>
                <PlusIcon className="h-4 w-4 mr-2"/>
                Crear primer journal
              </Button>) : null}/>) : (<div className="space-y-4">
          {/* Lista de journals */}
          <div className="space-y-3">
            {journals.map(function (journal) { return (<Card key={journal.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer" onClick={function () { return handleJournalClick(journal); }}>                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="h-5 w-5 text-blue-600"/>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 grid grid-cols-1 lg:grid-cols-3 gap-4">
                      {/* Columna 1: Información básica */}
                      <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {journal.name}
                          </h3>
                          <Badge className={JournalTypeColors[journal.type]}>
                            {JournalTypeLabels[journal.type]}
                          </Badge>
                          {!journal.is_active && (<Badge className="bg-red-100 text-red-800">
                              Inactivo
                            </Badge>)}
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <div>Código: {journal.code}</div>
                          <div>Prefijo: {journal.sequence_prefix}</div>
                        </div>
                      </div>
                      
                      {/* Columna 2: Cuenta por defecto */}
                      <div className="lg:col-span-1">
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Cuenta por Defecto</span>
                        </div>
                        {journal.default_account ? (<div className="text-sm">
                            <div className="font-medium text-blue-600">
                              {journal.default_account.code}
                            </div>
                            <div className="text-gray-900 truncate">
                              {journal.default_account.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {journal.default_account.account_type}
                            </div>
                          </div>) : (<div className="text-sm text-gray-400">
                            Sin cuenta por defecto
                          </div>)}
                      </div>
                      
                      {/* Columna 3: Estadísticas */}
                      <div className="lg:col-span-1">
                        <div className="mb-2">
                          <span className="text-sm font-medium text-gray-700">Estadísticas</span>
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                          <div>Secuencia: {journal.current_sequence_number}</div>
                          <div>{journal.total_journal_entries} asientos</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Creado: {formatDate(journal.created_at)}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>); })}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (<div className="flex items-center justify-between">
              <Button onClick={function () { return setCurrentPage(Math.max(0, currentPage - 1)); }} disabled={currentPage === 0} variant="outline">
                Anterior
              </Button>
              
              <div className="flex items-center space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, function (_, i) {
                    var page = currentPage < 3 ? i : currentPage - 2 + i;
                    if (page >= totalPages)
                        return null;
                    return (<Button key={page} onClick={function () { return setCurrentPage(page); }} variant={page === currentPage ? "primary" : "outline"} size="sm">
                      {page + 1}
                    </Button>);
                })}
              </div>
              
              <Button onClick={function () { return setCurrentPage(Math.min(totalPages - 1, currentPage + 1)); }} disabled={currentPage >= totalPages - 1} variant="outline">
                Siguiente
              </Button>
            </div>)}
        </div>)}
    </div>);
}
export default JournalList;
