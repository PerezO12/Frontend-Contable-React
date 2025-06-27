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
 * Página de detalle de journal
 * Muestra información completa de un journal específico
 */
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useJournal, useJournalStats, useJournalSequence } from '../hooks/useJournals';
import { JournalTypeLabels, JournalTypeColors } from '../types';
import { formatDate } from '@/shared/utils/formatters';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/shared/contexts/ToastContext';
import { ArrowLeftIcon, PencilIcon, DocumentTextIcon, TrashIcon, ArrowPathIcon, } from '@/shared/components/icons';
export function JournalDetailPage() {
    var _this = this;
    var _a;
    var id = useParams().id;
    var navigate = useNavigate();
    var _b = useToast(), showSuccess = _b.showSuccess, showError = _b.showError;
    // Estados locales
    var _c = useState(false), showDeleteDialog = _c[0], setShowDeleteDialog = _c[1];
    var _d = useState(false), showResetDialog = _d[0], setShowResetDialog = _d[1];
    var _e = useState(''), resetReason = _e[0], setResetReason = _e[1];
    var _f = useState('info'), activeTab = _f[0], setActiveTab = _f[1];
    // Hooks
    var _g = useJournal(id), journal = _g.journal, loading = _g.loading, error = _g.error, deleteJournal = _g.delete, resetSequence = _g.resetSequence, clearError = _g.clearError;
    var _h = useJournalStats(id || '', !!id), stats = _h.stats, statsLoading = _h.loading, refreshStats = _h.refresh;
    var _j = useJournalSequence(id || '', !!id), sequenceInfo = _j.sequenceInfo, sequenceLoading = _j.loading, refreshSequence = _j.refresh;
    useEffect(function () {
        clearError();
    }, [clearError]);
    if (loading) {
        return (<div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg"/>
      </div>);
    }
    if (error) {
        return (<div className="text-center py-12">
        <div className="text-red-600 mb-4">{error}</div>
        <Button onClick={function () { return navigate('/journals'); }} variant="outline">
          Volver a Journals
        </Button>
      </div>);
    }
    if (!journal) {
        return (<div className="text-center py-12">
        <div className="text-gray-600 mb-4">Journal no encontrado</div>
        <Button onClick={function () { return navigate('/journals'); }} variant="outline">
          Volver a Journals
        </Button>
      </div>);
    }
    // Handlers
    var handleEdit = function () {
        navigate("/journals/".concat(journal.id, "/edit"));
    };
    var handleDelete = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, deleteJournal()];
                case 1:
                    _a.sent();
                    showSuccess('Journal eliminado exitosamente');
                    navigate('/journals');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    showError(error_1.message || 'Error al eliminar journal');
                    return [3 /*break*/, 3];
                case 3:
                    setShowDeleteDialog(false);
                    return [2 /*return*/];
            }
        });
    }); };
    var handleResetSequence = function () { return __awaiter(_this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!resetReason.trim()) {
                        showError('Debe proporcionar una razón para resetear la secuencia');
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, resetSequence({
                            confirm: true,
                            reason: resetReason,
                        })];
                case 2:
                    _a.sent();
                    showSuccess('Secuencia reseteada exitosamente');
                    setShowResetDialog(false);
                    setResetReason('');
                    refreshSequence();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    showError(error_2.message || 'Error al resetear secuencia');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleGoToJournalEntries = function () {
        navigate("/journal-entries?journal_id=".concat(journal.id));
    };
    // Renderizar pestañas
    var renderTabButton = function (tabId, label) { return (<button onClick={function () { return setActiveTab(tabId); }} className={"px-4 py-2 font-medium text-sm rounded-lg transition-colors ".concat(activeTab === tabId
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')}>
      {label}
    </button>); };
    return (<div className="container mx-auto px-4 py-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={function () { return navigate('/journals'); }} variant="outline" size="sm">
              <ArrowLeftIcon className="h-4 w-4 mr-2"/>
              Volver
            </Button>
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold text-gray-900">{journal.name}</h1>
                <Badge className={JournalTypeColors[journal.type]}>
                  {JournalTypeLabels[journal.type]}
                </Badge>
                {!journal.is_active && (<Badge className="bg-red-100 text-red-800">
                    Inactivo
                  </Badge>)}
              </div>
              <p className="text-gray-600 mt-1">
                Código: {journal.code} • Prefijo: {journal.sequence_prefix}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button onClick={handleGoToJournalEntries} variant="outline" size="sm">
              <DocumentTextIcon className="h-4 w-4 mr-2"/>
              Ver Asientos
            </Button>
            <Button onClick={handleEdit} variant="outline" size="sm">
              <PencilIcon className="h-4 w-4 mr-2"/>
              Editar
            </Button>
            <Button onClick={function () { return setShowDeleteDialog(true); }} variant="danger" size="sm">
              <TrashIcon className="h-4 w-4 mr-2"/>
              Eliminar
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2">
          {renderTabButton('info', 'Información')}
          {renderTabButton('stats', 'Estadísticas')}
          {renderTabButton('sequence', 'Secuencia')}
        </div>

        {/* Contenido según pestaña activa */}
        {activeTab === 'info' && (<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Información básica */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información Básica
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Nombre</label>
                  <p className="text-sm text-gray-900">{journal.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Código</label>
                  <p className="text-sm text-gray-900">{journal.code}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Tipo</label>
                  <p className="text-sm text-gray-900">{JournalTypeLabels[journal.type]}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Descripción</label>
                  <p className="text-sm text-gray-900">{journal.description || 'Sin descripción'}</p>
                </div>
              </div>
            </Card>

            {/* Configuración */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Configuración
              </h2>              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Prefijo de Secuencia</label>
                  <p className="text-sm text-gray-900">{journal.sequence_prefix}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relleno de Secuencia</label>
                  <p className="text-sm text-gray-900">{journal.sequence_padding} dígitos</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Cuenta por Defecto</label>
                  <p className="text-sm text-gray-900">
                    {journal.default_account
                ? "".concat(journal.default_account.code, " - ").concat(journal.default_account.name)
                : 'Sin cuenta por defecto'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Incluir Año</label>
                    <p className="text-sm text-gray-900">
                      {journal.include_year_in_sequence ? 'Sí' : 'No'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Reset Anual</label>
                    <p className="text-sm text-gray-900">
                      {journal.reset_sequence_yearly ? 'Sí' : 'No'}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Requiere Validación</label>
                    <p className="text-sm text-gray-900">
                      {journal.requires_validation ? 'Sí' : 'No'}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Asientos Manuales</label>
                    <p className="text-sm text-gray-900">
                      {journal.allow_manual_entries ? 'Permitidos' : 'No permitidos'}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Auditoría */}
            <Card className="p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Información de Auditoría
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Fecha de Creación</label>
                  <p className="text-sm text-gray-900">{formatDate(journal.created_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Última Actualización</label>
                  <p className="text-sm text-gray-900">{formatDate(journal.updated_at)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Creado Por</label>
                  <p className="text-sm text-gray-900">{((_a = journal.created_by) === null || _a === void 0 ? void 0 : _a.name) || 'Sistema'}</p>
                </div>
              </div>
            </Card>
          </div>)}

        {activeTab === 'stats' && (<Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Estadísticas</h2>
              <Button onClick={refreshStats} variant="outline" size="sm" disabled={statsLoading}>
                <ArrowPathIcon className="h-4 w-4 mr-2"/>
                Actualizar
              </Button>
            </div>
            
            {statsLoading ? (<div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>) : stats ? (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.total_entries}</div>
                  <div className="text-sm text-gray-600">Total de Asientos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.total_entries_current_year}</div>
                  <div className="text-sm text-gray-600">Este Año</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{stats.total_entries_current_month}</div>
                  <div className="text-sm text-gray-600">Este Mes</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.avg_entries_per_month.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Promedio Mensual</div>
                </div>
                {stats.last_entry_date && (<div className="text-center md:col-span-2 lg:col-span-4">
                    <div className="text-sm text-gray-600">
                      Último asiento: {formatDate(stats.last_entry_date)}
                    </div>
                  </div>)}
              </div>) : (<div className="text-center py-8 text-gray-500">
                No hay estadísticas disponibles
              </div>)}
          </Card>)}

        {activeTab === 'sequence' && (<Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Información de Secuencia</h2>
              <div className="flex space-x-2">
                <Button onClick={refreshSequence} variant="outline" size="sm" disabled={sequenceLoading}>
                  <ArrowPathIcon className="h-4 w-4 mr-2"/>
                  Actualizar
                </Button>
                <Button onClick={function () { return setShowResetDialog(true); }} variant="danger" size="sm">
                  <ArrowPathIcon className="h-4 w-4 mr-2"/>
                  Resetear Secuencia
                </Button>
              </div>
            </div>
            
            {sequenceLoading ? (<div className="flex justify-center py-8">
                <LoadingSpinner />
              </div>) : sequenceInfo ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-500">Número Actual</label>
                  <p className="text-lg font-semibold text-gray-900">{sequenceInfo.current_sequence_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Próximo Número</label>
                  <p className="text-lg font-semibold text-blue-600">{sequenceInfo.next_sequence_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Último Reset</label>
                  <p className="text-sm text-gray-900">
                    {sequenceInfo.last_sequence_reset_year || 'Nunca'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Configuración</label>
                  <div className="text-sm text-gray-900">
                    <p>Incluir año: {sequenceInfo.include_year_in_sequence ? 'Sí' : 'No'}</p>
                    <p>Reset anual: {sequenceInfo.reset_sequence_yearly ? 'Sí' : 'No'}</p>
                  </div>
                </div>
              </div>) : (<div className="text-center py-8 text-gray-500">
                No hay información de secuencia disponible
              </div>)}
          </Card>)}        {/* Diálogo de confirmación para eliminar */}
        <ConfirmDialog open={showDeleteDialog} onClose={function () { return setShowDeleteDialog(false); }} onConfirm={handleDelete} title="Eliminar Journal" description={"\u00BFEst\u00E1 seguro que desea eliminar el journal \"".concat(journal === null || journal === void 0 ? void 0 : journal.name, "\"? Esta acci\u00F3n no se puede deshacer.")} confirmText="Eliminar" confirmButtonClass="bg-red-600 hover:bg-red-700"/>

        {/* Diálogo para resetear secuencia */}
        <ConfirmDialog open={showResetDialog} onClose={function () {
            setShowResetDialog(false);
            setResetReason('');
        }} onConfirm={handleResetSequence} title="Resetear Secuencia" description="¿Está seguro que desea resetear la secuencia? Esto reiniciará el contador a 0." confirmText="Resetear" confirmButtonClass="bg-red-600 hover:bg-red-700"/>
      </div>
    </div>);
}
export default JournalDetailPage;
