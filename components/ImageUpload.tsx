"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface ImageUploadProps {
  onImageUpload: (imageData: string) => void;
}

export default function ImageUpload({ onImageUpload }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file");
      return;
    }

    setIsProcessing(true);

    // Compress image before upload (especially important for mobile photos)
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Create canvas for compression
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setIsProcessing(false);
            return;
          }

          // Calculate new dimensions (max 512px on longest side for better mobile compatibility)
          const maxSize = 512;
          let width = img.width;
          let height = img.height;

          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }

          // Resize and compress
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to base64 with aggressive compression (0.75 quality)
          let compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);

          // If still too large (>1MB), reduce quality further
          let quality = 0.75;
          while (compressedDataUrl.length > 1024 * 1024 && quality > 0.3) {
            quality -= 0.1;
            compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          }

          // Final size check
          const finalSizeKB = Math.round(compressedDataUrl.length / 1024);
          if (finalSizeKB > 1024) {
            setIsProcessing(false);
            alert(`Image is still too large (${finalSizeKB}KB). Please try a smaller image or screenshot instead of a camera photo.`);
            return;
          }

          console.log(`Image compressed: ${Math.round(file.size / 1024)}KB → ${finalSizeKB}KB (quality: ${Math.round(quality * 100)}%)`);

          setIsProcessing(false);
          onImageUpload(compressedDataUrl);
        } catch (error) {
          console.error('Error compressing image:', error);
          setIsProcessing(false);
          alert('Error processing image. Please try a different image.');
        }
      };
      img.onerror = () => {
        setIsProcessing(false);
        alert('Error loading image. Please try a different file.');
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-8 border-2 border-dashed border-gray-600 hover:border-purple-500 transition-colors"
    >
      <div
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`text-center ${isDragging ? "opacity-50" : ""}`}
      >
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-white mb-2">
            Upload an Image
          </h3>
          <p className="text-gray-400 mb-4">
            {isProcessing
              ? "Processing image..."
              : "Drag and drop your image here, or click to browse"}
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={isProcessing}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isProcessing}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isProcessing ? "Processing..." : "Choose File"}
        </button>
      </div>
    </motion.div>
  );
}
