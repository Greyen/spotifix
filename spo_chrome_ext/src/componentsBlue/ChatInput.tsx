import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mt-auto mb-8 px-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Type Something..."
          value={inputValue}
          
          onChange={(e) => setInputValue(e.target.value)}
          className="w-full py-6 px-8 bg-navy-900/40 backdrop-blur-sm border border-navy-800 text-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-500 transition-all duration-300"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-400 transition-colors duration-300"
          aria-label="Send message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>
    </form>
  );
};

export default ChatInput;