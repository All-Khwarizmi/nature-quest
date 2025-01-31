"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTokenBalance } from "~~/app/_components/hooks/use-token-balance";
import { Confetti } from "~~/components/confetti";
import { TokenEarnedModal } from "~~/components/token-earned-modal";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/alert";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";

type PlantClassification = {
  category: string;
  confidence: number;
  description: string;
  isNature: boolean;
  species?: string | undefined;
};

type Upload = {
  id: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string;
  questId: string | null;
  imageUrl: string;
  classificationJson: PlantClassification;
  status: string;
  location: [number, number] | null;
  season: string | null;
  photoTakenAt: Date | null;
  metadata: unknown;
};

export default function SpeciesDetailPage({ params }: { params: { slug: string } }) {
  const [uploadData, setUploadData] = useState<Upload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const { showConfetti, showModal, earnedTokens, closeModal } = useTokenBalance();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/uploads/${params.slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch upload data");
        }
        const data: Upload = await response.json();
        setUploadData(data);
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load species data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.slug]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (uploadData && uploadData.status === "pending") {
      intervalId = setInterval(async () => {
        try {
          console.log("checking if the upload has finished");
          const response = await fetch(`/api/uploads/${params.slug}`);
          if (!response.ok) {
            throw new Error("Failed to fetch updated status");
          }
          const updatedData: Upload = await response.json();

          if (updatedData.status !== uploadData.status) {
            setUploadData(updatedData);
          }
        } catch (error) {
          console.error("Failed to check status:", error);
        }
      }, 5000); // Check every 5 seconds
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [uploadData, params.slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !uploadData) {
    return (
      <div className="container px-4 py-8 pt-24">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error || "Species not found"}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      {showConfetti && <Confetti />}
      <TokenEarnedModal isOpen={showModal} onClose={closeModal} earnedTokens={earnedTokens} />
      <div className="container px-4 py-8 pt-24">
        <div className="max-w-4xl mx-auto">
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-8">
            <Image
              src={uploadData.imageUrl || "/placeholder.svg"}
              alt="Captured species"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h1 className="text-3xl font-bold text-[#2C5530] mb-2">
                {uploadData.classificationJson.species || "Unknown Species"}
              </h1>
              <p className="text-[#90EE90] text-lg mb-4">
                Confidence: {uploadData.classificationJson.confidence.toFixed(2)}%
              </p>

              <Card>
                <CardHeader>
                  <CardTitle>Classification Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Category:</strong> {uploadData.classificationJson.category}
                  </p>
                  <p>
                    <strong>Description:</strong> {uploadData.classificationJson.description}
                  </p>
                  {uploadData.season && (
                    <p>
                      <strong>Season:</strong> {uploadData.season}
                    </p>
                  )}
                  {uploadData.location && (
                    <p>
                      <strong>Location:</strong> {uploadData.location[0].toFixed(6)},{" "}
                      {uploadData.location[1].toFixed(6)}
                    </p>
                  )}
                  {uploadData.photoTakenAt && (
                    <p>
                      <strong>Photo Taken:</strong> {new Date(uploadData.photoTakenAt).toLocaleString()}
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge
                    variant={
                      uploadData.status === "approved"
                        ? "approved"
                        : uploadData.status === "rejected"
                          ? "destructive"
                          : "default"
                    }
                    className="text-sm"
                  >
                    {uploadData.status.charAt(0).toUpperCase() + uploadData.status.slice(1)}
                  </Badge>
                  {uploadData.status === "pending" && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Pending Reward</AlertTitle>
                      <AlertDescription>
                        Your upload is being processed. Please check back later for your reward status.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              {uploadData.questId && (
                <Card>
                  <CardHeader>
                    <CardTitle>Quest Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>
                      <strong>Quest ID:</strong> {uploadData.questId}
                    </p>
                    {/* Add more quest-related information here if available */}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Button onClick={() => router.push("/")} variant="outline">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
