export class Document {
    constructor() {
      this.title = undefined;
      this.description = undefined;
      this.url = undefined;
      this.markdown = undefined;
      this.html = undefined;
      this.rawHtml = undefined;
      this.links = undefined;
      this.screenshot = undefined;
      this.extract = undefined;
      this.json = undefined;
      this.warning = undefined;
      this.actions = {
        screenshots: undefined,
        scrapes: undefined,
      };
      this.metadata = {
        title: undefined,
        description: undefined,
        language: undefined,
        keywords: undefined,
        robots: undefined,
        ogTitle: undefined,
        ogDescription: undefined,
        ogUrl: undefined,
        ogImage: undefined,
        ogAudio: undefined,
        ogDeterminer: undefined,
        ogLocale: undefined,
        ogLocaleAlternate: undefined,
        ogSiteName: undefined,
        ogVideo: undefined,
        dcTermsCreated: undefined,
        dcDateCreated: undefined,
        dcDate: undefined,
        dcTermsType: undefined,
        dcType: undefined,
        dcTermsAudience: undefined,
        dcTermsSubject: undefined,
        dcSubject: undefined,
        dcDescription: undefined,
        dcTermsKeywords: undefined,
        modifiedTime: undefined,
        publishedTime: undefined,
        articleTag: undefined,
        articleSection: undefined,
        url: undefined,
        sourceURL: undefined,
        statusCode: undefined,
        scrapeId: undefined,
        error: undefined,
      };
      this.serpResults = {
        title: undefined,
        description: undefined,
        url: undefined,
      };
    }
  }
  
  