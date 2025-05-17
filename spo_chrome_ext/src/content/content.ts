// import {searchAgent} from "../search/index.ts"
import { executeTransformers } from "../transformers/index.ts";
import { Document } from "../utils.ts";
import { parseLLMResponse } from "../utils/answerparser.ts";
import {convertReferences} from "../utils/favicons.ts"
import {WithReference} from "../utils/answerparser.ts"
// import { parsedetailed } from "../utils/parseDetialed.ts";
// import {SearchResult} from "../search/index.ts"
export type searchQuery = {
  metadata:Document["metadata"],
  "question":string,
  "type":string
}
console.log("console script loaded");
// Listen for messages from the React popup
// chrome.runtime.onMessage.addListener(async(message, sender, sendResponse) => {
//     const documentObj: Document = {
//       metadata: { url: window.location.href },
//       rawHtml: document.documentElement.outerHTML, // Capture raw HTML
//     };
//     console.log("before transformer",documentObj)

//     // const transformedData = await executeTransformers(documentObj);
//     // console.log("after transformer",transformedData)
//     // Execute transformations
//     executeTransformers(documentObj)
//       .then((transformedDocument) => {
//         console.log("Transformed Document:", transformedDocument);
//         // for every unique url we have to index the data if a new url comes then we have to exract the 
//         // new web page 

//         // on search action we are making the json data to send to the model
//         const {metadata} = transformedDocument
//         if(message.action=="search"){
//           const search_query:searchQuery = {metadata,"question":message.question,"type":"search"}
//           // function which take:
//           // 1 search_query 
//           // output will give the ai response of the  query 
//           // searchAgent(search_query)
          
//             return fetch("http://localhost:3000/data", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(search_query), // Send transformed data
//             })
//             .then(response => response.json())
//             .then(data => {
//               console.log("Server Response :", data.success);
//               console.log("Server Response :", data.result);
//               sendResponse({ result: data.result });
//               console.log("send to frontend") // Send the server response back to popup or background
//             })
//             .catch(error => {
//               console.error("Error:", error);
//               sendResponse({ error: "Transformation or server request failed" });
//             });
//         }
//         else{          
//           sendResponse({ document: transformedDocument });
//           return fetch("http://localhost:3000/data", {
//               method: "POST",
//               headers: { "Content-Type": "application/json" },
//               body: JSON.stringify(transformedDocument), // Send transformed data
//             })
//              .then(response => response.json())
//              .then(data => {
//                console.log("Server Response:", data);
//                sendResponse({ document: data }); // Send the server response back to popup or background
//              })
//              .catch(error => {
//                console.error("Error:", error);
//                sendResponse({ error: "Transformation or server request failed" });
//              });
//         }
//       })
//   return true;
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const documentObj = {
    metadata: { url: window.location.href },
    rawHtml: document.documentElement.outerHTML, // Capture raw HTML
  };

  console.log("Before transformer:", documentObj);

  executeTransformers(documentObj)
    .then(async (transformedDocument) => {
      console.log("Transformed Document:", transformedDocument);

      const { metadata } = transformedDocument;

      try {
        if (message.action === "search") {
          const search_query = { metadata, question: message.question, type: "search" };

          const response = await fetch("http://localhost:3000/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(search_query),
          });

          const data = await response.json();
          console.log("Server Response:", data.success);
          // console.log("server data",typeof(data.result))

          const hatt = parseLLMResponse(data.result);
          console.log("hatt after parsing",hatt)
          const {Summary,Detailed,References,Related_Queries} = hatt
          console.log(References)
          const new_refernces = convertReferences(References)
          console.log("new Refernces section",new_refernces)
          console.log("New Detailed Section",Detailed)
          // const new_detailed = parsedetailed(Detailed.content)
          // console.log("new Detailed section",new_detailed)
          const with_refer :WithReference= {Summary,Detailed,Related_Queries,References: new_refernces}
          // console.log(hatt)

          sendResponse(with_refer);
        } else {
          sendResponse({ document: transformedDocument });

          // Send transformed data to server, but without waiting for a response
          fetch("http://localhost:3000/data", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transformedDocument),
          }).catch((error) => console.error("Error sending transformed data:", error));
        }
      } catch (error) {
        console.error("Error:", error);
        sendResponse({ error: "Transformation or server request failed" });
      }
    })
    .catch((error) => {
      console.error("Error executing transformers:", error);
      sendResponse({ error: "Transformation failed" });
    });

  return true; // ✅ Keeps the message channel open for async sendResponse
});
