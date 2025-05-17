 // Define the structure of the result object
 import {ReferenceProps} from "./favicons"
 type ParsedContent = Record<string, string[]>;

 interface ParsedResult {
    Summary: string;
    Detailed: { [key: string]: string } | ParsedContent ;
    Related_Queries: string[];
    References: string[];
  }


  export interface WithReference {
    Summary: string;
    Detailed: { [key: string]: string }| ParsedContent;
    Related_Queries: string[];
    References: ReferenceProps[];
  }
 

  export interface newReference {
    Summary: string;
    Detailed: ParsedContent;
    Related_Queries: string[];
    References: ReferenceProps[];
  }

export const parseLLMResponse  = (responseText: string):ParsedResult=> {
    console.log("parse function")
    console.log("original_String>",responseText)
    // Helper function to clean up text by removing extra whitespace/newlines
    const cleanText = (text: string): string => text.trim();
  
    // Initialize result object
    const result: ParsedResult = {
      Summary: "",
      Detailed: {},
      Related_Queries: [],
      References: []
    };
  
    // Split the response into main sections using known markers
    // We assume the sections appear in order: Summary, Detailed Analysis, Related Queries, References
    const summarySplit = responseText.split(/\*Summary\*/i);
    if (summarySplit.length > 1) {
      // Get text after "*Summary*"
      const summaryAndRest = summarySplit[1];
      // Split by "*Detailed Analysis*"
      const parts = summaryAndRest.split(/\*Detailed Answer\*/i);
      if (parts.length > 1) {
        const summaryPart = parts[0];
        console.log("summary Part->",summaryPart)
        const restAfterSummary = parts[1];
        result.Summary = cleanText(summaryPart);
        console.log("result before:",result)

        // if (sumaryAndRest.length > 1) {
        //   // Split further by "*References*" if present
        //   const refSplit = restAfterSummary.split(/\*References\*/i);
        //   const relatedQueriesPart = refSplit[0];
        //   const queriesLines = relatedQueriesPart.split('\n').map(line => line.trim());
        //   result.Related_Queries = queriesLines.filter(line => line.startsWith('-') || line.startsWith('*'))
        //     .map(line => line.replace(/^[-*]\s*/, '').trim());
          
        //   // Process References if they exist
        //   if (refSplit.length > 1) {
        //     const referencesPart = refSplit[1];
        //     const referenceLines = referencesPart.split('\n').map(line => line.trim());
        //     // Filter out empty lines and possible dashes or bullet points
        //     result.References = referenceLines.filter(line => line.length > 0);
        //   }
        // }
  
        // Now, from the rest, split by "*Related Queries*"
        const detailedSplit = restAfterSummary.split(/\*References\*/i);
        if (detailedSplit.length > 0) {
          const detailedPart = detailedSplit[0];
          
          // Process the Detailed Analysis part by splitting into subheadings (assumed to be marked with **)
          // Regex: match subheadings that start and end with "**" and capture their title.
          // const detailedLines = detailedPart.split('\n');
          // let currentSubheading = "";
          // let currentContent = "";
          // detailedLines.forEach(line => {
          //   line = line.trim();
          //   // If the line starts and ends with "**", treat it as a subheading
          //   const subheadingMatch = line.match(/^\*\*(.+)\*\*$/);
          //   if (subheadingMatch) {
          //     // If there was a previous subheading, save its content
          //     if (currentSubheading) {
          //       result.Detailed[currentSubheading] = cleanText(currentContent);
          //     }
          //     currentSubheading = subheadingMatch[1].trim();
          //     currentContent = "";
          //   } else if (line !== "") {
          //     currentContent += line + " ";
          //   }
          // });
          // // Save the last subheading content if it exists
          // if (currentSubheading) {
          //   result.Detailed[currentSubheading] = cleanText(currentContent);
          // } else {
          //   // If no subheadings were detected, save the whole detailed text as one block
          //   result.Detailed["Content"] = cleanText(detailedPart);
          // }
          // console.log("maa ki chu Detailed Part",detailedPart)
          const sections = detailedPart.split(/\*\*(.*?)\*\*/g); // Split on **strong**
          const result_obj:ParsedContent = {};
          console.log("maa ki chu length",sections.length)
          if (sections.length==1){
            console.log("yes only one sections");
            const heading = "Content"
            if (!result_obj[heading]) result_obj[heading] = [];
            const splitContent= detailedPart.split(/(\[\d+\])/g).filter(Boolean);
            splitContent.forEach(part => {
              // Check if the part is a citation like [2]
              if (part.match(/\[\d+\]/g)) {
                result_obj[heading].push(part.trim()); // Push citation separately
              } else {
                result_obj[heading].push(part.trim()); // Push text normally
              }
            });
          }
          else{
            for (let i = 1; i < sections.length; i += 2) {
              const heading = sections[i].trim();
              const content = sections[i + 1].trim();
          
              // Split content on citations like [2][7]
              const splitContent = content.split(/(\[\d+\])/g).filter(Boolean);
          
              if (!result_obj[heading]) result_obj[heading] = [];
          
              splitContent.forEach(part => {
                // Check if the part is a citation like [2]
                if (part.match(/\[\d+\]/g)) {
                  result_obj[heading].push(part.trim()); // Push citation separately
                } else {
                  result_obj[heading].push(part.trim()); // Push text normally
                }
              });
            }
          }
          result.Detailed = result_obj
          // Process the Related Queries section if available
          if (detailedSplit.length > 1) {
            
            // Split further by "*References*" if present
              const refSplit = detailedSplit[1].split(/\*Related Queries\*/i);
              const referencesPart = refSplit[0];
              const referenceLines = referencesPart.split('\n').map(line => line.trim());
              // Filter out empty lines and possible dashes or bullet points
              result.References = referenceLines.filter(line => line.length > 0);
              if(refSplit.length>1){
                const relatedQueriesPart = refSplit[1];
                const queriesLines = relatedQueriesPart.split('\n').map(line => line.trim());
                result.Related_Queries = queriesLines.filter(line => line.startsWith('-') || line.startsWith('*'))
                  .map(line => line.replace(/^[-*]\s*/, '').trim());
            } 
          }
        }
      }
    }
    return result;
    // return JSON.stringify(result, null, 2);
  }

