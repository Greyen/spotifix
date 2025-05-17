// export default App
// import { useState } from 'react';
// import { Document } from './utils.ts';

// function App() {
//   const [documentData, setDocumentData] = useState<Document | null>(null); 
//   const [chatMessages, setChatMessages] = useState<{ question: string; answer: string }[]>([]);
//   const [chatInput, setChatInput] = useState("");
//   const [isloading, setIsloading] = useState<boolean>(false)


//   const handleChatSubmit = async (event: any) => {
//     if (event.key === "Enter" && chatInput.trim() !== "") {
//       event.preventDefault();
//       const userMessage = chatInput;
//       setChatInput("");
//       setIsloading(true);
//       const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//       if (tab?.id) {
//         chrome.tabs.sendMessage(tab.id, { action: "search", question: userMessage }, async(response) => {
//           if (chrome.runtime.lastError) {
//             console.error("Message sending error:", chrome.runtime.lastError.message);
//             return;
//           }
//           console.log(response.result)
//           const botResponse = response?.result || "Failed to get response";
//           setChatMessages((prev) => [...prev, { question: userMessage, answer: botResponse }]);
//           setIsloading(false);
//           return true;
//         });
//       }
//     }
//   };

//   const onClick = async () => {
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//     if (tab?.id) {
//       chrome.tabs.sendMessage(tab.id, { action: "execute_transformers" }, (response) => {
//         if (response?.document) {
//           setDocumentData(response.document);
//         } else {
//           console.error("Failed to get transformed document");
//         }
//       });
//     }
//   };

//   return (
//     <>
//       <div className="card">
//         <button onClick={onClick}>Extract Document</button>
//         {documentData && (
//           <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
//             {JSON.stringify(documentData, null, 2)}
//           </pre>
//         )}
//       </div>

//       {/* Chat Box */}
//       <div className="chat-box">
//         <div className="chat-messages">
//           {chatMessages.map((chat, index) => (
//             <div key={index} className="chat-entry">
//               <div className="user-message">User: {chat.question}</div>
//               <div className="bot-message">
//                 Bot: {isloading ? "Loading..." : chat.answer}
//               </div>
//             </div>
//           ))}
//         </div>
//         <input
//           type="text"
//           value={chatInput}
//           onChange={(e) => setChatInput(e.target.value)}
//           onKeyDown={handleChatSubmit}
//           placeholder="Type a message and press Enter"
//           className="chat-input"
//         />
//       </div>
//     </>
//   );
// }

// // export default App;
// import { useState } from "react";
// import { Document } from "./utils.ts";

// function App() {
//   const [documentData, setDocumentData] = useState<Document | null>(null);
//   const [chatMessages, setChatMessages] = useState<
//     { question: string; answer: string }[]
//   >([]);
//   const [chatInput, setChatInput] = useState("");
//   const [isloading, setIsloading] = useState<boolean>(false);

//   const handleChatSubmit = async (event: any) => {
//     if (event.key === "Enter" && chatInput.trim() !== "") {
//       event.preventDefault();

//       const userMessage = chatInput;
//       setChatInput(""); // ✅ Clears input immediately after enter
//       setIsloading(true); // ✅ Set loading state to true

//       const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//       if (tab?.id) {
//         chrome.tabs.sendMessage(
//           tab.id,
//           { action: "search", question: userMessage },
//           async (response) => {
//             if (chrome.runtime.lastError) {
//               console.error("Message sending error:", chrome.runtime.lastError.message);
//               setIsloading(false);
//               return;
//             }

//             console.log(response.result);
//             const botResponse = response?.result || "Failed to get response";

//             // ✅ Adds user message first, then updates bot response
//             setChatMessages((prev) => [...prev, { question: userMessage, answer: botResponse }]);
//             setIsloading(false); // ✅ Stops loading once response is received
//           }
//         );
//       }
//     }
//   };

//   const onClick = async () => {
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

//     if (tab?.id) {
//       chrome.tabs.sendMessage(tab.id, { action: "execute_transformers" }, (response) => {
//         if (response?.document) {
//           setDocumentData(response.document);
//         } else {
//           console.error("Failed to get transformed document");
//         }
//       });
//     }
//   };

//   return (
//     <>
//       {/* <div className="card">
//         <button onClick={onClick}>Extract Document</button>
//         {documentData && (
//           <pre style={{ whiteSpace: "pre-wrap", wordWrap: "break-word" }}>
//             {JSON.stringify(documentData, null, 2)}
//           </pre>
//         )}
//       </div> */}

//       {/* Chat Box */}
//       <div className="chat-box">
//         <div className="chat-messages">
//           {chatMessages.map((chat, index) => (
//             <div key={index} className="chat-entry">
//               <div className="user-message">User: {chat.question}</div>
//               <div className="bot-message">
//                 Bot: {isloading ? "Loading..." : chat.answer}
//               </div>
//             </div>
//           ))}

//           {/* ✅ Show "Loading..." if a message is being processed */}
//           {isloading && (
//             <div className="chat-entry">
//               <div className="bot-message">Loading...</div>
//             </div>
//           )}
//         </div>

//         <input
//           type="text"
//           value={chatInput}
//           onChange={(e) => setChatInput(e.target.value)}
//           onKeyDown={handleChatSubmit}
//           placeholder={isloading ? "" : "Type a message and press Enter"}
//           className="chat-input"
//           disabled={isloading} // Optional: Disable input while loading
//         />
//       </div>
//     </>
//   );
// }

// export default App;

import React, { useState } from 'react';
import { Search, ArrowRight, Copy, Plus, Link, Sparkles } from 'lucide-react';
import RelatedQueries from './Components/relatedQueries';
import ReferencesList from './Components/references';
// import { WithReference } from './utils/answerparser';
import {ReferenceProps} from './Components/references'
import Summary from './Components/summary';
import DetailedComponent from './Components/Detailed';

