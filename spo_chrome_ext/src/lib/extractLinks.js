var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { load } from "cheerio";
// const {load} = require("cheerio")
export function extractLinks(html, baseUrl) {
    return __awaiter(this, void 0, void 0, function* () {
        const $ = load(html);
        const links = [];
        $("a").each((_, element) => {
            let href = $(element).attr("href");
            if (href) {
                href = href.trim();
                try {
                    if (href.startsWith("http://") || href.startsWith("https://")) {
                        // Absolute URL, add as is
                        links.push(href);
                    }
                    else if (href.startsWith("/")) {
                        // Relative URL starting with '/', append to origin
                        links.push(new URL(href, baseUrl).href);
                    }
                    else if (!href.startsWith("#") && !href.startsWith("mailto:")) {
                        // Relative URL not starting with '/', append to base URL
                        links.push(new URL(href, baseUrl).href);
                    }
                    else if (href.startsWith("mailto:")) {
                        // mailto: links, add as is
                        links.push(href);
                    }
                    // Fragment-only links (#) are ignored
                }
                catch (error) {
                    console.log(error);
                    // logger.error(
                    //   `Failed to construct URL for href: ${href} with base: ${baseUrl}`,
                    //   { error },
                    // );
                }
            }
        });
        // Remove duplicates and return
        return [...new Set(links)];
    });
}
;
