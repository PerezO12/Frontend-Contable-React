import React, { useState } from 'react';
import { DataTable } from '../DataTable';
import { Button } from '../Button';
import { Input } from '../Input';
import { ExportControls } from '../ExportControls';

// Ejemplo de tipo de datos
interface ExampleItem {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

// Ejemplo de tipo de filtros
interface ExampleFilters {
  page: number;
  size: number;
  search?: string;
  status?: string;
}

// Datos de ejemplo
const exampleData: ExampleItem[] = Array.from({ length: 10 }, (_, i) => ({
  id: `item-${i + 1}`,
  name: `Elemento ${i + 1}`,
  description: `Descripción del elemento ${i + 1}`,
  status: i % 3 === 0 ? 'active' : i % 3 === 1 ? 'inactive' : 'pending',
  createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString()
}));

export const DataTableExample: React.FC = () => {
  // Estado para filtros
  const [filters, setFilters] = useState<ExampleFilters>({
    page: 1,
    size: 50
  });
  
  // Estado para búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  
  // Simular paginación
  const pagination = {
    total: 100,
    page: filters.page,
    pages: 10,
    perPage: filters.size
  };
  
  // Manejadores
  const handleFilterChange = (key: keyof ExampleFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    console.log('Filtros actualizados:', newFilters);
  };
  
  const handleClearFilters = () => {
    setSearchTerm('');
    setFilters({
      page: 1,
      size: 50
    });
    console.log('Filtros limpiados');
  };
  
  const handleSearch = () => {
    handleFilterChange('search', searchTerm);
  };
  
  const handleExport = async (format: 'csv' | 'json' | 'xlsx') => {
    console.log(`Exportando en formato ${format}`);
    // Simular una operación asíncrona
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Exportación completada');
  };
  
  // Renderizar columnas
  const renderColumns = () => (
    <>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Nombre
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Descripción
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Estado
      </th>
      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Fecha
      </th>
    </>
  );
  
  // Renderizar fila
  const renderRow = (item: ExampleItem, isSelected: boolean, onSelect: (id: string) => void) => (
    <tr key={item.id} className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(item.id)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm font-medium text-gray-900">{item.name}</div>
      </td>
      <td className="px-6 py-4">
        <div className="text-sm text-gray-500">{item.description}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
          ${item.status === 'active' ? 'bg-green-100 text-green-800' : 
          item.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
          'bg-yellow-100 text-yellow-800'}`}
        >
          {item.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(item.createdAt).toLocaleDateString()}
      </td>
    </tr>
  );
  
  // Contenido de los filtros
  const filterContent = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Búsqueda */}
      <div className="md:col-span-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Buscar
        </label>
        <div className="flex space-x-2">
          <Input
            placeholder="Nombre, descripción..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button 
            onClick={handleSearch}
            variant="secondary"
          >
            Buscar
          </Button>
        </div>
      </div>

      {/* Estado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Estado
        </label>
        <select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
          className="form-select w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activo</option>
          <option value="inactive">Inactivo</option>
          <option value="pending">Pendiente</option>
        </select>
      </div>
    </div>
  );
  
  // Acciones para filtros
  const filterActions = (
    <ExportControls
      selectedIds={[]}
      selectedCount={0}
      onExport={handleExport}
    />
  );
  
  // Acciones para elementos seleccionados
  const bulkActions = (
    <Button
      variant="outline"
      size="sm"
      className="border-red-300 text-red-700 hover:bg-red-100"
    >
      🗑️ Eliminar
    </Button>
  );

  return (
    <DataTable<ExampleItem, ExampleFilters>
      title="Ejemplo de DataTable"
      description="Una tabla de datos de ejemplo usando componentes estandarizados"
      data={exampleData}
      renderColumns={renderColumns}
      renderRow={renderRow}
      pagination={pagination}
      filters={filters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      onPageChange={(page) => handleFilterChange('page', page)}
      onPageSizeChange={(size) => handleFilterChange('size', size)}
      getItemId={(item) => item.id}
      primaryAction={{
        label: 'Nuevo elemento',
        onClick: () => console.log('Crear nuevo elemento'),
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        )
      }}
      filterContent={filterContent}
      filterActions={filterActions}
      bulkActions={bulkActions}
      selectionText="elementos"
      emptyStateProps={{
        title: "No hay elementos",
        description: "No se encontraron elementos que coincidan con los filtros aplicados.",
        action: (
          <Button 
            onClick={() => console.log('Crear nuevo elemento')}
            variant="primary"
          >
            Crear elemento
          </Button>
        )
      }}
    />
  );
}; 