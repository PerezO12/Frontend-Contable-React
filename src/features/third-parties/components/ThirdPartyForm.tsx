import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';
import { 
  ThirdPartyType, 
  DocumentType,
  THIRD_PARTY_TYPE_LABELS, 
  DOCUMENT_TYPE_LABELS,
  type ThirdParty,
  type ThirdPartyCreate,
  type ThirdPartyUpdate
} from '../types';

interface ThirdPartyFormProps {
  thirdParty?: ThirdParty;
  onSubmit: (data: ThirdPartyCreate | ThirdPartyUpdate) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
  mode: 'create' | 'edit';
}

interface FormErrors {
  [key: string]: string;
}

export const ThirdPartyForm: React.FC<ThirdPartyFormProps> = ({
  thirdParty,
  onSubmit,
  onCancel,
  loading = false,
  mode
}) => {  const [formData, setFormData] = useState<ThirdPartyCreate>({
    third_party_type: ThirdPartyType.CUSTOMER,
    document_type: DocumentType.RUT,
    document_number: '',
    name: '',
    commercial_name: '',
    email: '',
    phone: '',
    mobile: '',
    website: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    credit_limit: '',
    payment_terms: '',
    discount_percentage: '',
    bank_name: '',
    bank_account: '',
    is_active: true,
    is_tax_withholding_agent: false,
    tax_id: '',
    notes: '',
    internal_code: '',
    code: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (thirdParty && mode === 'edit') {
      setFormData({
        third_party_type: thirdParty.third_party_type,
        document_type: thirdParty.document_type,
        document_number: thirdParty.document_number,
        name: thirdParty.name,
        commercial_name: thirdParty.commercial_name || '',
        email: thirdParty.email || '',
        phone: thirdParty.phone || '',
        mobile: thirdParty.mobile || '',
        website: thirdParty.website || '',
        address: thirdParty.address || '',
        city: thirdParty.city || '',
        state: thirdParty.state || '',
        country: thirdParty.country || '',
        postal_code: thirdParty.postal_code || '',
        credit_limit: thirdParty.credit_limit || '',
        payment_terms: thirdParty.payment_terms || '',
        discount_percentage: thirdParty.discount_percentage || '',
        bank_name: thirdParty.bank_name || '',
        bank_account: thirdParty.bank_account || '',
        is_active: thirdParty.is_active,
        is_tax_withholding_agent: thirdParty.is_tax_withholding_agent || false,
        tax_id: thirdParty.tax_id || '',
        notes: thirdParty.notes || '',
        internal_code: thirdParty.internal_code || '',
        code: thirdParty.code || ''
      });
    }
  }, [thirdParty, mode]);
  const handleInputChange = (field: keyof ThirdPartyCreate, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.code?.trim()) {
      newErrors.code = 'Código es requerido';
    }

    if (!formData.document_number.trim()) {
      newErrors.document_number = 'Número de documento es requerido';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Nombre/Razón social es requerido';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email no válido';
    }

    if (formData.payment_terms && isNaN(Number(formData.payment_terms))) {
      newErrors.payment_terms = 'Términos de pago debe ser un número';
    }

    if (formData.credit_limit && isNaN(Number(formData.credit_limit))) {
      newErrors.credit_limit = 'Límite de crédito debe ser un número';
    }

    if (formData.discount_percentage && (isNaN(Number(formData.discount_percentage)) || Number(formData.discount_percentage) < 0 || Number(formData.discount_percentage) > 100)) {
      newErrors.discount_percentage = 'Porcentaje de descuento debe ser entre 0 y 100';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📋 [ThirdPartyForm] Datos del formulario antes de validación:');
    console.log('📝 formData:', JSON.stringify(formData, null, 2));
    
    if (!validateForm()) {
      console.log('❌ [ThirdPartyForm] Validación fallida');
      return;
    }

    console.log('✅ [ThirdPartyForm] Validación exitosa, enviando datos...');
    
    try {
      await onSubmit(formData);
      console.log('✅ [ThirdPartyForm] Formulario enviado exitosamente');
    } catch (error) {
      console.error('❌ [ThirdPartyForm] Error submitting form:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">          {/* Código */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código *
            </label>
            <Input
              type="text"
              value={formData.code || ''}
              onChange={(e) => handleInputChange('code', e.target.value)}
              error={errors.code}
              placeholder="Código interno"
            />
          </div>

          {/* Tipo de Tercero */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Tercero *
            </label>
            <select
              value={formData.third_party_type}
              onChange={(e) => handleInputChange('third_party_type', e.target.value as ThirdPartyType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(THIRD_PARTY_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Tipo de Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Documento *
            </label>
            <select
              value={formData.document_type}
              onChange={(e) => handleInputChange('document_type', e.target.value as DocumentType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.entries(DOCUMENT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Número de Documento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Número de Documento *
            </label>
            <Input
              type="text"
              value={formData.document_number}
              onChange={(e) => handleInputChange('document_number', e.target.value)}
              error={errors.document_number}
              placeholder="Ej: 12345678-9"
            />
          </div>

          {/* Nombre/Razón Social */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre/Razón Social *
            </label>
            <Input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={errors.name}
              placeholder="Nombre completo o razón social"
            />
          </div>

          {/* Nombre Comercial */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre Comercial
            </label>
            <Input
              type="text"
              value={formData.commercial_name || ''}
              onChange={(e) => handleInputChange('commercial_name', e.target.value)}
              placeholder="Nombre comercial (opcional)"
            />
          </div>

          {/* Tax ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Tributario
            </label>
            <Input
              type="text"
              value={formData.tax_id || ''}
              onChange={(e) => handleInputChange('tax_id', e.target.value)}
              placeholder="Identificación tributaria"
            />
          </div>

          {/* Agente de Retención */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_tax_withholding_agent || false}
              onChange={(e) => handleInputChange('is_tax_withholding_agent', e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Agente de Retención
            </label>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={formData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={errors.email}
              placeholder="correo@ejemplo.com"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <Input
              type="text"
              value={formData.phone || ''}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+56 2 1234 5678"
            />
          </div>

          {/* Móvil */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Móvil
            </label>
            <Input
              type="text"
              value={formData.mobile || ''}
              onChange={(e) => handleInputChange('mobile', e.target.value)}
              placeholder="+56 9 1234 5678"
            />
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sitio Web
            </label>
            <Input
              type="url"
              value={formData.website || ''}
              onChange={(e) => handleInputChange('website', e.target.value)}
              placeholder="https://www.ejemplo.com"
            />
          </div>

          {/* Dirección */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <Input
              type="text"
              value={formData.address || ''}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Dirección completa"
            />
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ciudad
            </label>
            <Input
              type="text"
              value={formData.city || ''}
              onChange={(e) => handleInputChange('city', e.target.value)}
              placeholder="Ciudad"
            />
          </div>

          {/* Estado/Región */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado/Región
            </label>
            <Input
              type="text"
              value={formData.state || ''}
              onChange={(e) => handleInputChange('state', e.target.value)}
              placeholder="Estado o región"
            />
          </div>

          {/* País */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              País
            </label>
            <Input
              type="text"
              value={formData.country || ''}
              onChange={(e) => handleInputChange('country', e.target.value)}
              placeholder="País"
            />
          </div>

          {/* Código Postal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código Postal
            </label>
            <Input
              type="text"
              value={formData.postal_code || ''}
              onChange={(e) => handleInputChange('postal_code', e.target.value)}
              placeholder="Código postal"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Financiera</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Límite de Crédito */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Límite de Crédito
            </label>
            <Input
              type="text"
              value={formData.credit_limit || ''}
              onChange={(e) => handleInputChange('credit_limit', e.target.value)}
              error={errors.credit_limit}
              placeholder="0.00"
            />
          </div>

          {/* Términos de Pago */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Términos de Pago (días)
            </label>
            <Input
              type="text"
              value={formData.payment_terms || ''}
              onChange={(e) => handleInputChange('payment_terms', e.target.value)}
              error={errors.payment_terms}
              placeholder="30"
            />
          </div>

          {/* Porcentaje de Descuento */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Porcentaje de Descuento (%)
            </label>
            <Input
              type="text"
              value={formData.discount_percentage || ''}
              onChange={(e) => handleInputChange('discount_percentage', e.target.value)}
              error={errors.discount_percentage}
              placeholder="0.00"
            />
          </div>

          {/* Banco */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Banco
            </label>
            <Input
              type="text"
              value={formData.bank_name || ''}
              onChange={(e) => handleInputChange('bank_name', e.target.value)}
              placeholder="Nombre del banco"
            />
          </div>

          {/* Cuenta Bancaria */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cuenta Bancaria
            </label>
            <Input
              type="text"
              value={formData.bank_account || ''}
              onChange={(e) => handleInputChange('bank_account', e.target.value)}
              placeholder="Número de cuenta bancaria"
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Información Adicional</h3>
        
        <div className="space-y-4">
          {/* Código Interno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código Interno
            </label>
            <Input
              type="text"
              value={formData.internal_code || ''}
              onChange={(e) => handleInputChange('internal_code', e.target.value)}
              placeholder="Código interno de referencia"
            />
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notas
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Notas adicionales..."
            />
          </div>

          {/* Estado Activo */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm font-medium text-gray-700">
              Activo
            </label>
          </div>
        </div>
      </Card>

      {/* Botones de acción */}
      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={loading}
        >
          {loading ? 'Guardando...' : mode === 'create' ? 'Crear Tercero' : 'Actualizar Tercero'}
        </Button>
      </div>
    </form>
  );
};
