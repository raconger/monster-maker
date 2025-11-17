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
        prompt: "3D Pixar quality scary monster character, dark creepy CGI creature, haunting monster design with eerie presence, professional 3D horror character model, smooth stylized rendering with unsettling details, dramatic dark cinematic lighting with ominous shadows, mysterious foggy background in deep purples and blacks, shallow depth of field, Pixar-level CGI quality but scary and intimidating, menacing creature design, sinister expression, glowing eyes, sharp teeth, nightmare-inducing yet beautifully rendered, high-quality horror animation character, preserve exact head shape, maintain exact limb count and positions, enhance creepy features, preserve exact number of eyes but make them glow, dark fantasy creature not architecture",
        negative_prompt: "friendly, cute, whimsical, cheerful, bright colors, warm lighting, happy expression, cartoonish silly, comedic, childish, overly cute, friendly smile, realistic photo, human-like features, different anatomy, changed proportions, extra limbs, missing limbs, altered colors, different head shape, notebook, paper, flat drawing, 2D illustration, extra eyes, missing eyes, different eye count, text, letters, words, writing, architecture, building, structure, landscape, environment, object",
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
