/** @format */

import * as tf from "@tensorflow/tfjs-node";
import * as fs from "fs";

async function predictClassification(model: tf.LayersModel, imagePath: string) {
  try {
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);

    const imageTensor = tf.node
      .decodeImage(imageBuffer)
      .resizeNearestNeighbor([224, 224]) // Resize to match model input shape
      .expandDims() // Add batch dimension
      .toFloat();

    // Make prediction
    const prediction = model.predict(imageTensor);

    // Check if prediction is an array of tensors
    if (Array.isArray(prediction)) {
      throw new Error("Unexpected prediction format: Array of Tensors");
    }

    // Get prediction data
    const scores = await prediction.data();
    const confidenceScore = Math.max(...scores) * 100;

    const classes = [
      "Melanocytic nevus",
      "Squamous cell carcinoma",
      "Vascular lesion",
    ];

    const classResult = tf.argMax(prediction, 1).dataSync()[0];
    const label = classes[classResult];
    console.log(label);
    console.log(confidenceScore);
    return { confidenceScore, label };
  } catch (error) {
    console.error("Error during prediction:", error);
    throw error;
  }
}

export default predictClassification;
