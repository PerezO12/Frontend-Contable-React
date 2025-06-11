// ==========================================
// Declaraciones de tipos para módulos externos
// ==========================================

declare module 'jspdf-autotable' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
    lastAutoTable: {
      finalY: number;
    };
  }
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: {
      head?: string[][];
      body?: string[][];
      startY?: number;
      styles?: {
        fontSize?: number;
        cellPadding?: number;
        textColor?: number[] | string;
        fillColor?: number[];
        fontStyle?: string;
      };
      headStyles?: {
        fillColor?: number[];
        textColor?: number[] | string;
        fontStyle?: string;
      };
      columnStyles?: Record<number, {
        cellWidth?: number;
        halign?: 'left' | 'center' | 'right';
        fontStyle?: string;
      }>;
      alternateRowStyles?: {
        fillColor?: number[];
      };
    }) => void;
    lastAutoTable: {
      finalY: number;
    };
  }
}
