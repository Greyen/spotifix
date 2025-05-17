// import dot from 'compute-dot';
import cosineSimilarity from 'compute-cosine-similarity';
// import { getSimilarityMeasure } from '../config';
const computeSimilarity = (x, y, similarityMeasure) => {
    //   const similarityMeasure = getSimilarityMeasure();
    var _a;
    if (similarityMeasure === 'cosine') {
        return (_a = cosineSimilarity(x, y)) !== null && _a !== void 0 ? _a : 0;
    }
    // if (similarityMeasure === 'cosine') {
    //   return cosineSimilarity(x, y)??0;
    // } else if (similarityMeasure === 'dot') {
    //   return dot(x, y);
    // }
    throw new Error('Invalid similarity measure');
};
export default computeSimilarity;
