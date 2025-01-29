"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { PutBlobResult, UploadProgressEvent } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { BackgroundPattern } from "~~/components/background-pattern";
import { PendingQuests } from "~~/components/pending-quests";
import { PhotoCapture } from "~~/components/photo-capture";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/alert";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Progress } from "~~/components/ui/progress";
import { classifyImage } from "~~/services/classification-agent";
import type { ClassificationResult } from "~~/services/classification-agent/types";
import addUpload from "~~/src/actions/uploadActions";
import addUser, { getUser } from "~~/src/actions/userActions";
import type { User } from "~~/src/db/schema";

export default function Home() {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<any>(null);

  const handleUpload = async (imageFile: File, classificationResult: ClassificationResult) => {
    console.log(imageFile);

    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

    try {
      const user = await handleGetUser(address);
      if (!user) {
        return;
      }

      const blob = await handleUploadBlob(imageFile, address);
      if (!blob) {
        return;
      }

      const result = await handleUploadUserData(user, blob, classificationResult);
      if (!result) {
        setUploadResult(result);
        return;
      }
      return result;
    } catch (error) {
      console.error(error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageClassification = async (imageFile: File, imageElement: HTMLImageElement) => {
    try {
      const classificationResult = await classifyImage(imageElement, imageFile);
      const result = await handleUpload(imageFile, classificationResult);
      if (!result) {
        return;
      }
      // call the check endpoint and pass the userAddress, classificationJson, and uploadId as a JSON body
      // Add a timeout to abort the request after 3 seconds
      const abortController = new AbortController();
      setTimeout(() => abortController.abort(), 2000);

      await fetch("/api/quest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userAddress: result.userId,
          classificationJson: classificationResult?.className || "",
          uploadId: result.id,
        }),
        signal: abortController.signal,
      });

      // redirect to details page
      router.push(`/details/${result.id}`);
    } catch (error) {
      console.error(error);
      setError("Failed to classify image. Please try again.");
    }
  };

  const handleRetry = () => {
    setBlob(null);
    setError(null);
    setProgress(0);
    setUploadResult(null);
  };

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundPattern />
      <div className="relative z-10 flex flex-col min-h-screen">
        <section className="flex-grow flex items-center justify-center px-4">
          <div className="flex flex-col justify-center max-w-md space-y-8">
            {!blob && !isUploading && !uploadResult && <PhotoCapture onImageCaptured={handleImageClassification} />}

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

            {blob && !uploadResult && (
              <div className="space-y-4">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  <Image src={blob.url || "/placeholder.svg"} alt="Captured image" fill className="object-cover" />
                </div>
                <Button onClick={handleRetry} className="w-full text-white">
                  Capture Another Image
                </Button>
              </div>
            )}

            {uploadResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Upload Successful!</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Your image has been uploaded and classified.</p>
                  <p>Redirecting to details page...</p>
                </CardContent>
              </Card>
            )}

            {address && <PendingQuests userAddress={address} />}
          </div>
        </section>
      </div>
    </div>
  );

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

  async function handleUploadUserData(user: User, newBlob: PutBlobResult, classificationResult: ClassificationResult) {
    try {
      console.log("Uploading user data");
      const uploadResult = await addUpload({
        userId: user.id,
        classificationJson: classificationResult?.className || "",
        imageUrl: newBlob.url,
        metadata: "Spring Birds",
        status: "pending",
        location: [0, 0],
        season: "spring",
        createdAt: new Date(),
        photoTakenAt: new Date(),
        updatedAt: new Date(),
        questId: user.id,
      });

      console.log(uploadResult);
      return uploadResult;
    } catch (error) {
      console.error(error);
      setError("Failed to process upload. Please try again.");

      return null;
    }
  }
}