export const parseReferences = (text: string): Record<string, string> => {
  const result: Record<string, string> = {};
  
  const regex = /-\s*\[(\d+)\]\s*"(.+?)"/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const key = match[1];  // The number inside [x]
    const url = match[2];  // The URL inside quotes
    result[key] = url;
  }
  
  return result;
};
  
//   // Example LLM response
//   const llmResponse = `
//   *Summary*
  
//   "Some Sexy Songs 4 U," the collaborative album by Drake and PartyNextDoor, has garnered mixed reviews since its release. While it has achieved commercial success, debuting at number one on the Billboard Canadian Albums chart and breaking streaming records on Apple Music, critical reception has been varied. The album's first half has been described as lackluster, with some critics noting that it feels more calculated than collaborative. However, the second half of the album has been praised for its smoother vibes and catchy hooks, which have resonated well with listeners.
  
//   *Detailed Analysis*
  
//   **Commercial Success**
  
//   The album "Some Sexy Songs 4 U" has been a commercial triumph, particularly in Drake and PartyNextDoor's home country of Canada, where it debuted at number one on the Billboard Canadian Albums chart. It also set a new record for the most streamed R&B/Soul album on Apple Music on its first day of release[5]. This commercial success underscores the strong fanbase and anticipation surrounding the project.
  
//   **Critical Reception**
  
//   Despite its commercial achievements, the album has received mixed reviews from critics. The first half of the album has been criticized for lacking energy and engagement, with some reviewers describing it as a "total disaster" and noting that both artists sound "asleep at the wheel"[3]. This part of the album has been perceived as more of a calculated effort rather than a genuine collaboration, with PartyNextDoor struggling to find his space within the tracks[8].
  
//   **Positive Highlights**
  
//   In contrast, the second half of the album has been better received. It features smoother vibes and catchy hooks that have been appreciated by listeners[13]. Songs like "CN Tower," "Moth Balls," and "Something About You" set a positive tone and showcase the artists' ability to create engaging music[13]. The album also includes the RIAA gold-certified single "Resentment," which has been a standout track[14].
  
//   **Overall Impression**
  
//   Overall, "Some Sexy Songs 4 U" presents a dichotomy between its commercial success and critical reception. While it has achieved significant streaming numbers and chart positions, the album's artistic execution has been questioned by some critics. The project highlights the challenges of balancing commercial appeal with artistic integrity, a common theme in the music industry.
  
//   *Related Queries*
  
//   - What are the standout tracks on "Some Sexy Songs 4 U"?
//   - How does "Some Sexy Songs 4 U" compare to Drake's previous albums in terms of streaming success?
//   - What are the themes explored in "Some Sexy Songs 4 U"?
//   - How has PartyNextDoor's collaboration with Drake evolved over time?
//   - What are the critical reviews of "Some Sexy Songs 4 U"?
  
//   *References*
  
//   1. - [Rolling Stone Review](https://www.reddit.com/r/Drizzy/comments/1it5ns0/some_sexy_songs_4_u_review_rolling_stone_35_out/)
//   2. - [Worldstar Hip Hop](https://www.facebook.com/worldstarhiphop/posts/drakes-some-sexy-songs-4-u-got-the-ladies-already-talking-but-their-reviews-migh/1031941425633271/)
//   3. - [Soul In Stereo Review](https://soulinstereo.com/2025/02/album-review-drake-partynextdoor-some-sexy-songs-4-u.html)
//   4. - [Time Out Music](https://www.timeout.com/music/best-sexy-songs)
//   `;
  
//   const parsedJSON = parseLLMResponse(llmResponse);
//   console.log(parsedJSON);
  