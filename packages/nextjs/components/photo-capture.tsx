"use client";

import { useCallback, useRef } from "react";
import type React from "react";
import { Button } from "./ui/button";
import { Camera } from "lucide-react";

interface PhotoCaptureProps {
  onImageCaptured: (image: File) => void;
}

export function PhotoCapture({ onImageCaptured }: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleCapture = useCallback(() => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];

      if (file) {
        const MAX_FILE_SIZE = 1024 * 1024 * 4.5; // 4.5 MB
        const exceedsMaxSize = file.size > MAX_FILE_SIZE;

        if (exceedsMaxSize) {
          console.error("File size exceeds the maximum limit of 4.5 MB");
          alert("File size exceeds the maximum limit of 4.5 MB");
          return;
        }

        onImageCaptured(file);
      } else {
        console.error("No file selected");
        alert("No file selected");
      }
    },
    [onImageCaptured],
  );

  return (
    <div className="w-full aspect-square flex items-center justify-center">
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
      <Button
        className="w-32 h-32 rounded-full bg-forest-green hover:bg-deep-forest transition-all duration-300 hover:scale-105 shadow-lg group relative overflow-hidden"
        onClick={handleCapture}
      >
        <div className="absolute inset-1 rounded-full bg-leaf-green/10 group-hover:bg-leaf-green/20 transition-colors" />
        <Camera className="w-12 h-12 text-clean-white" />
        <span className="sr-only">Take Photo</span>
      </Button>
    </div>
  );
}
