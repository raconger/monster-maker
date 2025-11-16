# Monster Maker 👾

Transform any image into a terrifying creature with AI-powered image transformation and 3D model generation!

Inspired by the movie "Sketch" and similar to the Angel Labs app, Monster Maker lets you:
- Upload any image
- Transform it into a monster using AI
- Generate a 3D model for printing
- Download both the monster image and 3D model

## Features

- 🎨 **AI Image Transformation** - Uses Stable Diffusion XL to turn any image into a monster
- 🎭 **Animated Transformations** - Smooth animations during the creation process
- 🎲 **3D Model Generation** - Automatically creates a 3D model from your monster
- 🖨️ **3D Printing Ready** - Export GLB files for 3D printing
- 🎪 **Interactive 3D Viewer** - Rotate and inspect your monster in real-time

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **3D Rendering:** Three.js + React Three Fiber
- **AI Processing:** Replicate API
  - Image transformation: Stability AI SDXL
  - 3D generation: Stability AI Fast 3D

## Prerequisites

1. **Node.js** 18.x or higher
2. **Replicate API Key** (sign up at https://replicate.com)

## Setup Instructions

### 1. Get Your Replicate API Key

1. Go to https://replicate.com
2. Sign up for a free account
3. Navigate to https://replicate.com/account/api-tokens
4. Create a new API token
5. Copy the token (you'll need it in the next step)

**Cost Estimate:**
- Image transformation: ~$0.02-0.05 per generation
- 3D model generation: ~$0.10-0.20 per model
- Free $5 credit to start

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and add your Replicate API key:
   ```
   REPLICATE_API_TOKEN=your_actual_api_token_here
   ```

### 4. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Usage

1. **Upload an Image**
   - Click "Choose File" or drag and drop an image
   - Any image works - faces, objects, landscapes, etc.

2. **Watch the Magic**
   - The app will automatically transform your image into a monster
   - This takes about 10-20 seconds

3. **View Your Monster**
   - See the transformed monster image
   - Download it if you like

4. **3D Model Generation**
   - A 3D model is automatically generated from your monster
   - This takes about 20-30 seconds

5. **Download & Print**
   - Download the GLB file
   - Import into your 3D slicer (Cura, PrusaSlicer, etc.)
   - Print your monster!

## Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial Monster Maker app"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Add your `REPLICATE_API_TOKEN` in the environment variables
   - Deploy!

3. **Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add: `REPLICATE_API_TOKEN` with your API key
   - Redeploy if needed

## Project Structure

```
monster-maker/
├── app/
│   ├── api/
│   │   ├── transform/       # Monster transformation API route
│   │   └── generate-3d/     # 3D model generation API route
│   ├── page.tsx             # Main page
│   └── layout.tsx           # Root layout
├── components/
│   ├── ImageUpload.tsx      # Drag-and-drop image upload
│   ├── MonsterDisplay.tsx   # Monster image display with animations
│   └── Model3DViewer.tsx    # 3D model viewer with Three.js
├── .env.local               # Your API keys (not committed)
└── .env.example             # Example environment file
```

## How It Works

### Image Transformation
1. User uploads an image
2. Image is sent to Replicate API
3. Stability AI SDXL transforms it using the prompt: "terrifying monster creature, scary detailed monster design..."
4. Transformed image is displayed with animations

### 3D Generation
1. Monster image is sent to Replicate API
2. Stability AI Fast 3D converts the 2D image to a 3D model
3. Returns a GLB file (3D model format)
4. Displayed in interactive Three.js viewer

### Export for 3D Printing
1. Download the GLB file
2. Import into your 3D slicer software
3. Configure print settings (supports, infill, etc.)
4. Print your monster!

## Customization

### Adjust Monster Style
Edit `app/api/transform/route.ts` and modify the prompts:
```typescript
prompt: "your custom monster style prompt here",
negative_prompt: "what to avoid",
```

### Change 3D Settings
Edit `app/api/generate-3d/route.ts`:
```typescript
foreground_ratio: 0.85,  // Adjust foreground extraction
texture_resolution: 1024, // Higher = better quality, slower
```

## Troubleshooting

### "Failed to transform image"
- Check that your `REPLICATE_API_TOKEN` is set correctly in `.env.local`
- Ensure you have credits in your Replicate account
- Check console for detailed error messages

### 3D Model Not Loading
- Ensure the GLB URL is valid
- Check browser console for CORS or loading errors
- Try refreshing the page

### Slow Generation
- Image transformation: 10-30 seconds (normal)
- 3D generation: 20-60 seconds (normal)
- Slower on first use (model cold start)

## Future Enhancements

- [ ] Multiple monster styles (zombie, alien, demon, etc.)
- [ ] Adjust transformation strength slider
- [ ] Automatic STL conversion (currently GLB)
- [ ] Gallery of created monsters
- [ ] Share monsters on social media
- [ ] Batch processing
- [ ] Custom prompt input

## License

MIT

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Replicate](https://replicate.com/)
- [Three.js](https://threejs.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [Tailwind CSS](https://tailwindcss.com/)

Inspired by the movie "Sketch" and similar creature generation apps.

---

**Have fun creating monsters!** 👹🎨🖨️
