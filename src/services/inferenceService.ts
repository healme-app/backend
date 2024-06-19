/** @format */

import * as tf from "@tensorflow/tfjs-node";

async function predictClassification(model: tf.LayersModel, imageUrl: string) {
  try {
    // Read the image file
    const { default: fetch } = await import("node-fetch");
    const response = await fetch(imageUrl);
    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch image from URL: ${response.statusText}`);
    }
    const imageArrayBuffer = await response.arrayBuffer();

    const imageBuffer = Buffer.from(imageArrayBuffer);
    // const imageTensor = tf.node
    //   .decodeImage(imageBuffer)
    //   .resizeNearestNeighbor([224, 224])
    //   .expandDims()
    //   .toFloat();

    const imageTensor = tf.node
      .decodeImage(imageBuffer)
      .resizeBilinear([224, 224])
      .expandDims()
      .toFloat()
      .div(tf.scalar(255));

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
      "Acne and Rosacea",
      "Atopic Dermatitis",
      "Bullous Disease",
      "Cellulitis Impetigo and other Bacterial Infections",
      "Eczema",
      "Poison Ivy and other Contact Dermatitis",
      "Psoriasis pictures Lichen Planus and related diseases",
      "Scabies Lyme Disease and other Infestations and Bites",
      "Tinea Ringworm Candidiasis and other Fungal Infections",
      "Warts Molluscum and other Viral Infections",
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
