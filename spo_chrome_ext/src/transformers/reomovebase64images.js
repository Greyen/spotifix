import { Meta } from "..";
import { Document } from "../../../controllers/v1/types";

const regex = /(!\[.*?\])\(data:image\/.*?;base64,.*?\)/g;

export function removeBase64Images(document) {
//   if (meta.options.removeBase64Images && document.markdown !== undefined) {
//     document.markdown = document.markdown.replace(regex, "$1(<Base64-Image-Removed>)");
//   }
// TODO will check when we want to do something with images
  document.markdown = document.markdown.replace(regex, "$1(<Base64-Image-Removed>)");
  return document;
}
