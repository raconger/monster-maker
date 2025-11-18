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
        prompt: "A 3D stop-motion puppet creature brought to life from a child's creepy crayon drawing, sinister and twisted, unsettling handcrafted monster, vintage Jim Henson creature workshop aesthetic with disturbing edge, weathered fabric texture with visible stitching, aged papier-mâché surface with scuffs and patina, theatrical warm lighting with strong amber rim light, background looks like chalk and crayon drawn corner of a child's bedroom with simple sketchy walls and floor, crayon texture background art, bokeh depth of field, Laika Studios Coraline meets dark twisted children's art, tangible handmade puppet quality, dramatic ominous shadows, simple childlike crayon drawing design brought to creepy 3D life in sinister twisted manner, eerie presence, practical puppet photography, 4K",
        negative_prompt: "smooth, clean, CGI, Pixar, digital render, shiny plastic, new, pristine, photorealistic, highly detailed, complex, modern 3D animation, polished, sleek, Disney style, bright lighting, cold colors, friendly, cute, cheerful",
        num_inference_steps: 35,
        guidance_scale: 7.5,
        strength: 0.8,
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
