// type ParsedContent = Record<string, string[]>;

// export function parsedetailed(text:string):ParsedContent{
//     const sections = text.split(/\*\*(.*?)\*\*/g); // Split on **strong**
//     const result:ParsedContent = {};
  
//     for (let i = 1; i < sections.length; i += 2) {
//       const heading = sections[i].trim();
//       const content = sections[i + 1].trim();
  
//       // Split content on citations like [2][7]
//       const splitContent = content.split(/(\[\d+\])/g).filter(Boolean);
  
//       if (!result[heading]) result[heading] = [];
  
//       splitContent.forEach(part => {
//         // Check if the part is a citation like [2]
//         if (part.match(/\[\d+\]/g)) {
//           result[heading].push(part.trim()); // Push citation separately
//         } else {
//           result[heading].push(part.trim()); // Push text normally
//         }
//       });
//     }
  
//     return result;
//   }