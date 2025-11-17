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

    // Use SDXL with a monster-themed prompt
    const output: any = await replicate.run(
      "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
      {
        input: {
          image: image,
          prompt: "3D Pixar style monster character, CGI animated creature based on child's drawing, whimsical friendly monster design, soft stylized 3D rendering, professional character model with smooth shading, warm cinematic lighting with soft rim light, painterly background in warm earth tones, shallow depth of field, Disney Pixar movie quality rendering, charming creature design, maintains childlike simplicity with professional polish, expressive character, gentle shadows, rendered in high-quality CGI, 4K quality, animated film character aesthetic, preserve exact head shape, maintain exact limb count and positions, match original color scheme, preserve exact number of eyes, creature character not architecture",
          negative_prompt: "realistic, photorealistic, overly detailed, dark moody lighting, cold colors, sharp focus background, busy background, human-like features, terrifying, different anatomy, changed proportions, extra limbs, missing limbs, altered colors, different head shape, notebook, paper, flat drawing, 2D illustration, extra eyes, missing eyes, different eye count, text, letters, words, writing, architecture, building, structure, landscape, environment, object",
          num_inference_steps: 35,
          guidance_scale: 7.5,
          strength: 0.45,
        }
      }
    );

    console.log('SDXL raw output:', output);

    // Handle different output formats from Replicate
    let imageUrl: string;

    if (Array.isArray(output)) {
      // Array of URLs - take the first one
      imageUrl = output[0];
    } else if (typeof output === 'string') {
      // Direct URL string
      imageUrl = output;
    } else {
      throw new Error('Unexpected output format from Replicate');
    }

    console.log('Processed image URL:', imageUrl?.substring(0, 100));
    return NextResponse.json({ output: imageUrl });
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
