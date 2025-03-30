
import React from 'react';
import { 
  Sidebar as SidebarComponent, 
  SidebarContent, 
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarTrigger
} from '@/components/ui/sidebar';
import { 
  Mic, 
  HardDrive, 
  Music, 
  Settings, 
  BookOpen, 
  FileAudio, 
  Headphones, 
  AudioLines
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Sidebar = () => {
  return (
    <SidebarComponent className="border-r border-tehoria-darker">
      <SidebarHeader className="flex flex-col items-center justify-center py-6">
        <div className="flex items-center justify-center gap-2">
          <AudioLines className="h-8 w-8 text-tehoria-accent" />
          <span className="text-2xl font-bold text-white">TehorIA</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">AI-Powered DAW</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Project</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center">
                    <FileAudio className="h-5 w-5 mr-3" />
                    <span>New Project</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center">
                    <HardDrive className="h-5 w-5 mr-3" />
                    <span>Load Project</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Audio</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center">
                    <Mic className="h-5 w-5 mr-3" />
                    <span>Record</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center">
                    <Music className="h-5 w-5 mr-3" />
                    <span>Instruments</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center">
                    <Headphones className="h-5 w-5 mr-3" />
                    <span>Effects</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>System</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center">
                    <Settings className="h-5 w-5 mr-3" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#" className="flex items-center">
                    <BookOpen className="h-5 w-5 mr-3" />
                    <span>Documentation</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <div className="mt-auto p-4">
        <SidebarTrigger className="w-full flex justify-center">
          <span className="sr-only">Toggle sidebar</span>
        </SidebarTrigger>
      </div>
    </SidebarComponent>
  );
};

export default Sidebar;
