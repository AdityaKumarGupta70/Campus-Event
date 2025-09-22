import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/sidebars/AdminSidebar';
import { FacultySidebar } from '@/components/sidebars/FacultySidebar';
import { StudentSidebar } from '@/components/sidebars/StudentSidebar';
import { NotificationsDropdown } from '@/components/NotificationsDropdown';

const DashboardLayout: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const getSidebar = () => {
    switch (user.role) {
      case 'admin':
        return <AdminSidebar />;
      case 'faculty':
        return <FacultySidebar />;
      case 'student':
      case 'alumni':
        return <StudentSidebar />;
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        {getSidebar()}
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm border-b p-4">
            <div className="flex justify-end">
              <NotificationsDropdown />
            </div>
          </header>
          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;