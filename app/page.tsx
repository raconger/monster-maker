"use client";

import { useState } from "react";
import ImageUpload from "@/components/ImageUpload";
import MonsterDisplay from "@/components/MonsterDisplay";
import Model3DViewer from "@/components/Model3DViewer";

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [monsterImage, setMonsterImage] = useState<string | null>(null);
  const [model3D, setModel3D] = useState<string | null>(null);
  const [isTransforming, setIsTransforming] = useState(false);
  const [isGenerating3D, setIsGenerating3D] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (imageData: string) => {
    setUploadedImage(imageData);
    setMonsterImage(null);
    setModel3D(null);
    setError(null);
    setIsTransforming(true);

    try {
      // Start transformation (returns immediately with prediction ID)
      const response = await fetch("/api/transform", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error("Failed to start transformation");
      }

      const data = await response.json();
      console.log('Transform started:', data);

      // Poll for results
      await pollForResult(data.predictionId);
    } catch (err: any) {
      setError(err.message);
      setIsTransforming(false);
    }
  };

  const pollForResult = async (predictionId: string) => {
    const maxAttempts = 60; // Max 2 minutes (60 * 2 seconds)
    let attempts = 0;

    const poll = async () => {
      try {
        const response = await fetch(`/api/status?id=${predictionId}`);

        if (!response.ok) {
          throw new Error("Failed to check status");
        }

        const data = await response.json();
        console.log('Status check:', data.status);

        if (data.status === 'succeeded') {
          console.log('Monster URL:', data.output);
          setMonsterImage(data.output);
          setIsTransforming(false);
        } else if (data.status === 'failed') {
          throw new Error(data.error || 'Transformation failed');
        } else if (attempts < maxAttempts) {
          // Still processing - check again in 2 seconds
          attempts++;
          setTimeout(poll, 2000);
        } else {
          throw new Error('Transformation timed out');
        }
      } catch (err: any) {
        setError(err.message);
        setIsTransforming(false);
      }
    };

    // Start polling
    poll();
  };

  const generate3DModel = async (imageUrl: string) => {
    setIsGenerating3D(true);
    try {
      const response = await fetch("/api/generate-3d", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: imageUrl }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate 3D model");
      }

      const data = await response.json();
      console.log('3D API response:', data);
      // Trellis returns model_file in the output
      const modelUrl = data.output?.model_file || data.output;
      console.log('Model URL:', modelUrl);
      setModel3D(modelUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating3D(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <main className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Monster Maker
          </h1>
          <p className="text-xl text-gray-300">
            Transform any image into a terrifying creature
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Upload Section */}
          <div className="space-y-6">
            <ImageUpload onImageUpload={handleImageUpload} />

            {uploadedImage && (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold mb-3">Original Image</h3>
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500 rounded-lg p-4">
                <p className="text-red-400">{error}</p>
              </div>
            )}

            <MonsterDisplay
              monsterImage={monsterImage}
              isTransforming={isTransforming}
            />

            {monsterImage && (
              <Model3DViewer
                modelUrl={model3D}
                isGenerating={isGenerating3D}
                monsterImage={monsterImage}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
