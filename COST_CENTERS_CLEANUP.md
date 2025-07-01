# Cost Centers Migration - Files to Clean Up

## Files that can be removed after migration:

### Components (obsoletos después de migración)
- src/features/cost-centers/components/CostCenterList.tsx
- src/features/cost-centers/components/CostCenterExportModal.tsx  
- src/features/cost-centers/components/SimpleExportControls.tsx
- src/features/cost-centers/components/SimpleCostCenterExportControls.tsx
- src/features/cost-centers/components/BulkDeleteModal.tsx

### Hooks (reemplazados por sistema genérico)
- src/features/cost-centers/hooks/useCostCenterExport.ts
- src/features/cost-centers/hooks/useCostCenters.ts (parcialmente - revisar dependencias)

### Pages (reemplazadas por versión migrada)
- src/features/cost-centers/pages/CostCenterListPage.tsx (la vieja)

## Files to keep (still needed):
- src/features/cost-centers/pages/CostCenterCreatePage.tsx
- src/features/cost-centers/pages/CostCenterEditPage.tsx  
- src/features/cost-centers/pages/CostCenterDetailPage.tsx
- src/features/cost-centers/pages/CostCenterManagementPage.tsx (if still used)
- src/features/cost-centers/components/CostCenterForm.tsx
- src/features/cost-centers/components/CostCenterDetail.tsx
- src/features/cost-centers/components/CostCenterTreeView.tsx
- src/features/cost-centers/hooks/useCostCenterEvents.ts
- All services and types

## Route changes needed:
- Review if /cost-centers/list should redirect to /cost-centers or be removed
- Check if CostCenterManagementPage is still being used

## Next steps:
1. Test the new migrated system
2. Update routes if needed  
3. Remove obsolete files
4. Clean up imports and exports
