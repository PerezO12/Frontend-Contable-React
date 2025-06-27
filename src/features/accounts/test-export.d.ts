export declare const testAccountExport: () => Promise<boolean>;
export declare const testExportSchema: () => Promise<{
    table_name: string;
    display_name: string;
    description: string;
    columns: Array<{
        name: string;
        data_type: string;
        nullable: boolean;
        description?: string;
    }>;
    total_records: number;
}>;
export declare const testAvailableTables: () => Promise<{
    tables: Array<{
        table_name: string;
        display_name: string;
        description: string;
        available_columns: Array<{
            name: string;
            data_type: string;
            include: boolean;
        }>;
        total_records: number;
    }>;
    total_tables: number;
}>;
export declare const exportTests: {
    testAccountExport: () => Promise<boolean>;
    testExportSchema: () => Promise<{
        table_name: string;
        display_name: string;
        description: string;
        columns: Array<{
            name: string;
            data_type: string;
            nullable: boolean;
            description?: string;
        }>;
        total_records: number;
    }>;
    testAvailableTables: () => Promise<{
        tables: Array<{
            table_name: string;
            display_name: string;
            description: string;
            available_columns: Array<{
                name: string;
                data_type: string;
                include: boolean;
            }>;
            total_records: number;
        }>;
        total_tables: number;
    }>;
};
