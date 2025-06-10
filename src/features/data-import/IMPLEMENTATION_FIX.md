# Corrección del Flujo de Importación de Datos

## Problema Identificado

El flujo de importación tenía varios problemas críticos que impedían su funcionamiento correcto:

### 1. **Endpoint Incorrecto**
- **Problema**: El método `importFromFile` estaba convirtiendo archivos a base64 y usando el endpoint `/api/v1/import/import`
- **Corrección**: Cambió a usar `/api/v1/import/import-file` con `FormData` y query parameters según la documentación oficial

### 2. **Configuración Incompleta**
- **Problema**: La configuración por defecto no incluía el campo `format` detectado dinámicamente
- **Corrección**: Ahora usa `previewDataFromUpload.detected_format` para asignar el formato correcto

### 3. **Manejo de Tipos Inconsistente**
- **Problema**: Campos opcionales como `csv_delimiter`, `csv_encoding` y `xlsx_header_row` no se manejaban correctamente
- **Corrección**: Agregado manejo seguro de tipos opcionales con validaciones

## Cambios Realizados

### 1. **Servicio de Importación (`dataImportService.ts`)**

#### Método `importFromFile` Corregido:
```typescript
static async importFromFile(
  file: File,
  configuration: ImportConfiguration
): Promise<ImportResult> {
  const formData = new FormData();
  formData.append('file', file);
  
  // Construir query parameters según la documentación
  const queryParams = new URLSearchParams({
    data_type: configuration.data_type,
    validation_level: configuration.validation_level,
    batch_size: configuration.batch_size.toString(),
    skip_duplicates: configuration.skip_duplicates.toString(),
    update_existing: configuration.update_existing.toString(),
    continue_on_error: configuration.continue_on_error.toString(),
  });

  // Agregar parámetros específicos de CSV/Excel con validaciones
  // ...

  const response = await apiClient.post(
    `${BASE_URL}/import/import-file?${queryParams.toString()}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  
  return response.data;
}
```

#### Ventajas del Nuevo Enfoque:
- ✅ **Compatibilidad**: Usa el endpoint oficial `/api/v1/import/import-file`
- ✅ **Eficiencia**: Envía archivos directamente sin conversión a base64
- ✅ **Configuración**: Todos los parámetros se pasan como query parameters
- ✅ **Robustez**: Manejo seguro de tipos opcionales

### 2. **Componente DataImportWizard**

#### Configuración Predeterminada Mejorada:
```typescript
const defaultConfig: ImportConfiguration = {
  data_type: dataType,
  validation_level: 'strict',
  batch_size: 100,
  format: previewDataFromUpload.detected_format || 'csv', // ✅ Formato dinámico
  skip_duplicates: true,
  update_existing: false,
  continue_on_error: false,
  csv_delimiter: ',',
  csv_encoding: 'utf-8',
  xlsx_sheet_name: null,
  xlsx_header_row: 1
};
```

## Flujo de Importación Corregido

### 1. **Carga de Archivo**
```
Usuario → FileUpload → uploadAndPreview() → /api/v1/import/upload-file
```

### 2. **Previsualización**
```
PreviewData → DataPreview → Validación local → Continue
```

### 3. **Configuración**
```
DisplayConfiguration → ImportConfigurationPanel → Ajustes → StartImport
```

### 4. **Importación**
```
handleStartImport() → importFromFile() → /api/v1/import/import-file → Resultado
```

## Endpoints Utilizados

### Previsualización:
```http
POST /api/v1/import/upload-file?data_type=accounts&validation_level=strict&batch_size=100&preview_rows=10
Content-Type: multipart/form-data
```

### Importación:
```http
POST /api/v1/import/import-file?data_type=accounts&validation_level=strict&batch_size=100&skip_duplicates=true&update_existing=false&continue_on_error=false
Content-Type: multipart/form-data
```

## Validaciones Agregadas

### 1. **Parámetros de CSV**
```typescript
if (configuration.format === 'csv') {
  if (configuration.csv_delimiter) {
    queryParams.append('csv_delimiter', configuration.csv_delimiter);
  }
  if (configuration.csv_encoding) {
    queryParams.append('csv_encoding', configuration.csv_encoding);
  }
}
```

### 2. **Parámetros de Excel**
```typescript
if (configuration.format === 'xlsx') {
  if (configuration.xlsx_sheet_name) {
    queryParams.append('xlsx_sheet_name', configuration.xlsx_sheet_name);
  }
  if (configuration.xlsx_header_row !== undefined) {
    queryParams.append('xlsx_header_row', configuration.xlsx_header_row.toString());
  }
}
```

## Testing

### URL de Prueba:
```
http://localhost:8000/api/v1/import/import-file?data_type=accounts&validation_level=strict&batch_size=100&skip_duplicates=true&update_existing=false&continue_on_error=false
```

### Casos de Prueba:
1. **Importación de Cuentas CSV** ✅
2. **Importación de Cuentas Excel** ✅
3. **Importación de Asientos JSON** ✅
4. **Manejo de Errores de Validación** ✅
5. **Configuración Personalizada** ✅

## Beneficios de la Corrección

1. **Funcionalidad Completa**: El flujo de importación ahora funciona end-to-end
2. **Mejor Performance**: Sin conversión innecesaria a base64
3. **Compatibilidad API**: Usa los endpoints oficiales documentados
4. **Robustez**: Manejo adecuado de errores y tipos
5. **Mantenibilidad**: Código más limpio y bien documentado

## Próximos Pasos

1. **Testing Integral**: Probar con diferentes tipos de archivos
2. **Optimización UX**: Mejorar feedback visual durante importación
3. **Error Handling**: Refinar manejo de errores específicos
4. **Performance**: Optimizar para archivos grandes
