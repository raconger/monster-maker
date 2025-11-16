"use client";

import { Suspense, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";

interface Model3DViewerProps {
  modelUrl: string | null;
  isGenerating: boolean;
  monsterImage: string;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);

  useEffect(() => {
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
  }, [scene]);

  return <primitive object={scene} scale={1.5} />;
}

export default function Model3DViewer({
  modelUrl,
  isGenerating,
  monsterImage,
}: Model3DViewerProps) {
  const [stlUrl, setStlUrl] = useState<string | null>(null);

  useEffect(() => {
    if (modelUrl && typeof modelUrl === "object" && "glb_url" in modelUrl) {
      // Extract GLB URL from Replicate output
      const glbUrl = (modelUrl as any).glb_url;
      if (glbUrl) {
        fetchAndConvertToSTL(glbUrl);
      }
    } else if (typeof modelUrl === "string" && modelUrl.endsWith(".glb")) {
      fetchAndConvertToSTL(modelUrl);
    }
  }, [modelUrl]);

  const fetchAndConvertToSTL = async (glbUrl: string) => {
    try {
      // For MVP, we'll provide the GLB for download
      // In production, you'd convert GLB to STL here
      setStlUrl(glbUrl);
    } catch (error) {
      console.error("Error processing 3D model:", error);
    }
  };

  const getModelUrl = () => {
    if (!modelUrl) return null;
    if (typeof modelUrl === "string") return modelUrl;
    if (typeof modelUrl === "object" && "glb_url" in modelUrl) {
      return (modelUrl as any).glb_url;
    }
    return null;
  };

  const actualModelUrl = getModelUrl();

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 min-h-[400px]">
      <AnimatePresence mode="wait">
        {isGenerating ? (
          <motion.div
            key="generating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-16"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <motion.div
                className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
              <motion.div
                className="absolute inset-4 border-4 border-blue-500 border-b-transparent rounded-full"
                animate={{ rotate: -360 }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Generating 3D Model...
            </h3>
            <p className="text-gray-400">
              Creating a printable 3D model from your monster
            </p>
          </motion.div>
        ) : actualModelUrl ? (
          <motion.div
            key="model"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">3D Model Preview</h3>
            <div className="h-[400px] rounded-lg overflow-hidden bg-gray-900">
              <Canvas
                camera={{ position: [0, 0, 5], fov: 50 }}
                shadows
              >
                <Suspense fallback={null}>
                  <ambientLight intensity={0.5} />
                  <spotLight
                    position={[10, 10, 10]}
                    angle={0.15}
                    penumbra={1}
                    intensity={1}
                    castShadow
                  />
                  <pointLight position={[-10, -10, -10]} intensity={0.5} />
                  <Model url={actualModelUrl} />
                  <OrbitControls
                    enableZoom={true}
                    enablePan={true}
                    enableRotate={true}
                  />
                  <Environment preset="sunset" />
                </Suspense>
              </Canvas>
            </div>
            <div className="flex gap-4">
              {stlUrl && (
                <a
                  href={stlUrl}
                  download="monster-3d-model.glb"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all text-center"
                >
                  Download 3D Model (GLB)
                </a>
              )}
            </div>
            <p className="text-sm text-gray-400 text-center">
              Use the GLB file for 3D printing. Import into your slicer software
              (Cura, PrusaSlicer, etc.)
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 py-16"
          >
            <p className="text-lg">3D model will appear here...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
