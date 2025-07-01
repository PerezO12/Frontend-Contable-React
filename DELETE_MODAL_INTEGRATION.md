# DeleteModal Integration Documentation

## Overview

This document describes the implementation of a generic DeleteModal component and its integration across different features in the accounting application. The DeleteModal provides a unified experience for bulk deletion operations with backend validation.

## Architecture

### Components

1. **Modal.tsx** - Base modal component for reusable modal functionality
2. **DeleteModal.tsx** - Generic deletion modal that works with any entity type
3. **DeletionService Interface** - Generic interface for deletion operations

### Pattern

The DeleteModal follows a generic pattern that can be applied to any feature:

```typescript
// Generic types in atomic/types.ts
export interface DeletableItem {
  id: string | number;
  [key: string]: any;
}

export interface DeletionCheckResult<T extends DeletableItem> {
  canDelete: T[];
  cannotDelete: T[];
  reasons?: Record<string | number, string>;
}

export interface DeletionService<T extends DeletableItem> {
  checkDeletable: (items: T[]) => Promise<DeletionCheckResult<T>>;
  deleteItems: (items: T[]) => Promise<void>;
}
```

## Implementation Steps

### 1. Create Deletion Service

For each feature that needs deletion functionality, create a service that implements the `DeletionService<T>` interface:

```typescript
// Example: ThirdPartyDeletionService.ts
export class ThirdPartyDeletionService implements DeletionService<ThirdParty> {
  async checkDeletable(thirdParties: ThirdParty[]): Promise<DeletionCheckResult<ThirdParty>> {
    // Call validation endpoint
    const validations = await ThirdPartyService.validateDeletion(thirdPartyIds);
    
    // Separate items into deletable/non-deletable
    const canDelete: ThirdParty[] = [];
    const cannotDelete: ThirdParty[] = [];
    const reasons: Record<string | number, string> = {};
    
    // Process validation results...
    
    return { canDelete, cannotDelete, reasons };
  }

  async deleteItems(thirdParties: ThirdParty[]): Promise<void> {
    // Call bulk deletion endpoint
    await ThirdPartyService.bulkDeleteReal(thirdPartyIds, false, 'UI deletion');
  }
}
```

### 2. Integrate into ListView Templates

Add DeleteModal to the ListView template:

```typescript
// In ListView template component
import { DeleteModal } from '../organisms/DeleteModal';
import { SomeDeletionService } from '../../../features/some-feature/services/someDeletionService';

export const SomeListView: React.FC<Props> = ({ ... }) => {
  // State for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedForDeletion, setSelectedForDeletion] = useState<SomeType[]>([]);
  const [deletionService] = useState(() => new SomeDeletionService());

  // Update delete action to open modal
  const actions = [
    {
      key: 'delete',
      label: 'Eliminar',
      icon: <span>🗑️</span>,
      variant: 'error',
      requiresSelection: true,
      onClick: (selectedItems) => {
        setSelectedForDeletion(selectedItems);
        setIsDeleteModalOpen(true);
      },
    },
  ];

  return (
    <>
      <ListView<SomeType>
        // ... other props
        actions={actions}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        selectedItems={selectedForDeletion}
        deletionService={deletionService}
        itemDisplayName={(item) => SomeService.formatDisplayName(item)}
        itemTypeName="item type name"
        onSuccess={(deletedItems) => {
          // Handle success
          setIsDeleteModalOpen(false);
          setSelectedForDeletion([]);
        }}
        onError={(error) => {
          // Handle error
        }}
      />
    </>
  );
};
```

## Completed Integrations

### ✅ Products
- **Service**: `ProductDeletionService`
- **Template**: `ProductListView`
- **Endpoints**: 
  - `POST /api/v1/products/validate-deletion`
  - `POST /api/v1/products/bulk-delete`

### ✅ Third Parties
- **Service**: `ThirdPartyDeletionService`  
- **Template**: `ThirdPartyListView`
- **Endpoints**:
  - `POST /api/v1/third-parties/validate-deletion`
  - `POST /api/v1/third-parties/bulk-delete`

### ✅ Accounts (Example)
- **Service**: `AccountDeletionService`
- **Template**: Not yet integrated (example only)
- **Endpoints**:
  - `POST /api/v1/accounts/validate-deletion`
  - `POST /api/v1/accounts/bulk-delete`

## Pending Features

The following features have bulk deletion endpoints and can be integrated using the same pattern:

### Cost Centers
- **Service**: Create `CostCenterDeletionService`
- **Template**: Create `CostCenterListView`
- **Endpoints**: Available in `CostCenterService.bulkDeleteCostCenters`

### Payment Terms
- **Service**: Create `PaymentTermDeletionService` 
- **Template**: Create `PaymentTermListView`
- **Endpoints**: Check if available in `PaymentTermsService`

### Journal Entries
- **Service**: Create `JournalEntryDeletionService`
- **Template**: Create `JournalEntryListView` 
- **Endpoints**: Check if available in `JournalEntryService`

## Benefits

1. **Consistency**: Unified deletion experience across all features
2. **Safety**: Backend validation prevents accidental deletion of items with dependencies
3. **User Experience**: Clear separation of deletable vs non-deletable items with reasons
4. **Maintainability**: Generic pattern reduces code duplication
5. **Accessibility**: Built-in modal accessibility features

## Best Practices

1. Always call the validation endpoint before showing the deletion modal
2. Provide clear, user-friendly error messages for blocking reasons
3. Show success feedback after successful deletion
4. Refresh the list after deletion to reflect changes
5. Handle both network errors and business logic errors gracefully

## Files Modified/Created

### Created
- `src/components/atomic/atoms/Modal.tsx`
- `src/components/atomic/organisms/DeleteModal.tsx`
- `src/features/products/services/productDeletionService.ts`
- `src/features/third-parties/services/thirdPartyDeletionService.ts`
- `src/features/accounts/services/accountDeletionService.ts`

### Modified
- `src/components/atomic/types.ts` - Added deletion types
- `src/components/atomic/templates/ProductListView.tsx` - Integrated DeleteModal
- `src/components/atomic/templates/ThirdPartyListView.tsx` - Integrated DeleteModal
- `src/features/third-parties/pages/ThirdPartyListPage.tsx` - Updated to use new ListView
- Various index.ts files to export new services

## Testing

To test the implementation:

1. Navigate to Products or Third Parties list
2. Select one or more items
3. Click the "Eliminar" (Delete) button
4. Verify the modal shows items separated into deletable/non-deletable
5. Confirm deletion and verify backend deletion occurs
6. Check that non-deletable items show appropriate blocking reasons

## Future Enhancements

1. Add loading states during validation and deletion
2. Implement toast notifications for success/error feedback
3. Add bulk operation progress indicators for large deletions
4. Consider adding undo functionality for recent deletions
5. Add telemetry/analytics for deletion operations
