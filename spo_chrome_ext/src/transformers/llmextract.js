// import { encoding_for_model } from "@dqbd/tiktoken";
// import { TiktokenModel } from "@dqbd/tiktoken";
// import {
//   Document,
//   ExtractOptions,
//   TokenUsage,
// } from "../../../controllers/v1/types";
// import { Logger } from "winston";
// import { EngineResultsTracker, Meta } from "..";
// import { logger } from "../../../lib/logger";
// import { modelPrices } from "../../../lib/extract/usage/model-prices";
// import { generateObject, generateText, LanguageModel } from 'ai';
// import { jsonSchema } from 'ai';
// import { getModel } from "../../../lib/generic-ai";
// import { z } from "zod";

// // Get max tokens from model prices
const getModelLimits = (model) => {
  const modelConfig = modelPrices[model];
  if (!modelConfig) {
    // Default fallback values
    return {
      maxInputTokens: 8192,
      maxOutputTokens: 4096,
      maxTokens: 12288,
    };
  }
  return {
    maxInputTokens: modelConfig.max_input_tokens || modelConfig.max_tokens,
    maxOutputTokens: modelConfig.max_output_tokens || modelConfig.max_tokens,
    maxTokens: modelConfig.max_tokens,
  };
};

// export class LLMRefusalError extends Error {
//   public refusal: string;
//   public results: EngineResultsTracker | undefined;

//   constructor(refusal: string) {
//     super("LLM refused to extract the website's content");
//     this.refusal = refusal;
//   }
// }

function normalizeSchema(x) {
    if (typeof x !== "object" || x === null) return x;
  
    if (x["$defs"] !== null && typeof x["$defs"] === "object") {
      x["$defs"] = Object.fromEntries(
        Object.entries(x["$defs"]).map(([name, schema]) => [
          name,
          normalizeSchema(schema),
        ])
      );
    }
  
    if (x && x.anyOf) {
      x.anyOf = x.anyOf.map((x) => normalizeSchema(x));
    }
  
    if (x && x.oneOf) {
      x.oneOf = x.oneOf.map((x) => normalizeSchema(x));
    }
  
    if (x && x.allOf) {
      x.allOf = x.allOf.map((x) => normalizeSchema(x));
    }
  
    if (x && x.not) {
      x.not = normalizeSchema(x.not);
    }
  
    if (x && x.type === "object") {
      return {
        ...x,
        properties: Object.fromEntries(
          Object.entries(x.properties).map(([k, v]) => [k, normalizeSchema(v)])
        ),
        required: Object.keys(x.properties),
        additionalProperties: false,
      };
    } else if (x && x.type === "array") {
      return {
        ...x,
        items: normalizeSchema(x.items),
      };
    } else {
      return x;
    }
  }
  



// interface TrimResult {
//   text: string;
//   numTokens: number;
//   warning?: string;
// }

/**
 * @typedef {Object} TrimResult
 * @property {string} text - The trimmed text.
 * @property {number} numTokens - The number of tokens in the text.
 * @property {string} [warning] - Optional warning message.
 */


export function trimToTokenLimit(text, maxTokens, modelId = "gpt-4o", previousWarning) {
    try {
      const encoder = encoding_for_model(modelId);
      try {
        const tokens = encoder.encode(text);
        const numTokens = tokens.length;
        
        if (numTokens <= maxTokens) {
          return { text, numTokens };
        }
  
        const modifier = 3;
        let currentText = text.slice(0, Math.floor(maxTokens * modifier) - 1);
        
        while (true) {
          const currentTokens = encoder.encode(currentText);
          if (currentTokens.length <= maxTokens) {
            const warning = `The extraction content would have used more tokens (${numTokens}) than the maximum we allow (${maxTokens}). -- the input has been automatically trimmed.`;
            return {
              text: currentText,
              numTokens: currentTokens.length,
              warning: previousWarning ? `${warning} ${previousWarning}` : warning
            };
          }
          const overflow = currentTokens.length * modifier - maxTokens - 1;
          currentText = currentText.slice(0, Math.floor(currentText.length - overflow));
        }
      } catch (e) {
        throw e;
      } finally {
        encoder.free();
      }
    } catch (error) {
      const estimatedCharsPerToken = 2.8;
      const safeLength = maxTokens * estimatedCharsPerToken;
      const trimmedText = text.slice(0, Math.floor(safeLength));
      
      const warning = `Failed to derive number of LLM tokens the extraction might use -- the input has been automatically trimmed to the maximum number of tokens (${maxTokens}) we support.`;
      
      return {
        text: trimmedText,
        numTokens: maxTokens,
        warning: previousWarning ? `${warning} ${previousWarning}` : warning
      };
    }
  }
  

// export async function generateCompletions({
//   logger,
//   options,
//   markdown,
//   previousWarning,
//   isExtractEndpoint,
//   model = getModel("gpt-4o-mini"),
// }: {
//   model?: LanguageModel; 
//   logger: Logger;
//   options: ExtractOptions;
//   markdown?: string;
//   previousWarning?: string;
//   isExtractEndpoint?: boolean;
// }): Promise<{
//   extract: any;
//   numTokens: number;
//   warning: string | undefined;
//   totalUsage: TokenUsage;
//   model: string;
// }> {
//   let extract: any;
//   let warning: string | undefined;

