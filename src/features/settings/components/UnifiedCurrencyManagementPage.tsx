/**
 * Unified Currency Management Page - All-in-one currency management interface
 */
import React, { useState, useEffect, useCallback } from 'react';
import type { Currency, CurrencyUpdate } from '../services/currencyService';
import { currencyService } from '../services/currencyService';

interface EditableCurrencyRow extends Currency {
  isEditing?: boolean;
  latestExchangeRate?: number;
  exchangeRateDate?: string;
  exchangeRateId?: string;
}

export const UnifiedCurrencyManagementPage: React.FC = () => {
  const [currencies, setCurrencies] = useState<EditableCurrencyRow[]>([]);
  const [baseCurrency, setBaseCurrency] = useState<Currency | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(true);
  const [editingCurrency, setEditingCurrency] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    size: 50,
    total: 0,
    pages: 0
  });
  const [customPageSize, setCustomPageSize] = useState('50');

  // Load data
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load currencies with pagination to get all
      const currenciesResponse = await currencyService.getCurrencies(
        {}, // filters
        1,  // page
        1000, // pageSize
        true  // includeInactive
      );

      // Load base currency
      const baseCurrencyResponse = await currencyService.getBaseCurrency();
      setBaseCurrency(baseCurrencyResponse);

      // Load exchange rates for all currencies
      const exchangeRatesResponse = await currencyService.getExchangeRates(
        {}, // filters
        1,  // page
        1000 // pageSize
      );

      // Combine currencies with their latest exchange rates
      const enrichedCurrencies: EditableCurrencyRow[] = (currenciesResponse.currencies || []).map(currency => {
        // Find latest exchange rate for this currency
        const currencyExchangeRates = (exchangeRatesResponse.exchange_rates || [])
          .filter(er => er.currency.id === currency.id)
          .sort((a, b) => new Date(b.rate_date).getTime() - new Date(a.rate_date).getTime());
        
        const latestRate = currencyExchangeRates[0];
        
        return {
          ...currency,
          isEditing: false,
          latestExchangeRate: latestRate?.rate,
          exchangeRateDate: latestRate?.rate_date,
          exchangeRateId: latestRate?.id
        };
      });

      setCurrencies(enrichedCurrencies);
      
      // Update pagination
      setPagination({
        page: currenciesResponse.page || 1,
        size: currenciesResponse.size || 1000,
        total: currenciesResponse.total || enrichedCurrencies.length,
        pages: currenciesResponse.pages || 1
      });
    } catch (error) {
      console.error('Error loading currency data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Page size options
  const pageSizeOptions = [10, 25, 50, 100, 250, 500, 1000];

  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setCustomPageSize(String(newSize));
    // For now, we'll reload all data since we're using client-side pagination
    // In a real implementation, you might want to implement server-side pagination
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter currencies based on search and active status
  const filteredCurrencies = currencies.filter(currency => {
    const matchesSearch = !searchTerm || 
      currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesActiveFilter = showInactive || currency.is_active;
    
    return matchesSearch && matchesActiveFilter;
  });

  // Calculate pagination for client-side
  const currentPageSize = parseInt(customPageSize);
  const totalPages = Math.ceil(filteredCurrencies.length / currentPageSize);
  const currentPage = Math.min(pagination.page, totalPages) || 1;
  const startIndex = (currentPage - 1) * currentPageSize;
  const endIndex = startIndex + currentPageSize;
  const paginatedCurrencies = filteredCurrencies.slice(startIndex, endIndex);

  // Update pagination info
  const paginationInfo = {
    page: currentPage,
    size: currentPageSize,
    total: filteredCurrencies.length,
    pages: totalPages
  };

  // Handle currency status toggle
  const handleToggleActive = async (currencyId: string, currentStatus: boolean) => {
    try {
      const updateData: CurrencyUpdate = { is_active: !currentStatus };
      await currencyService.updateCurrency(currencyId, updateData);
      
      // Update local state
      setCurrencies(prev => prev.map(currency => 
        currency.id === currencyId 
          ? { ...currency, is_active: !currentStatus }
          : currency
      ));
    } catch (error) {
      console.error('Error toggling currency status:', error);
    }
  };

  // Handle setting base currency
  const handleSetBaseCurrency = async (currencyCode: string) => {
    try {
      await currencyService.setBaseCurrency(currencyCode);
      await loadData(); // Reload to get updated base currency
    } catch (error) {
      console.error('Error setting base currency:', error);
    }
  };

  // Handle inline editing
  const handleStartEdit = (currencyId: string) => {
    setEditingCurrency(currencyId);
    setCurrencies(prev => prev.map(currency => 
      currency.id === currencyId 
        ? { ...currency, isEditing: true }
        : { ...currency, isEditing: false }
    ));
  };

  const handleCancelEdit = () => {
    setEditingCurrency(null);
    setCurrencies(prev => prev.map(currency => ({ ...currency, isEditing: false })));
  };

  const handleSaveEdit = async (currencyId: string, updatedData: Partial<Currency>) => {
    try {
      const updateData: CurrencyUpdate = {
        name: updatedData.name,
        symbol: updatedData.symbol,
        decimal_places: updatedData.decimal_places,
        notes: updatedData.notes
      };
      
      await currencyService.updateCurrency(currencyId, updateData);
      
      // Update local state
      setCurrencies(prev => prev.map(currency => 
        currency.id === currencyId 
          ? { ...currency, ...updatedData, isEditing: false }
          : currency
      ));
      
      setEditingCurrency(null);
    } catch (error) {
      console.error('Error updating currency:', error);
    }
  };

  // Handle exchange rate update
  const handleUpdateExchangeRate = async (currencyId: string, newRate: number) => {
    try {
      const currency = currencies.find(c => c.id === currencyId);
      if (!currency) return;

      if (currency.exchangeRateId) {
        // Update existing exchange rate
        await currencyService.updateExchangeRate(currency.exchangeRateId, {
          rate: newRate,
          rate_date: new Date().toISOString().split('T')[0]
        });
      } else {
        // Create new exchange rate
        await currencyService.createExchangeRate({
          currency_id: currencyId,
          rate: newRate,
          rate_date: new Date().toISOString().split('T')[0],
          source: 'manual',
          is_manual: true
        });
      }

      // Update local state
      setCurrencies(prev => prev.map(c => 
        c.id === currencyId 
          ? { 
              ...c, 
              latestExchangeRate: newRate,
              exchangeRateDate: new Date().toISOString().split('T')[0]
            }
          : c
      ));
    } catch (error) {
      console.error('Error updating exchange rate:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 text-blue-600 mr-3">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Monedas</h1>
              <p className="text-gray-600">
                Administre todas las monedas, estados y tipos de cambio del sistema
                {baseCurrency && (
                  <span className="ml-2 text-sm text-blue-600 font-medium">
                    Moneda base: {baseCurrency.code} - {baseCurrency.name}
                  </span>
                )}
              </p>
            </div>
          </div>
          
          {/* Stats */}
          <div className="text-right">
            <div className="text-sm text-gray-500">Total de monedas</div>
            <div className="text-2xl font-bold text-gray-900">{currencies.length}</div>
            <div className="text-sm text-green-600">
              {currencies.filter(c => c.is_active).length} activas
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Buscar por código o nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Show inactive toggle */}
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                checked={showInactive}
                onChange={(e) => setShowInactive(e.target.checked)}
              />
              <span className="ml-2 text-sm text-gray-700">Mostrar inactivas</span>
            </label>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Mostrando {Math.min((paginationInfo.page - 1) * paginationInfo.size + 1, paginationInfo.total)} - {Math.min(paginationInfo.page * paginationInfo.size, paginationInfo.total)} de {paginationInfo.total} monedas
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Mostrar:</span>
              <select
                value={customPageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                {pageSizeOptions.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Currencies Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Símbolo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo de Cambio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Decimales
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Actualización
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedCurrencies.map((currency) => (
                <CurrencyRow
                  key={currency.id}
                  currency={currency}
                  baseCurrency={baseCurrency}
                  isEditing={currency.isEditing || false}
                  onToggleActive={handleToggleActive}
                  onSetBaseCurrency={handleSetBaseCurrency}
                  onStartEdit={handleStartEdit}
                  onCancelEdit={handleCancelEdit}
                  onSaveEdit={handleSaveEdit}
                  onUpdateExchangeRate={handleUpdateExchangeRate}
                />
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Paginación */}
        {paginationInfo.pages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(paginationInfo.page - 1)}
                disabled={paginationInfo.page === 1}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {paginationInfo.page} de {paginationInfo.pages}
              </span>
              <button
                onClick={() => handlePageChange(paginationInfo.page + 1)}
                disabled={paginationInfo.page === paginationInfo.pages}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
                <svg className="h-4 w-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Currency Row Component with inline editing
interface CurrencyRowProps {
  currency: EditableCurrencyRow;
  baseCurrency: Currency | null;
  isEditing: boolean;
  onToggleActive: (id: string, currentStatus: boolean) => void;
  onSetBaseCurrency: (code: string) => void;
  onStartEdit: (id: string) => void;
  onCancelEdit: () => void;
  onSaveEdit: (id: string, data: Partial<Currency>) => void;
  onUpdateExchangeRate: (id: string, rate: number) => void;
}

const CurrencyRow: React.FC<CurrencyRowProps> = ({
  currency,
  baseCurrency,
  isEditing,
  onToggleActive,
  onSetBaseCurrency,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onUpdateExchangeRate
}) => {
  const [editData, setEditData] = useState({
    name: currency.name,
    symbol: currency.symbol,
    decimal_places: currency.decimal_places,
    notes: currency.notes || ''
  });
  const [exchangeRate, setExchangeRate] = useState(currency.latestExchangeRate?.toString() || '1.0');

  const isBaseCurrency = baseCurrency?.id === currency.id;

  const handleSave = () => {
    onSaveEdit(currency.id, editData);
  };

  const handleExchangeRateUpdate = () => {
    const rate = parseFloat(exchangeRate);
    if (!isNaN(rate) && rate > 0) {
      onUpdateExchangeRate(currency.id, rate);
    }
  };

  return (
    <tr className={`hover:bg-gray-50 ${!currency.is_active ? 'opacity-60' : ''} ${isBaseCurrency ? 'bg-blue-50' : ''}`}>
      {/* Status Toggle */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only"
              checked={currency.is_active}
              onChange={() => onToggleActive(currency.id, currency.is_active)}
            />
            <div className={`w-11 h-6 rounded-full ${currency.is_active ? 'bg-blue-600' : 'bg-gray-200'} relative transition-colors duration-200 ease-in-out`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out ${currency.is_active ? 'transform translate-x-5' : ''}`}></div>
            </div>
          </label>
          {isBaseCurrency && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Base
            </span>
          )}
        </div>
      </td>

      {/* Currency Code */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-900">{currency.code}</span>
          {!isBaseCurrency && (
            <button
              onClick={() => onSetBaseCurrency(currency.code)}
              className="ml-2 text-xs text-blue-600 hover:text-blue-800"
              title="Establecer como moneda base"
            >
              Establecer base
            </button>
          )}
        </div>
      </td>

      {/* Name */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={editData.name}
            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
          />
        ) : (
          <span className="text-sm text-gray-900">{currency.name}</span>
        )}
      </td>

      {/* Symbol */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="text"
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={editData.symbol}
            onChange={(e) => setEditData(prev => ({ ...prev, symbol: e.target.value }))}
          />
        ) : (
          <span className="text-sm font-mono text-gray-900">{currency.symbol}</span>
        )}
      </td>

      {/* Exchange Rate */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isBaseCurrency ? (
          <span className="text-sm text-gray-500">1.0 (Base)</span>
        ) : (
          <div className="flex items-center space-x-2">
            <input
              type="number"
              step="0.000001"
              className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={exchangeRate}
              onChange={(e) => setExchangeRate(e.target.value)}
              onBlur={handleExchangeRateUpdate}
              onKeyPress={(e) => e.key === 'Enter' && handleExchangeRateUpdate()}
            />
            {currency.exchangeRateDate && (
              <span className="text-xs text-gray-500">
                {new Date(currency.exchangeRateDate).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </td>

      {/* Decimal Places */}
      <td className="px-6 py-4 whitespace-nowrap">
        {isEditing ? (
          <input
            type="number"
            min="0"
            max="6"
            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={editData.decimal_places}
            onChange={(e) => setEditData(prev => ({ ...prev, decimal_places: parseInt(e.target.value) }))}
          />
        ) : (
          <span className="text-sm text-gray-900">{currency.decimal_places}</span>
        )}
      </td>

      {/* Last Updated */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {new Date(currency.updated_at).toLocaleDateString()}
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="text-green-600 hover:text-green-900"
            >
              Guardar
            </button>
            <button
              onClick={onCancelEdit}
              className="text-gray-600 hover:text-gray-900"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => onStartEdit(currency.id)}
            className="text-blue-600 hover:text-blue-900"
          >
            Editar
          </button>
        )}
      </td>
    </tr>
  );
};
