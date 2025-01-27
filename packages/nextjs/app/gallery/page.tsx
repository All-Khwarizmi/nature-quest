"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useAccount } from "wagmi";
import { GalleryGrid } from "~~/components/gallery-grid";
import { Alert, AlertDescription, AlertTitle } from "~~/components/ui/alert";
import { getUploadsByUserId } from "~~/src/actions/uploadActions";
import type { Upload } from "~~/src/db/schema";

export default function GalleryPage() {
  const { address, isConnected } = useAccount();
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isConnected && address) {
      const fetchUploads = async () => {
        if (!address) return;

        setIsLoading(true);
        setError(null);
        try {
          const fetchedUploads = await getUploadsByUserId(address);
          setUploads(fetchedUploads);
        } catch (err) {
          setError("Failed to fetch uploads. Please try again later.");
          console.error("Error fetching uploads:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUploads();
    }
  }, [address, isConnected]);

  if (!isConnected) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2C5530] mb-6">Please connect your wallet to view your gallery</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container px-4 py-8 pt-24">
        <h1 className="text-2xl font-bold text-[#2C5530] mb-6">Your Upload Gallery</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-[#2C5530]" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : uploads.length === 0 ? (
          <p className="text-center text-gray-500">You haven&apos;t uploaded any images yet.</p>
        ) : (
          <GalleryGrid uploads={uploads} />
        )}
      </div>
    </main>
  );
}
