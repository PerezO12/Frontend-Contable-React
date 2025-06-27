/**
 * Componente para mostrar información del asiento contable relacionado con una factura
 * Similar al que se usa en journal entries pero adaptado para facturas
 */
import React from 'react';
interface InvoiceJournalEntryInfoProps {
    journalEntryId: string;
    invoiceAmount: number;
    invoiceType: string;
    thirdPartyName: string;
}
export declare const InvoiceJournalEntryInfo: React.FC<InvoiceJournalEntryInfoProps>;
export {};
