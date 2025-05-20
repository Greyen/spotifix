import React , { useState }from 'react';
import Background from './componentsBlue/Background';
import Header from './componentsBlue/Header';
import ChatInput from './componentsBlue/ChatInput';
import Conversation from './componentsBlue/Conversation';
import RelatedQueries from './componentsBlue/RelatedQueries';
import useChat from './hooks/usechat';

function AppBlue() {
  // const { messages, handleUserMessage } = useChat();
  const [query, setQuery] = useState('');
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [relatedQueries,setRelatedQueries] = useState<string[]>([]);
  // const [refer,setRefer] = useState<ReferenceProps[]>([]);
  // const [summ,setSumm] = useState<string>("");
  // const [detailedComp,setDetailedComp] = useState<Record<string, string[]>>({});

  const handleSearch = async(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      // e.preventDefault();
      // if (!query.trim()) return;
        if(e.key === "Enter" && query.trim() !== "") {
          e.preventDefault();
          setIsLoading(true);
          setQuery(query)
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
          if (tab?.id) {
            chrome.tabs.sendMessage(tab.id,{ action: "search", question: query }, async (response) => {
                if (chrome.runtime.lastError) {
                  console.error("Message sending error:", chrome.runtime.lastError.message);
                  setIsLoading(false);
                  return;
                }
                console.log(response)
                // const data = response.json()
                const {Summary,Detailed,Related_Queries,References} = response
                // console.log(Summary)
                // console.log(Detailed)
                // console.log(Related_Queries)
                setRelatedQueries(Related_Queries)
                // setRefer(References)
                // setSumm(Summary)
                // setDetailedComp(Detailed)
                // console.log(References)
                // response? console.log(response) :console.log("Failed to get response") 
                // const botResponse = response?.result || "Failed to get response";
  
                // ✅ Adds user message first, then updates bot response
                // setChatMessages((prev) => [...prev, { question: userMessage, answer: botResponse }]);
                // setIsSearched(true)
                setIsLoading(false); // ✅ Stops loading once response is received
              }
            );
          }
        };
    }
    // w-[430px] min-h-[180px] max-h-[600px] overflow-auto flex flex-col items-center text-white relative
  return (
    <div className="w-[430px] min-h-[180px] max-h-[600px] overflow-auto flex flex-col items-center text-white relative">
      {/* <Background /> */}
      {/* <div className="relative">
        <div className="w-28 h-28 md:w-36 md:h-36 bg-blue-500 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center animate-pulse-slow">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-400 rounded-full flex items-center justify-center">
            <div className="w-20 h-20 md:w-28 md:h-28 bg-blue-300 rounded-full animate-float"></div>
          </div>
        </div>
      </div> */}
      {/* <div className="w-28 h-28 md:w-36 md:h-36 bg-blue-500 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center animate-pulse-slow">
        <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-400 rounded-full flex items-center justify-center">
          <div className="w-20 h-20 md:w-28 md:h-28 bg-blue-300 rounded-full animate-float"></div>
        </div>
      </div> */}
      {/* <div className="w-[112px] h-[112px] md:w-[144px] md:h-[144px] bg-blue-500 rounded-full shadow-lg shadow-blue-500/30 flex items-center justify-center animate-pulse-slow">
        <div className="w-[96px] h-[96px] md:w-[128px] md:h-[128px] bg-blue-400 rounded-full flex items-center justify-center">
          <div className="w-[80px] h-[80px] md:w-[112px] h-[112px] bg-blue-300 rounded-full animate-float"></div>
        </div>
      </div> */}
      <Header />
      {/* <div className="flex-grow w-full flex flex-col items-center overflow-hidden">
        <Conversation messages={messages} /> */}
        {/* {relatedQueries.length > 0 && (
          <RelatedQueries 
            queries={relatedQueries} 
            onQuerySelect={handleUserMessage} 
          />
        )} */}
        {/* <ChatInput onSendMessage={handleUserMessage} /> */}
        {/* <form onSubmit={handleSubmit} className="w-full max-w-2xl mt-auto mb-8 px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Type Something..."
              // value={inputValue}
              // onChange={(e) => setInputValue(e.target.value)}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleSearch}></input>
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
        </form> */}
        {/* <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto px-4 mt-10">
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type your message..."
              className="w-full h-[120px] max-h-[300px] min-h-[80px] p-6 pr-16 bg-navy-900/40 backdrop-blur-sm text-gray-100 border border-navy-800 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 placeholder:text-gray-500 transition-all duration-300 dark:bg-offsetDark dark:text-textMainDark dark:placeholder-textOffDark"
            />
            <button
              type="submit"
              className="absolute bottom-4 right-4 w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white hover:bg-blue-400 transition-colors duration-300"
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
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </form> */}

        <div className="w-full bg-navy-900/40 text-gray-100 border border-navy-800 backdrop-blur-sm rounded-full px-8 py-6 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all duration-300">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type Something..."
            onKeyDown={handleSearch}
            className="w-full bg-transparent text-inherit placeholder:text-gray-500 outline-none resize-none"
          />
        </div>

        {!isLoading && (
          <div>
            {/* {Realted queries} */}
            {<RelatedQueries queries={relatedQueries} />}
          </div> 
        )}
      {/* </div> */}
    </div>
  );
}

export default AppBlue;