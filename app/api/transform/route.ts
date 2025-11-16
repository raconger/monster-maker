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

    // Handle streaming output - the output is an array containing a stream
    let imageUrl: string;

    if (Array.isArray(output) && output[0] && typeof output[0][Symbol.asyncIterator] === 'function') {
      // Stream is inside array - collect all chunks
      const chunks: Uint8Array[] = [];
      for await (const chunk of output[0]) {
        if (chunk instanceof Uint8Array) {
          chunks.push(chunk);
        }
      }

      // Combine chunks into a single buffer
      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      // Convert to base64 data URL
      const base64 = Buffer.from(combined).toString('base64');
      imageUrl = `data:image/png;base64,${base64}`;
    } else if (output && typeof output[Symbol.asyncIterator] === 'function') {
      // Direct stream
      const chunks: Uint8Array[] = [];
      for await (const chunk of output) {
        if (chunk instanceof Uint8Array) {
          chunks.push(chunk);
        }
      }

      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      const base64 = Buffer.from(combined).toString('base64');
      imageUrl = `data:image/png;base64,${base64}`;
    } else if (Array.isArray(output)) {
      // Direct array of URLs
      imageUrl = output[0];
    } else {
      // Single URL
      imageUrl = output;
    }

    console.log('Processed image URL type:', typeof imageUrl, imageUrl?.substring(0, 100));
    return NextResponse.json({ output: imageUrl });
  } catch (error: any) {
    console.error('Error transforming image:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to transform image' },
      { status: 500 }
    );
  }
}
