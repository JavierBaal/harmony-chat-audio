
import React from 'react';
import Sidebar from './Sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useToast } from '@/hooks/use-toast';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-tehoria-darker text-white">
        <Sidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
