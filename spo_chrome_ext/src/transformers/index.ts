
// import { cleanHTML} from "../lib/htmlformat.js";
// import { extractlinks } from "../lib/extractLinks.js";
// import { extractMetadata } from "../lib/extractMetadata.js";
// "------------------------------------------------------------------"


// export async function deriveMetadataFromRawHTML(meta, document) {
//     if (document.rawHtml === undefined) {
//       throw new Error(
//         "rawHtml is undefined -- this transformer is being called out of order"
//       );
//     }
  
//     document.metadata = {
//       ...(await extractMetadata(meta, document.rawHtml)),
//       ...document.metadata,
//     };
//     return document;
//   }
  
//   export async function deriveHTMLFromRawHTML(document) {
//     console.log("i am in html convert")
//     if (document.rawHtml === undefined) {
//       throw new Error(
//         "rawHtml is undefined -- this transformer is being called out of order"
//       );
//     }
  
//     document.html = await cleanHTML(
//       document.rawHtml,
//       document.metadata.url ?? document.metadata.sourceURL ?? meta.url,
//     );
//     return document;
//   }
  
 
  
//   export async function deriveLinksFromHTML(meta, document) {
//     if (document.html === undefined) {
//         throw new Error(
//           "html is undefined -- this transformer is being called out of order"
//         );
//     }
//     document.links = await extractlinks(document.html, document.url);
//     return document;
//   }


//   export const transformerStack = [
//     deriveHTMLFromRawHTML,
//     deriveLinksFromHTML,
//   ];

//   export async function executeTransformers(document) {
//     const executions = [];
//     for (const transformer of transformerStack) {
//       const start = Date.now();
//       document = await transformer(document);
//       executions.push([transformer.name, Date.now() - start]);
//     }
//     return document;
//   }
// import { parseMarkdown } from "../../../lib/html-to-markdown";
// import { Meta } from "..";
import { Document } from "../utils.js";
// import { cleanHTML } from "../lib/htmlformat.ts";
import { extractLinks } from "../lib/extractLinks.ts";
import { extractMetadata } from "../lib/extractMetadata.ts";
import { cleanHTML } from "../lib/htmlformat.ts";
// import { performLLMExtract } from "./llmExtract";
// import { uploadScreenshot } from "./uploadScreenshot";
// import { removeBase64Images } from "./removeBase64Images";
// import { saveToCache } from "./cache";

export type Transformer = (
  document:Document
) => Document | Promise<Document>;

export async function deriveMetadataFromRawHTML(
  document:Document,
): Promise<Document> {
  if (document.rawHtml === undefined) {
    throw new Error(
      "rawHtml is undefined -- this transformer is being called out of order",
    );
  }

  document.metadata = {
    ...(await extractMetadata(document.metadata.url,document.rawHtml)),
    ...document.metadata,
  };
  return document;
}

export async function deriveHTMLFromRawHTML(
  document: Document,
): Promise<Document> {
  if (document.rawHtml === undefined) {
    throw new Error(
      "rawHtml is undefined -- this transformer is being called out of order",
    );
  }

  document.html = await cleanHTML(
    document.rawHtml,
    document.metadata.url,
  );
  return document;
}

// export async function deriveMarkdownFromHTML(
//   _meta: Meta,
//   document: Document,
// ): Promise<Document> {
//   if (document.html === undefined) {
//     throw new Error(
//       "html is undefined -- this transformer is being called out of order",
//     );
//   }

//   document.markdown = await parseMarkdown(document.html);
//   return document;
// }

export async function deriveLinksFromHTML(document: Document): Promise<Document> {
  // Only derive if the formats has links
  
  if (document.html === undefined) {
    throw new Error(
      "html is undefined -- this transformer is being called out of order",
    );
  }
  document.links = await extractLinks(document.html, document.metadata.url);
  return document;
}

// export function coerceFieldsToFormats(
//   meta: Meta,
//   document: Document,
// ): Document {
//   const formats = new Set(meta.options.formats);

//   if (!formats.has("markdown") && document.markdown !== undefined) {
//     delete document.markdown;
//   } else if (formats.has("markdown") && document.markdown === undefined) {
//     meta.logger.warn(
//       "Request had format: markdown, but there was no markdown field in the result.",
//     );
//   }

//   if (!formats.has("rawHtml") && document.rawHtml !== undefined) {
//     delete document.rawHtml;
//   } else if (formats.has("rawHtml") && document.rawHtml === undefined) {
//     meta.logger.warn(
//       "Request had format: rawHtml, but there was no rawHtml field in the result.",
//     );
//   }

//   if (!formats.has("html") && document.html !== undefined) {
//     delete document.html;
//   } else if (formats.has("html") && document.html === undefined) {
//     meta.logger.warn(
//       "Request had format: html, but there was no html field in the result.",
//     );
//   }

//   if (
//     !formats.has("screenshot") &&
//     !formats.has("screenshot@fullPage") &&
//     document.screenshot !== undefined
//   ) {
//     meta.logger.warn(
//       "Removed screenshot from Document because it wasn't in formats -- this is very wasteful and indicates a bug.",
//     );
//     delete document.screenshot;
//   } else if (
//     (formats.has("screenshot") || formats.has("screenshot@fullPage")) &&
//     document.screenshot === undefined
//   ) {
//     meta.logger.warn(
//       "Request had format: screenshot / screenshot@fullPage, but there was no screenshot field in the result.",
//     );
//   }

//   if (!formats.has("links") && document.links !== undefined) {
//     meta.logger.warn(
//       "Removed links from Document because it wasn't in formats -- this is wasteful and indicates a bug.",
//     );
//     delete document.links;
//   } else if (formats.has("links") && document.links === undefined) {
//     meta.logger.warn(
//       "Request had format: links, but there was no links field in the result.",
//     );
//   }

//   if (!formats.has("extract") && (document.extract !== undefined || document.json !== undefined)) {
//     meta.logger.warn(
//       "Removed extract from Document because it wasn't in formats -- this is extremely wasteful and indicates a bug.",
//     );
//     delete document.extract;
//   } else if (formats.has("extract") && document.extract === undefined && document.json === undefined) {
//     meta.logger.warn(
//       "Request had format extract, but there was no extract field in the result.",
//     );
//   }

//   if (meta.options.actions === undefined || meta.options.actions.length === 0) {
//     delete document.actions;
//   }

//   return document;
// }

// TODO: allow some of these to run in parallel
export const transformerStack: Transformer[] = [
  deriveHTMLFromRawHTML,
  deriveLinksFromHTML,
  deriveMetadataFromRawHTML,
];

export async function executeTransformers(
  document: Document,
): Promise<Document> {
  const executions: [string, number][] = [];

  for (const transformer of transformerStack) {
    // const _meta = {
    //   ...meta,
    //   logger: meta.logger.child({
    //     method: "executeTransformers/" + transformer.name,
    //   }),
    // };
    const start = Date.now();
    document = await transformer(document);
    executions.push([transformer.name, Date.now() - start]);
  }
  return document;
}
  