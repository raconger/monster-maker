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
        prompt: "A 3D stop-motion puppet of a striped orange and brown creature with large toothy mouth and small arms, handcrafted practical effects style, vintage Jim Henson creature workshop aesthetic, weathered fabric texture with visible stitching, aged papier-mâché surface with scuffs and patina, theatrical warm lighting with strong amber rim light, painterly background in rust orange and yellow ochre tones, bokeh depth of field, Laika Studios Coraline style, tangible handmade puppet quality, dramatic shadows, maintains simple childlike design with dimensional depth, practical puppet photography, 4K",
        negative_prompt: "smooth, clean, CGI, Pixar, digital render, shiny plastic, new, pristine, photorealistic, highly detailed, complex, modern 3D animation, polished, sleek, Disney style, bright lighting, cold colors",
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
