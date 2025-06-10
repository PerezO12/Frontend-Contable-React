import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen} />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={closeSidebar} 
          onToggle={toggleSidebarCollapse}
          isCollapsed={sidebarCollapsed}
        />
          {/* Main content area */}
        <main className={`main-content-with-fixed-layout ${sidebarCollapsed ? 'content-sidebar-collapsed' : ''}`}>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
