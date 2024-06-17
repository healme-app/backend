/** @format */

import * as tf from "@tensorflow/tfjs-node";

async function loadModel(): Promise<tf.LayersModel> {
  return tf.loadLayersModel(process.env.MODEL_URL!);
}

export default loadModel;
