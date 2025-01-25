"use client";

import { useState } from "react";
import { type PutBlobResult, UploadProgressEvent } from "@vercel/blob";
import { upload } from "@vercel/blob/client";
import { useAccount } from "wagmi";
import { BackgroundPattern } from "~~/components/background-pattern";
import { PhotoCapture } from "~~/components/photo-capture";
import { QuestCard } from "~~/components/quest-card";

export default function Home() {
  // Get the user's wallet address and connection status
  const { address, isConnected } = useAccount();

  // State to store the uploaded image blob
  const [blob, setBlob] = useState<PutBlobResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<UploadProgressEvent | null>(null);

  const handleUpload = async (imageFile: File) => {
    console.log(imageFile);

    if (!isConnected || !address) alert("Please connect your wallet first");

    const newBlob = await upload(imageFile.name, imageFile, {
      access: "public",
      handleUploadUrl: "/api/image/upload",
      clientPayload: address,
      contentType: imageFile.type,
      onUploadProgress: progress => {
        console.log("Progress:", progress);
      },
    });

    setBlob(newBlob);
  };

  // Handle the image capture event
  const handleImageClassification = async (imageFile: File, imageElement: HTMLImageElement) => {
    // Pass to next module (MobileNet, upload, etc.)
    handleUpload(imageFile);
  };
  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundPattern />
      <div className="relative z-10 flex flex-col min-h-screen">
        <section className="flex-grow flex items-center justify-center px-4 pb-8">
          <div className="w-full items-center justify-center max-w-md space-y-8">
            <PhotoCapture onImageCaptured={handleImageClassification} />
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
