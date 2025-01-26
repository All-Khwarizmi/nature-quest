import { ClassificationAgentInterface, ClassificationResult } from "./types";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";

export class ClassificationAgent implements ClassificationAgentInterface {
  private model: mobilenet.MobileNet | null = null;

  private readonly BOTANICAL_KEYWORDS = [
    "tree",
    "plant",
    "flower",
    "palm",
    "pine",
    "fern",
    "bush",
    "shrub",
    "vine",
    "grass",
    "bamboo",
    "moss",
    "algae",
    "succulent",
    "cactus",
    "herb",
    "leaf",
    "bark",
  ];

  constructor() {
    if (typeof window !== "undefined") {
      this.initModel(); // Run only in the browser
    }
  }

  private async initModel() {
    try {
      await tf.ready();
      if (tf.getBackend() !== "webgl") {
        await tf.setBackend("webgl");
      }
      console.log("Current backend:", tf.getBackend());
      this.model = await mobilenet.load();
    } catch (error) {
      console.error("Failed to load MobileNet model:", error);
    }
  }

  private isBotanical(prediction: string): boolean {
    return this.BOTANICAL_KEYWORDS.some(keyword => prediction.toLowerCase().includes(keyword));
  }

  async classifyImage(image: HTMLImageElement, file: File): Promise<ClassificationResult> {
    try {
      if (!this.model) {
        await this.initModel();
        if (!this.model) throw new Error("Model failed to initialize");
      }

      // Ensure the image is loaded
      if (!image.complete) {
        await new Promise(resolve => {
          image.onload = resolve;
        });
      }

      // Get predictions
      const predictions = await this.model.classify(image, 5); // Get top 5 predictions
      console.log(predictions, "predictions inside classify image");
      // Find first botanical prediction
      //   for (const prediction of predictions) {
      //     if (this.isBotanical(prediction.className)) {
      //       return {
      //         className: prediction.className.toLowerCase(),
      //         image,
      //         file,
      //       };
      //     }
      //   }

      if (predictions.length > 0) {
        return {
          className: predictions[0].className.toLowerCase(),
          image,
          file,
        };
      }

      return undefined;
    } catch (error) {
      console.error("Classification error:", error);
      return undefined;
    }
  }
}
