import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    env: {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasReplicate: !!process.env.REPLICATE_API_TOKEN,
      hasHuggingFace: !!process.env.HUGGINGFACE_API_KEY
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    return NextResponse.json({
      message: 'POST request received',
      data: body,
      timestamp: new Date().toISOString(),
      env: {
        hasOpenAI: !!process.env.OPENAI_API_KEY,
        hasReplicate: !!process.env.REPLICATE_API_TOKEN,
        hasHuggingFace: !!process.env.HUGGINGFACE_API_KEY
      }
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Failed to parse request',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 400 })
  }
}