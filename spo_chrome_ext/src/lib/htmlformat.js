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
// import * as cheerio from "cheerio";
// const cheerio = require("cheerio");
//"script","noscript","iframe",
const forcedremovetags = [
    "#Desktop_LeftSidebar_Id",
    "#global-nav-bar",
    'aside[aria-label="Now playing view"]',
    'header[aria-label="Top bar and user menu"]',
    '#main-view-container__mh-footer-container',
    '.ReactModalPortal',
    "#onetrust-consent-sdk",
];
const excludeNonMainTags = [
    "header",
    "footer",
    "nav",
    "aside",
    "script",
    "noscript",
    "iframe",
    ".header",
    ".top",
    ".navbar",
    "#header",
    ".footer",
    ".bottom",
    "#footer",
    ".sidebar",
    ".side",
    ".aside",
    "#sidebar",
    ".modal",
    ".popup",
    "#modal",
    ".overlay",
    ".ad",
    ".ads",
    ".advert",
    "#ad",
    ".lang-selector",
    ".language",
    "#language-selector",
    ".social",
    ".social-media",
    ".social-links",
    "#social",
    ".menu",
    ".navigation",
    "#nav",
    ".breadcrumbs",
    "#breadcrumbs",
    ".share",
    "#share",
    ".widget",
    "#widget",
    ".cookie",
    "#cookie",
];
const forceIncludeMainTags = ["#main"];
export const cleanHTML = (html, url) => __awaiter(void 0, void 0, void 0, function* () {
    let soup = load(html);
    // tag only for spotify
    try {
        forcedremovetags.forEach((selector) => {
            const elements = soup(selector);
            if (elements.length > 0) { // Check if elements exist
                console.log(`Removing: ${selector}`);
                elements.remove(); // Remove the elements
            }
        });
        console.log("Done removing elements");
    }
    catch (error) {
        console.log("Not able to do remove new elements", error);
    }
    excludeNonMainTags.forEach((tag) => {
        const elementsToRemove = soup(tag).filter(forceIncludeMainTags.map((x) => ":not(:has(" + x + "))").join(""));
        elementsToRemove.remove();
    });
    // Select the parent div if it only contains the target aside
    soup('aside[aria-label="Now playing view"]').each((_, el) => {
        const parent = soup(el).parent();
        // Check if the parent contains only this aside
        if (parent.children().length === 1) {
            parent.remove(); // Remove the entire parent div
        }
        else {
            soup(el).remove(); // Just remove the aside if parent has other elements
        }
    });
    // always return biggest image
    soup("img[srcset]").each((_, el) => {
        var _a;
        const sizes = el.attribs.srcset.split(",").map((x) => {
            var _a, _b;
            const tok = x.trim().split(" ");
            return {
                url: tok[0],
                size: parseInt(((_a = tok[1]) !== null && _a !== void 0 ? _a : "1x").slice(0, -1), 10),
                isX: ((_b = tok[1]) !== null && _b !== void 0 ? _b : "").endsWith("x"),
            };
        });
        if (sizes.every((x) => x.isX) && el.attribs.src) {
            sizes.push({
                url: el.attribs.src,
                size: 1,
                isX: true,
            });
        }
        sizes.sort((a, b) => b.size - a.size);
        el.attribs.src = (_a = sizes[0]) === null || _a === void 0 ? void 0 : _a.url;
    });
    // absolute links
    soup("img[src]").each((_, el) => {
        try {
            el.attribs.src = new URL(el.attribs.src, url).href;
        }
        catch (_) { }
    });
    soup("a[href]").each((_, el) => {
        try {
            el.attribs.href = new URL(el.attribs.href, url).href;
        }
        catch (_) { }
    });
    const cleanedHtml = soup.html();
    return cleanedHtml;
});
// // Example usage
// const html = `
//   <header>Header</header>
//   <main>Main Content</main>
//   <aside>Sidebar</aside>
//   <img srcset="small.jpg 1x, medium.jpg 2x, large.jpg 3x" src="fallback.jpg">
//   <a href="/contact">Contact Us</a>
// `;
// const url = "https://example.com";
// const scrapeOptions = { onlyMainContent: true };
// const excludeNonMainTags = ["header", "aside"];
// const forceIncludeMainTags = ["main"];
// const cleanedHtml = cleanHTML(html, url, scrapeOptions, excludeNonMainTags, forceIncludeMainTags);
// console.log(cleanedHtml);
