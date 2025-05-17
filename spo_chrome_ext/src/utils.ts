export interface ScrapeActionContent {
    url: string;
    html: string;
  }

export type Document = {
    title?: string;
    description?: string;
    url?: string;
    markdown?: string;
    html?: string;
    rawHtml?: string;
    links?: string[];
    screenshot?: string;
    extract?: any;
    json?: any;
    warning?: string;
    actions?: {
      screenshots?: string[];
      scrapes?: ScrapeActionContent[];
    };
    metadata: {
      title?: string;
      description?: string;
      language?: string;
      keywords?: string;
      robots?: string;
      ogTitle?: string;
      ogDescription?: string;
      ogUrl?: string;
      ogImage?: string;
      ogAudio?: string;
      ogDeterminer?: string;
      ogLocale?: string;
      ogLocaleAlternate?: string[];
      ogSiteName?: string;
      ogVideo?: string;
      dcTermsCreated?: string;
      dcDateCreated?: string;
      dcDate?: string;
      dcTermsType?: string;
      dcType?: string;
      dcTermsAudience?: string;
      dcTermsSubject?: string;
      dcSubject?: string;
      dcDescription?: string;
      dcTermsKeywords?: string;
      modifiedTime?: string;
      publishedTime?: string;
      articleTag?: string;
      articleSection?: string;
      url: string;
      sourceURL?: string;
      statusCode?: number;
      scrapeId?: string;
      error?: string;
      [key: string]: string | string[] | number | undefined
    };
    serpResults?: {
      title: string;
      description: string;
      url: string;
    };
  };