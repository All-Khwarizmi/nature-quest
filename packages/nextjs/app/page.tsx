"use client";

import Image from "next/image";
import useHomeState from "./_components/hooks/use-home-state";
import { AlertCircle, Loader2 } from "lucide-react";
import Confetti from "react-confetti";
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
    data: { blob, uploadResult, progress, error, isProcessing, processingStep, classificationResult, showConfetti },
    functions: { handleImageClassification, handleRetry, handleRedirectToDetails },
  } = useHomeState();

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundPattern />
      {showConfetti && <Confetti />}
      <div className="relative z-10 flex flex-col min-h-screen">
        <section className="flex-grow flex items-center justify-center px-4">
          <div className="flex flex-col justify-center max-w-md space-y-8 py-4 pb-8">
            {!blob && !isProcessing && !uploadResult && <PhotoCapture onImageCaptured={handleImageClassification} />}

            {(blob || isProcessing || uploadResult) && (
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>{processingStep || "Image Capture"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {blob && (
                    <div className="relative aspect-square rounded-lg overflow-hidden">
                      <Image src={blob.url || "/placeholder.svg"} alt="Captured image" fill className="object-cover" />
                    </div>
                  )}

                  {isProcessing && (
                    <div className="text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                      <p className="text-forest-green mb-2">{processingStep || "Processing..."}</p>
                      {progress > 0 && <Progress value={progress} className="w-full" />}
                    </div>
                  )}

                  {classificationResult && (
                    <div className="space-y-2">
                      <h3 className="font-semibold">Classification Result:</h3>
                      <p>Species: {classificationResult.species}</p>
                      <p>Confidence: {classificationResult.confidence.toFixed(2)}%</p>
                      <p>Category: {classificationResult.category}</p>
                      <p>{classificationResult.description}</p>
                    </div>
                  )}

                  {uploadResult && (
                    <>
                      <p>Your image has been uploaded and classified successfully!</p>
                    </>
                  )}

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {!isProcessing && uploadResult && (
                    <Button onClick={handleRedirectToDetails} className="w-full text-white">
                      View Details
                    </Button>
                  )}
                  {!isProcessing && (
                    <Button onClick={handleRetry} className="w-full text-white">
                      Capture Another Image
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {address && <PendingQuests userAddress={address} />}
          </div>
        </section>
      </div>
    </div>
  );
}