//   if (markdown === undefined) {
//     throw new Error("document.markdown is undefined -- this is unexpected");
//   }

//   const { maxInputTokens, maxOutputTokens } = getModelLimits(model.modelId);
//   // Calculate 80% of max input tokens (for content)
//   const maxTokensSafe = Math.floor(maxInputTokens * 0.8);

//   // Use the new trimming function
//   const { text: trimmedMarkdown, numTokens, warning: trimWarning } = trimToTokenLimit(
//     markdown,
//     maxTokensSafe,
//     model.modelId,
//     previousWarning
//   );

//   markdown = trimmedMarkdown;
//   warning = trimWarning;

//   let schema = options.schema;
//   // Normalize the bad json schema users write (mogery)
//   if (schema && !(schema instanceof z.ZodType)) {
//     // let schema = options.schema;
//     if (schema) {
//       schema = removeDefaultProperty(schema);
//     }

//     if (schema && schema.type === "array") {
//       schema = {
//         type: "object",
//         properties: {
//           items: options.schema,
//         },
//         required: ["items"],
//         additionalProperties: false,
//       };
//     } else if (schema && typeof schema === "object" && !schema.type) {
//       schema = {
//         type: "object",
//         properties: Object.fromEntries(
//           Object.entries(schema).map(([key, value]) => {
//             return [key, removeDefaultProperty(value)];
//           }),
//         ),
//         required: Object.keys(schema),
//         additionalProperties: false,
//       };
//     }

//     schema = normalizeSchema(schema);
//   }

//   try {
//     const prompt = options.prompt !== undefined
//       ? `Transform the following content into structured JSON output based on the provided schema and this user request: ${options.prompt}. If schema is provided, strictly follow it.\n\n${markdown}`
//       : `Transform the following content into structured JSON output based on the provided schema if any.\n\n${markdown}`;

//     const repairConfig = {
//       experimental_repairText: async ({ text, error }) => {
//         const { text: fixedText } = await generateText({
//           model: model,
//           prompt: `Fix this JSON that had the following error: ${error}\n\nOriginal text:\n${text}\n\nReturn only the fixed JSON, no explanation.`,
//           system: "You are a JSON repair expert. Your only job is to fix malformed JSON and return valid JSON that matches the original structure and intent as closely as possible. Do not include any explanation or commentary - only return the fixed JSON."
//         });
//         return fixedText;
//       }
//     };


//     const generateObjectConfig = {
//       model: model,
//       prompt: prompt,
//       temperature: options.temperature ?? 0,
//       system: options.systemPrompt,
//       ...(schema && { schema: schema instanceof z.ZodType ? schema : jsonSchema(schema) }),
//       ...(!schema && { output: 'no-schema' as const }),
//       ...repairConfig,
//       ...(!schema && {
//         onError: (error: Error) => {
//           console.error(error);
//         }
//       })
//     } satisfies Parameters<typeof generateObject>[0];

//     const result = await generateObject(generateObjectConfig);
//     extract = result.object;

//     // If the users actually wants the items object, they can specify it as 'required' in the schema
//     // otherwise, we just return the items array
//     if (
//       options.schema &&
//       options.schema.type === "array" &&
//       !schema?.required?.includes("items")
//     ) {
//       extract = extract?.items;
//     }

//     // Since generateObject doesn't provide token usage, we'll estimate it
//     const promptTokens = numTokens;
//     const completionTokens = result?.usage?.completionTokens ?? 0;

//     return {
//       extract,
//       warning,
//       numTokens,
//       totalUsage: {
//         promptTokens,
//         completionTokens,
//         totalTokens: promptTokens + completionTokens,
//       },
//       model: model.modelId,
//     };
//   } catch (error) {
//     if (error.message?.includes('refused')) {
//       throw new LLMRefusalError(error.message);
//     }
//     throw error;
//   }
// }

