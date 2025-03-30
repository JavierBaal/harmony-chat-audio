
import React from 'react';
import { 
  Clock, 
  Music, 
  BarChart,
  Volume2, 
  Music2 
} from 'lucide-react';

interface StatusPanelProps {
  bpm: number;
  currentTime: string;
  trackCount: number;
  audioLevel: number;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ 
  bpm = 120, 
  currentTime = "00:00:00", 
  trackCount = 0,
  audioLevel = 0 
}) => {
  return (
    <div className="glass-panel p-4 grid grid-cols-4 gap-4">
      <div className="flex flex-col items-center">
        <div className="text-xs text-muted-foreground mb-1 flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          <span>Time</span>
        </div>
        <div className="text-lg font-mono">{currentTime}</div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="text-xs text-muted-foreground mb-1 flex items-center">
          <BarChart className="h-3 w-3 mr-1" />
          <span>BPM</span>
        </div>
        <div className="text-lg font-mono">{bpm}</div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="text-xs text-muted-foreground mb-1 flex items-center">
          <Music className="h-3 w-3 mr-1" />
          <span>Tracks</span>
        </div>
        <div className="text-lg font-mono">{trackCount}</div>
      </div>
      
      <div className="flex flex-col items-center">
        <div className="text-xs text-muted-foreground mb-1 flex items-center">
          <Volume2 className="h-3 w-3 mr-1" />
          <span>Level</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-5 w-full bg-tehoria-darker rounded overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-yellow-500"
              style={{ width: `${audioLevel}%` }}
            ></div>
          </div>
          <span className="text-xs">{audioLevel}%</span>
        </div>
      </div>
    </div>
  );
};

export default StatusPanel;
