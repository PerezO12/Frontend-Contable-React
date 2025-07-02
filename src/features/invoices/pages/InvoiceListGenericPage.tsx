/**
 * Página de listado de facturas usando el template genérico
 * Reemplaza a InvoiceListEnhancedPage con el patrón genérico
 */
import { useNavigate } from 'react-router-dom';
import { InvoiceListView } from '../../../components/atomic/templatesViews/InvoiceListView';
import type { Invoice } from '../types/legacy';

export function InvoiceListGenericPage() {
  const navigate = useNavigate();

  const handleInvoiceSelect = (invoice: Invoice) => {
    navigate(`/invoices/${invoice.id}`);
  };

  const handleCreateInvoice = () => {
    navigate('/invoices/new');
  };

  return (
    <InvoiceListView
      onInvoiceSelect={handleInvoiceSelect}
      onCreateInvoice={handleCreateInvoice}
      showActions={true}
    />
  );
}
