import { useState, useCallback } from 'react';
import { Message } from '../componentsBlue/ChatMessage';

const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [relatedQueries, setRelatedQueries] = useState<string[]>([
    "Ask about music genres",
    "Get song recommendations", 
    "Learn about artists",
    "Discover new music",
  ]);

  const addMessage = useCallback((text: string, sender: 'user' | 'bot') => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text,
        sender,
      },
    ]);
  }, []);

  const handleUserMessage = useCallback(
    (text: string) => {
      addMessage(text, 'user');
      
      setTimeout(() => {
        let botResponse = "I'm not sure how to respond to that yet.";
        
        const lowerText = text.toLowerCase();
        
        if (lowerText.includes('hello') || lowerText.includes('hi')) {
          botResponse = "Hello there! How can I assist you with music today?";
          setRelatedQueries([
            "What kind of music do you like?",
            "Can you recommend some songs?",
            "Tell me about different genres",
            "What's trending in music?",
          ]);
        } else if (lowerText.includes('music') || lowerText.includes('song')) {
          botResponse = "Music is my passion! I can discuss genres, artists, or help you discover new tunes.";
          setRelatedQueries([
            "Recommend a playlist",
            "Who's your favorite artist?",
            "What's your favorite genre?",
            "Tell me about classical music",
          ]);
        } else if (lowerText.includes('dare')) {
          botResponse = "I dare you to listen to a genre you've never explored before. How about some experimental jazz or classical crossover?";
          setRelatedQueries([
            "What is experimental jazz?",
            "Tell me about classical crossover",
            "Give me another challenge",
            "Recommend some artists",
          ]);
        } else if (lowerText.includes('recommend') || lowerText.includes('suggestion')) {
          botResponse = "I'd recommend checking out 'Time' by Hans Zimmer. It's a masterpiece that transcends genre boundaries.";
          setRelatedQueries([
            "Tell me more about Hans Zimmer",
            "Similar composers to check out",
            "Other movie soundtracks",
            "Different music styles",
          ]);
        } else {
          setRelatedQueries([
            "Ask about music genres",
            "Get song recommendations",
            "Learn about artists",
            "Discover new music",
          ]);
        }
        
        addMessage(botResponse, 'bot');
      }, 1000);
    },
    [addMessage]
  );

  return {
    messages,
    relatedQueries,
    handleUserMessage,
  };
};

export default useChat;