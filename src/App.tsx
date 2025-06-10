import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { LoginForm } from '@/features/auth/components/LoginForm';
import { Dashboard } from '@/components/layout/Dashboard';
import { UnauthorizedPage } from '@/components/layout/UnauthorizedPage';
import { ToastContainer } from '@/components/ui/Toast';
import { useToast } from '@/shared/hooks/useToast';
import { UserRole } from '@/features/auth/types';
import { 
  JournalEntryListPage, 
  JournalEntryCreatePage, 
  JournalEntryEditPage, 
  JournalEntryDetailPage 
} from '@/features/journal-entries/pages';

const AppContent = () => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      <Routes>
        {/* Ruta pública - Login */}
        <Route path="/login" element={<LoginForm />} />
        
        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Rutas de Asientos Contables - Solo para ADMIN y CONTADOR */}
        <Route 
          path="/journal-entries" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <JournalEntryListPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/journal-entries/new" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <JournalEntryCreatePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/journal-entries/:id" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <JournalEntryDetailPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/journal-entries/:id/edit" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN, UserRole.CONTADOR]}>
              <JournalEntryEditPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Ejemplo de ruta solo para administradores */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
              <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900">Panel de Administración</h1>
                  <p className="text-gray-600 mt-2">Solo para administradores</p>
                </div>
              </div>
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
      
      {/* Toast Container Global */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
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
