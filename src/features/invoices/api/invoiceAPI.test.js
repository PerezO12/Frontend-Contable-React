/**
 * Smoke test para verificar que el módulo de facturas está correctamente integrado
 */

// Mock de dependencias externas
const mockApiClient = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

jest.mock('../../../shared/api/client', () => ({
  apiClient: mockApiClient
}));

jest.mock('../../../shared/contexts/ToastContext', () => ({
  useToast: () => ({
    showToast: jest.fn()
  })
}));

jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
  useParams: () => ({ id: 'test-id' })
}));

// Importar el store después de los mocks
import { InvoiceAPI } from '../api/invoiceAPI';
import { InvoiceType, InvoiceStatus } from '../types';

describe('Invoice Module Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('InvoiceAPI', () => {
    test('should call correct endpoint for getting invoices', async () => {
      const mockResponse = {
        data: {
          items: [],
          total: 0,
          page: 1,
          page_size: 10,
          total_pages: 0
        }
      };

      mockApiClient.get.mockResolvedValue(mockResponse);

      await InvoiceAPI.getInvoices();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/v1/invoices');
    });

    test('should call correct endpoint for creating invoice', async () => {
      const invoiceData = {
        invoice_type: InvoiceType.CUSTOMER_INVOICE,
        third_party_id: 'test-third-party',
        invoice_date: '2024-01-01',
        lines: [
          {
            description: 'Test product',
            quantity: 1,
            unit_price: 100,
            tax_rate: 21,
            line_total: 100
          }
        ]
      };

      const mockResponse = {
        data: {
          id: 'test-invoice-id',
          status: InvoiceStatus.DRAFT,
          ...invoiceData
        }
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const result = await InvoiceAPI.createInvoice(invoiceData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/v1/invoices', invoiceData);
      expect(result.id).toBe('test-invoice-id');
      expect(result.status).toBe(InvoiceStatus.DRAFT);
    });

    test('should call correct endpoint for workflow actions', async () => {
      const invoiceId = 'test-invoice-id';
      const mockResponse = {
        data: {
          id: invoiceId,
          status: InvoiceStatus.POSTED
        }
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      await InvoiceAPI.postInvoice(invoiceId);

      expect(mockApiClient.post).toHaveBeenCalledWith(`/api/v1/invoices/${invoiceId}/post`);
    });
  });

  describe('Invoice Types', () => {
    test('should have correct invoice types', () => {
      expect(InvoiceType.CUSTOMER_INVOICE).toBe('customer_invoice');
      expect(InvoiceType.SUPPLIER_INVOICE).toBe('supplier_invoice');
      expect(InvoiceType.CREDIT_NOTE).toBe('credit_note');
      expect(InvoiceType.DEBIT_NOTE).toBe('debit_note');
    });

    test('should have correct invoice statuses', () => {
      expect(InvoiceStatus.DRAFT).toBe('draft');
      expect(InvoiceStatus.PENDING).toBe('pending');
      expect(InvoiceStatus.APPROVED).toBe('approved');
      expect(InvoiceStatus.POSTED).toBe('posted');
      expect(InvoiceStatus.PAID).toBe('paid');
      expect(InvoiceStatus.CANCELLED).toBe('cancelled');
    });
  });

  describe('Workflow Steps', () => {
    test('should have correct workflow steps defined', () => {
      const { INVOICE_WORKFLOW_STEPS } = require('../types');
      
      expect(INVOICE_WORKFLOW_STEPS).toHaveLength(5);
      expect(INVOICE_WORKFLOW_STEPS[0].title).toBe('Cliente registrado');
      expect(INVOICE_WORKFLOW_STEPS[1].title).toBe('Factura borrador');
      expect(INVOICE_WORKFLOW_STEPS[2].title).toBe('Validar y emitir');
      expect(INVOICE_WORKFLOW_STEPS[3].title).toBe('Registrar pago');
      expect(INVOICE_WORKFLOW_STEPS[4].title).toBe('Aplicar pago');
    });
  });
});

describe('Invoice Module Smoke Test', () => {
  test('should be able to import all required modules', () => {
    // Test que todos los módulos se pueden importar sin errores
    expect(() => {
      require('../api/invoiceAPI');
      require('../types');
      require('../hooks/useThirdPartiesForInvoices');
      require('../hooks/useProductsForInvoices');
    }).not.toThrow();
  });

  test('should have correct exports in pages index', () => {
    const pages = require('../pages');
    
    expect(pages.InvoiceListPage).toBeDefined();
    expect(pages.InvoiceCreatePage).toBeDefined();
    expect(pages.InvoiceEditPage).toBeDefined();
    expect(pages.InvoiceDetailPage).toBeDefined();
  });

  test('should have correct exports in hooks index', () => {
    const hooks = require('../hooks');
    
    expect(hooks.useThirdPartiesForInvoices).toBeDefined();
    expect(hooks.useProductsForInvoices).toBeDefined();
  });
});
