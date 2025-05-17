chrome.runtime.onInstalled.addListener(() => {
    console.log("Now Playing Scraper installed!");
});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'openPopup') {
      chrome.action.openPopup() // Opens the popup programmatically
    }
  })