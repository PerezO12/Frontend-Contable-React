/**
 * Componente ConfirmDialog
 */
import { Modal } from './Modal';
import { Button } from './Button';
export function ConfirmDialog(_a) {
    var open = _a.open, onClose = _a.onClose, onConfirm = _a.onConfirm, title = _a.title, description = _a.description, _b = _a.confirmText, confirmText = _b === void 0 ? 'Confirmar' : _b, _c = _a.cancelText, cancelText = _c === void 0 ? 'Cancelar' : _c, _d = _a.confirmButtonClass, confirmButtonClass = _d === void 0 ? 'bg-red-600 hover:bg-red-700' : _d, _e = _a.loading, loading = _e === void 0 ? false : _e;
    return (<Modal isOpen={open} onClose={onClose} title={title}>
      <div className="space-y-4">
        <p className="text-gray-600">
          {description}
        </p>
        
        <div className="flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            {cancelText}
          </Button>
          
          <Button onClick={onConfirm} disabled={loading} className={confirmButtonClass}>
            {loading ? 'Procesando...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>);
}
