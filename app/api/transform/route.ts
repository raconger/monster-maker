import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Check if API token is configured
    if (!process.env.REPLICATE_API_TOKEN) {
      console.error('REPLICATE_API_TOKEN is not set');
      return NextResponse.json(
        { error: 'API configuration error - missing REPLICATE_API_TOKEN' },
        { status: 500 }
      );
    }

    console.log('Starting image transformation...');

    // Create prediction (non-blocking - returns immediately)
    const prediction = await replicate.predictions.create({
      version: "7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      input: {
        image: image,
        prompt: "single centered 3D monster character transformation, professional CGI creature render, creepy Tim Burton inspired design with Pixar quality CGI, one monster only centered in frame, clean neutral background, detailed 3D character model with high-quality textures, slightly eerie and unsettling creature design, gothic whimsical monster, twisted proportions with personality, expressive large eyes, professional animation-ready 3D render, cinematic lighting on character, soft shadows, beautifully rendered creepy monster, drawing brought to life in 3D, maintain original monster anatomy and features, preserve eye count and limb positions, single subject only, character-focused composition",
        negative_prompt: "multiple creatures, multiple characters, busy background, detailed environment, landscape, buildings, objects in background, flat 2D drawing, sketch lines, pencil marks, paper texture, overly cute, friendly smile, bright cheerful, realistic human, photograph, extra limbs beyond original, missing limbs, different head shape, text, words, letters, numbers, watermark, signature, multiple subjects, crowded composition, architecture, vehicles, props",
        num_inference_steps: 35,
        guidance_scale: 7.5,
        strength: 0.45,
      }
    });

    console.log('Prediction created:', prediction.id);

    // Return prediction ID immediately - frontend will poll for status
    return NextResponse.json({
      predictionId: prediction.id,
      status: prediction.status
    });
  } catch (error: any) {
    console.error('Error transforming image:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });

    // Return more detailed error for debugging
    const errorMessage = error.message || 'Failed to transform image';
    const detailedError = process.env.NODE_ENV === 'development'
      ? `${errorMessage} - ${error.stack}`
      : errorMessage;

    return NextResponse.json(
      { error: detailedError },
      { status: 500 }
    );
  }
}
