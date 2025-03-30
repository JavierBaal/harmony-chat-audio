
import React from 'react';
import { AudioLines, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface MessageListProps {
  messages: Message[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  return (
    <div className="space-y-4 py-2">
      {messages.map((message, index) => (
        <div 
          key={index} 
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
              {message.content}
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