function App(){
  const [query, setQuery] = useState('');
  const [isSearched, setIsSearched] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [relatedQueries,setRelatedQueries] = useState<string[]>([]);
  const [refer,setRefer] = useState<ReferenceProps[]>([]);
  const [summ,setSumm] = useState<string>("");
  const [detailedComp,setDetailedComp] = useState<Record<string, string[]>>({});
  // const [chatInput, setChatInput] = useState<string>("");

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
              console.log(Summary)
              console.log(Detailed)
              console.log(Related_Queries)
              setRelatedQueries(Related_Queries)
              setRefer(References)
              setSumm(Summary)
              setDetailedComp(Detailed)
              console.log(References)
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
  return (
    <div className="">
      <div className="w-[430px] min-h-[180px] max-h-[600px] overflow-hidden pb-md border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-background dark:bg-backgroundDark">
        <div className="mb-sm border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
          {/* Header */}
          <div className="flex items-center justify-between mb-md border-b pl-md pr-sm py-sm border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
          <div className="cursor-pointer h-[32px] flex">
            <div className="h-auto group w-28 md:w-36">
              <path d="M24.0655 1.39844L14.5703 10.9021H24.0655V1.3984  4Z" className="stroke-textMain dark:stroke-textMainDark stroke-[1.3px] transition-all duration-300" stroke-miterlimit="10"></path>
              <svg viewBox="0 0 151 36" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M24.0655 1.39844L14.5703 10.9021H24.0655V1.3984  4Z" className="stroke-textMain dark:stroke-textMainDark stroke-[1.3px] transition-all duration-300" stroke-miterlimit="10"></path><path d="M14.57 10.9021L5.07422 1.39844V10.9021H14.57Z" className="stroke-textMain dark:stroke-textMainDark stroke-[1.3px] transition-all duration-300" stroke-miterlimit="10"></path><path d="M14.5488 0L14.5488 36" className="stroke-textMain dark:stroke-textMainDark stroke-[1.3px] transition-all duration-300" stroke-miterlimit="10"></path><path d="M24.0655 20.4041L14.5703 10.9004V24.5252L24.0655 34.0288V20.4041Z" className="stroke-textMain dark:stroke-textMainDark stroke-[1.3px] transition-all duration-300" stroke-miterlimit="10"></path><path d="M5.07422 20.4041L14.57 10.9004V24.5252L5.07422 34.0288V20.4041Z" className="stroke-textMain dark:stroke-textMainDark stroke-[1.3px] transition-all duration-300" stroke-miterlimit="10"></path><path d="M1 10.9004V24.4705H5.07437V20.4041L14.5701 10.9004H1Z" className="stroke-textMain dark:stroke-textMainDark stroke-[1.3px] transition-all duration-300" stroke-miterlimit="10"></path><path d="M14.5703 10.9004L24.0655 20.4041V24.4705H28.1405V10.9004H14.5703Z" className="stroke-textMain dark:stroke-textMainDark stroke-[1.3px] transition-all duration-300" stroke-miterlimit="10"></path><path d="M55.9605 13.0284C56.5531 11.9196 57.3829 11.0651 58.4511 10.4648C59.5182 9.86569 60.7706 9.56555 62.206 9.56555C63.6414 9.56555 64.8312 9.86098 65.8263 10.4518C66.8226 11.0427 67.5674 11.8254 68.0608 12.8012C68.5542 13.7769 68.8009 14.8457 68.8009 16.0086V17.6187H57.6296C57.7193 19.0147 58.1903 20.1246 59.0425 20.9474C59.8948 21.7713 61.0386 22.1821 62.4752 22.1821C63.6414 22.1821 64.535 21.9455 65.1535 21.4711C65.7732 20.9968 66.2253 20.34 66.5133 19.4985H69.0713C68.7301 20.8049 68.0349 21.9372 66.9855 22.8942C65.9361 23.8523 64.4323 24.3301 62.4763 24.3301C61.0044 24.3301 59.7071 24.03 58.5857 23.4309C57.4643 22.8318 56.5979 21.9773 55.9876 20.8673C55.3774 19.7574 55.0728 18.4509 55.0728 16.9478C55.0728 15.4448 55.3691 14.1383 55.9617 13.0284H55.9605ZM66.1096 15.6049C66.1096 14.3878 65.7956 13.4356 65.1677 12.7459C64.5397 12.0573 63.5529 11.7124 62.206 11.7124C60.9501 11.7124 59.9219 12.0479 59.124 12.7188C58.3248 13.3897 57.8362 14.3525 57.6567 15.6049H66.1096Z" className=" block fill-textMain dark:fill-textMainDark"></path><path d="M72.1566 9.96796V12.1961C72.1566 12.322 72.2192 12.3844 72.3455 12.3844C72.4175 12.3844 72.4706 12.3667 72.5072 12.3302C72.5438 12.2938 72.5792 12.2231 72.6146 12.116C73.0809 10.6495 74.2388 9.91499 76.0873 9.91499H77.2713V12.3302H75.7368C74.5339 12.3302 73.6368 12.6163 73.0443 13.1895C72.4517 13.7627 72.1554 14.7019 72.1554 16.0084V23.9275H69.732V9.96796H72.1566Z" className=" block fill-textMain dark:fill-textMainDark"></path><path d="M91.4988 20.9874C90.8614 22.1055 90.0363 22.9424 89.0223 23.4968C88.0084 24.0511 86.9177 24.3289 85.7514 24.3289C83.4544 24.3289 81.8384 23.4167 80.9059 21.5912C80.8338 21.4487 80.7441 21.3769 80.6367 21.3769C80.5293 21.3769 80.475 21.4311 80.475 21.5382V29.0276H78.0516V9.96805H80.475V12.3574C80.475 12.4645 80.5293 12.5187 80.6367 12.5187C80.7441 12.5187 80.8338 12.4469 80.9059 12.3044C81.8384 10.4789 83.4544 9.56669 85.7514 9.56669C86.9177 9.56669 88.0084 9.84447 89.0223 10.3988C90.0363 10.9532 90.8614 11.7901 91.4988 12.9083C92.1362 14.0264 92.455 15.3741 92.455 16.9478C92.455 18.5215 92.1362 19.8692 91.4988 20.9874ZM88.6989 13.0954C87.8101 12.1738 86.6391 11.7124 85.186 11.7124C83.7329 11.7124 82.5608 12.1738 81.6731 13.0954C80.7843 14.017 80.4585 15.3012 80.4585 16.9478C80.4585 18.5945 80.7843 19.8786 81.6731 20.8002C82.562 21.7218 83.7329 22.1832 85.186 22.1832C86.6391 22.1832 87.8112 21.723 88.6989 20.8002C89.5877 19.8786 90.0316 18.5945 90.0316 16.9478C90.0316 15.3012 89.5877 14.0182 88.6989 13.0954Z" className=" block fill-textMain dark:fill-textMainDark"></path><path d="M95.9712 4.59961V23.9263H93.5478V4.59961H95.9712Z" className=" block fill-textMain dark:fill-textMainDark"></path><path d="M97.966 13.0284C98.5585 11.9196 99.3883 11.0651 100.457 10.4648C101.524 9.86569 102.776 9.56555 104.211 9.56555C105.647 9.56555 106.837 9.86098 107.832 10.4518C108.828 11.0427 109.573 11.8254 110.066 12.8012C110.56 13.7769 110.806 14.8457 110.806 16.0086V17.6187H99.6351C99.7248 19.0147 100.196 20.1246 101.048 20.9474C101.9 21.7713 103.044 22.1821 104.481 22.1821C105.647 22.1821 106.54 21.9455 107.159 21.4711C107.779 20.9968 108.231 20.34 108.519 19.4985H111.077C110.736 20.8049 110.04 21.9372 108.991 22.8942C107.942 23.8523 106.438 24.3301 104.482 24.3301C103.01 24.3301 101.713 24.03 100.591 23.4309C99.4698 22.8318 98.6034 21.9773 97.9931 20.8673C97.3828 19.7574 97.0783 18.4509 97.0783 16.9478C97.0783 15.4448 97.3746 14.1383 97.9671 13.0284H97.966ZM108.115 15.6049C108.115 14.3878 107.801 13.4356 107.173 12.7459C106.545 12.0573 105.558 11.7124 104.211 11.7124C102.956 11.7124 101.927 12.0479 101.129 12.7188C100.33 13.3897 99.8416 14.3525 99.6622 15.6049H108.115Z" className=" block fill-textMain dark:fill-textMainDark"></path><path d="M109.728 23.3894L115.273 16.5438L110.724 10.5045V9.96777H113.389L117.186 15.1749L121.278 9.96777H123.996V10.5316L118.774 16.9475L123.593 23.3894V23.9261H120.982L116.863 18.3164L112.449 23.9261H109.73V23.3894H109.728Z" className=" block fill-textMain dark:fill-textMainDark"></path><path d="M127.514 5.4245V8.44591H124.684V5.4245H127.514ZM127.367 23.9273H124.943V9.96781H127.367V23.9273Z" className=" block fill-textMain dark:fill-textMainDark"></path><path d="M128.131 9.96828H130.767V6.21005H133.191V9.96828H135.965L136.646 12.014H133.191V18.6924C133.191 19.6046 133.168 20.2802 133.123 20.7192C133.078 21.1582 133.056 21.4219 133.056 21.5114C133.056 21.6373 133.091 21.735 133.163 21.8068C133.235 21.8786 133.333 21.9139 133.46 21.9139C133.549 21.9139 133.814 21.8915 134.254 21.8468C134.693 21.8021 135.371 21.7797 136.287 21.7797H137.229V23.9266H135.345C133.801 23.9266 132.652 23.5511 131.899 22.799C131.146 22.0469 130.768 20.9028 130.768 19.3633V12.014H128.133V9.96828H128.131Z" className=" block fill-textMain dark:fill-textMainDark"></path><path d="M136.695 9.96777H139.165L143.176 21.6792C143.231 21.8228 143.316 22.0123 143.591 22.0123C143.866 22.0123 143.951 21.8228 144.005 21.6792L148.016 9.96777H150.32V10.5045L145.302 25.5633C144.871 26.8522 144.266 27.7514 143.486 28.2611C142.705 28.7707 141.798 29.0261 140.289 29.0261H137.705V26.8793H139.671C140.299 26.8793 140.81 26.9016 141.205 26.9463C141.599 26.9911 141.851 27.0134 141.959 27.0134C142.264 27.0134 142.47 26.8793 142.579 26.6109L143.333 24.5711C143.423 24.3569 143.431 24.1956 143.36 24.0874C143.324 24.0156 143.28 23.9708 143.226 23.9532C143.172 23.9355 143.091 23.9261 142.984 23.9261H141.342L136.697 9.96777H136.695Z" className=" block fill-textMain dark:fill-textMainDark"></path><path d="M53.5331 21.0098C52.8957 22.128 52.0706 22.9648 51.0566 23.5192C50.0427 24.0736 48.952 24.3514 47.7857 24.3514C45.4887 24.3514 43.8727 23.4392 42.9402 21.6136C42.8682 21.4712 42.7784 21.3994 42.671 21.3994C42.5636 21.3994 42.5093 21.4535 42.5093 21.5607V29.0501H40.0859V9.99051H42.5093V12.3799C42.5093 12.487 42.5636 12.5411 42.671 12.5411C42.7784 12.5411 42.8682 12.4693 42.9402 12.3269C43.8727 10.5013 45.4887 9.58915 47.7857 9.58915C48.952 9.58915 50.0427 9.86693 51.0566 10.4213C52.0706 10.9757 52.8957 11.8125 53.5331 12.9307C54.1705 14.0489 54.4893 15.3966 54.4893 16.9703C54.4893 18.5439 54.1705 19.8916 53.5331 21.0098ZM50.7332 13.1179C49.8444 12.1963 48.6734 11.7349 47.2203 11.7349C45.7672 11.7349 44.5951 12.1963 43.7074 13.1179C42.8186 14.0395 42.4928 15.3236 42.4928 16.9703C42.4928 18.6169 42.8186 19.9011 43.7074 20.8227C44.5963 21.7443 45.7672 22.2057 47.2203 22.2057C48.6734 22.2057 49.8455 21.7455 50.7332 20.8227C51.622 19.9011 52.0659 18.6169 52.0659 16.9703C52.0659 15.3236 51.622 14.0407 50.7332 13.1179Z" className=" block fill-textMain dark:fill-textMainDark"></path></svg>
            </div>
          </div>
          </div>
          {/* Main Content */}
          <div className="grow">
          <div>
            <div className='rounded-md mx-sm mb-sm grow'>
              <div className="relative flex items-center">
                <div className="w-full outline-none focus:outline-none focus:ring-borderMain font-sans flex items-center dark:bg-offsetDark dark:text-textMainDark dark:placeholder-textOffDark dark:border-borderMainDark dark:focus:ring-borderMainDark selection:bg-superDuper selection:text-textMain duration-200 transition-all bg-background border text-textMain border-borderMain focus:ring-1 placeholder-textOff rounded-t-md rounded-b-md text-base p-md pb-xl max-h-[200px]">
                  <textarea style={{height:"50px"}} placeholder="Ask anything..." className=" overflow-auto max-h-[50vh] outline-none w-full flex items-center font-sans duration-200 transition-all caret-superDuper resize-none selection:bg-superDuper selection:text-textMain dark:bg-offsetDark dark:text-textMainDark dark:placeholder-textOffDark bg-background text-textMain placeholder-textOff h-[50px]" autoComplete="off" value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleSearch}>
                  </textarea>
                </div>
                <div className="absolute m-[1px] bottom-0 flex justify-between px-[6px] bg-background focus:bg-background dark:bg-offsetDark dark:focus:bg-offsetDark rounded-b-md " style={{width: "calc(100% - 2px)"}}>
                  <div className="absolute flex items-center gap-sm bg-background dark:bg-offsetDark rounded-full right-sm bottom-0 pb-xs mb-xs">
                    <button type="button" className="bg-offsetPlus dark:bg-offsetPlusDark text-textMain dark:text-textMainDark  md:hover:text-textOff md:dark:hover:text-textOffDark font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-in-out font-sans  select-none items-center relative group  justify-center text-center items-center rounded-full cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex text-sm aspect-square h-8">
                      <div className="flex items-center leading-none justify-center gap-xs">
                        <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-right" className="svg-inline--fa fa-arrow-right fa-fw fa-1x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M440.6 273.4c4.7-4.5 7.4-10.8 7.4-17.4s-2.7-12.8-7.4-17.4l-176-168c-9.6-9.2-24.8-8.8-33.9 .8s-8.8 24.8 .8 33.9L364.1 232 24 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l340.1 0L231.4 406.6c-9.6 9.2-9.9 24.3-.8 33.9s24.3 9.9 33.9 .8l176-168z"></path>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
                {/* Query Display */}
            {/* {!isLoading&& (
              <div className="mb-4">
                <p className="text-lg text-gray-800">
                  <span className="text-gray-500 underline">{query}</span>
                </p>
              </div>
            )} */}

            {/* Search Input */}
            {/* <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                  placeholder="Focus"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <button
                    type="submit"
                    className="p-1 rounded-full bg-teal-500 text-white"
                    disabled={isLoading}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </form> */}
          </div>
          {/* Answer Section */}
          {/* {isLoading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
            </div>
          )} */}

          {isSearched && !isLoading && (
            <div>
              <div className="flex items-start mb-4">
                <Sparkles className="h-5 w-5 mr-2 mt-1 text-gray-700" />
                <span className="text-lg font-medium">Answer</span>
              </div>

              <div className="text-gray-800 space-y-4">
                <p>
                  24kGoldn's song "Mood", featuring Iann Dior, has been a significant success since its release on July 24, 2020. Here are the key highlights regarding its streams and recent news:
                </p>

                <ul className="list-disc pl-6 space-y-4">
                  <li>
                    <span className="font-medium">Streaming Success:</span> "Mood" has achieved over 250 million audio streams worldwide and garnered more than 30 million combined video views as of early 2025. It has also been a dominant force on streaming platforms, with nearly <span className="font-medium">6 million daily streams</span> on Spotify alone <sup>1</sup> <sup>2</sup>.
                  </li>
                  
                  <li>
                    <span className="font-medium">Chart Performance:</span> The track reached the <span className="font-medium">No. 1 position</span> on the UK singles chart and the Billboard Hot 100, where it remained for eight non-consecutive weeks. It also topped charts in several other countries, including Australia, Ireland, and various European nations <sup>1</sup> <sup>2</sup>.
                  </li>
                  
                  <li>
                    <span className="font-medium">Cultural Impact:</span> The song gained immense popularity through platforms like TikTok, where it was featured in over two million videos shortly after its release. This viral moment contributed significantly to its commercial success <sup>2</sup>.
                  </li>
                  
                  <li>
                    <span className="font-medium">Remix and Collaborations:</span> A remix featuring November 6, 2020, adding to the song's appeal and further boosting its reach <sup>2</sup>.
                  </li>
                </ul>

                <p>
                  Overall, "Mood" exemplifies a blend of pop rock and hip-hop influences, characterized by its catchy hook and relatable themes surrounding relationships. Its success reflects the evolving landscape of music consumption in the digital age.
                </p>

                <div className="pt-4">
                  <button className="p-2 hover:bg-gray-100 rounded-md">
                    <Copy size={18} />
                  </button>
                </div>

                {/* Sources */}
                <div className="pt-4 flex flex-wrap gap-2">
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    <span className="mr-1">1</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4M12 16h.01"></path></svg>
                    <span className="ml-1">co</span>
                  </div>
                  
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    <span className="mr-1">2</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M12 8v4M12 16h.01"></path></svg>
                    <span className="ml-1">wikipedia</span>
                  </div>
                  
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    <span className="mr-1">3</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#1DB954"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"></path></svg>
                    <span className="ml-1">spotify</span>
                  </div>
                  
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    <span className="mr-1">4</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#FF0000"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0zm0 22c-5.5 0-10-4.5-10-10S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z"></path><path d="M12.5 7.5c-2.5 0-4 1.5-4 4s1.5 4 4 4 4-1.5 4-4-1.5-4-4-4zm0 6.5c-1.4 0-2.5-1.1-2.5-2.5s1.1-2.5 2.5-2.5 2.5 1.1 2.5 2.5-1.1 2.5-2.5 2.5z" fill="#FF0000"></path></svg>
                    <span className="ml-1">rollingstone</span>
                  </div>
                  
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    <span className="mr-1">5</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#000000"><path d="M17.3 3.3L21.7 12l-4.4 8.7H6.7L2.3 12l4.4-8.7h10.6m-.8-2H6.5L1.3 12l5.2 10.7h10.2L22 12 16.5 1.3z"></path><path d="M13.8 9l-3.6 6.3h-2L11.8 9h2m.7-2h-4.5L5.5 15h4.5L14.5 7z"></path></svg>
                    <span className="ml-1">variety</span>
                  </div>
                  
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    <span className="mr-1">6</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path></svg>
                    <span className="ml-1">youtube</span>
                  </div>
                  
                  <div className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center">
                    <span className="mr-1">7</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#000000"><path d="M16.8 4H7.2C5.4 4 4 5.4 4 7.2v9.6c0 1.8 1.4 3.2 3.2 3.2h9.6c1.8 0 3.2-1.4 3.2-3.2V7.2c0-1.8-1.4-3.2-3.2-3.2zm1.6 12.8c0 .9-.7 1.6-1.6 1.6H7.2c-.9 0-1.6-.7-1.6-1.6V7.2c0-.9.7-1.6 1.6-1.6h9.6c.9 0 1.6.7 1.6 1.6v9.6z"></path><path d="M9.2 8.4H7.6v7.2h1.6V8.4zm4 0h-1.6v7.2h1.6V8.4zm4 0h-1.6v7.2h1.6V8.4z"></path></svg>
                    <span className="ml-1">billboard</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Initial State */}
          {/* {!isSearched && !isLoading && !query && (
            <div className="flex justify-center items-center py-16">
              <p className="text-gray-500">Enter a query to search</p>
            </div>
          )} */}
          </div>
        </div>
        {/* {Answer section} */}
        {!isLoading && (
        <div className="grow px-md" style={{ minHeight: "105px", maxHeight: "410px", overflow: "auto" }}>
          <div></div>
          <div></div>
          <div className="pb-md mb-md border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
            <div className="border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
              <div className="border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                <div className="flex items-center justify-between border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-background dark:bg-backgroundDark">
                  <div className="flex items-center justify-between w-full mb-sm">
                    <div className="cursor-pointer">
                      <div color="super" className="space-x-sm flex items-center ">
                        <h2 className="default font-display text-lg font-medium text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">
                          <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="arrow-up-right-from-square" className="svg-inline--fa fa-arrow-up-right-from-square fa-fw " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path fill="currentColor" d="M304 24c0 13.3 10.7 24 24 24H430.1L207 271c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l223-223V184c0 13.3 10.7 24 24 24s24-10.7 24-24V24c0-13.3-10.7-24-24-24H328c-13.3 0-24 10.7-24 24zM72 32C32.2 32 0 64.2 0 104V440c0 39.8 32.2 72 72 72H408c39.8 0 72-32.2 72-72V312c0-13.3-10.7-24-24-24s-24 10.7-24 24V440c0 13.3-10.7 24-24 24H72c-13.3 0-24-10.7-24-24V104c0-13.3 10.7-24 24-24H200c13.3 0 24-10.7 24-24s-10.7-24-24-24H72z"></path>
                          </svg>
                        </h2>
                        <h2 className="default font-display text-lg font-medium text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">Answer </h2>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative default font-sans text-base text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">
                  <div className="break-words min-w-0 [word-break:break-word]">
                    <div dir="auto">
                      <div className="prose dark:prose-invert inline leading-normal break-words min-w-0 [word-break:break-word]">
                        {/* summary */}
                        {<Summary summary={summ}/>}
                        {<DetailedComponent data = {detailedComp}/>}
                        {/* <span className="">The feud between Drake and Kendrick Lamar has been ongoing since 2013, with roots in Kendrick Lamar's verse on Big Sean's song "Control," where he named Drake among several rappers he aimed to surpass</span>
                          <span className="">
                            <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                              <span>
                                <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">1</div>
                              </span>
                            </span>
                          </span> */}
                        {/* <span className="">
                          <span className="whitespace-nowrap">
                            <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                              <span>
                                <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">3</div>
                              </span>
                            </span>.
                          </span>
                        </span>
                        <span className=""> Initially, the situation seemed like friendly competition, but over time, tensions escalated due to perceived subliminal disses in various songs</span>
                        <span className="">
                          <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                            <span>
                              <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">3</div>
                            </span>
                          </span>
                        </span>
                        <span className="">
                          <span className="whitespace-nowrap">
                            <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                              <span>
                                <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">4</div>
                              </span>
                            </span>.
                          </span>
                        </span>
                        <span className=""></span>
                        <span className="block mt-md"></span>
                          <span className=""><strong>Key Events in the Beef:</strong></span>
                            <ol className="list-outside list-decimal marker:font-mono marker:text-sm pl-11">
                              <li>
                                <span className=""></span>
                                <span className="">
                                    <span className="">
                                      <strong>"Control" (2013):</strong>
                                    </span>
                                    <span className=""> Kendrick Lamar called out Drake and other prominent rappers, stating he wanted to figuratively "murder" them in the rap game</span>
                                    <span className="">
                                      <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                                        <span>
                                          <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">1</div>
                                        </span>
                                      </span>
                                    </span>
                                    <span className="">
                                      <span className="whitespace-nowrap">
                                        <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                                          <span>
                                            <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">3</div>
                                          </span>
                                        </span>.
                                      </span>
                                    </span>
                                  <span className=""></span>
                                </span>
                                <span className=""></span>
                              </li>
                              <li>
                                <span className=""></span>
                                <span className="">
                                  <span className="">
                                    <strong>Escalation in 2024:</strong>
                                  </span>
                                  <span className=""> The feud intensified when Kendrick Lamar rejected the idea of a "Big Three" in hip-hop, which included himself, Drake, and J. Cole</span>
                                  <span className="">
                                    <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                                      <span>
                                        <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">2</div>
                                      </span>
                                    </span>
                                  </span>
                                  <span className="">
                                    <span className="whitespace-nowrap">
                                      <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                                        <span>
                                          <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">3</div>
                                        </span>
                                      </span>.
                                    </span>
                                  </span>
                                  <span className=""> This led to a series of diss tracks from both sides.</span>
                                </span>
                                <span className=""></span>
                              </li>
                              <li>
                                <span className=""></span>
                                <span className="">
                                  <span className="">
                                    <strong>Serious Allegations:</strong>
                                  </span>
                                  <span className=""> The beef reached new heights with serious allegations, including domestic abuse and sexual misconduct, being traded between the two artists</span>
                                  <span className="">
                                    <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                                      <span>
                                        <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">1</div>
                                      </span>
                                    </span>
                                  </span>
                                  <span className="">
                                    <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                                      <span>
                                        <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">2</div>
                                      </span>
                                    </span>
                                  </span>
                                  <span className="">
                                    <span className="whitespace-nowrap">
                                      <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                                        <span>
                                          <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">3</div>
                                        </span>
                                      </span>.
                                    </span>
                                  </span>
                                  <span className=""></span>
                                </span>
                                <span className=""></span>
                              </li>
                              <li>
                                <span className=""></span>
                                <span className="">
                                  <span className="">
                                    <strong>Recent Developments:</strong>
                                  </span>
                                <span className=""> Drake released an album in February 2025, which included indirect references to the feud, while Kendrick Lamar has continued to assert his dominance in hip-hop</span>
                                <span className="">
                                  <span className="whitespace-nowrap">
                                    <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                                      <span>
                                        <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">3</div>
                                      </span>
                                    </span>.
                                  </span>
                                </span>
                                <span className=""></span>
                                </span>
                                <span className=""></span>
                              </li>
                            </ol>
                          <span className="">The feud reflects a broader competition for dominance in the hip-hop world, with both artists vying for recognition as the best rapper of their generation</span>
                          <span className="">
                            <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                              <span>
                                <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">2</div>
                              </span>
                            </span>
                          </span>
                          <span className="">
                            <span className="whitespace-nowrap">
                              <span className="ml-xs hover:opacity-50 transition duration-300 cursor-pointer tabular-nums light text-[11px] font-bold tracking-wide font-mono leading-none uppercase text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">
                                <span>
                                  <div className="inline rounded-full p-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">3</div>
                                </span>
                              </span>.
                            </span>
                          </span>
                          <span className=""></span> */}
                      </div>
                    </div>
                  </div>
                </div>
                {/* {clipboard} */}
                <div className="flex flex-row items-center gap-xs mt-sm -ml-sm">
                  <button type="button" className="md:hover:bg-offsetPlus text-textOff dark:text-textOffDark md:hover:text-textMain dark:md:hover:bg-offsetPlusDark  dark:md:hover:text-textMainDark font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-in-out font-sans  select-none items-center relative group  justify-center text-center items-center rounded cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex text-sm aspect-square h-8">
                    <div className="pointer-events-none absolute z-30  opacity-0 shadow-sm transition-all delay-200 duration-200 group-hover:translate-y-0 group-hover:translate-x-0  group-hover:opacity-100 left-[120%] translate-x-1">
                      <div className="py-xs px-sm rounded flex items-center gap-x-sm border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offsetPlusDark">
                        <div className="default font-sans text-xs font-medium text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">
                          <span className="text-textMainDark">Copy To Clipboard</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center leading-none justify-center gap-xs">
                      <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="clipboard" className="svg-inline--fa fa-clipboard fa-fw fa-1x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path fill="currentColor" d="M280 64h40c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128C0 92.7 28.7 64 64 64h40 9.6C121 27.5 153.3 0 192 0s71 27.5 78.4 64H280zM64 112c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16H320c8.8 0 16-7.2 16-16V128c0-8.8-7.2-16-16-16H304v24c0 13.3-10.7 24-24 24H192 104c-13.3 0-24-10.7-24-24V112H64zm128-8a24 24 0 1 0 0-48 24 24 0 1 0 0 48z">
                        </path>
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
              {/* {Sources with links} */}
              <div className="mt-sm">
                <div className="border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                  <div className="border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                    <div className="flex items-center justify-between border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-background dark:bg-backgroundDark">
                    </div>
                    <div className="flex flex-wrap gap-sm">
                      {<ReferencesList references={refer}/>}
                      {/* <div>
                        <a href="https://www.bbc.com/news/entertainment-arts-68739398" className="block group cursor-pointer" target="_blank" rel="noopener">
                          <div className="rounded-full border py-xs pl-xs pr-sm flex items-center group border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                            <div className="w-[20px] aspect-square rounded-full flex items-center justify-center text-center border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">
                              <div className="light font-sans text-xs font-medium text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">1</div>
                            </div>
                            <div className="pl-xs -mt-one">
                              <div className="flex items-center gap-x-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                                <div className="relative">
                                  <div className="rounded-full overflow-hidden">
                                    <img className="block w-[16px] h-[16px]" src="https://www.google.com/s2/favicons?sz=128&amp;domain=bbc.com" alt="bbc.com favicon" width="16" height="16"/>
                                  </div>
                                </div>
                                <div className=" duration-300 transition-all line-clamp-1 break-all default font-sans text-sm text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">bbc</div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div>
                        <a href="https://www.esquire.com/entertainment/music/a60704570/drake-kendrick-lamar-rap-beef-explained/" className="block group cursor-pointer" target="_blank" rel="noopener">
                          <div className="rounded-full border py-xs pl-xs pr-sm flex items-center group border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                            <div className="w-[20px] aspect-square rounded-full flex items-center justify-center text-center border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">
                              <div className="light font-sans text-xs font-medium text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">2</div>
                              </div>
                            <div className="pl-xs -mt-one">
                              <div className="flex items-center gap-x-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                                <div className="relative">
                                  <div className="rounded-full overflow-hidden">
                                    <img className="block w-[16px] h-[16px]" src="https://www.google.com/s2/favicons?sz=128&amp;domain=esquire.com" alt="esquire.com favicon" width="16" height="16"/>
                                  </div>
                                </div>
                                <div className=" duration-300 transition-all line-clamp-1 break-all default font-sans text-sm text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">esquire</div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div>
                        <a href="https://en.wikipedia.org/wiki/Drake%E2%80%93Kendrick_Lamar_feud" className="block group cursor-pointer" target="_blank" rel="noopener">
                          <div className="rounded-full border py-xs pl-xs pr-sm flex items-center group border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                            <div className="w-[20px] aspect-square rounded-full flex items-center justify-center text-center border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">
                              <div className="light font-sans text-xs font-medium text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">3</div>
                            </div>
                            <div className="pl-xs -mt-one">
                              <div className="flex items-center gap-x-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                                <div className="relative">
                                  <div className="rounded-full overflow-hidden">
                                    <img className="block w-[16px] h-[16px]" src="https://www.google.com/s2/favicons?sz=128&amp;domain=wikipedia.org" alt="wikipedia.org favicon" width="16" height="16"/>
                                  </div>
                                </div>
                                <div className=" duration-300 transition-all line-clamp-1 break-all default font-sans text-sm text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">wikipedia</div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div>
                        <a href="https://www.billboard.com/lists/drake-kendrick-lamar-beef-timeline/" className="block group cursor-pointer" target="_blank" rel="noopener">
                          <div className="rounded-full border py-xs pl-xs pr-sm flex items-center group border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                            <div className="w-[20px] aspect-square rounded-full flex items-center justify-center text-center border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">
                              <div className="light font-sans text-xs font-medium text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">4</div>
                            </div>
                            <div className="pl-xs -mt-one">
                              <div className="flex items-center gap-x-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                                <div className="relative">
                                  <div className="rounded-full overflow-hidden">
                                    <img className="block w-[16px] h-[16px]" src="https://www.google.com/s2/favicons?sz=128&amp;domain=billboard.com" alt="billboard.com favicon" width="16" height="16"/>
                                  </div>
                                </div>
                                <div className=" duration-300 transition-all line-clamp-1 break-all default font-sans text-sm text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">billboard</div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div>
                        <a href="https://www.gq.com/story/the-kendrick-lamar-drake-beef-explained" className="block group cursor-pointer" target="_blank" rel="noopener">
                          <div className="rounded-full border py-xs pl-xs pr-sm flex items-center group border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                            <div className="w-[20px] aspect-square rounded-full flex items-center justify-center text-center border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">
                              <div className="light font-sans text-xs font-medium text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">5</div>
                            </div>
                            <div className="pl-xs -mt-one">
                              <div className="flex items-center gap-x-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                                <div className="relative">
                                  <div className="rounded-full overflow-hidden">
                                    <img className="block w-[16px] h-[16px]" src="https://www.google.com/s2/favicons?sz=128&amp;domain=gq.com" alt="gq.com favicon" width="16" height="16"/>
                                  </div>
                                </div>
                                <div className=" duration-300 transition-all line-clamp-1 break-all default font-sans text-sm text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">gq</div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div>
                        <a href="https://www.bbc.com/news/articles/cy8xmkmg207o" className="block group cursor-pointer" target="_blank" rel="noopener">
                          <div className="rounded-full border py-xs pl-xs pr-sm flex items-center group border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                            <div className="w-[20px] aspect-square rounded-full flex items-center justify-center text-center border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">
                              <div className="light font-sans text-xs font-medium text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">6</div>
                            </div>
                            <div className="pl-xs -mt-one">
                              <div className="flex items-center gap-x-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                                <div className="relative">
                                  <div className="rounded-full overflow-hidden">
                                    <img className="block w-[16px] h-[16px]" src="https://www.google.com/s2/favicons?sz=128&amp;domain=bbc.com" alt="bbc.com favicon" width="16" height="16"/>
                                  </div>
                                </div>
                                <div className=" duration-300 transition-all line-clamp-1 break-all default font-sans text-sm text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">bbc</div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div>
                        <a href="https://www.reddit.com/r/OutOfTheLoop/comments/1ilyfgn/whats_up_with_the_drake_and_kendrick_lamar_beef/" className="block group cursor-pointer" target="_blank" rel="noopener">
                          <div className="rounded-full border py-xs pl-xs pr-sm flex items-center group border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                            <div className="w-[20px] aspect-square rounded-full flex items-center justify-center text-center border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">
                              <div className="light font-sans text-xs font-medium text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">7</div>
                            </div>
                            <div className="pl-xs -mt-one">
                              <div className="flex items-center gap-x-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                                <div className="relative">
                                  <div className="rounded-full overflow-hidden">
                                    <img className="block w-[16px] h-[16px]" src="https://www.google.com/s2/favicons?sz=128&amp;domain=reddit.com" alt="reddit.com favicon" width="16" height="16"/>
                                  </div>
                                </div>
                                <div className=" duration-300 transition-all line-clamp-1 break-all default font-sans text-sm text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">reddit</div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div>
                      <div>
                        <a href="https://www.usatoday.com/story/entertainment/music/2025/02/10/super-bowl-kendrick-lamar-drake-beef-explained/78381830007/" className="block group cursor-pointer" target="_blank" rel="noopener">
                          <div className="rounded-full border py-xs pl-xs pr-sm flex items-center group border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                            <div className="w-[20px] aspect-square rounded-full flex items-center justify-center text-center border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-offset dark:bg-offsetDark">
                              <div className="light font-sans text-xs font-medium text-textOff dark:text-textOffDark selection:bg-superDuper selection:text-textMain">8</div>
                            </div>
                            <div className="pl-xs -mt-one">
                              <div className="flex items-center gap-x-xs border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                                <div className="relative">
                                  <div className="rounded-full overflow-hidden">
                                    <img className="block w-[16px] h-[16px]" src="https://www.google.com/s2/favicons?sz=128&amp;domain=usatoday.com" alt="usatoday.com favicon" width="16" height="16"/>
                                  </div>
                                </div>
                                <div className=" duration-300 transition-all line-clamp-1 break-all default font-sans text-sm text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">usatoday</div>
                              </div>
                            </div>
                          </div>
                        </a>
                      </div> */}
                    </div>
                  </div>
                </div>
              </div>
              {/* {Realted queries} */}
              <div className="">
                <div className="mt-lg border-t pt-lg animate-in fade-in ease-out duration-1000 border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                  <div className="border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                    <div className="flex items-center justify-between border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-background dark:bg-backgroundDark">
                      <div className="flex items-center justify-between w-full mb-sm">
                        <div className="">
                          <div color="super" className="space-x-sm flex items-center ">
                            <h2 className="default font-display text-lg font-medium text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">
                              <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="layer-plus" className="svg-inline--fa fa-layer-plus fa-fw " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                                <path fill="currentColor" d="M464 4c-11 0-20 9-20 20V60H408c-11 0-20 9-20 20s9 20 20 20h36v36c0 11 9 20 20 20s20-9 20-20V100h36c11 0 20-9 20-20s-9-20-20-20H484V24c0-11-9-20-20-20zM288 128c-8.5 0-17 1.7-24.8 5.1L53.9 222.8C40.6 228.5 32 241.5 32 256s8.6 27.5 21.9 33.2l209.3 89.7c7.8 3.4 16.3 5.1 24.8 5.1s17-1.7 24.8-5.1l209.3-89.7c13.3-5.7 21.9-18.8 21.9-33.2s-8.6-27.5-21.9-33.2L312.8 133.1c-7.8-3.4-16.3-5.1-24.8-5.1zm-5.9 49.2c1.9-.8 3.9-1.2 5.9-1.2s4 .4 5.9 1.2L477.7 256 293.9 334.8c-1.9 .8-3.9 1.2-5.9 1.2s-4-.4-5.9-1.2L98.3 256l183.8-78.8zM85.1 337.4L53.9 350.8C40.6 356.5 32 369.5 32 384s8.6 27.5 21.9 33.2l209.3 89.7c7.8 3.4 16.3 5.1 24.8 5.1s17-1.7 24.8-5.1l209.3-89.7c13.3-5.7 21.9-18.8 21.9-33.2s-8.6-27.5-21.9-33.2l-31.2-13.4L430 363.5 477.7 384 293.9 462.8c-1.9 .8-3.9 1.2-5.9 1.2s-4-.4-5.9-1.2L98.3 384 146 363.5 85.1 337.4z"></path>
                              </svg>
                            </h2>
                            <h2 className="default font-display text-lg font-medium text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">Related</h2>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="divide-y border-borderMain/60 dark:border-borderMainDark/80 divide-borderMain/60 dark:divide-borderMainDark/80 ring-borderMain dark:ring-borderMainDark bg-transparent">
                      {/* <div className="py-sm cursor-pointer group flex items-center justify-between">
                        <div className="md:group-hover:text-super md:dark:group-hover:text-superDark  transition-all duration-300 default font-sans text-base font-medium text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">What was the initial reason for the beef between Drake and Kendrick Lamar</div>
                        <div className="flex-none transition-all duration-300 ml-sm super font-sans text-base text-super dark:text-superDark selection:bg-superDuper selection:text-textMain">
                          <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="plus" className="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24V232H40c-13.3 0-24 10.7-24 24s10.7 24 24 24H200V440c0 13.3 10.7 24 24 24s24-10.7 24-24V280H408c13.3 0 24-10.7 24-24s-10.7-24-24-24H248V72z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="py-sm cursor-pointer group flex items-center justify-between">
                        <div className="md:group-hover:text-super md:dark:group-hover:text-superDark  transition-all duration-300 default font-sans text-base font-medium text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">How did J. Cole get involved in the feud between Drake and Kendrick Lamar</div>
                        <div className="flex-none transition-all duration-300 ml-sm super font-sans text-base text-super dark:text-superDark selection:bg-superDuper selection:text-textMain">
                          <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="plus" className="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24V232H40c-13.3 0-24 10.7-24 24s10.7 24 24 24H200V440c0 13.3 10.7 24 24 24s24-10.7 24-24V280H408c13.3 0 24-10.7 24-24s-10.7-24-24-24H248V72z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="py-sm cursor-pointer group flex items-center justify-between">
                        <div className="md:group-hover:text-super md:dark:group-hover:text-superDark  transition-all duration-300 default font-sans text-base font-medium text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">What are the most shocking allegations made by Drake and Kendrick Lamar in their diss tracks</div>
                        <div className="flex-none transition-all duration-300 ml-sm super font-sans text-base text-super dark:text-superDark selection:bg-superDuper selection:text-textMain">
                          <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="plus" className="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24V232H40c-13.3 0-24 10.7-24 24s10.7 24 24 24H200V440c0 13.3 10.7 24 24 24s24-10.7 24-24V280H408c13.3 0 24-10.7 24-24s-10.7-24-24-24H248V72z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="py-sm cursor-pointer group flex items-center justify-between">
                        <div className="md:group-hover:text-super md:dark:group-hover:text-superDark  transition-all duration-300 default font-sans text-base font-medium text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">How did the public react to the beef between Drake and Kendrick Lamar</div>
                        <div className="flex-none transition-all duration-300 ml-sm super font-sans text-base text-super dark:text-superDark selection:bg-superDuper selection:text-textMain">
                          <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="plus" className="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24V232H40c-13.3 0-24 10.7-24 24s10.7 24 24 24H200V440c0 13.3 10.7 24 24 24s24-10.7 24-24V280H408c13.3 0 24-10.7 24-24s-10.7-24-24-24H248V72z"></path>
                          </svg>
                        </div>
                      </div>
                      <div className="py-sm cursor-pointer group flex items-center justify-between">
                        <div className="md:group-hover:text-super md:dark:group-hover:text-superDark  transition-all duration-300 default font-sans text-base font-medium text-textMain dark:text-textMainDark selection:bg-superDuper selection:text-textMain">What role did family play in escalating the feud between Drake and Kendrick Lamar</div>
                        <div className="flex-none transition-all duration-300 ml-sm super font-sans text-base text-super dark:text-superDark selection:bg-superDuper selection:text-textMain">
                          <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="plus" className="svg-inline--fa fa-plus " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24V232H40c-13.3 0-24 10.7-24 24s10.7 24 24 24H200V440c0 13.3 10.7 24 24 24s24-10.7 24-24V280H408c13.3 0 24-10.7 24-24s-10.7-24-24-24H248V72z"></path>
                          </svg>
                        </div>
                      </div> */}
                      {<RelatedQueries queries={relatedQueries}/>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* {Ask a follow up} */}
          <div className="width-[100%] flex justify-center mb-[10px]">
            <button type="button" className="bg-offsetPlus dark:bg-offsetPlusDark text-textMain dark:text-textMainDark  md:hover:text-textOff md:dark:hover:text-textOffDark font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-in-out font-sans  select-none items-center relative group  justify-center text-center items-center rounded cursor-point active:scale-95 origin-center whitespace-nowrap inline-flex text-base px-md font-medium h-10">
              <div className="flex items-center leading-none justify-center gap-xs">
                <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="plus" className="svg-inline--fa fa-plus fa-fw fa-1x " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                  <path fill="currentColor" d="M248 72c0-13.3-10.7-24-24-24s-24 10.7-24 24V232H40c-13.3 0-24 10.7-24 24s10.7 24 24 24H200V440c0 13.3 10.7 24 24 24s24-10.7 24-24V280H408c13.3 0 24-10.7 24-24s-10.7-24-24-24H248V72z"></path>
                </svg>
                <div className="text-align-center relative">Ask a follow up</div>
              </div>
            </button>
          </div>
        </div>)}
      </div>
    </div>
  );
}
export default App;

