
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ChatInterface from '@/components/chat/ChatInterface';
import StatusPanel from '@/components/audio/StatusPanel';
import TrackList from '@/components/audio/TrackList';
import { useToast } from '@/hooks/use-toast';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';

const Index = () => {
  const [projectStatus, setProjectStatus] = useState({
    bpm: 128, // Updated to match the simulation scenario
    currentTime: "00:00:00",
    trackCount: 4,
    audioLevel: 75
  });
  
  const { toast } = useToast();

  return (
    <MainLayout>
      <div className="flex flex-col h-screen">
        <header className="p-4 border-b border-tehoria-darker">
          <StatusPanel 
            bpm={projectStatus.bpm}
            currentTime={projectStatus.currentTime}
            trackCount={projectStatus.trackCount}
            audioLevel={projectStatus.audioLevel}
          />
        </header>
        
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={40} minSize={20}>
              <TrackList />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel defaultSize={60}>
              <ChatInterface />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
