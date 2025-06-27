import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
export var MainLayout = function (_a) {
    var children = _a.children;
    var _b = useState(false), sidebarOpen = _b[0], setSidebarOpen = _b[1];
    var _c = useState(false), sidebarCollapsed = _c[0], setSidebarCollapsed = _c[1];
    var toggleSidebar = function () {
        setSidebarOpen(!sidebarOpen);
    };
    var toggleSidebarCollapse = function () {
        setSidebarCollapsed(!sidebarCollapsed);
    };
    var closeSidebar = function () {
        setSidebarOpen(false);
    };
    return (<div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header onToggleSidebar={toggleSidebar} isSidebarOpen={sidebarOpen}/>

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} onToggle={toggleSidebarCollapse} isCollapsed={sidebarCollapsed}/>
          {/* Main content area */}
        <main className={"main-content-with-fixed-layout ".concat(sidebarCollapsed ? 'content-sidebar-collapsed' : '')}>
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>);
};
