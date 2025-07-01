import { Button } from '../atoms/Button';
import { Typography } from '../atoms/Typography';
import type { ListViewAction } from '../types';

export interface ActionBarProps<T = any> {
  actions?: ListViewAction<T>[];
  selectedItems: T[];
  selectedCount: number;
  totalCount: number;
  onSelectAll?: (selected: boolean) => void;
  className?: string;
}

export const ActionBar = <T,>({
  actions = [],
  selectedItems,
  selectedCount,
  totalCount,
  onSelectAll,
  className = '',
}: ActionBarProps<T>) => {
  const isAllSelected = selectedCount === totalCount && totalCount > 0;
  const isIndeterminate = selectedCount > 0 && selectedCount < totalCount;

  const handleActionClick = (action: ListViewAction<T>) => {
    if (action.confirmMessage) {
      if (window.confirm(action.confirmMessage)) {
        action.onClick(selectedItems);
      }
    } else {
      action.onClick(selectedItems);
    }
  };

  const availableActions = actions.filter(action => 
    !action.requiresSelection || selectedCount > 0
  );

  const bulkActions = availableActions.filter(action => action.requiresSelection);
  const generalActions = availableActions.filter(action => !action.requiresSelection);

  return (
    <div className={`flex items-center justify-between bg-white px-4 py-3 border-b border-gray-100 ${className}`}>
      <div className="flex items-center space-x-4">
        {/* Selector de todos */}
        {onSelectAll && totalCount > 0 && (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={isAllSelected}
              ref={(input) => {
                if (input) {
                  input.indeterminate = isIndeterminate;
                }
              }}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              aria-label="Seleccionar todos los elementos"
            />
            <Typography variant="body2" color="secondary" className="ml-2">
              {selectedCount > 0 
                ? `${selectedCount} de ${totalCount} seleccionados`
                : `Seleccionar todos (${totalCount})`
              }
            </Typography>
          </div>
        )}

        {/* Acciones de selección múltiple */}
        {selectedCount > 0 && bulkActions.length > 0 && (
          <div className="flex items-center space-x-2">
            <div className="h-4 border-l border-gray-300" />
            {bulkActions.map((action) => (
              <Button
                key={action.key}
                variant={action.variant || 'secondary'}
                size="sm"
                onClick={() => handleActionClick(action)}
                disabled={action.disabled}
                leftIcon={action.icon}
              >
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Acciones generales */}
      {generalActions.length > 0 && (
        <div className="flex items-center space-x-2">
          {generalActions.map((action) => (
            <Button
              key={action.key}
              variant={action.variant || 'primary'}
              size="sm"
              onClick={() => handleActionClick(action)}
              disabled={action.disabled}
              leftIcon={action.icon}
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};