export async function generateCompletions({
    logger,
    options,
    markdown,
    previousWarning,
    isExtractEndpoint,
    model = getModel("gpt-4o-mini"),
  }) {
    if (markdown === undefined) {
      throw new Error("document.markdown is undefined -- this is unexpected");
    }
  
    const { maxInputTokens, maxOutputTokens } = getModelLimits(model.modelId);
    const maxTokensSafe = Math.floor(maxInputTokens * 0.8);
  
    // Trim input content to stay within token limits
    const { text: trimmedMarkdown, numTokens, warning: trimWarning } = trimToTokenLimit(
      markdown,
      maxTokensSafe,
      model.modelId,
      previousWarning
    );
  
    markdown = trimmedMarkdown;
    let warning = trimWarning;
  
    let schema = options.schema;
  
    // Normalize schema if necessary
    if (schema && typeof schema === "object") {
      schema = removeDefaultProperty(schema);
  
      if (schema.type === "array") {
        schema = {
          type: "object",
          properties: { items: options.schema },
          required: ["items"],
          additionalProperties: false,
        };
      } else if (!schema.type) {
        schema = {
          type: "object",
          properties: Object.fromEntries(
            Object.entries(schema).map(([key, value]) => [key, removeDefaultProperty(value)])
          ),
          required: Object.keys(schema),
          additionalProperties: false,
        };
      }
  
      schema = normalizeSchema(schema);
    }
  
    try {
      const prompt = options.prompt
        ? `Transform the following content into structured JSON output based on the provided schema and this user request: ${options.prompt}. If schema is provided, strictly follow it.\n\n${markdown}`
        : `Transform the following content into structured JSON output based on the provided schema if any.\n\n${markdown}`;
  
      const repairConfig = {
        experimental_repairText: async ({ text, error }) => {
          const { text: fixedText } = await generateText({
            model: model,
            prompt: `Fix this JSON that had the following error: ${error}\n\nOriginal text:\n${text}\n\nReturn only the fixed JSON, no explanation.`,
            system: "You are a JSON repair expert. Your only job is to fix malformed JSON and return valid JSON that matches the original structure and intent as closely as possible. Do not include any explanation or commentary - only return the fixed JSON."
          });
          return fixedText;
        }
      };
  
      const generateObjectConfig = {
        model: model,
        prompt: prompt,
        temperature: options.temperature ?? 0,
        system: options.systemPrompt,
        ...(schema && { schema: jsonSchema(schema) }),
        ...(!schema && { output: "no-schema" }),
        ...repairConfig,
        ...(!schema && {
          onError: (error) => {
            console.error(error);
          }
        })
      };
  
      const result = await generateObject(generateObjectConfig);
      let extract = result.object;
  
      if (options.schema?.type === "array" && !(schema?.required || []).includes("items")) {
        extract = extract?.items;
      }
  
      const promptTokens = numTokens;
      const completionTokens = result?.usage?.completionTokens ?? 0;
  
      return {
        extract,
        warning,
        numTokens,
        totalUsage: {
          promptTokens,
          completionTokens,
          totalTokens: promptTokens + completionTokens,
        },
        model: model.modelId,
      };
    } catch (error) {
      if (error.message?.includes("refused")) {
        throw new LLMRefusalError(error.message);
      }
      throw error;
    }
  }
  

  export async function performLLMExtract(document) {
    if (meta.options.formats.includes("extract")) {
      // Check if the operation has been aborted
      meta.internalOptions.abort?.throwIfAborted();
  
      // Call generateCompletions to get structured data
      const { extract, warning } = await generateCompletions({
        logger: meta.logger.child({
          method: "performLLMExtract/generateCompletions",
        }),
        options: meta.options.extract,
        markdown: document.markdown,
        previousWarning: document.warning
      });
  
      // Store the extracted data based on format preference
      if (meta.options.formats.includes("json")) {
        document.json = extract;
      } else {
        document.extract = extract;
      }
      
      document.warning = warning;
    }
  
    return document;
  }
  

  export function removeDefaultProperty(schema) {
    if (typeof schema !== "object" || schema === null) return schema;
  
    const { default: _, ...rest } = schema;
  
    for (const key in rest) {
      if (Array.isArray(rest[key])) {
        rest[key] = rest[key].map(item => removeDefaultProperty(item));
      } else if (typeof rest[key] === "object" && rest[key] !== null) {
        rest[key] = removeDefaultProperty(rest[key]);
      }
    }
  
    return rest;
  }
  

export async function generateSchemaFromPrompt(prompt) {
    const model = getModel("gpt-4o");
    const temperatures = [0, 0.1, 0.3]; // Different temperatures to try
    let lastError = null;
  
    for (const temp of temperatures) {
      try {
        const { extract } = await generateCompletions({
          logger: logger.child({
            method: "generateSchemaFromPrompt/generateCompletions",
          }),
          model: model,
          options: {
            mode: "llm",
            systemPrompt: `You are a schema generator for a web scraping system. Generate a JSON schema based on the user's prompt.
  Consider:
  1. The type of data being requested
  2. Required fields vs optional fields
  3. Appropriate data types for each field
  4. Nested objects and arrays where appropriate
  
  Valid JSON schema, has to be simple. No crazy properties. OpenAI has to support it.
  Supported types:
  - String
  - Number
  - Boolean
  - Integer
  - Object
  - Array
  - Enum
  - anyOf
  
  Formats are not supported. Min/max are not supported. Keep it simple with types and descriptions.
  Optionals are not supported.
  DO NOT USE FORMATS.
  Keep it simple. Don't create too many properties, just the ones that are needed. Don't invent properties.
  Return a valid JSON schema object with properties that would capture the information requested in the prompt.`,
            prompt: `Generate a JSON schema for extracting the following information: ${prompt}`,
            temperature: temp
          },
          markdown: prompt
        });
  
        return extract;
  
      } catch (error) {
        lastError = error;
        logger.warn(`Failed attempt with temperature ${temp}: ${error.message}`);
        continue;
      }
    }
  
    // If all attempts fail, throw an error
    throw new Error(
      `Failed to generate schema after all attempts. Last error: ${lastError?.message}`
    );
  }
  