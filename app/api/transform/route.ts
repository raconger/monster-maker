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
        prompt: "Tim Burton style monster character, gothic nightmare creature design, twisted dark fantasy character inspired by Nightmare Before Christmas and Corpse Bride, haunting stop-motion aesthetic in 3D CGI, exaggerated proportions with elongated limbs and large expressive eyes, skeletal features with stitched details, melancholic eerie atmosphere, gothic horror art style, striped patterns and twisted spirals, pale ghostly skin tones with deep shadows, macabre whimsical design, Burton-esque creature with unsettling charm, professional 3D gothic character rendering, dark moody cinematic lighting with rim lights, spooky graveyard atmosphere with purple and black tones, high contrast shadows, beautifully creepy and artistic, preserve exact head shape, maintain exact limb count and positions but elongate them, preserve exact number of eyes but make them large and soulful, gothic monster not architecture",
        negative_prompt: "friendly smile, cheerful, bright happy colors, warm sunny lighting, overly cute, Disney princess style, anime style, realistic photo, human-like proportions, normal anatomy, bright colorful, comedic silly, different anatomy structure, extra limbs, missing limbs, completely different head shape, notebook, paper, flat drawing, 2D illustration, extra eyes beyond original count, missing eyes, different eye count, text, letters, words, writing, architecture, building, structure, landscape, environment, object, Pixar style, smooth rounded shapes",
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
