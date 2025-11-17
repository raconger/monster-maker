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
        prompt: "dark sinister monster character, deeply unsettling creature design, nightmare fuel, Tim Burton meets Trent Reznor aesthetic, disturbing and eerie, haunting presence, menacing expression, soulless dark eyes, twisted grotesque features, macabre horror character, ominous and foreboding, shadowy creature, psychological horror monster, deeply creepy, nightmare creature, single monster only, solid black background, minimalist but terrifying, simple dark shapes with malevolent personality, gothic horror illustration, industrial darkness, fear-inducing design, isolated predator on dark backdrop",
        negative_prompt: "cute, friendly, warm, inviting, cheerful, bright, colorful, whimsical, playful, cartoonish, silly, charming, endearing, multiple creatures, busy background, patterns, textures, environment, landscape, buildings, objects, props, detailed background, realistic photo, overly complex details, architectural elements, nature, plants, ground, floor, walls, decorative elements, text, words, letters, numbers, watermark, human, happy, smiling",
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
