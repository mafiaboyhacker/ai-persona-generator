# AI Persona Generator - Next.js Edition

A cutting-edge AI-powered persona generation platform built with the latest web technologies, featuring a Langflow-inspired neon-dark design.

## 🚀 Tech Stack

- **Frontend**: Next.js 15.3.5 with App Router
- **Styling**: Tailwind CSS v4 + shadcn
- **Animations**: Framer Motion
- **UI Components**: Radix Primitives
- **Backend**: Next.js API Routes (No separate backend)
- **AI Models**: OpenAI GPT-4o-mini + Replicate FLUX 1.1 Pro
- **Deployment**: Railway.app with GitHub auto-deployment

## ✨ Features

- **🧠 Advanced AI**: Powered by GPT-4o-mini and FLUX 1.1 Pro for highest quality
- **⚡ Lightning Fast**: Generate detailed personas in under 30 seconds
- **🎨 Stunning Design**: Langflow-inspired neon-dark theme with glassmorphism
- **📱 Responsive**: Perfect on desktop, tablet, and mobile
- **🎭 Unlimited Customization**: Control every aspect of persona generation
- **💾 Export & Share**: Download as PDF/JSON or share via unique links
- **🔧 Developer-Friendly**: Modern TypeScript codebase with excellent DX

## 🏗️ Project Structure

```
persona-frontend/
├── src/
│   ├── app/
│   │   ├── globals.css          # Global styles with Langflow theme
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Main page
│   ├── components/
│   │   ├── sections/            # Page sections
│   │   │   ├── hero-section.tsx
│   │   │   ├── persona-generator-section.tsx
│   │   │   ├── code-demo-section.tsx
│   │   │   ├── features-section.tsx
│   │   │   ├── testimonials-section.tsx
│   │   │   └── cta-section.tsx
│   │   └── ui/                  # Reusable UI components
│   │       ├── glass-card.tsx
│   │       ├── neon-button.tsx
│   │       └── ... (shadcn/ui components)
│   └── lib/
│       └── utils.ts             # Utility functions
├── public/                      # Static assets
└── ... (config files)
```

## 🎨 Design System

### Colors
- **Primary**: Purple (#8B5CF6) to Teal (#10B981) gradient
- **Background**: Pure black (#000000)
- **Glass Effects**: RGBA with backdrop-filter blur
- **Accents**: Pink (#EC4899), Blue (#3B82F6), Orange (#F97316)

### Components
- **Glass Cards**: Advanced glassmorphism with backdrop-filter
- **Neon Buttons**: Multiple variants with glow effects
- **Typography**: Geist Sans font family
- **Animations**: Smooth Framer Motion transitions

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mafiaboyhacker/ai-persona-generator.git
   cd ai-persona-generator/persona-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Environment Variables
Create a `.env.local` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
REPLICATE_API_TOKEN=your_replicate_api_token_here
```

## 📦 API Integration

The application uses Next.js API Routes for:
- AI persona generation via OpenAI GPT-4o-mini
- Image generation via Replicate FLUX 1.1 Pro
- Real-time processing and response handling

API endpoint: `/api/generate-complete-persona`

## 🛠️ Development Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 🚀 Deployment

### Railway.app (Current)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard:
   - `OPENAI_API_KEY`
   - `REPLICATE_API_TOKEN`
3. Deploy automatically on git push

### Manual Deployment
```bash
npm run build
npm start
```

## 🎯 Performance

- **Lighthouse Score**: 90+ (mobile), 95+ (desktop)
- **Core Web Vitals**: Optimized for speed
- **Bundle Size**: Optimized with dynamic imports
- **SEO**: Meta tags and semantic HTML

## 🔧 Customization

### Adding New Sections
1. Create component in `src/components/sections/`
2. Import and add to `src/app/page.tsx`
3. Follow existing patterns for consistency

### Styling
- Use Tailwind classes for consistency
- Custom CSS variables in `globals.css`
- Follow the established design tokens

### Components
- Extend shadcn/ui components as needed
- Maintain glass-card and neon-button patterns
- Use Framer Motion for animations

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Join our community discussions

---

Built with ❤️ using Next.js 15 and modern web technologies.