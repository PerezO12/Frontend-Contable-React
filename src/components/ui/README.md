# Componentes de Tabla Estandarizados

Este conjunto de componentes proporciona una interfaz estandarizada para todas las tablas de datos en la aplicación, asegurando consistencia en la experiencia de usuario.

## Componentes Disponibles

### 1. DataTable

El componente principal que integra todos los demás componentes para crear una tabla de datos completa.

```tsx
import { DataTable } from '../components/ui/TableComponents';

<DataTable<YourDataType, YourFiltersType>
  title="Título de la tabla"
  description="Descripción opcional"
  data={yourData}
  renderColumns={renderColumnsFunction}
  renderRow={renderRowFunction}
  pagination={paginationObject}
  filters={filtersObject}
  onFilterChange={handleFilterChange}
  onClearFilters={handleClearFilters}
  onPageChange={handlePageChange}
  onPageSizeChange={handlePageSizeChange}
  getItemId={(item) => item.id}
  primaryAction={{
    label: "Nuevo",
    onClick: handleCreateNew,
    icon: <YourIcon />
  }}
  filterContent={yourFilterContent}
  filterActions={yourFilterActions}
  bulkActions={yourBulkActions}
  selectionText="elementos"
/>
```

### 2. TableActionBar

Barra superior con título, descripción y acciones principales.

```tsx
import { TableActionBar } from '../components/ui/TableComponents';

<TableActionBar
  title="Título"
  description="Descripción"
  pagination={paginationObject}
  showFilters={showFilters}
  onToggleFilters={toggleFilters}
  onPageSizeChange={handlePageSizeChange}
  pageSize={50}
  primaryAction={{
    label: "Nuevo",
    onClick: handleCreateNew,
    icon: <YourIcon />
  }}
  additionalActions={<YourAdditionalActions />}
/>
```

### 3. TableFilters

Contenedor para los filtros de la tabla.

```tsx
import { TableFilters } from '../components/ui/TableComponents';

<TableFilters
  onClearFilters={handleClearFilters}
  actions={<YourFilterActions />}
>
  <YourFilterContent />
</TableFilters>
```

### 4. TableBulkActions

Muestra acciones para elementos seleccionados.

```tsx
import { TableBulkActions } from '../components/ui/TableComponents';

<TableBulkActions
  selectedCount={selectedItems.size}
  actions={<YourBulkActions />}
  selectionText="elementos"
/>
```

### 5. TablePagination

Control de paginación para tablas.

```tsx
import { TablePagination } from '../components/ui/TableComponents';

<TablePagination
  total={100}
  page={currentPage}
  pages={totalPages}
  perPage={itemsPerPage}
  onPageChange={handlePageChange}
/>
```

### 6. ExportControls

Control para exportar datos en diferentes formatos.

```tsx
import { ExportControls } from '../components/ui/TableComponents';

<ExportControls
  selectedIds={selectedItemIds}
  selectedCount={selectedItemIds.length}
  onExport={handleExport}
  exportButtonText="Exportar"
  itemsText="registros"
/>
```

## Ejemplo Completo

Para ver un ejemplo completo de implementación, consulta el archivo:

```
src/components/ui/examples/DataTableExample.tsx
```

## Beneficios

- **Consistencia**: Asegura que todas las tablas de la aplicación tengan el mismo aspecto y comportamiento.
- **Mantenibilidad**: Facilita los cambios globales en la interfaz de usuario.
- **Reutilización**: Reduce la duplicación de código entre diferentes módulos.
- **Experiencia de usuario**: Proporciona una experiencia coherente en toda la aplicación.

## Migración

Para migrar una tabla existente a estos componentes estandarizados:

1. Identifica los elementos comunes en tu tabla actual (filtros, paginación, etc.).
2. Adapta tus manejadores de eventos para que sean compatibles con las interfaces de los componentes.
3. Utiliza el componente `DataTable` como base y personaliza según sea necesario.
4. Prueba que todas las funcionalidades existentes sigan funcionando correctamente. 