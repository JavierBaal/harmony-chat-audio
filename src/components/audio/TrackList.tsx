
import React, { useState } from 'react';
import { Music, AudioLines, Piano } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import PianoRoll from './PianoRoll';

interface Track {
  id: string;
  name: string;
  type: 'audio' | 'midi';
  color: string;
  isMuted: boolean;
  isSolo: boolean;
}

const TrackList = () => {
  const [tracks, setTracks] = useState<Track[]>([
    { id: '1', name: 'Batería', type: 'audio', color: 'bg-blue-500', isMuted: false, isSolo: false },
    { id: '2', name: 'Bajo', type: 'audio', color: 'bg-purple-500', isMuted: false, isSolo: false },
    { id: '3', name: 'Sintetizador', type: 'midi', color: 'bg-green-500', isMuted: false, isSolo: false },
    { id: '4', name: 'Melodía', type: 'midi', color: 'bg-yellow-500', isMuted: false, isSolo: false },
  ]);
  
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [showPianoRoll, setShowPianoRoll] = useState(false);
  
  const handleTrackClick = (id: string) => {
    setSelectedTrackId(id);
  };
  
  const handleTrackDoubleClick = (track: Track) => {
    if (track.type === 'midi') {
      setSelectedTrackId(track.id);
      setShowPianoRoll(true);
    }
  };
  
  const handleClosePianoRoll = () => {
    setShowPianoRoll(false);
  };
  
  const selectedTrack = tracks.find(track => track.id === selectedTrackId);

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-tehoria-darker bg-tehoria-dark">
        <h2 className="text-lg font-semibold">Pistas</h2>
      </div>
      
      {showPianoRoll && selectedTrack?.type === 'midi' ? (
        <PianoRoll 
          trackName={selectedTrack.name} 
          trackColor={selectedTrack.color} 
          onClose={handleClosePianoRoll} 
        />
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {tracks.map((track) => (
              <div 
                key={track.id}
                className={`glass-panel p-3 cursor-pointer transition-colors ${
                  selectedTrackId === track.id ? 'border-tehoria-accent' : 'border-white/10'
                }`}
                onClick={() => handleTrackClick(track.id)}
                onDoubleClick={() => handleTrackDoubleClick(track)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {track.type === 'audio' ? (
                      <AudioLines className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Piano className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="font-medium">{track.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`h-2 w-2 rounded-full ${track.color}`}></span>
                  </div>
                </div>
                
                <div className="mt-2 h-10 bg-tehoria-darker rounded overflow-hidden">
                  {track.type === 'audio' ? (
                    // Representación simple de forma de onda de audio
                    <div className="h-full w-full flex items-center justify-around">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div 
                          key={i}
                          className={`visualizer-bar h-${Math.floor(Math.random() * 8) + 1} w-1 opacity-70 ${track.color}`}
                          style={{ animationDelay: `${i * 0.05}s` }}
                        ></div>
                      ))}
                    </div>
                  ) : (
                    // Representación simple de notas MIDI
                    <div className="h-full w-full flex items-end p-1">
                      {Array.from({ length: 20 }).map((_, i) => {
                        const height = Math.floor(Math.random() * 8) + 1;
                        const width = Math.floor(Math.random() * 3) + 1;
                        return (
                          <div 
                            key={i}
                            className={`mx-1 ${track.color} rounded-sm`}
                            style={{ 
                              height: `${height * 10}%`, 
                              width: `${width * 5}px`,
                              marginLeft: `${i * 15}px`
                            }}
                          ></div>
                        );
                      })}
                    </div>
                  )}
                </div>
                
                {selectedTrackId === track.id && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    {track.type === 'midi' ? 'Doble clic para abrir Piano Roll' : 'Pista de Audio'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

export default TrackList;
