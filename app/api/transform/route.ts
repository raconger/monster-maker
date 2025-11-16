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

    // Use SDXL with a monster-themed prompt
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          image: image,
          prompt: "terrifying monster creature, scary detailed monster design, horror art, creature concept art, dark fantasy, highly detailed, dramatic lighting, digital art",
          negative_prompt: "human, person, realistic photo, blurry, low quality, distorted",
          num_inference_steps: 25,
          guidance_scale: 7.5,
          strength: 0.75,
        }
      }
    );

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error('Error transforming image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to transform image' },
      { status: 500 }
    );
  }
}
