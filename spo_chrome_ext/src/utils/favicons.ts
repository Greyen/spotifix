export interface ReferenceProps {
  url: string;
  faviconUrl: string;
  siteName: string;
  index: number;
}

export function getSiteName(url: string): string {
  // Step 1: Extract the hostname (like www.bbc.com)
  const hostname = new URL(url).hostname;

  // Step 2: Remove "www." if it exists
  const cleanDomain = hostname.replace("www.", "");

  // Step 3: Extract the site name without ".com"
  const siteName = cleanDomain.split(".")[0];

  // Step 4: Capitalize the first letter
  return siteName.charAt(0).toUpperCase() + siteName.slice(1);
}

export function convertReferences(references: string[]): ReferenceProps[] {
  const result: ReferenceProps[] = [];

  // Loop through each string in the array
  references.forEach((reference) => {
    // Extract the index and URL using regex like: [1] "https://example.com"
    const regex = /\[(\d+)\]\s*"(.+?)"/;
    const match = reference.match(regex);

    if (match) {
      const index = Number(match[1]); // Extract index like [1]
      const url = match[2];           // Extract URL like "https://example.com"
      const domain = new URL(url).hostname;
      const siteName = getSiteName(url);

      result.push({
        url: url,
        faviconUrl: `https://www.google.com/s2/favicons?sz=128&domain=${domain}`,
        siteName: siteName,
        index: index
      });
    }
  });

  return result;
}
