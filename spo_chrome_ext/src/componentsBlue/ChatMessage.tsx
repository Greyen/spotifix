import React from 'react';

export interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === 'bot';

  return (
    <div
      className={`flex max-w-xl ${
        isBot ? 'self-start' : 'self-end ml-auto'
      } animate-fade-in`}
    >
      {isBot && (
        <div className="w-8 h-8 mr-2 bg-blue-500 rounded-full flex-shrink-0"></div>
      )}
      <div
        className={`py-3 px-5 rounded-3xl ${
          isBot
            ? 'bg-navy-800 text-white'
            : 'bg-blue-500 text-white ml-auto'
        }`}
      >
        <p className="text-sm md:text-base">{message.text}</p>
      </div>
    </div>
  );
};

export default ChatMessage;