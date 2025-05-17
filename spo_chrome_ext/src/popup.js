console.log("pop us loaded")
document.addEventListener("DOMContentLoaded", async () => {
    console.log("dom of popus loaded")
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    console.log("popup url",tab.url);
    // Ensure the URL is from Spotify
    if (!tab.url.includes("open.spotify.com")) {
        document.getElementById("song-info").style.display = "none";
        document.getElementById("album-art").style.display = "none";
        document.getElementById("error-msg").style.display = "block";
        return;
    }

    // Execute the content script to get song info
    // Send a message to content script to get song info
    chrome.tabs.sendMessage(tab.id, { action: "getSongInfo",url:window.location.href }, (response) => {
        console.log(response);
        if (response.success) {
            const { title, artist, albumArt ,htmlContent} = response;
            document.getElementById("title").innerText = `Title: ${title || "Unknown"}`;
            document.getElementById("artist").innerText = `Artist: ${artist || "Unknown"}`;
            document.getElementById("album-art").src = albumArt || "icon.png";
            document.getElementById("album-art").style.display = "block";
            try{
                    chrome.runtime.sendMessage({
                        action: "forwardToServer",
                        payload: {
                            html: htmlContent,
                            url: tab.url,
                        }
                    },(response)=>
                    {console.log(response)})
                }
                catch(error){
                    console.log("failed to send the data",error)
                }
        }
    });
});

// // This function is injected into Spotify's page
// function getSongInfo() {
//     let title = document.querySelector(".track-info__name")?.innerText;
//     let artist = document.querySelector(".track-info__artists")?.innerText;
//     let albumArt = document.querySelector(".cover-art-image")?.src;

//     return { title, artist, albumArt };
// }

