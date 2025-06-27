import React from 'react';
export declare const ReportsMainPage: React.FC;
export declare const QuickReportWidget: React.FC;
export declare const AppRoutesExample: React.FC;
export declare const useExecutiveDashboard: () => {
    generateMonthlyReports: () => Promise<[PromiseSettledResult<void>, PromiseSettledResult<void>, PromiseSettledResult<void>]>;
    isLoading: boolean;
    currentReport: import("@/features/reports").ReportResponse;
    error: string;
};
export declare const NavigationWithReports: React.FC;
import { type ReactNode } from 'react';
interface ReportsContextType {
    companyName: string;
    defaultFilters: any;
    permissions: {
        canExport: boolean;
        canViewDetails: boolean;
    };
}
export declare const ReportsProvider: React.FC<{
    children: ReactNode;
    companyName: string;
    permissions?: Partial<ReportsContextType['permissions']>;
}>;
export declare const useReportsContext: () => ReportsContextType;
export declare const ExampleApp: React.FC;
export {};
