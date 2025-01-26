"use client";

import { useState } from "react";
import Image from "next/image";
import { type PutBlobResult, UploadProgressEvent } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { BackgroundPattern } from "~~/components/background-pattern";
import { PhotoCapture } from "~~/components/photo-capture";
import { QuestCard } from "~~/components/quest-card";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/alert";
import { Button } from "~~/components/ui/button";
import { Progress } from "~~/components/ui/progress";
import addUpload from "~~/src/actions/uploadActions";
import addUser, { getUser } from "~~/src/actions/userActions";
import { User } from "~~/src/db/schema";
import { classifyImage } from "~~/services/classification-agent";
import { ClassificationResult } from "~~/services/classification-agent/types";

export default function Home() {
  // Get the user's wallet address and connection status
  const { address, isConnected } = useAccount();

  // State to store the uploaded image blob
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUpload = async (imageFile: File, classificationResult: ClassificationResult) => {
    console.log(imageFile);

    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    // Get user from postgres
    const user = await handleGetUser(address);
    if (!user) {
      console.log("No user");
      return;
    }

    // Store image blob
    const blob = await handleUploadBlob(imageFile, address);
    if (!blob) {
      console.log("No blob");
      return;
    }

    // Upload user data to postgres
    await handleUploadUserData(user, blob, classificationResult);
    
    // TODO: upload business data?
  };

  // Handle the image capture event
  const handleImageClassification = async (imageFile: File, imageElement: HTMLImageElement) => {
    // Pass to next module (MobileNet, upload, etc.)
    // 👉 agent goes here
    const classificationResult = await classifyImage(imageElement, imageFile);
    await handleUpload(imageFile, classificationResult);
  };

  const handleRetry = () => {
    setBlob(null);
    setError(null);
    setProgress(0);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundPattern />
      <div className="relative z-10 flex flex-col min-h-screen">
        <section className="flex-grow  flex items-center justify-center px-4">
          <div className=" flex flex-col justify-center max-w-md space-y-8">
            {!blob && !isUploading && <PhotoCapture onImageCaptured={handleImageClassification} />}

            {isUploading && (
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-forest-green mb-2">Uploading image...</p>
                <Progress value={progress} className="w-full" />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {blob && (
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image src={blob.url || "/placeholder.svg"} alt="Captured image" fill className="object-cover" />
                </div>
                <Button onClick={handleRetry} className="w-full text-white">
                  Capture Another Image
                </Button>
              </div>
            )}

            <QuestCard
              title="Spot Spring Birds"
              description="Find and photograph 3 different spring migratory birds in your area"
              progress={1}
              total={3}
              dueDate="2 days left"
            />
          </div>
        </section>
      </div>
    </div>
  );

  async function handleGetUser(address: string) {
    try {
      // Get the user Id from the db
      console.log("Getting user data");
      let user = await getUser(address);
      console.log(user);
      if (!user) {
        console.log("User not found, creating new user");
        user = await addUser(address);
        if (!user) {
          setError("Failed to create user. Please try again.");
          return;
        }
        return user;
      }
      return user;
    } catch (error) {
      console.error(error);
      setError("Failed to upload user data. Please try again.");
      return;
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
      setError("Failed to save image. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleUploadUserData(user: User, newBlob: PutBlobResult, classificationResult: ClassificationResult) {
    try {
      console.log("Uploading user data");
      // Update the user's db entry

      // pass in result of classification... but also pass in blob results

      const uploadResult = await addUpload({
        userId: user.id,
        classificationJson: classificationResult?.className || '',
        imageUrl: newBlob.url,
        metadata: "Spring Birds", // TODO: Update this
        status: "pending", // TODO: Update this
        location: [0, 0], // TODO: Update this
        season: "spring", // TODO: Update this
        createdAt: new Date(),
        photoTakenAt: new Date(),
        updatedAt: new Date(),
        questId: user.id, // TODO: Update this
      });

      console.log(uploadResult);
      return uploadResult;
    } catch (error) {
      console.error(error);
      setError("Failed to upload user data. Please try again.");
    }
  }
}
