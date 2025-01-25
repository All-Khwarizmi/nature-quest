"use client";

import { useCallback } from "react";
import { Button } from "./ui/button";
import { Camera } from "lucide-react";

interface PhotoCaptureProps {
  onImageCaptured: (image: HTMLImageElement) => void;
}

export function PhotoCapture({ onImageCaptured }: PhotoCaptureProps) {
  const createImageFromFile = useCallback((file: File) => {
    return new Promise<HTMLImageElement>(resolve => {
      const reader = new FileReader();
      reader.onload = e => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleCapture = useCallback(() => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const image = await createImageFromFile(file);
        onImageCaptured(image);
      }
    };

    input.click();
  }, [onImageCaptured, createImageFromFile]);

  return (
    <div className="w-full aspect-square flex items-center justify-center">
      <Button
        size="lg"
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
