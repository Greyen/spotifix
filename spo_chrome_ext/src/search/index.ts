import { ChatOpenAI } from '@langchain/openai';
import { OpenAI } from "openai";
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { Embeddings } from '@langchain/core/embeddings';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  PromptTemplate,
} from '@langchain/core/prompts';
import {
  RunnableLambda,
  RunnableMap,
  RunnableSequence,
} from '@langchain/core/runnables';
import { BaseMessage } from '@langchain/core/messages';
import {searchQuery} from "../content/content.ts"
import {webQueryPrompt} from "../prompts/websearch.ts"
import LineListOutputParser from "../outputparsers/listLineOutputParser.ts"
import LineOutputParser from "../outputparsers/lineOutputParser.ts"
import dotenv from 'dotenv';
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
import {webSearchResponsePrompt} from "../prompts/websearch.ts"

// Initialize OpenAI Embeddings
const SEARXNG_URL = "http://localhost:8081";

// dotenv.config();
dotenv.config();

interface searxngResult {
    results: any[];
    suggestions: string[];
}

// pascal case for types
export type SearchResult={
    result:string | null
}

function final_runnable(llm:BaseChatModel):RunnableSequence{
    
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
    return RunnableSequence.from([fullPrompt,llm,new StringOutputParser()
]);



}

// function processDocs(docs: search_Document[]) {
//     return docs
//       .map(
//         (_, index) =>
//           `${index + 1}. ${docs[index].metadata.title} ${docs[index].pageContent} ${docs[index].metadata.url}`,
//       )
//       .join('\n');
//   }
  function processDocs(docs: search_Document[]): Record<string, { content: string; URL: string }> {
    return docs.reduce((acc, doc, index) => {
      acc[(index + 1).toString()] = {
        content: doc.pageContent,
        URL: doc.metadata.url
      };
      return acc;
    }, {} as Record<string, { content: string; URL: string }>);
  }
  

async function rerankDocs(
    query: string,
    docs: search_Document[],
    fileIds: string[],
    embeddings: Embeddings,
    optimizationMode: 'speed' | 'balanced' | 'quality',
  ):Promise<search_Document[]> 
  {
      
    const filesData = fileIds
    .map((file) => {
      const filePath = path.join(process.cwd(), 'uploads', file);

      const contentPath = filePath + '-extracted.json';
      const embeddingsPath = filePath + '-embeddings.json';

      const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
      const embeddings = JSON.parse(fs.readFileSync(embeddingsPath, 'utf8'));

      const fileSimilaritySearchObject = content.contents.map(
        (c: string, i:any) => {
          return {
            fileName: content.title,
            content: c,
            embeddings: embeddings.embeddings[i],
          };
        },
      );

      return fileSimilaritySearchObject;
    })
    .flat();

      const docsWithContent = docs.filter(
        (doc) => doc.pageContent && doc.pageContent.length > 0,
      );
      const [docEmbeddings, queryEmbedding] = await Promise.all([
        embeddings.embedDocuments(
          docsWithContent.map((doc) => doc.pageContent),
        ),
        embeddings.embedQuery(query),
      ]);

      docsWithContent.push(
        ...filesData.map((fileData) => {
          return new search_Document({
            pageContent: fileData.content,
            metadata: {
              title: fileData.fileName,
              url: `File`,
            },
          });
        }),
      );

      docEmbeddings.push(...filesData.map((fileData) => fileData.embeddings));

      const similarity = docEmbeddings.map((docEmbedding, i) => {
        const sim = computeSimilarity(queryEmbedding, docEmbedding,'cosine');

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
  }
export async function searchAgent(input:searchQuery):Promise<SearchResult>{
        const llm: BaseChatModel = new ChatOpenAI({
            modelName: "gpt-4o",
            apiKey:process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY, // Replace with your API key
          });
        const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
            { role: "system", content:webQueryPrompt },
            { role: "user", content:JSON.stringify(input)},
        ],
        })

        const question  = response.choices[0].message.content ?? ""
        console.log(question)
        // const params = {'q':question,'format':'json'}
        const params =  {
            q :question,
            format: "json",
          };
        const url = `${SEARXNG_URL}/search?${new URLSearchParams(params).toString()}`;
        try {
            const response = await axios.get(url);
            const sear_Result: searxngResult = {
                results: response.data.results || [], 
                suggestions: response.data.suggestions || []
            };

            const documents = sear_Result.results.map(
                (result) =>
                  new search_Document({
                    pageContent:
                      result.content  /* Todo: Implement transcript grabbing using Youtubei (source: https://www.npmjs.com/package/youtubei) */,
                    metadata: {
                      title: result.title,
                      url: result.url,
                      ...(result.img_src && { img_src: result.img_src }),
                    },
                  }),
              );

              const embeddings = new OpenAIEmbeddings()
              const sortedDocs = await rerankDocs(question,documents ?? [],[],embeddings,
                'balanced')
              const final_context = processDocs(sortedDocs)
              const final_resp = await final_runnable(llm).invoke({"context":final_context,
                "query":question})
              return {result:final_resp}
        } catch (error) {
            console.error("❌ Error fetching search results:", error);
            return {result:"An occured due to your summary retrivak chain"       
            }
        }
}


