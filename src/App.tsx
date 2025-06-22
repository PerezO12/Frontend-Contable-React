import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { MainLayout } from '@/components/layout/MainLayout';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Dashboard } from '@/components/layout/Dashboard';
import { UnauthorizedPage } from '@/components/layout/UnauthorizedPage';
import { ToastProvider } from '@/shared/contexts/ToastContext';
import { UserRole } from '@/features/auth/types';
import { 
  JournalEntryListPage, 
  JournalEntryCreatePage, 
  JournalEntryEditPage, 
  JournalEntryDetailPage 
} from '@/features/journal-entries/pages';
import {
  AccountsPage,
  AccountListPage,
  AccountCreatePage,
  AccountEditPage,
  AccountDetailPage
} from '@/features/accounts/pages';
import {
  CostCentersPage,
  CostCenterListPage,
  CostCenterCreatePage,
  CostCenterEditPage,
  CostCenterDetailPage
} from '@/features/cost-centers/pages';
import {
  ThirdPartiesPage
} from '@/features/third-parties/pages';
import {
  PaymentTermsPage
} from '@/features/payment-terms/pages';
import {
  ProductsPage,
  ProductCreatePage,
  ProductEditPage
} from '@/features/products/pages';
import { DataImportRoutes } from '@/features/data-import';
import { ReportsRoutes } from '@/features/reports';

const AppContent = () => {
  return (
    <ToastProvider>
      <Routes>
        {/* Ruta pública - Login */}
        <Route path="/login" element={<LoginForm />} />
        
        {/* Rutas protegidas con layout principal */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de Asientos Contables - Solo para ADMIN y CONTADOR */}
        <Route 
          path="/journal-entries" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <JournalEntryListPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/journal-entries/new" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <JournalEntryCreatePage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/journal-entries/:id" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <JournalEntryDetailPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/journal-entries/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <JournalEntryEditPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de Cuentas - Solo para ADMIN y CONTADOR */}
        <Route 
          path="/accounts" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <AccountsPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/accounts/list" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <AccountListPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/accounts/new" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <AccountCreatePage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/accounts/:id" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <AccountDetailPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/accounts/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <AccountEditPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de Centros de Costo - Solo para ADMIN y CONTADOR */}
        <Route 
          path="/cost-centers" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <CostCentersPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/cost-centers/list" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <CostCenterListPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/cost-centers/new" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <CostCenterCreatePage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/cost-centers/:id" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <CostCenterDetailPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/cost-centers/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <CostCenterEditPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de Terceros - Solo para ADMIN y CONTADOR */}
        <Route 
          path="/third-parties/*" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <ThirdPartiesPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de Términos de Pago - Solo para ADMIN y CONTADOR */}
        <Route 
          path="/payment-terms" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <PaymentTermsPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de Productos - Solo para ADMIN y CONTADOR */}
        <Route 
          path="/products" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <ProductsPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/products/new" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <ProductCreatePage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/products/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <ProductEditPage />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de Importación/Exportación - Solo para ADMIN y CONTADOR */}
        <Route 
          path="/import-export/*" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <MainLayout>
                <DataImportRoutes />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de Reportes - Acceso para todos los roles */}
        <Route 
          path="/reports/*" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR, UserRole.SOLO_LECTURA]}>
              <MainLayout>
                <ReportsRoutes />
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Ejemplo de ruta solo para administradores */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <MainLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                    <p className="text-gray-600 mt-2">Solo para administradores</p>
                  </div>
                </div>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Página de acceso denegado */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        
        {/* Redireccionamiento por defecto */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Página 404 */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900">404</h1>
                <p className="text-gray-600 mt-2">Página no encontrada</p>
                <a 
                  href="/dashboard" 
                  className="mt-4 inline-block text-primary-600 hover:text-primary-500"
                >
                  Volver al Dashboard
                </a>
              </div>
            </div>
          } 
        />
      </Routes>
    </ToastProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <AppContent />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
