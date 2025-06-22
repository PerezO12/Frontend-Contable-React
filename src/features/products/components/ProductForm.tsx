import React, { useState, useMemo } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { Spinner } from '../../../components/ui/Spinner';
import { useAccounts } from '../../accounts/hooks';
import { AccountType } from '../../accounts/types';
import { ProductService } from '../services';
import { 
  ProductType,
  ProductStatus,
  MeasurementUnit,
  TaxCategory,
  ProductTypeLabels,
  ProductStatusLabels,
  MeasurementUnitLabels,
  TaxCategoryLabels,
  type ProductCreate,
  type Product
} from '../types';

interface ProductFormProps {
  onSuccess?: (product: Product) => void;
  onCancel?: () => void;
  initialData?: Partial<ProductCreate>;
  isEditMode?: boolean;
  customSubmitHandler?: (data: ProductCreate) => Promise<Product>; // Handler personalizado
}

export const ProductForm: React.FC<ProductFormProps> = ({
  onSuccess,
  onCancel,
  initialData,
  isEditMode = false,
  customSubmitHandler
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInventoryFields, setShowInventoryFields] = useState(initialData?.manage_inventory || false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<ProductCreate>({
    code: '',
    name: '',
    description: '',
    product_type: ProductType.PRODUCT,
    category: '',
    subcategory: '',
    brand: '',
    status: ProductStatus.ACTIVE,
    measurement_unit: MeasurementUnit.UNIT,
    weight: 0,
    dimensions: '',
    purchase_price: 0,
    sale_price: 0,
    min_sale_price: 0,
    suggested_price: 0,    tax_category: TaxCategory.EXEMPT,
    tax_rate: 0,
    manage_inventory: false,
    current_stock: 0,
    min_stock: 0,
    max_stock: 0,
    reorder_point: 0,
    barcode: '',
    sku: '',
    internal_reference: '',
    supplier_reference: '',
    external_reference: '',
    notes: '',
    ...initialData
  });
  // Filtros estables para las cuentas
  const accountFilters = useMemo(() => ({ is_active: true }), []);
  const { accounts, loading: loadingAccounts } = useAccounts(accountFilters);  // Filtrar cuentas por tipo según la lógica contable
  const salesAccounts = accounts.filter(acc => 
    acc.account_type === AccountType.INGRESO && 
    acc.allows_movements &&
    (acc.name?.toLowerCase().includes('venta') || 
     acc.name?.toLowerCase().includes('ingreso') ||
     acc.name?.toLowerCase().includes('producto') ||
     acc.code.startsWith('4'))  // Mantener el filtro por código como respaldo
  );
  
  // Filtro alternativo para ventas si no se encuentran cuentas específicas
  const salesAccountsAlt = salesAccounts.length === 0 ? 
    accounts.filter(acc => acc.account_type === AccountType.INGRESO && acc.allows_movements) : 
    salesAccounts;
  
  const purchaseAccounts = accounts.filter(acc => 
    (acc.account_type === AccountType.GASTO || acc.account_type === AccountType.COSTOS) && 
    acc.allows_movements &&
    (acc.name?.toLowerCase().includes('compra') || 
     acc.name?.toLowerCase().includes('costo') ||
     acc.name?.toLowerCase().includes('inventario') ||
     acc.name?.toLowerCase().includes('mercader') ||
     acc.name?.toLowerCase().includes('producto') ||
     acc.code.startsWith('6'))  // Mantener el filtro por código como respaldo
  );

  // Filtro alternativo para compras si no se encuentran cuentas específicas
  const purchaseAccountsAlt = purchaseAccounts.length === 0 ? 
    accounts.filter(acc => 
      (acc.account_type === AccountType.GASTO || acc.account_type === AccountType.COSTOS) && 
      acc.allows_movements
    ) : 
    purchaseAccounts;

  // Debug: Mostrar información de las cuentas filtradas
  React.useEffect(() => {
    if (accounts.length > 0) {
      console.log('Total de cuentas disponibles:', accounts.length);
      console.log('Cuentas de ventas encontradas:', salesAccountsAlt.length, salesAccountsAlt.map(acc => `${acc.code} - ${acc.name}`));
      console.log('Cuentas de compras encontradas:', purchaseAccountsAlt.length, purchaseAccountsAlt.map(acc => `${acc.code} - ${acc.name}`));
      
      // Mostrar algunas cuentas de ejemplo para debug
      const gastoAccounts = accounts.filter(acc => acc.account_type === AccountType.GASTO);
      const costosAccounts = accounts.filter(acc => acc.account_type === AccountType.COSTOS);
      const ingresoAccounts = accounts.filter(acc => acc.account_type === AccountType.INGRESO);
      
      console.log('Cuentas de GASTO disponibles:', gastoAccounts.length, gastoAccounts.slice(0, 5).map(acc => `${acc.code} - ${acc.name}`));
      console.log('Cuentas de COSTOS disponibles:', costosAccounts.length, costosAccounts.slice(0, 5).map(acc => `${acc.code} - ${acc.name}`));
      console.log('Cuentas de INGRESO disponibles:', ingresoAccounts.length, ingresoAccounts.slice(0, 5).map(acc => `${acc.code} - ${acc.name}`));
    }
  }, [accounts, salesAccountsAlt.length, purchaseAccountsAlt.length]);

  const updateField = (field: keyof ProductCreate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === 'manage_inventory') {
      setShowInventoryFields(value);
    }
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSuccessMessage(null);    try {
      // Limpiar datos antes de enviar - omitir campos vacíos que pueden causar problemas de unicidad
      const dataToSend = { ...formData };
      
      // Omitir código si está vacío
      if (!dataToSend.code || dataToSend.code.trim() === '') {
        delete dataToSend.code;
      }
      
      // Omitir barcode si está vacío para evitar problemas de unicidad
      if (!dataToSend.barcode || dataToSend.barcode.trim() === '') {
        delete dataToSend.barcode;
      }
      
      // Omitir SKU si está vacío para evitar problemas de unicidad
      if (!dataToSend.sku || dataToSend.sku.trim() === '') {
        delete dataToSend.sku;
      }
      
      // Omitir otros campos opcionales que estén vacíos
      if (!dataToSend.description || dataToSend.description.trim() === '') {
        delete dataToSend.description;
      }
      if (!dataToSend.category || dataToSend.category.trim() === '') {
        delete dataToSend.category;
      }
      if (!dataToSend.subcategory || dataToSend.subcategory.trim() === '') {
        delete dataToSend.subcategory;
      }
      if (!dataToSend.brand || dataToSend.brand.trim() === '') {
        delete dataToSend.brand;
      }
      if (!dataToSend.dimensions || dataToSend.dimensions.trim() === '') {
        delete dataToSend.dimensions;
      }
      if (!dataToSend.internal_reference || dataToSend.internal_reference.trim() === '') {
        delete dataToSend.internal_reference;
      }
      if (!dataToSend.supplier_reference || dataToSend.supplier_reference.trim() === '') {
        delete dataToSend.supplier_reference;
      }
      if (!dataToSend.external_reference || dataToSend.external_reference.trim() === '') {
        delete dataToSend.external_reference;
      }
      if (!dataToSend.notes || dataToSend.notes.trim() === '') {
        delete dataToSend.notes;
      }
        console.log('=== INICIO OPERACIÓN DE PRODUCTO ===');
      console.log('Datos del producto a enviar:', JSON.stringify(dataToSend, null, 2));
      
      let resultProduct: Product;
      
      if (customSubmitHandler) {
        // Usar handler personalizado (para edición)
        resultProduct = await customSubmitHandler(dataToSend);
      } else {
        // Crear el producto usando el servicio real (para creación)
        resultProduct = await ProductService.createProduct(dataToSend);
      }
      
      console.log('=== OPERACIÓN EXITOSA ===');
      console.log('Respuesta del servidor:', JSON.stringify(resultProduct, null, 2));
      
      // Mostrar mensaje de éxito
      const actionText = isEditMode ? 'actualizado' : 'creado';
      setSuccessMessage(`Producto "${resultProduct.name}" ${actionText} exitosamente`);
      
      // Esperar un momento para que el usuario vea el mensaje y luego navegar
      setTimeout(() => {
        setIsSubmitting(false);
        onSuccess?.(resultProduct);
      }, 1500);
        } catch (error) {
      const operationText = isEditMode ? 'ACTUALIZAR' : 'CREAR';
      console.log(`=== ERROR AL ${operationText} PRODUCTO ===`);
      console.error('Error completo:', error);
      
      // Log más detallado del error
      if (error instanceof Error) {
        console.error('Mensaje de error:', error.message);
        console.error('Stack trace:', error.stack);
      }
      
      // Si es un error de axios, mostrar más detalles
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Respuesta del servidor (error):', {
          status: axiosError.response?.status,
          statusText: axiosError.response?.statusText,
          data: axiosError.response?.data,
          headers: axiosError.response?.headers
        });
      }
      
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      updateField(name as keyof ProductCreate, checked);
    } else if (type === 'number') {
      updateField(name as keyof ProductCreate, parseFloat(value) || 0);
    } else {
      updateField(name as keyof ProductCreate, value);
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    updateField(name as keyof ProductCreate, value);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {isEditMode ? 'Editar Producto' : 'Crear Nuevo Producto'}
        </h2>

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Información Básica */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código
            </label>
            <Input
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              placeholder="Ej: PROD001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Nombre del producto"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleInputChange}
              placeholder="Descripción del producto"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Producto
            </label>
            <select
              name="product_type"
              value={formData.product_type}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {Object.entries(ProductTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {Object.entries(ProductStatusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Unidad de Medida
            </label>
            <select
              name="measurement_unit"
              value={formData.measurement_unit}
              onChange={handleSelectChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              {Object.entries(MeasurementUnitLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <Input
              name="category"
              value={formData.category || ''}
              onChange={handleInputChange}
              placeholder="Categoría del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Marca
            </label>
            <Input
              name="brand"
              value={formData.brand || ''}
              onChange={handleInputChange}
              placeholder="Marca del producto"
            />
          </div>
        </div>

        {/* Precios */}
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Precios</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio de Compra
              </label>
              <Input
                type="number"
                name="purchase_price"
                value={formData.purchase_price?.toString() || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Precio de Venta
              </label>
              <Input
                type="number"
                name="sale_price"
                value={formData.sale_price?.toString() || ''}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Información Fiscal */}
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Fiscal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría de Impuesto
              </label>
              <select
                name="tax_category"
                value={formData.tax_category}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              >
                {Object.entries(TaxCategoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tasa de Impuesto (%)
              </label>
              <Input
                type="number"
                name="tax_rate"
                value={formData.tax_rate?.toString() || ''}
                onChange={handleInputChange}
                placeholder="19"
                step="0.01"
                min="0"
                max="100"
              />
            </div>
          </div>
        </div>

        {/* Cuentas Contables */}
        <div className="border-t pt-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cuentas Contables</h3>
          {loadingAccounts ? (
            <div className="flex justify-center py-4">
              <Spinner size="sm" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuenta de Ventas
                </label>                <select
                  name="sales_account_id"
                  value={formData.sales_account_id || ''}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >                  <option value="">Seleccionar cuenta...</option>
                  {salesAccountsAlt.length === 0 ? (
                    <option value="" disabled>No hay cuentas de ventas disponibles</option>
                  ) : (
                    salesAccountsAlt.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.code} - {account.name}
                      </option>
                    ))
                  )}
                </select>
                {salesAccountsAlt.length === 0 && (
                  <p className="mt-1 text-sm text-yellow-600">
                    No se encontraron cuentas de ventas. Asegúrese de que existan cuentas de tipo INGRESO activas.
                  </p>
                )}
                {salesAccounts.length === 0 && salesAccountsAlt.length > 0 && (
                  <p className="mt-1 text-sm text-blue-600">
                    Mostrando todas las cuentas de ingreso disponibles. Para un filtrado más específico, 
                    cree cuentas con nombres que incluyan "venta", "ingreso" o "producto".
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cuenta de Compras
                </label>                <select
                  name="purchase_account_id"
                  value={formData.purchase_account_id || ''}
                  onChange={handleSelectChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                >                  <option value="">Seleccionar cuenta...</option>
                  {purchaseAccountsAlt.length === 0 ? (
                    <option value="" disabled>No hay cuentas de compras disponibles</option>
                  ) : (
                    purchaseAccountsAlt.map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.code} - {account.name}
                      </option>
                    ))
                  )}
                </select>
                {purchaseAccountsAlt.length === 0 && (
                  <p className="mt-1 text-sm text-yellow-600">
                    No se encontraron cuentas de compras. Asegúrese de que existan cuentas de tipo GASTO o COSTOS activas.
                  </p>
                )}
                {purchaseAccounts.length === 0 && purchaseAccountsAlt.length > 0 && (
                  <p className="mt-1 text-sm text-blue-600">
                    Mostrando todas las cuentas de gasto/costo disponibles. Para un filtrado más específico, 
                    cree cuentas con nombres que incluyan "compra", "costo", "inventario" o "mercadería".
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Inventario */}
        <div className="border-t pt-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Gestión de Inventario</h3>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="manage_inventory"
                checked={formData.manage_inventory}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Manejar inventario</span>
            </label>
          </div>

          {showInventoryFields && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Actual
                </label>
                <Input
                  type="number"
                  name="current_stock"
                  value={formData.current_stock?.toString() || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="1"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Mínimo
                </label>
                <Input
                  type="number"
                  name="min_stock"
                  value={formData.min_stock?.toString() || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  step="1"
                  min="0"
                />
              </div>
            </div>
          )}
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          
          <Button
            type="submit"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          >
            {isEditMode ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
        </div>
      </Card>
    </form>
  );
};
