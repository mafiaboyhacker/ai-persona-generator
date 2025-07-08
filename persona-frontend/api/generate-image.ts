import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { 
      prompt, 
      model = 'flux-pro-1.1',
      seed,
      aspectRatio = '9:16'
    } = req.body

    // Fal.ai API 키 확인
    const falApiKey = process.env.FAL_AI_API_KEY
    if (!falApiKey) {
      return res.status(500).json({ 
        error: 'Fal.ai API key not configured',
        message: 'Please add FAL_AI_API_KEY to environment variables'
      })
    }

    // 프롬프트 최적화
    const optimizedPrompt = `${prompt}, professional portrait, high quality, detailed, realistic, cinematic lighting, 4K resolution`

    // Fal.ai API 호출
    const falResponse = await fetch('https://fal.run/fal-ai/flux-pro/v1.1', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: optimizedPrompt,
        image_size: aspectRatio === '9:16' ? 'portrait_4_3' : 'landscape_4_3',
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: true,
        seed: seed ? parseInt(seed) : undefined,
      }),
    })

    if (!falResponse.ok) {
      const errorData = await falResponse.json()
      return res.status(500).json({ 
        error: 'Fal.ai API error',
        details: errorData
      })
    }

    const falData = await falResponse.json()
    const imageUrl = falData.images?.[0]?.url

    if (!imageUrl) {
      return res.status(500).json({ 
        error: 'No image generated',
        message: 'Fal.ai returned empty response'
      })
    }

    // 성공 응답
    res.status(200).json({
      success: true,
      imageUrl: imageUrl,
      model: model,
      seed: falData.seed || seed,
      prompt: optimizedPrompt,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Image generation error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}