
import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import ChatInterface from '@/components/chat/ChatInterface';
import StatusPanel from '@/components/audio/StatusPanel';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [projectStatus, setProjectStatus] = useState({
    bpm: 120,
    currentTime: "00:00:00",
    trackCount: 3,
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
          <ChatInterface />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
