"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/alert";
import { Badge } from "~~/components/ui/badge";
import { Button } from "~~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~~/components/ui/tabs";

interface UploadData {
  id: string;
  userId: string;
  questId?: string;
  imageUrl: string;
  classificationJson: {
    species: string;
    confidence: number;
  };
  status: "pending" | "approved" | "rejected";
  location?: [number, number];
  season?: string;
  photoTakenAt?: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
}

export default function SpeciesDetailPage({ params }: { params: { slug: string } }) {
  const [uploadData, setUploadData] = useState<UploadData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/uploads/${params.slug}`);
        if (!response.ok) {
          throw new Error("Failed to fetch upload data");
        }
        const data: UploadData = await response.json();
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
          const response = await fetch(`/api/uploads/${params.slug}`);
          if (!response.ok) {
            throw new Error("Failed to fetch updated status");
          }
          const updatedData: UploadData = await response.json();

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

          <div className="grid gap-8 md:grid-cols-3">
            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold text-[#2C5530] mb-2">{uploadData.classificationJson.species}</h1>
              <p className="text-[#90EE90] text-lg mb-4">
                Confidence: {uploadData.classificationJson.confidence.toFixed(2)}%
              </p>

              <Tabs defaultValue="details" className="w-full">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="metadata">Metadata</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="text-gray-700 leading-relaxed">
                  <p>
                    <strong>Status:</strong> {uploadData.status}
                  </p>
                  {uploadData.questId && (
                    <p>
                      <strong>Quest ID:</strong> {uploadData.questId}
                    </p>
                  )}
                  {uploadData.location && (
                    <p>
                      <strong>Location:</strong> {uploadData.location[0].toFixed(6)},{" "}
                      {uploadData.location[1].toFixed(6)}
                    </p>
                  )}
                  {uploadData.season && (
                    <p>
                      <strong>Season:</strong> {uploadData.season}
                    </p>
                  )}
                  {uploadData.photoTakenAt && (
                    <p>
                      <strong>Photo Taken:</strong> {new Date(uploadData.photoTakenAt).toLocaleString()}
                    </p>
                  )}
                </TabsContent>
                <TabsContent value="metadata" className="text-gray-700 leading-relaxed">
                  <pre>{JSON.stringify(uploadData.metadata, null, 2)}</pre>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Upload Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    <strong>Upload ID:</strong> {uploadData.id}
                  </p>
                  <p>
                    <strong>User ID:</strong> {uploadData.userId}
                  </p>
                  <p>
                    <strong>Created At:</strong> {new Date(uploadData.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Updated At:</strong> {new Date(uploadData.updatedAt).toLocaleString()}
                  </p>
                </CardContent>
              </Card>

              <div>
                <h2 className="font-semibold text-lg mb-2 text-[#2C5530]">Status</h2>
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
              </div>

              {uploadData.status === "pending" && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Pending Reward</AlertTitle>
                  <AlertDescription>
                    Your upload is being processed. Please check back later for your reward status.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </div>

          <div className="mt-8">
            <Button onClick={() => router.push("/")}>Back to Home</Button>
          </div>
        </div>
      </div>
    </main>
  );
}
