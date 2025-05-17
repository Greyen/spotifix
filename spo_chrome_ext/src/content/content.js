var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// import {searchAgent} from "../search/index.ts"
import { executeTransformers } from "../transformers/index.ts";
console.log("console script loaded");
// Listen for messages from the React popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => __awaiter(void 0, void 0, void 0, function* () {
    const documentObj = {
        metadata: { url: window.location.href },
        rawHtml: document.documentElement.outerHTML, // Capture raw HTML
    };
    console.log("before transformer", documentObj);
    // const transformedData = await executeTransformers(documentObj);
    // console.log("after transformer",transformedData)
    // Execute transformations
    executeTransformers(documentObj)
        .then((transformedDocument) => {
        console.log("Transformed Document:", transformedDocument);
        // for every unique url we have to index the data if a new url comes then we have to exract the 
        // new web page 
        // on search action we are making the json data to send to the model
        const { metadata } = transformedDocument;
        if (message.action == "search") {
            const search_query = { metadata, "question": message.question, type: "search" };
            // function which take:
            // 1 search_query 
            // output will give the ai response of the  query 
            // searchAgent(search_query)
            return fetch("http://localhost:3000/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(search_query), // Send transformed data
            })
                .then(response => response.json())
                .then(data => {
                console.log("Server Response :", data.success);
                sendResponse({ result: data }); // Send the server response back to popup or background
            })
                .catch(error => {
                console.error("Error:", error);
                sendResponse({ error: "Transformation or server request failed" });
            });
        }
        else {
            sendResponse({ document: transformedDocument });
            return fetch("http://localhost:3000/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transformedDocument), // Send transformed data
            })
                .then(response => response.json())
                .then(data => {
                console.log("Server Response:", data);
                sendResponse({ document: data }); // Send the server response back to popup or background
            })
                .catch(error => {
                console.error("Error:", error);
                sendResponse({ error: "Transformation or server request failed" });
            });
        }
    });
    return true;
}));
