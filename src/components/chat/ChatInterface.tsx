
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Send, Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';
import MessageList from './MessageList';
import { useToast } from '@/hooks/use-toast';

// Creamos una interfaz para el evento personalizado
interface TrackActivityEvent extends CustomEvent {
  detail: {
    trackId: string;
    action: 'highlight' | 'edit' | 'reset';
    type?: 'rhythm' | 'melody' | 'atmosphere';
  };
}

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Hello! I\'m TehorIA, your AI-powered DAW assistant. How can I help with your music production today?' },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationStep, setSimulationStep] = useState(0);
  const [showSimulationButton, setShowSimulationButton] = useState(true);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Simulated conversation flow for the techno track example
  const simulatedConversation = [
    { role: 'user', content: 'Quiero hacer un track de techno oscuro a 128 BPM' },
    { role: 'assistant', content: 'Me gusta la idea. Por tu historial, veo que prefieres empezar con el ritmo y crear atmósferas densas. ¿Te gustaría que empecemos con un patrón de drums inspirado en el estilo Berlin techno que usamos en tu último proyecto? O podemos explorar algo nuevo, quizás con influencias industriales.' },
    { role: 'user', content: 'Sí, empecemos por el ritmo, pero esta vez quiero algo más industrial' },
    { role: 'assistant', content: 'Vale, vamos a ello. Ya que te gustó cómo quedó la compresión paralela en el último track, la aplicaré sutilmente al bombo mientras trabajamos. Para darle ese toque industrial, sugiero:\n\n1. Un bombo más crudo a 128 BPM\n2. Un patrón de hi-hats metálicos con algo de distorsión\n3. Claps procesados con reverb metálica\n\n¿Por cuál prefieres que empecemos?' },
    { role: 'user', content: 'El bombo suena bien pero necesita más pegada' },
    { role: 'assistant', content: 'Basándome en tu estilo de mezcla anterior, sugiero:\n\n1. Aumentar el ataque con el transient designer que usas frecuentemente\n2. Añadir saturación suave en los graves (sé que prefieres el plugin Saturn para esto)\n3. Un toque de compresión rápida para acentuar el click\n\n¿Cuál probamos primero?' },
    { role: 'user', content: 'Me gusta cómo va quedando. ¿Qué tal si añadimos algo de melodía?' },
    { role: 'assistant', content: 'He notado que en tus últimos tracks de techno, las melodías minimalistas con delays sincronizados funcionaron muy bien. ¿Qué te parece si creamos algo con el Repro-1 (tu sinte favorito para leads) usando:\n\n1. Una secuencia de 2 notas en Dm\n2. Delay ping-pong a negras\n3. Algo de modulación LFO en el filtro\n\nTambién podríamos explorar algo diferente si prefieres salir de tu zona de confort.' },
    { role: 'assistant', content: 'Por cierto, he notado que en tus últimas sesiones, cuando trabajamos con este tipo de atmósferas oscuras, solías añadir texturas ambiente sutiles en el fondo. ¿Te gustaría que exploremos algunas ideas para eso? Tengo algunas sugerencias basadas en lo que ha funcionado bien antes.' }
  ];

  // Track activity corresponding to each simulation step
  const simulationTrackActivity = [
    { step: 0, trackId: '1', action: 'highlight', type: 'rhythm' }, // Primer mensaje - menciona BPM y techno
    { step: 2, trackId: '1', action: 'edit', type: 'rhythm' },      // Tercer mensaje - habla de ritmo industrial
    { step: 4, trackId: '1', action: 'edit', type: 'rhythm' },      // Quinto mensaje - ajustes de bombo
    { step: 6, trackId: '3', action: 'highlight', type: 'melody' }, // Séptimo mensaje - menciona melodía
    { step: 7, trackId: '3', action: 'edit', type: 'melody' },      // Octavo mensaje - habla de sintetizadores
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Emitir eventos para activar visualizaciones en las pistas
  const triggerTrackActivity = (trackId: string, action: 'highlight' | 'edit' | 'reset', type?: 'rhythm' | 'melody' | 'atmosphere') => {
    const event = new CustomEvent('track-activity', {
      detail: { trackId, action, type },
      bubbles: true
    }) as TrackActivityEvent;
    document.dispatchEvent(event);
  };

  // Simulate conversation
  useEffect(() => {
    if (isSimulating && simulationStep < simulatedConversation.length) {
      const timer = setTimeout(() => {
        const nextMessage = simulatedConversation[simulationStep];
        setMessages(prev => [...prev, nextMessage]);
        setSimulationStep(prev => prev + 1);
        
        // Update BPM if it's the first user message about 128 BPM techno
        if (simulationStep === 0) {
          toast({
            title: "BPM actualizado",
            description: "Tempo ajustado a 128 BPM",
          });
        }
        
        // Simulate changing sounds when mentioning industrial drums
        if (simulationStep === 2) {
          setIsPlaying(true);
          toast({
            title: "Aplicando estilo industrial",
            description: "Ajustando parámetros de ritmo",
          });
        }

        // Buscar y activar actividad visual para este paso
        const activity = simulationTrackActivity.find(act => act.step === simulationStep);
        if (activity) {
          triggerTrackActivity(activity.trackId, activity.action, activity.type);
          
          // Para reacciones de edición, también actualizar el estado de reproducción
          if (activity.action === 'edit') {
            setIsPlaying(true);
          }
        }
        
      }, simulationStep % 2 === 0 ? 1000 : 2000); // User messages appear faster than AI responses
      
      return () => clearTimeout(timer);
    } else if (isSimulating && simulationStep >= simulatedConversation.length) {
      setIsSimulating(false);
    }
  }, [isSimulating, simulationStep, toast]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages([...messages, { role: 'user', content: message }]);
    setMessage('');
    
    // Simulate assistant response after a delay
    setTimeout(() => {
      const assistantResponses = [
        "He ajustado los parámetros según tus preferencias. ¿Qué te parece ahora?",
        "He aplicado el efecto que sugeriste. ¿Continuamos con la estructura del track?",
        "He añadido una leve reverb al sintetizador principal. ¿Necesitas que ajuste algo más?",
        "La mezcla está tomando forma. ¿Te gustaría que refuerce alguna frecuencia en particular?",
        "He guardado una copia de seguridad de tu proyecto. Podemos explorar diferentes variaciones sin perder tu trabajo."
      ];
      
      const randomResponse = assistantResponses[Math.floor(Math.random() * assistantResponses.length)];
      
      setMessages(prev => [...prev, { role: 'assistant', content: randomResponse }]);
    }, 1000);
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording stopped" : "Recording started",
      description: isRecording ? "Your audio has been captured" : "Speak your command...",
    });
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    toast({
      title: isPlaying ? "Playback paused" : "Playback started",
      description: isPlaying ? "Audio paused" : "Playing your project",
    });

    // Resetear todos los estados visuales cuando se pausa
    if (!isPlaying) {
      triggerTrackActivity('all', 'reset');
    }
  };

  const startSimulation = () => {
    // Reset conversation and start simulation
    setMessages([{ role: 'assistant', content: 'Hello! I\'m TehorIA, your AI-powered DAW assistant. How can I help with your music production today?' }]);
    setSimulationStep(0);
    setIsSimulating(true);
    setShowSimulationButton(false); // Ocultar el botón al iniciar la simulación
    
    // Resetear cualquier estado visual previo
    triggerTrackActivity('all', 'reset');
  };

  // Para reiniciar la simulación cuando se completa
  useEffect(() => {
    if (!isSimulating && simulationStep >= simulatedConversation.length && !showSimulationButton) {
      const timer = setTimeout(() => {
        setShowSimulationButton(true);
      }, 5000); // Mostrar el botón nuevamente después de 5 segundos
      
      return () => clearTimeout(timer);
    }
  }, [isSimulating, simulationStep, simulatedConversation.length, showSimulationButton]);

  return (
    <div className="flex flex-col h-full">
      {/* Audio controls area */}
      <div className="p-3 glass-panel m-4 flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => toast({ title: "Previous track" })}
            >
              <SkipBack className="h-5 w-5" />
            </Button>
            
            <Button 
              variant="default" 
              size="icon" 
              className={`rounded-full ${isPlaying ? 'bg-tehoria-accent' : 'bg-primary'}`}
              onClick={togglePlayback}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => toast({ title: "Next track" })}
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Current Project</div>
            <div className="text-sm font-medium">My Awesome Track</div>
          </div>
          
          <div className="flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-muted-foreground" />
            <div className="w-24 h-1 bg-tehoria-darker rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-tehoria-accent rounded-full"></div>
            </div>
          </div>
        </div>
        
        <AudioVisualizer isActive={isPlaying} />

        {/* Simulation control - ahora condicional */}
        {showSimulationButton && !isSimulating && (
          <div className="flex justify-center">
            <Button 
              onClick={startSimulation}
              variant="outline" 
              className="text-tehoria-accent hover:bg-tehoria-darker/50 text-sm"
            >
              Simular conversación de producción techno
            </Button>
          </div>
        )}
      </div>
      
      {/* Chat area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <MessageList messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div className="p-4 border-t border-tehoria-darker">
        <div className="relative flex items-center">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a command or question..."
            className="w-full p-3 pr-16 bg-tehoria-darker rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-tehoria-accent min-h-[60px] max-h-32"
            rows={1}
            disabled={isSimulating}
          />
          <div className="absolute right-2 flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${isRecording ? 'text-red-500 animate-pulse-soft' : 'text-muted-foreground'}`}
              onClick={toggleRecording}
              disabled={isSimulating}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full bg-tehoria-accent hover:bg-tehoria-highlight"
              onClick={handleSendMessage}
              disabled={!message.trim() || isSimulating}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
