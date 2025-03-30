
import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PianoRollProps {
  trackName: string;
  trackColor: string;
  onClose: () => void;
}

const PianoRoll: React.FC<PianoRollProps> = ({ trackName, trackColor, onClose }) => {
  const [octave, setOctave] = useState(4);
  const pianoKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  
  // Generamos notas para 2 octavas visibles
  const notes = [];
  for (let o = octave + 1; o >= octave; o--) {
    for (let i = pianoKeys.length - 1; i >= 0; i--) {
      notes.push({ note: pianoKeys[i], octave: o });
    }
  }
  
  // Simulamos algunas notas en el piano roll
  const generateRandomNotes = () => {
    const randomNotes = [];
    for (let i = 0; i < 20; i++) {
      const startTime = Math.floor(Math.random() * 64);
      const duration = Math.floor(Math.random() * 4) + 1;
      const noteIndex = Math.floor(Math.random() * notes.length);
      
      randomNotes.push({
        id: i,
        note: notes[noteIndex],
        startTime,
        duration
      });
    }
    return randomNotes;
  };
  
  const [midiNotes] = useState(generateRandomNotes());
  
  const increaseOctave = () => {
    if (octave < 7) setOctave(octave + 1);
  };
  
  const decreaseOctave = () => {
    if (octave > 0) setOctave(octave - 1);
  };

  return (
    <div className="flex flex-col h-full">
      <div className={`p-3 flex items-center justify-between ${trackColor} bg-opacity-20`}>
        <div className="flex items-center gap-2">
          <span className="font-semibold">Piano Roll:</span>
          <span>{trackName}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Piano keyboard */}
        <div className="w-16 bg-tehoria-darker border-r border-tehoria-darker">
          <div className="flex items-center justify-center p-1 border-b border-tehoria-darker">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={decreaseOctave}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="mx-1 text-xs">Oct {octave}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={increaseOctave}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-col">
            {notes.map((note, index) => (
              <div
                key={index}
                className={`flex items-center h-6 border-b border-tehoria-darker ${
                  note.note.includes('#') ? 'bg-tehoria-dark' : 'bg-tehoria-darker'
                }`}
              >
                <span className="text-xs font-mono ml-2">
                  {note.note}{note.octave}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Grid and notes */}
        <ScrollArea className="flex-1 h-full">
          <div className="relative" style={{ width: '1600px', height: `${notes.length * 24}px` }}>
            {/* Grid lines */}
            <div className="absolute inset-0">
              {/* Horizontal lines (note boundaries) */}
              {notes.map((_, index) => (
                <div
                  key={`h-${index}`}
                  className="absolute h-px w-full bg-tehoria-darker"
                  style={{ top: `${index * 24}px` }}
                ></div>
              ))}
              
              {/* Vertical lines (time divisions) */}
              {Array.from({ length: 64 }).map((_, index) => (
                <div
                  key={`v-${index}`}
                  className={`absolute top-0 bottom-0 w-px ${index % 4 === 0 ? 'bg-tehoria-darker' : 'bg-tehoria-darker bg-opacity-30'}`}
                  style={{ left: `${index * 25}px` }}
                ></div>
              ))}
            </div>
            
            {/* MIDI Notes */}
            {midiNotes.map((midiNote) => {
              const noteIndex = notes.findIndex(
                n => n.note === midiNote.note.note && n.octave === midiNote.note.octave
              );
              
              return (
                <div
                  key={midiNote.id}
                  className={`absolute ${trackColor} rounded cursor-pointer`}
                  style={{
                    top: `${noteIndex * 24 + 1}px`,
                    left: `${midiNote.startTime * 25 + 1}px`,
                    width: `${midiNote.duration * 25 - 2}px`,
                    height: '22px'
                  }}
                ></div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default PianoRoll;
