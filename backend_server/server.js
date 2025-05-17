var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// const express = require('express');
import express from 'express';
// const bodyParser = require('body-parser');
import bodyParser from "body-parser";
import { searchAgent } from "../spo_chrome_ext/src/search/index";
export { searchQuery } from "../spo_chrome_ext/src/content/content";
// export type searchQuery = {
//   metadata:Document["metadata"],
//   question:string
//   type:string
// }
// import {cleanHTML} from "./lib/htmlformat.js";
// import { extractlinks } from './lib/extractLinks.js';
const app = express();
const PORT = 3000;
import cors from "cors";
app.use(cors({
    origin: '*'
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
// Middleware to parse JSON bodies
app.use(bodyParser.json());
let capturedPages = [];
// Handle GET requests for testing
app.get('/data', (req, res) => {
    res.send("Server is working! Use POST to send data.");
});
// Endpoint to handle POST requests from the extension
app.post('/data', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.body.links)
    console.log(req.body);
    const { type } = req.body;
    if (type === "search") {
        const resp = yield searchAgent(req.body); // Wait for the function to complete
        console.log(resp);
        return res.json({ success: true, data: resp });
    }
    else {
        capturedPages.push(req.body);
    }
}));
app.get('', (req, res) => {
    console.log("aa gya bc dekhne");
    console.log(req);
    if (capturedPages.length === 0) {
        return res.json({ message: "No captured pages yet", links: [] });
    }
    console.log(capturedPages.length);
    const lastCapturedPage = capturedPages[capturedPages.length - 1];
    // console.log(lastCapturedPage)
    if (!lastCapturedPage || lastCapturedPage.links == 0) {
        return res.status(500).json({ error: "Links data is missing" });
    }
    // const { metadata, html } = lastCapturedPage;
    res.json(lastCapturedPage);
});
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
