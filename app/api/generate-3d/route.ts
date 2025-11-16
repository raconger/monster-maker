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

    // Use Stable Fast 3D for image-to-3D generation
    const output = await replicate.run(
      "stabilityai/stable-fast-3d:5aa0cf8000bdac54e9f36fa5bb19d4c4c7f6bea76da5f5bd8e00cd9f1457df9b",
      {
        input: {
          image: image,
          foreground_ratio: 0.85,
          texture_resolution: 1024,
          remesh: "none"
        }
      }
    );

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error('Error generating 3D model:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate 3D model' },
      { status: 500 }
    );
  }
}
