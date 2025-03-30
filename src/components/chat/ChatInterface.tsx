
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, Send, Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import AudioVisualizer from './AudioVisualizer';
import MessageList from './MessageList';
import { useToast } from '@/hooks/use-toast';

const ChatInterface = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([
    { role: 'assistant', content: 'Hello! I\'m TehorIA, your AI-powered DAW assistant. How can I help with your music production today?' },
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages([...messages, { role: 'user', content: message }]);
    setMessage('');
    
    // Simulate assistant response after a delay
    setTimeout(() => {
      const assistantResponses = [
        "I've loaded your project. What would you like to work on first?",
        "I've added a reverb effect to the vocal track. How does it sound?",
        "I've created a new MIDI pattern with the chord progression you described. Would you like me to play it?",
        "I've adjusted the BPM to 120. The rhythm feels better now.",
        "I've exported your project as a WAV file. You can find it in your project folder."
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
  };

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
          />
          <div className="absolute right-2 flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className={`rounded-full ${isRecording ? 'text-red-500 animate-pulse-soft' : 'text-muted-foreground'}`}
              onClick={toggleRecording}
            >
              <Mic className="h-5 w-5" />
            </Button>
            <Button 
              variant="default" 
              size="icon" 
              className="rounded-full bg-tehoria-accent hover:bg-tehoria-highlight"
              onClick={handleSendMessage}
              disabled={!message.trim()}
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
