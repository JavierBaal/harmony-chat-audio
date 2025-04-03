
import React, { useState, useEffect, useRef } from 'react';
import { AudioLines, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  typing?: boolean;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  // Mantener una referencia del último mensaje para animarlo
  const lastMessageRef = useRef<HTMLDivElement>(null);
  
  // Estado para manejar el texto animado
  const [typingStates, setTypingStates] = useState<{[key: number]: {
    displayedText: string,
    isComplete: boolean,
    errorMode: boolean,
    errorIndex: number,
    currentIndex: number
  }>>({}); 

  useEffect(() => {
    // Inicializar estados de escritura para nuevos mensajes
    messages.forEach((message, index) => {
      if (message.typing && !typingStates[index]?.isComplete) {
        if (!typingStates[index]) {
          setTypingStates(prev => ({
            ...prev,
            [index]: {
              displayedText: '',
              isComplete: false,
              errorMode: false,
              errorIndex: -1,
              currentIndex: 0
            }
          }));
        }
      }
    });
  }, [messages]);

  // Efecto para animar la escritura de texto
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    
    messages.forEach((message, index) => {
      if (message.typing && !typingStates[index]?.isComplete) {
        const state = typingStates[index];
        if (!state) return;
        
        const originalText = message.content;
        
        // Determinar si generaremos un error (20% de probabilidad)
        const willMakeError = Math.random() < 0.2 && !state.errorMode && state.currentIndex < originalText.length - 1;
        
        // Función para simular la escritura con posibles errores
        const typeNextCharacter = () => {
          setTypingStates(prev => {
            const current = prev[index];
            if (!current || current.isComplete) return prev;
            
            // Si estamos en modo error, simular un error de escritura
            if (willMakeError && !current.errorMode && current.currentIndex === Math.floor(originalText.length * Math.random())) {
              // Crear un error aleatorio (duplicar letra, cambiar por otra cercana en el teclado)
              const errors = [
                originalText[current.currentIndex] + originalText[current.currentIndex], // Duplicar letra
                "aeiou".includes(originalText[current.currentIndex].toLowerCase()) ? 'e' : 'a', // Cambiar por vocal
                originalText[current.currentIndex] === 's' ? 'd' : 's', // Errores comunes s/d
                originalText[current.currentIndex] === 'n' ? 'm' : 'n', // Errores comunes n/m
              ];
              
              const errorText = errors[Math.floor(Math.random() * errors.length)];
              
              return {
                ...prev,
                [index]: {
                  ...current,
                  displayedText: current.displayedText + errorText,
                  errorMode: true,
                  errorIndex: current.currentIndex,
                  currentIndex: current.currentIndex
                }
              };
            }
            
            // Si estamos corrigiendo un error
            if (current.errorMode) {
              // Borrar un carácter
              const newText = current.displayedText.slice(0, -1);
              
              // Verificar si hemos borrado suficiente para corregir el error
              const errorCorrected = newText.length <= current.errorIndex;
              
              return {
                ...prev,
                [index]: {
                  ...current,
                  displayedText: newText,
                  errorMode: !errorCorrected,
                  currentIndex: errorCorrected ? current.errorIndex : current.currentIndex
                }
              };
            }
            
            // Escritura normal (sin errores o después de corregir)
            if (current.currentIndex < originalText.length) {
              return {
                ...prev,
                [index]: {
                  ...current,
                  displayedText: current.displayedText + originalText[current.currentIndex],
                  currentIndex: current.currentIndex + 1,
                  isComplete: current.currentIndex + 1 >= originalText.length
                }
              };
            } else {
              return {
                ...prev,
                [index]: {
                  ...current,
                  isComplete: true
                }
              };
            }
          });
        };
        
        // Velocidad variable de escritura
        const interval = setInterval(typeNextCharacter, 
          state.errorMode ? 150 : Math.floor(Math.random() * 50) + 50
        );
        
        intervals.push(interval);
      }
    });
    
    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [messages, typingStates]);

  return (
    <div className="space-y-4 py-2">
      {messages.map((message, index) => (
        <div 
          key={index} 
          ref={index === messages.length - 1 ? lastMessageRef : null}
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg max-w-[85%]",
            message.role === 'assistant' 
              ? "bg-tehoria-darker" 
              : "bg-tehoria-accent/20 ml-auto"
          )}
        >
          {message.role === 'assistant' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-tehoria-accent flex items-center justify-center">
              <AudioLines className="h-4 w-4 text-white" />
            </div>
          )}
          
          <div className="flex-1 overflow-hidden">
            <div className="text-sm mb-1 font-medium">
              {message.role === 'assistant' ? 'TehorIA' : 'You'}
            </div>
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.typing && !typingStates[index]?.isComplete 
                ? typingStates[index]?.displayedText || ''
                : message.content}
              {message.typing && !typingStates[index]?.isComplete && (
                <span className="inline-block w-1 h-4 ml-0.5 bg-tehoria-accent animate-blink"></span>
              )}
            </p>
          </div>
          
          {message.role === 'user' && (
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MessageList;
