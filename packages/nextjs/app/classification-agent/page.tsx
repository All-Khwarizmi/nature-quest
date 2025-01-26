'use client';

import { useEffect, useState } from "react";
import { classifyImage } from "~~/services/classification-agent";
import { BackgroundPattern } from "~~/components/background-pattern";

export default function TestPage() {
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function runTest() {
      console.log('we are trying the test now')
      try {
        // 1. Get the file
        const response = await fetch('/white-oak-tree.jpg');
        console.log('Fetch response:', response);

        const blob = await response.blob();
        const file = new File([blob], 'white-oak-tree.jpg', { type: 'image/jpeg' });

        // 2. Create HTMLImageElement
        const img = new Image();
        img.src = URL.createObjectURL(file);
        console.log('img src ', img.src);

        // 3. Wait for image to load
        await new Promise((resolve) => {
          img.onload = resolve;
        });

        // 4. Run classification
        const classification = await classifyImage(img, file);
        console.log('classification is ', classification)
        setResult(JSON.stringify(classification));

        // 5. Cleanup
        URL.revokeObjectURL(img.src);
      } catch (error) {
        console.error('Test failed:', error);
        setError(error instanceof Error ? error.message : 'Classification failed');
      }
    }

    runTest();
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundPattern />
      <div className="relative z-10 flex flex-col min-h-screen">
        <section className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="w-full items-center justify-center max-w-md space-y-8">
            <h1 className="text-2xl font-bold text-center">Classification Test</h1>
            
            {/* Show loading state */}
            {!result && !error && (
              <div className="text-center">Loading classification...</div>
            )}

            {/* Show result */}
            {result && (
              <div className="p-4 bg-white rounded-lg shadow">
                <h2 className="font-bold mb-2">Classification Result:</h2>
                <p>{result}</p>
              </div>
            )}

            {/* Show error if any */}
            {error && (
              <div className="p-4 bg-red-100 text-red-700 rounded-lg">
                <h2 className="font-bold mb-2">Error:</h2>
                <p>{error}</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}