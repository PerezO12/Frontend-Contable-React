/**
 * Modal para seleccionar formato de exportación
 */
import { Modal } from './Modal';
import { Button } from './Button';
export function ExportFormatModal(_a) {
    var open = _a.open, onClose = _a.onClose, onExport = _a.onExport, _b = _a.title, title = _b === void 0 ? 'Exportar Datos' : _b, _c = _a.description, description = _c === void 0 ? 'Selecciona el formato de exportación' : _c, _d = _a.loading, loading = _d === void 0 ? false : _d;
    var handleExport = function (format) {
        onExport(format);
        onClose();
    };
    return (<Modal isOpen={open} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-gray-600">
          {description}
        </p>
        
        <div className="grid grid-cols-1 gap-3">
          <Button onClick={function () { return handleExport('xlsx'); }} disabled={loading} className="justify-start p-4 h-auto bg-green-50 hover:bg-green-100 border-green-200 text-green-800" variant="outline">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white font-bold text-sm">
                XL
              </div>
              <div className="text-left">
                <div className="font-semibold">Excel (.xlsx)</div>
                <div className="text-sm text-green-600">Ideal para análisis y cálculos</div>
              </div>
            </div>
          </Button>

          <Button onClick={function () { return handleExport('csv'); }} disabled={loading} className="justify-start p-4 h-auto bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-800" variant="outline">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-sm">
                CSV
              </div>
              <div className="text-left">
                <div className="font-semibold">CSV (.csv)</div>
                <div className="text-sm text-blue-600">Formato universal, compatible con todo</div>
              </div>
            </div>
          </Button>

          <Button onClick={function () { return handleExport('json'); }} disabled={loading} className="justify-start p-4 h-auto bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-800" variant="outline">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center text-white font-bold text-sm">
                JSON
              </div>
              <div className="text-left">
                <div className="font-semibold">JSON (.json)</div>
                <div className="text-sm text-purple-600">Para desarrolladores y APIs</div>
              </div>
            </div>
          </Button>
        </div>
        
        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
        </div>
      </div>
    </Modal>);
}
