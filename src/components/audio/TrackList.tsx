
import React, { useState } from 'react';
import { Music, AudioLines, Piano, FolderOpen, ChevronDown, ChevronRight } from 'lucide-react';
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

interface TrackGroup {
  id: string;
  name: string;
  isOpen: boolean;
  tracks: Track[];
}

const TrackList = () => {
  const [trackGroups, setTrackGroups] = useState<TrackGroup[]>([
    { 
      id: 'main',
      name: 'My Awesome Track', 
      isOpen: true,
      tracks: [
        { id: '1', name: 'Batería', type: 'audio', color: 'bg-blue-500', isMuted: false, isSolo: false },
        { id: '2', name: 'Bajo', type: 'audio', color: 'bg-purple-500', isMuted: false, isSolo: false },
        { id: '3', name: 'Sintetizador', type: 'midi', color: 'bg-green-500', isMuted: false, isSolo: false },
        { id: '4', name: 'Melodía', type: 'midi', color: 'bg-yellow-500', isMuted: false, isSolo: false },
      ]
    }
  ]);
  
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null);
  const [showPianoRoll, setShowPianoRoll] = useState(false);
  const [showAudioWave, setShowAudioWave] = useState(false);
  
  const handleTrackClick = (id: string) => {
    setSelectedTrackId(id);
  };
  
  const handleTrackDoubleClick = (track: Track) => {
    if (track.type === 'midi') {
      setSelectedTrackId(track.id);
      setShowPianoRoll(true);
      setShowAudioWave(false);
    } else if (track.type === 'audio') {
      setSelectedTrackId(track.id);
      setShowAudioWave(true);
      setShowPianoRoll(false);
    }
  };
  
  const handleClosePianoRoll = () => {
    setShowPianoRoll(false);
  };
  
  const toggleGroupOpen = (groupId: string) => {
    setTrackGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { ...group, isOpen: !group.isOpen } 
          : group
      )
    );
  };

  // Buscar la pista seleccionada en cualquier grupo
  const selectedTrack = trackGroups.flatMap(group => group.tracks).find(track => track.id === selectedTrackId);

  return (
    <div className="h-full flex flex-col">
      <div className="p-3 border-b border-tehoria-darker bg-tehoria-dark">
        <h2 className="text-lg font-semibold">Pistas</h2>
      </div>
      
      {(showPianoRoll && selectedTrack?.type === 'midi') ? (
        <PianoRoll 
          trackName={selectedTrack.name} 
          trackColor={selectedTrack.color} 
          onClose={handleClosePianoRoll} 
        />
      ) : showAudioWave && selectedTrack?.type === 'audio' ? (
        <div className="flex-1 p-4 glass-panel">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AudioLines className="h-5 w-5 text-tehoria-accent" />
              <h3 className="font-semibold">{selectedTrack.name} - Audio Waveform</h3>
            </div>
            <button 
              className="p-1 rounded-full hover:bg-tehoria-darker/50"
              onClick={() => setShowAudioWave(false)}
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>
          
          <div className="bg-tehoria-darker rounded-lg p-4 h-64">
            <div className="h-full w-full flex items-center justify-around">
              {Array.from({ length: 100 }).map((_, i) => (
                <div 
                  key={i}
                  className={`visualizer-bar h-${Math.floor(Math.random() * 8) + 1} w-1 ${selectedTrack.color}`}
                  style={{ animationDelay: `${i * 0.02}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-2">
            {trackGroups.map((group) => (
              <div key={group.id} className="glass-panel mb-4">
                <div 
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-tehoria-darker/50"
                  onClick={() => toggleGroupOpen(group.id)}
                >
                  <div className="flex items-center gap-2">
                    <FolderOpen className="h-5 w-5 text-tehoria-accent" />
                    <span className="font-semibold">{group.name}</span>
                  </div>
                  <div>
                    {group.isOpen ? 
                      <ChevronDown className="h-4 w-4" /> : 
                      <ChevronRight className="h-4 w-4" />
                    }
                  </div>
                </div>
                
                {group.isOpen && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 border-t border-tehoria-darker">
                    {group.tracks.map((track) => (
                      <div 
                        key={track.id}
                        className={`p-3 cursor-pointer transition-colors hover:bg-tehoria-darker/50 rounded-md border ${
                          selectedTrackId === track.id ? 'border-tehoria-accent' : 'border-transparent'
                        } ${track.color} bg-opacity-10`}
                        onClick={() => handleTrackClick(track.id)}
                        onDoubleClick={() => handleTrackDoubleClick(track)}
                      >
                        <div className="flex items-center justify-between mb-2">
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
                        
                        <div className="h-16 bg-tehoria-darker rounded overflow-hidden">
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
                              {Array.from({ length: 10 }).map((_, i) => {
                                const height = Math.floor(Math.random() * 8) + 1;
                                const width = Math.floor(Math.random() * 3) + 1;
                                return (
                                  <div 
                                    key={i}
                                    className={`mx-1 ${track.color} rounded-sm`}
                                    style={{ 
                                      height: `${height * 10}%`, 
                                      width: `${width * 5}px`,
                                      marginLeft: `${i * 9}px`
                                    }}
                                  ></div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-2 text-xs text-center text-muted-foreground">
                          {track.type === 'midi' ? 'Doble clic para Piano Roll' : 'Doble clic para ver Audio'}
                        </div>
                      </div>
                    ))}
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
