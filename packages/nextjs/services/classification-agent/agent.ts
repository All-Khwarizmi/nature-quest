import * as tf from '@tensorflow/tfjs';
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs-backend-webgl";
import { ClassificationAgentInterface, ClassificationResult } from "./types";

export class ClassificationAgent implements ClassificationAgentInterface {
  private model: mobilenet.MobileNet | null = null;

  private readonly BOTANICAL_KEYWORDS = [
    "rapeseed",
    "daisy",
    "yellow lady's slipper",
    "yellow lady-slipper",
    "Cypripedium calceolus",
    "Cypripedium parviflorum",
    "corn",
    "acorn",
    "hip",
    "rose hip",
    "rosehip",
    "buckeye",
    "horse chestnut",
    "conker",
    "cabbage",
    "broccoli",
    "cauliflower",
    "zucchini",
    "courgette",
    "spaghetti squash",
    "acorn squash",
    "butternut squash",
    "cucumber",
    "cuke",
    "artichoke",
    "globe artichoke",
    "bell pepper",
    "cardoon",
    "mushroom",
    "Granny Smith",
    "strawberry",
    "orange",
    "lemon",
    "fig",
    "pineapple",
    "ananas",
    "banana",
    "jackfruit",
    "jak",
    "jack",
    "custard apple",
    "pomegranate",
    "hay"
  ]  

  constructor() {
    if (typeof window !== "undefined") {
        this.initModel();
      }
  }

  private async initModel() {
    try {
        await tf.ready();
        if (tf.getBackend() !== 'webgl') {
            await tf.setBackend('webgl');
        }
        console.log('Current backend:', tf.getBackend());
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
      console.log(predictions, 'predictions inside classify image');
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
