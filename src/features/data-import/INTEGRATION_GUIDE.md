# Data Import Module - Integration Guide

## 🚀 Quick Start Integration

### 1. Add Routes to Main Application

Add the data import routes to your main router in `src/App.tsx` or your main routing file:

```tsx
import { DataImportRoutes } from '@/features/data-import';

// In your main router component:
<Routes>
  {/* ...existing routes... */}
  <Route path="/data-import/*" element={<DataImportRoutes />} />
</Routes>
```

### 2. Update Navigation Menu

Add navigation items to your sidebar or main menu:

```tsx
// In src/components/layout/Sidebar.tsx or similar
const menuItems = [
  // ...existing items...
  {
    title: 'Importar Datos',
    icon: '📁',
    path: '/data-import',
    children: [
      { title: 'Cuentas Contables', path: '/data-import/accounts', icon: '💰' },
      { title: 'Asientos Contables', path: '/data-import/journal-entries', icon: '📝' },
      { title: 'Historial', path: '/data-import/history', icon: '📊' }
    ]
  }
];
```

### 3. Available Components for Custom Implementation

#### Main Components
```tsx
import { 
  DataImportWizard,           // Complete import wizard
  FileUpload,                 // File upload with validation
  DataPreview,                // Data preview with errors
  ImportConfigurationPanel,   // Configuration settings
  TemplateDownloadComponent,  // Template download
  ImportProgress             // Real-time progress
} from '@/features/data-import';
```

#### Usage Examples

**Complete Import Wizard:**
```tsx
function CustomImportPage() {
  const handleComplete = (result) => {
    console.log('Import completed:', result);
    // Redirect or show success message
  };

  return (
    <DataImportWizard 
      dataType="accounts"
      onComplete={handleComplete}
      className="max-w-6xl mx-auto"
    />
  );
}
```

**Individual Components:**
```tsx
function CustomFileUpload() {
  const handleFileUploaded = (previewData) => {
    console.log('File uploaded:', previewData);
  };

  return (
    <FileUpload
      dataType="journal_entries"
      onFileUploaded={handleFileUploaded}
      validationLevel="strict"
    />
  );
}
```

### 4. Custom Hooks Usage

```tsx
import { useDataImport, useTemplates, useImportHistory } from '@/features/data-import';

function CustomImportLogic() {
  const {
    previewData,
    configuration,
    importResult,
    isLoading,
    canImport,
    importFromFile,
    updateConfiguration
  } = useDataImport();

  const {
    downloadTemplate,
    generateCustomTemplate,
    isDownloading
  } = useTemplates();

  const {
    imports,
    getImportHistory,
    changePage
  } = useImportHistory();

  // Your custom logic here...
}
```

### 5. API Service Integration

The module includes a complete API service. Ensure your backend endpoints match:

```typescript
// All these endpoints are automatically called by the service:
// POST /api/data-import/preview
// POST /api/data-import/import
// GET  /api/data-import/status/{id}
// GET  /api/data-import/result/{id}
// GET  /api/data-import/history
// GET  /api/data-import/templates
// POST /api/data-import/templates/download
```

### 6. Backend Configuration Requirements

Ensure your backend supports:
- **File uploads** up to 100MB
- **CORS** for file upload endpoints
- **Real-time status** updates for long imports
- **Template generation** in CSV/Excel/JSON formats

### 7. Environment Configuration

Add any necessary environment variables:

```env
# .env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MAX_FILE_SIZE=104857600  # 100MB
VITE_SUPPORTED_FORMATS=csv,xlsx,json
```

## 📋 Testing Checklist

### Frontend Testing
- [ ] File upload works with drag & drop
- [ ] File validation shows appropriate errors
- [ ] Data preview displays correctly
- [ ] Import configuration saves settings
- [ ] Progress tracking updates in real-time
- [ ] Template download works for all formats
- [ ] Import history shows paginated results
- [ ] Error handling displays user-friendly messages

### Backend Integration Testing
- [ ] File upload endpoint accepts multipart/form-data
- [ ] Preview endpoint returns structured data
- [ ] Import endpoint processes files correctly
- [ ] Status endpoint provides real-time updates
- [ ] Template endpoints generate valid files
- [ ] Error responses follow consistent format

## 🎯 Available Pages

### Direct Page Usage
```tsx
import { 
  DataImportMainPage,      // Type selection page
  AccountsImportPage,      // Direct accounts import
  JournalEntriesImportPage, // Direct journal entries import
  ImportHistoryPage       // Import history viewer
} from '@/features/data-import';

// Use directly in your routing:
<Route path="/import-accounts" element={<AccountsImportPage />} />
```

## 🔧 Customization Options

### Theme Integration
The components use your existing UI components (`Button`, `Card`, etc.) and should inherit your theme automatically.

### Validation Customization
```tsx
import { validateAccountData, validateJournalEntryData } from '@/features/data-import';

// Custom validation
const customValidation = (data) => {
  const baseErrors = validateAccountData(data);
  // Add your custom business rules
  return [...baseErrors, ...customErrors];
};
```

### File Format Support
Current supported formats:
- **CSV** with configurable delimiters
- **Excel** (.xlsx) with sheet selection
- **JSON** with structured data

## 🚨 Important Notes

1. **File Size Limits**: Default 100MB, configurable
2. **Security**: Files are validated before processing
3. **Performance**: Large imports use batch processing
4. **Error Handling**: Comprehensive validation with user-friendly messages
5. **Progress Tracking**: Real-time updates for long-running imports

## 📞 Support

The module is fully self-contained and includes:
- ✅ Complete TypeScript definitions
- ✅ Error boundary handling  
- ✅ Loading states management
- ✅ Responsive design
- ✅ Accessibility features
- ✅ Comprehensive documentation

Ready for production use! 🎉
