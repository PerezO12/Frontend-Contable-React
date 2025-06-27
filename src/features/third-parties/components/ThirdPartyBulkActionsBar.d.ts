interface ThirdPartyBulkActionsBarProps {
    selectedCount: number;
    selectedIds: Set<string>;
    onClearSelection: () => void;
    onOperationComplete: () => void;
}
export declare function ThirdPartyBulkActionsBar({ selectedCount, selectedIds, onClearSelection, onOperationComplete }: ThirdPartyBulkActionsBarProps): import("react").JSX.Element;
export {};
