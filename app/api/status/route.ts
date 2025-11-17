import { NextRequest, NextResponse } from 'next/server';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function GET(req: NextRequest) {
  try {
    const predictionId = req.nextUrl.searchParams.get('id');

    if (!predictionId) {
      return NextResponse.json(
        { error: 'No prediction ID provided' },
        { status: 400 }
      );
    }

    // Get prediction status
    const prediction = await replicate.predictions.get(predictionId);

    console.log('Prediction status:', prediction.status, prediction.id);

    // Return status and output (if completed)
    if (prediction.status === 'succeeded') {
      let imageUrl: string;

      if (Array.isArray(prediction.output)) {
        imageUrl = prediction.output[0];
      } else if (typeof prediction.output === 'string') {
        imageUrl = prediction.output;
      } else {
        throw new Error('Unexpected output format from Replicate');
      }

      return NextResponse.json({
        status: 'succeeded',
        output: imageUrl
      });
    } else if (prediction.status === 'failed') {
      return NextResponse.json({
        status: 'failed',
        error: prediction.error || 'Prediction failed'
      }, { status: 500 });
    } else {
      // Still processing
      return NextResponse.json({
        status: prediction.status // 'starting' or 'processing'
      });
    }
  } catch (error: any) {
    console.error('Error checking prediction status:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check status' },
      { status: 500 }
    );
  }
}
