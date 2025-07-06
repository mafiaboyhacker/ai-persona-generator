# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a documentation repository for developing an AI Persona Profile Website. The project aims to create a web application that generates detailed AI persona profiles and corresponding images using OpenAI API and Fal.ai API integration.

## Repository Structure

```
AI Persona Profile Website Development Guide/
├── BellaLeePersona.txt              # Example persona profile in Korean
├── 기술 스택 조사 결과.md            # Technical stack research (Korean)
├── 시스템 프롬프트 개선 및 최적화.md  # System prompt optimization (Korean)
├── 웹사이트 디자인 분석.md            # Website design analysis (Korean)
├── 클로드 코드 사용 가이드_.md        # Claude Code usage guide (Korean)
├── 클로드 코드용 상세 프롬프트_.md    # Detailed prompts for Claude Code (Korean)
└── CLAUDE.md                        # This file
```

## Key Development Commands

Since this is a documentation repository, there are no build commands. However, when implementing the actual website based on this documentation, you'll need:

### For Web Development (based on documentation):
- `python server.py` - Run Flask backend server
- `python -m http.server` - Serve static files for frontend testing
- `pip install Flask Flask-CORS requests python-dotenv` - Install Python dependencies

### For Environment Setup:
- Create `.env` file with API keys:
  ```
  OPENAI_API_KEY=your_key_here
  FAL_AI_API_KEY=your_key_here
  ```

## Architecture Overview

The documented system follows a three-tier architecture:

1. **Frontend (Client-side)**:
   - HTML5 with responsive design
   - CSS3 with glassmorphism effects and dark theme
   - Vanilla JavaScript for API communication

2. **Backend (Server-side)**:
   - Flask-based Python server
   - RESTful API endpoints
   - Integration with OpenAI API and Fal.ai API

3. **AI Integration Layer**:
   - OpenAI API for text generation (persona profiles)
   - Fal.ai API with Flux 1.1 Pro for image generation
   - Structured prompt engineering for consistent outputs

## Key Components

### Persona Generation System
- **Input Processing**: Collects user preferences for persona type, style, traits, background, and visual preferences
- **Text Generation**: Uses OpenAI API with optimized system prompts to generate detailed persona profiles
- **Image Generation**: Converts persona descriptions into visual prompts for Fal.ai API
- **Output Formatting**: Renders markdown text and displays generated images

### Design System
- **Theme**: Dark theme with glassmorphism effects
- **Color Palette**: Deep backgrounds with vibrant gradient accents (purple, pink, orange)
- **Typography**: Modern sans-serif fonts with proper hierarchy
- **Layout**: Responsive design optimized for both desktop and mobile

### API Integration Strategy
- **Authentication**: Environment variable-based API key management
- **Error Handling**: Comprehensive error handling for API failures
- **Rate Limiting**: Consideration for API usage limits and costs
- **Data Flow**: Structured data exchange between frontend and backend

## Important File Contents

### `BellaLeePersona.txt`
Contains a comprehensive example of an AI persona profile including:
- Basic profile information
- Physical appearance and style characteristics
- Personality and psychological traits
- Background story and narrative elements
- Digital activity and content strategy
- Symbolic elements and archetypes

### System Prompt Optimization
The documentation includes an optimized system prompt structure for:
- Consistent persona profile generation
- Integration with image generation prompts
- Adherence to ethical guidelines
- Structured output formatting

## Development Guidelines

### When Working with This Documentation:
1. **Language Support**: Content is primarily in Korean - use translation tools if needed
2. **API Integration**: Never expose API keys in client-side code
3. **Persona Quality**: Follow the detailed structure provided in `BellaLeePersona.txt`
4. **Design Consistency**: Implement the glassmorphism dark theme as specified
5. **Error Handling**: Implement comprehensive error handling for API failures

### Security Considerations:
- Store API keys in environment variables
- Implement proper CORS configuration
- Validate all user inputs
- Handle API rate limiting gracefully

### Performance Optimization:
- Implement loading states for API calls
- Consider image optimization for generated personas
- Use appropriate caching strategies for repeated requests

## Testing Strategy

When implementing based on this documentation:
1. Test API integrations separately before combining
2. Verify responsive design across different screen sizes
3. Test error handling scenarios (API failures, network issues)
4. Validate persona generation quality and consistency
5. Test image generation and display functionality

## Deployment Considerations

The documentation suggests deployment options:
- Static hosting for frontend (GitHub Pages, Vercel, Netlify)
- Serverless functions for backend (AWS Lambda, Vercel Functions)
- Environment variable management in production
- API cost monitoring and usage tracking

## File Encoding and Language

All Korean documentation files use UTF-8 encoding. The content covers:
- Technical implementation details
- Step-by-step development guides
- Design specifications and UI/UX guidelines
- API integration patterns and best practices