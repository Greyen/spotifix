// import dot from 'compute-dot';
import cosineSimilarity from 'compute-cosine-similarity';
// import { getSimilarityMeasure } from '../config';

const computeSimilarity = (x: number[], y: number[] , similarityMeasure:string): number => {
//   const similarityMeasure = getSimilarityMeasure();

  if (similarityMeasure === 'cosine') {
    return cosineSimilarity(x, y)??0;

  }
  // if (similarityMeasure === 'cosine') {
  //   return cosineSimilarity(x, y)??0;
  // } else if (similarityMeasure === 'dot') {
  //   return dot(x, y);
  // }

  throw new Error('Invalid similarity measure');
};

export default computeSimilarity;