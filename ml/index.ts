import tf from '@tensorflow/tfjs';
import mobilenet, { load } from '@tensorflow-models/mobilenet';
import tfnode, { node } from '@tensorflow/tfjs-node';
import fs from 'fs';

export async function imageClassification(imageBuffer: Uint8Array): Promise<{
  className: string;
  probability: number;
}[]> {
  const tfimage = node.decodeImage(imageBuffer);
  const mobilenetModel = await load();
  const predictions = await mobilenetModel.classify(tfimage);
  console.log('Classification Results:', predictions);
  return predictions;
}