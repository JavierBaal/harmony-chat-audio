
import React, { useState, useEffect } from 'react';
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
  isActive?: boolean;
  activityType?: 'rhythm' | 'melody' | 'atmosphere';
}

interface TrackGroup {
  id: string;
  name: string;
  isOpen: boolean;
  tracks: Track[];
}

// Interfaz para el evento personalizado
interface TrackActivityEvent extends CustomEvent {
  detail: {
    trackId: string;
    action: 'highlight' | 'edit' | 'reset';
    type?: 'rhythm' | 'melody' | 'atmosphere';
  };
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
  const [activeAnimation, setActiveAnimation] = useState<{
    trackId: string;
    animationType: 'pulse' | 'edit' | 'none';
  }>({ trackId: '', animationType: 'none' });
  
  // Escuchar eventos de actividad de pistas
  useEffect(() => {
    const handleTrackActivity = (event: Event) => {
      const { trackId, action, type } = (event as TrackActivityEvent).detail;
      
      if (trackId === 'all' && action === 'reset') {
        // Resetear todas las pistas
        setTrackGroups(prevGroups => 
          prevGroups.map(group => ({
            ...group,
            tracks: group.tracks.map(track => ({
              ...track,
              isActive: false,
              activityType: undefined
            }))
          }))
        );
        setActiveAnimation({ trackId: '', animationType: 'none' });
        return;
      }
      
      // Actualizar el estado de animación activa
      if (action === 'highlight') {
        setActiveAnimation({ trackId, animationType: 'pulse' });
      } else if (action === 'edit') {
        setActiveAnimation({ trackId, animationType: 'edit' });
      }
      
      // Actualizar el estado de las pistas
      setTrackGroups(prevGroups => 
        prevGroups.map(group => ({
          ...group,
          tracks: group.tracks.map(track => 
            track.id === trackId 
              ? { 
                  ...track, 
                  isActive: action !== 'reset', 
                  activityType: action !== 'reset' ? type : undefined 
                } 
              : track
          )
        }))
      );
      
      // Si es una edición, también seleccionar la pista
      if (action === 'edit') {
        setSelectedTrackId(trackId);
        
        // Mostrar piano roll o audio wave según el tipo de pista
        const selectedTrack = trackGroups
          .flatMap(group => group.tracks)
          .find(track => track.id === trackId);
          
        if (selectedTrack) {
          if (selectedTrack.type === 'midi') {
            setShowPianoRoll(true);
            setShowAudioWave(false);
          } else if (selectedTrack.type === 'audio') {
            setShowAudioWave(true);
            setShowPianoRoll(false);
          }
        }
      }
    };
    
    document.addEventListener('track-activity', handleTrackActivity);
    return () => {
      document.removeEventListener('track-activity', handleTrackActivity);
    };
  }, [trackGroups]);
  
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

  // Generar clases de animación según el estado
  const getTrackAnimationClasses = (track: Track) => {
    if (!track.isActive) return '';
    
    if (activeAnimation.trackId === track.id) {
      if (activeAnimation.animationType === 'pulse') {
        return 'animate-pulse border-2 border-tehoria-accent';
      } else if (activeAnimation.animationType === 'edit') {
        return 'animate-bounce-subtle border-2 border-tehoria-accent';
      }
    }
    
    return track.isActive ? 'border border-tehoria-accent' : '';
  };

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
                  style={{ 
                    animationDelay: `${i * 0.02}s`,
                    animationDuration: '0.8s'
                  }}
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
                        className={`p-3 cursor-pointer transition-colors hover:bg-tehoria-darker/50 rounded-md ${
                          selectedTrackId === track.id ? 'border border-tehoria-accent' : 'border border-transparent'
                        } ${track.color} bg-opacity-10 ${getTrackAnimationClasses(track)}`}
                        onClick={() => handleTrackClick(track.id)}
                        onDoubleClick={() => handleTrackDoubleClick(track)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {track.type === 'audio' ? (
                              <AudioLines className={`h-4 w-4 ${track.isActive ? 'text-tehoria-accent' : 'text-muted-foreground'}`} />
                            ) : (
                              <Piano className={`h-4 w-4 ${track.isActive ? 'text-tehoria-accent' : 'text-muted-foreground'}`} />
                            )}
                            <span className={`font-medium ${track.isActive ? 'text-tehoria-accent' : ''}`}>
                              {track.name}
                              {track.activityType && (
                                <span className="ml-1 text-xs">
                                  {track.activityType === 'rhythm' ? '(ritmo)' : 
                                   track.activityType === 'melody' ? '(melodía)' : 
                                   track.activityType === 'atmosphere' ? '(ambiente)' : ''}
                                </span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`h-2 w-2 rounded-full ${track.color} ${track.isActive ? 'animate-pulse' : ''}`}></span>
                          </div>
                        </div>
                        
                        <div className={`h-16 bg-tehoria-darker rounded overflow-hidden ${track.isActive ? 'bg-opacity-70' : ''}`}>
                          {track.type === 'audio' ? (
                            // Representación de forma de onda de audio con animación condicional
                            <div className="h-full w-full flex items-center justify-around">
                              {Array.from({ length: 30 }).map((_, i) => (
                                <div 
                                  key={i}
                                  className={`visualizer-bar h-${Math.floor(Math.random() * 8) + 1} w-1 opacity-70 ${track.color} ${
                                    track.isActive ? 'animate-[bounceHeight_0.5s_ease-in-out_infinite]' : ''
                                  }`}
                                  style={{ 
                                    animationDelay: `${i * 0.05}s`,
                                    animationDuration: track.isActive ? '0.5s' : '1s'
                                  }}
                                ></div>
                              ))}
                            </div>
                          ) : (
                            // Representación de notas MIDI con animación condicional
                            <div className="h-full w-full flex items-end p-1">
                              {Array.from({ length: 10 }).map((_, i) => {
                                const height = Math.floor(Math.random() * 8) + 1;
                                const width = Math.floor(Math.random() * 3) + 1;
                                return (
                                  <div 
                                    key={i}
                                    className={`mx-1 ${track.color} rounded-sm ${
                                      track.isActive ? 'animate-[pulse_0.8s_ease-in-out_infinite]' : ''
                                    }`}
                                    style={{ 
                                      height: `${height * 10}%`, 
                                      width: `${width * 5}px`,
                                      marginLeft: `${i * 9}px`,
                                      transition: 'height 0.3s ease-in-out'
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
