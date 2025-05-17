var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ChatOpenAI } from '@langchain/openai';
import { OpenAI } from "openai";
import { ChatPromptTemplate, } from '@langchain/core/prompts';
import { RunnableSequence, } from '@langchain/core/runnables';
import { webQueryPrompt } from "../prompts/websearch.ts";
import axios from "axios";
import path from 'path';
import fs from 'fs';
import "url-polyfill";
// import { URLSearchParams } from "url";
import { Document as search_Document } from '@langchain/core/documents';
import { OpenAIEmbeddings } from "@langchain/openai";
import computeSimilarity from '../utils/computeSimilarity.ts';
import { SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { webSearchResponsePrompt } from "../prompts/websearch.ts";
// Initialize OpenAI Embeddings
const SEARXNG_URL = "http://localhost:8081";
// dotenv.config();
function final_runnable(llm) {
    // Define the system template
    const systemTemplate = SystemMessagePromptTemplate.fromTemplate(webSearchResponsePrompt);
    // Create the user message template with query
    const userTemplate = HumanMessagePromptTemplate.fromTemplate("{query}");
    // Combine both templates into a full prompt
    const fullPrompt = ChatPromptTemplate.fromMessages([
        systemTemplate,
        userTemplate
    ]);
    // Create the chain
    return RunnableSequence.from([fullPrompt, llm, new StringOutputParser()
    ]);
}
function processDocs(docs) {
    return docs
        .map((_, index) => `${index + 1}. ${docs[index].metadata.title} ${docs[index].pageContent} ${docs[index].metadata.url}`)
        .join('\n');
}
function rerankDocs(query, docs, fileIds, embeddings, optimizationMode) {
    return __awaiter(this, void 0, void 0, function* () {
        const filesData = fileIds
            .map((file) => {
            const filePath = path.join(process.cwd(), 'uploads', file);
            const contentPath = filePath + '-extracted.json';
            const embeddingsPath = filePath + '-embeddings.json';
            const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
            const embeddings = JSON.parse(fs.readFileSync(embeddingsPath, 'utf8'));
            const fileSimilaritySearchObject = content.contents.map((c, i) => {
                return {
                    fileName: content.title,
                    content: c,
                    embeddings: embeddings.embeddings[i],
                };
            });
            return fileSimilaritySearchObject;
        })
            .flat();
        const docsWithContent = docs.filter((doc) => doc.pageContent && doc.pageContent.length > 0);
        const [docEmbeddings, queryEmbedding] = yield Promise.all([
            embeddings.embedDocuments(docsWithContent.map((doc) => doc.pageContent)),
            embeddings.embedQuery(query),
        ]);
        docsWithContent.push(...filesData.map((fileData) => {
            return new search_Document({
                pageContent: fileData.content,
                metadata: {
                    title: fileData.fileName,
                    url: `File`,
                },
            });
        }));
        docEmbeddings.push(...filesData.map((fileData) => fileData.embeddings));
        const similarity = docEmbeddings.map((docEmbedding, i) => {
            const sim = computeSimilarity(queryEmbedding, docEmbedding, 'cosine');
            return {
                index: i,
                similarity: sim,
            };
        });
        const sortedDocs = similarity
            .filter((sim) => sim.similarity > 0.3)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 15)
            .map((sim) => docsWithContent[sim.index]);
        return sortedDocs;
    });
}
export function searchAgent(input) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const llm = new ChatOpenAI({
            modelName: "gpt-4o",
            apiKey: OPENAI_API_KEY,
        });
        const openai = new OpenAI({
            apiKey: OPENAI_API_KEY, // Replace with your API key
        });
        const response = yield openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: webQueryPrompt },
                { role: "user", content: JSON.stringify(input) },
            ],
        });
        const question = (_a = response.choices[0].message.content) !== null && _a !== void 0 ? _a : "";
        // const params = {'q':question,'format':'json'}
        const params = {
            q: question,
            format: "json",
        };
        const url = `${SEARXNG_URL}/search?${new URLSearchParams(params).toString()}`;
        try {
            const response = yield axios.get(url);
            const sear_Result = {
                results: response.data.results || [],
                suggestions: response.data.suggestions || []
            };
            const documents = sear_Result.results.map((result) => new search_Document({
                pageContent: result.content /* Todo: Implement transcript grabbing using Youtubei (source: https://www.npmjs.com/package/youtubei) */,
                metadata: Object.assign({ title: result.title, url: result.url }, (result.img_src && { img_src: result.img_src })),
            }));
            const embeddings = new OpenAIEmbeddings();
            const sortedDocs = yield rerankDocs(question, documents !== null && documents !== void 0 ? documents : [], [], embeddings, 'balanced');
            const final_context = processDocs(sortedDocs);
            const final_resp = yield final_runnable(llm).invoke({ "context": final_context,
                "query": question });
            return { result: final_resp };
        }
        catch (error) {
            console.error("❌ Error fetching search results:", error);
            return { result: "An occured due to your summary retrivak chain" };
        }
    });
}
