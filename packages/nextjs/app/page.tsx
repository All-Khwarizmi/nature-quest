"use client";

import Image from "next/image";
import useHomeState from "./_components/hooks/use-home-state";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { BackgroundPattern } from "~~/components/background-pattern";
import { PendingQuests } from "~~/components/pending-quests";
import { PhotoCapture } from "~~/components/photo-capture";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/alert";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Progress } from "~~/components/ui/progress";

export default function Home() {
  const { address } = useAccount();

  const {
    data: { blob, uploadResult, progress, error, isProcessing, processingStep },
    functions: { handleImageClassification, handleRetry },
  } = useHomeState();

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundPattern />
      <div className="relative z-10 flex flex-col min-h-screen">
        <section className="flex-grow flex items-center justify-center px-4">
          <div className="flex flex-col justify-center max-w-md space-y-8">
            {!blob && !isProcessing && !uploadResult && <PhotoCapture onImageCaptured={handleImageClassification} />}

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

            {/* Always show processing state */}
            <div
              className={`text-center transition-opacity duration-300 ${isProcessing ? "opacity-100" : "opacity-0"}`}
            >
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-forest-green mb-2">{processingStep || "Processing..."}</p>
              {progress > 0 && <Progress value={progress} className="w-full" />}
            </div>

            {/* Always show error state */}
            <div className={`transition-opacity duration-300 ${error ? "opacity-100" : "opacity-0"}`}>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error || "An unexpected error occurred"}</AlertDescription>
              </Alert>
            </div>

            {address && <PendingQuests userAddress={address} />}
          </div>
        </section>
      </div>
    </div>
  );
}
