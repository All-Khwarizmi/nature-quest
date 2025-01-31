import { useState } from "react";
import { useRouter } from "next/navigation";
import useSeasonAndLocation from "./useSeasonAndLocation";
import type { PutBlobResult, UploadProgressEvent } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useAccount } from "wagmi";
import { PlantClassification } from "~~/app/api/quest/classification-agent";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";
import addUpload from "~~/src/actions/uploadActions";
import addUser, { getUser } from "~~/src/actions/userActions";
import type { Upload, User } from "~~/src/db/schema";

export default function useHomeState() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<Upload | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStep, setProcessingStep] = useState<string>("");
  const [classificationResult, setClassificationResult] = useState<PlantClassification | null>(null);

  const { locationData } = useSeasonAndLocation();

  const { data: tokenBalance } = useScaffoldReadContract({
    contractName: "NatureToken",
    functionName: "balanceOf",
    args: [address],
  });

  const handleUpload = async (imageFile: File, classificationResult: PlantClassification) => {
    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    setIsUploading(true);
    setIsProcessing(true);
    setError(null);
    setProgress(0);

    try {
      setProcessingStep("Getting user data...");
      const user = await handleGetUser(address);
      if (!user) return;

      setProcessingStep("Uploading image...");
      const blob = await handleUploadBlob(imageFile, address);
      if (!blob) return;

      setProcessingStep("Processing upload...");
      const result = await handleUploadUserData(user, blob, classificationResult);
      if (!result) return;

      return result;
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again.");
    }
  };

  const handleImageClassification = async (imageFile: File) => {
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      setIsProcessing(true);
      setProcessingStep("Classifying image...");
      const classificationResponse = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      });

      if (!classificationResponse.ok) {
        throw new Error("Classification failed");
      }

      const classificationResult = (await classificationResponse.json()) as PlantClassification;
      setClassificationResult(classificationResult);

      console.log({ classificationResult });

      // Only proceed if it's a nature image
      if (!classificationResult.isNature) {
        setError("Please upload an image of a plant or nature scene.");
        return;
      }

      // Upload the image with classification data
      const uploadResult = await handleUpload(imageFile, classificationResult);

      if (!uploadResult) return;

      setProcessingStep("Checking quest completion...");
      // Check quest completion with shorter timeout
      const questResponse = await fetch("/api/quest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress: address,
          classificationJson: classificationResult,
          confidence: classificationResult.confidence,
          species: classificationResult.species,
          uploadId: uploadResult.id,
        }),
      });
      if (!questResponse.ok) {
        console.warn("Quest check failed, but continuing...");
      }

      setProcessingStep("Checking completed");
    } catch (error) {
      console.error(error);
      if (error instanceof DOMException && error.name === "AbortError") {
        setError("Request timed out. Please try again.");
      } else {
        setError("Failed to process image. Please try again.");
      }
    } finally {
      setIsProcessing(false);
    }
  };
  async function handleGetUser(address: string) {
    try {
      console.log("Getting user data");
      let user = await getUser(address);
      console.log(user);
      if (!user) {
        console.log("User not found, creating new user");
        user = await addUser(address);
        if (!user) {
          throw new Error("Failed to create user");
        }
      }
      return user;
    } catch (error) {
      console.error(error);
      setError("Failed to get or create user. Please try again.");

      return null;
    }
  }

  async function handleUploadBlob(imageFile: File, address: string) {
    try {
      const newBlob = await upload(imageFile.name, imageFile, {
        access: "public",
        handleUploadUrl: "/api/image/upload",
        clientPayload: address,
        contentType: imageFile.type,
        onUploadProgress: (progress: UploadProgressEvent) => {
          console.log("Progress:", progress);
          setProgress(Math.round((progress.loaded / progress.total) * 100));
        },
      });

      console.log("new blob", newBlob);

      setBlob(newBlob);
      return newBlob;
    } catch (err) {
      console.error(err);
      setError("Failed to upload image. Please try again.");

      return null;
    }
  }

  async function handleUploadUserData(user: User, newBlob: PutBlobResult, classificationResult: PlantClassification) {
    try {
      console.log("Uploading user data");
      const uploadResult = await addUpload({
        userId: user.id,
        classificationJson: JSON.stringify(classificationResult), //TODO: change to classificationJson
        imageUrl: newBlob.url,
        metadata: JSON.stringify(classificationResult), //TODO: change this
        status: "pending",
        location: [locationData?.coordinates.latitude || 0, locationData?.coordinates.longitude || 0],
        season: locationData?.season || "Unknown Season",
        createdAt: new Date(),
        photoTakenAt: new Date(),
        updatedAt: new Date(),
        questId: null,
      });
      setUploadResult(uploadResult);

      console.log(uploadResult);
      return uploadResult;
    } catch (error) {
      console.error("Error uploading user data:", error);
      setError("Failed to process upload. Please try again.");

      return null;
    }
  }

  const handleRetry = () => {
    setBlob(null);
    setError(null);
    setProgress(0);
    setUploadResult(null);
  };

  const handleRedirectToDetails = () => {
    if (!uploadResult) return;
    router.push(`/details/${uploadResult?.id}`);
  };

  return {
    data: {
      blob,
      isUploading,
      uploadResult,
      progress,
      error,
      isProcessing,
      processingStep,
      classificationResult,
      tokenBalance,
    },
    functions: {
      handleGetUser,
      handleUploadBlob,
      handleUploadUserData,
      handleImageClassification,
      handleRedirectToDetails,
      handleRetry,
    },
  };
}
