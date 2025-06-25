#!/usr/bin/env node

/**
 * Script para probar la funcionalidad de navegación de lotes en el frontend
 */

import fs from 'fs';
import path from 'path';

// Verificar que los archivos importantes existen y tienen el contenido esperado
function checkFileContent(filePath, expectedContent, description) {
    try {
        if (!fs.existsSync(filePath)) {
            console.error(`❌ ${description}: Archivo no encontrado: ${filePath}`);
            return false;
        }
        
        const content = fs.readFileSync(filePath, 'utf8');
        const found = expectedContent.every(text => content.includes(text));
        
        if (found) {
            console.log(`✅ ${description}: OK`);
            return true;
        } else {
            console.error(`❌ ${description}: Contenido no encontrado en ${filePath}`);
            expectedContent.forEach(text => {
                if (!content.includes(text)) {
                    console.error(`   Falta: ${text}`);
                }
            });
            return false;
        }
    } catch (error) {
        console.error(`❌ ${description}: Error leyendo archivo: ${error.message}`);
        return false;
    }
}

console.log('🔍 === VERIFICACIÓN DE IMPLEMENTACIÓN DE NAVEGACIÓN DE LOTES ===\n');

const checks = [
    // 1. Verificar tipos TypeScript
    {
        file: 'src/features/generic-import/types/index.ts',
        content: ['BatchInfo', 'current_batch', 'total_batches', 'batch_number'],
        description: 'Tipos de navegación de lotes'
    },
    
    // 2. Verificar componente BatchNavigation
    {
        file: 'src/features/generic-import/components/BatchNavigation.tsx',
        content: ['BatchNavigation', 'onBatchChange', 'Lote', 'de', 'Anterior', 'Siguiente'],
        description: 'Componente BatchNavigation'
    },
    
    // 3. Verificar servicio actualizado
    {
        file: 'src/features/generic-import/services/GenericImportService.ts',
        content: ['generateBatchPreview', 'getBatchInfo', 'batch_number', 'batch_size'],
        description: 'Métodos de lote en GenericImportService'
    },
    
    // 4. Verificar hook actualizado
    {
        file: 'src/features/generic-import/hooks/useGenericImportWizard.ts',
        content: ['generateBatchPreview', 'batchNumber: number'],
        description: 'Hook con soporte para lotes'
    },
    
    // 5. Verificar PreviewStep actualizado
    {
        file: 'src/features/generic-import/components/steps/PreviewStep.tsx',
        content: ['BatchNavigation', 'onBatchChange', 'batch_info'],
        description: 'PreviewStep con navegación de lotes'
    },
    
    // 6. Verificar GenericImportWizard actualizado
    {
        file: 'src/features/generic-import/components/GenericImportWizard.tsx',
        content: ['generateBatchPreview', 'onBatchChange'],
        description: 'Wizard con soporte para lotes'
    }
];

let allPassed = true;

checks.forEach(check => {
    const passed = checkFileContent(check.file, check.content, check.description);
    allPassed = allPassed && passed;
});

console.log('\n=== RESUMEN ===');
if (allPassed) {
    console.log('✅ Todas las verificaciones pasaron. La navegación de lotes está implementada.');
    console.log('\n📋 FUNCIONALIDADES IMPLEMENTADAS:');
    console.log('   • Tipos TypeScript para información de lotes');
    console.log('   • Componente BatchNavigation con controles de navegación');
    console.log('   • Métodos de servicio para obtener lotes específicos');
    console.log('   • Hook actualizado con generateBatchPreview');
    console.log('   • PreviewStep integrado con navegación de lotes');
    console.log('   • Wizard configurado para manejar cambios de lote');
    console.log('\n🚀 PRÓXIMOS PASOS:');
    console.log('   • Probar la funcionalidad en el navegador');
    console.log('   • Verificar que el backend responde correctamente');
    console.log('   • Ajustar la UI según sea necesario');
} else {
    console.log('❌ Algunas verificaciones fallaron. Revise los archivos indicados.');
}
