import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const { image } = await req.json();
    console.log('Received image for 3D generation:', typeof image, image);

    if (!image) {
      return NextResponse.json(
        { error: 'No image provided' },
        { status: 400 }
      );
    }

    // Use Trellis for image-to-3D generation
    const output = await replicate.run(
      "firtoz/trellis:e8f6c45206993f297372f5436b90350817bd9b4a0d52d2a76df50c1c8afa2b3c",
      {
        input: {
          images: [image],
          texture_size: 1024,
          generate_model: true
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
