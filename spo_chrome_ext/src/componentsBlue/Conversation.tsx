import React, { useEffect, useRef } from 'react';
import ChatMessage, { Message } from './ChatMessage';

interface ConversationProps {
  messages: Message[];
}

const Conversation: React.FC<ConversationProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="w-full max-w-2xl mx-auto flex-grow overflow-y-auto px-4 py-4 flex flex-col gap-4">
      {messages.map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Conversation;