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

export default function Home() {
  // Get the user's wallet address and connection status
  const { address, isConnected } = useAccount();

  // State to store the uploaded image blob
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const handleUpload = async (imageFile: File) => {
    console.log(imageFile);

    if (!isConnected || !address) {
      setError("Please connect your wallet first");
      return;
    }

    setIsUploading(true);
    setError(null);
    setProgress(0);

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

      setBlob(newBlob);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle the image capture event
  const handleImageClassification = async (imageFile: File, imageElement: HTMLImageElement) => {
    // Pass to next module (MobileNet, upload, etc.)
    handleUpload(imageFile);
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
                <Button onClick={handleRetry} className="w-full">
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
}
