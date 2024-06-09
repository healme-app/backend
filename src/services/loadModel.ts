/** @format */

import * as tf from "@tensorflow/tfjs-node";

async function loadModel(): Promise<tf.GraphModel> {
  return tf.loadGraphModel(process.env.MODEL_URL!);
}

export default loadModel;
