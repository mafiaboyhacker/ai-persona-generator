# AI Persona Generator 🎭

A modern web application for generating detailed AI personas with realistic images and interactive features.

## 🚀 Features

- **AI Persona Generation**: Create detailed character profiles with personality traits and backgrounds
- **Image Generation**: Generate realistic persona images using AI models
- **Interactive Gallery**: Browse and manage saved personas
- **Video Showcase**: Dynamic video presentation of AI personas
- **Download System**: Export personas as images, PDFs, or text files
- **Responsive Design**: Optimized for all devices

## 🛠 Tech Stack

- **Framework**: Next.js 15 with Turbopack
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion
- **3D Graphics**: Three.js & React Three Fiber
- **UI Components**: Radix UI
- **Icons**: Lucide React
- **PDF Generation**: jsPDF

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>
cd persona-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🌐 Deployment

This project is optimized for deployment on **Vercel**:

1. Connect your GitHub repository to Vercel
2. Configure environment variables if needed
3. Deploy automatically on every push

### Alternative Deployments

- **Netlify**: Static site deployment
- **AWS S3 + CloudFront**: Scalable cloud deployment
- **GitHub Pages**: Free static hosting

## 📁 Project Structure

```
persona-frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   └── sections/     # Page sections
│   ├── app/              # Next.js app directory
│   └── styles/           # Global styles
├── public/
│   ├── gallery/          # Persona images
│   └── videos/           # Demo videos (8.8MB total)
└── ...config files
```

## 🎯 Key Components

- **PersonaGeneratorSection**: Main persona creation interface
- **CodeDemoSection**: Interactive demo with video showcase
- **GalleryModal**: Persona management and viewing
- **DownloadSystem**: Multi-format export functionality

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```bash
# API Configuration (if needed)
NEXT_PUBLIC_API_URL=your_api_url
OPENAI_API_KEY=your_openai_key
FAL_AI_API_KEY=your_fal_ai_key
```

### Performance Optimizations

- ✅ Image optimization with WebP/AVIF formats
- ✅ Video lazy loading and compression
- ✅ CDN caching headers (1 year cache)
- ✅ CSS and JavaScript minification
- ✅ Gzip compression enabled

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎬 Video Assets

The project includes 3 demo videos:
- `bella_lipsync.mp4` (2.7MB) - 8 seconds
- `cinematic_closeup.mp4` (1.4MB) - 8 seconds  
- `lala.mp4` (4.8MB) - 4 seconds

Videos auto-rotate every 8/4 seconds in sequence.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/ai-persona-generator)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions, please open a GitHub issue or contact the development team.
