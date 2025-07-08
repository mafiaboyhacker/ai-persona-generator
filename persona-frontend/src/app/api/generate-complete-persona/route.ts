import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      personaType, 
      desiredStyle, 
      personalityTraits, 
      background, 
      visualPreferences,
      allowNsfw = false
    } = body

    // API 키 확인
    const openaiApiKey = process.env.OPENAI_API_KEY
    const falApiKey = process.env.FAL_AI_API_KEY

    if (!openaiApiKey || !falApiKey) {
      return NextResponse.json({ 
        error: 'API keys not configured',
        message: 'Please add OPENAI_API_KEY and FAL_AI_API_KEY to environment variables'
      }, { status: 500 })
    }

    // 1단계: OpenAI로 페르소나 프로필 생성
    const personaResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `당신은 창의적인 AI 페르소나 생성 전문가입니다. 상세하고 매력적인 캐릭터 프로필을 생성해주세요.

응답은 다음과 같은 JSON 형식으로 제공해주세요:
{
  "profile": "마크다운 형식의 상세한 프로필",
  "imagePrompt": "이미지 생성을 위한 영어 프롬프트 (외모, 스타일, 분위기 포함)"
}

프로필에는 다음이 포함되어야 합니다:
1. 기본 정보 (이름, 나이, 직업)
2. 외모 및 스타일 특징  
3. 성격 및 심리적 특성
4. 배경 스토리
5. 특별한 특징들

이미지 프롬프트는 사실적이고 전문적인 인물 사진 생성에 최적화되어야 합니다.`
          },
          {
            role: 'user',
            content: `다음 조건에 맞는 AI 페르소나를 생성해주세요:
- 페르소나 타입: ${personaType}
- 원하는 스타일: ${desiredStyle}
- 성격 특성: ${personalityTraits}
- 배경: ${background}
- 시각적 선호도: ${visualPreferences}
- NSFW 허용: ${allowNsfw ? 'Yes' : 'No'}`
          }
        ],
        max_tokens: 2500,
        temperature: 0.8,
      }),
    })

    if (!personaResponse.ok) {
      const errorData = await personaResponse.json()
      return NextResponse.json({ 
        error: 'OpenAI API error',
        details: errorData
      }, { status: 500 })
    }

    const personaData = await personaResponse.json()
    const responseText = personaData.choices[0]?.message?.content

    if (!responseText) {
      return NextResponse.json({ 
        error: 'No content generated from OpenAI'
      }, { status: 500 })
    }

    // JSON 파싱 시도
    let parsedResponse
    try {
      // JSON 블록 추출
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0])
      } else {
        // JSON 형식이 아닌 경우 기본 처리
        parsedResponse = {
          profile: responseText,
          imagePrompt: `Professional portrait of a ${personaType}, ${desiredStyle} style, ${visualPreferences}, high quality, realistic`
        }
      }
    } catch {
      parsedResponse = {
        profile: responseText,
        imagePrompt: `Professional portrait of a ${personaType}, ${desiredStyle} style, ${visualPreferences}, high quality, realistic`
      }
    }

    // 2단계: Fal.ai로 이미지 생성
    const imageResponse = await fetch('https://fal.run/fal-ai/flux-pro/v1.1', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: parsedResponse.imagePrompt,
        image_size: 'portrait_4_3',
        num_inference_steps: 28,
        guidance_scale: 3.5,
        num_images: 1,
        enable_safety_checker: !allowNsfw,
      }),
    })

    let imageUrl = null
    let imageError = null

    if (imageResponse.ok) {
      const imageData = await imageResponse.json()
      imageUrl = imageData.images?.[0]?.url
    } else {
      const errorData = await imageResponse.json()
      imageError = errorData
    }

    // 성공 응답 (이미지 실패해도 프로필은 반환)
    return NextResponse.json({
      success: true,
      profile: parsedResponse.profile,
      imageUrl: imageUrl,
      imagePrompt: parsedResponse.imagePrompt,
      fal_model: 'flux-pro-1.1',
      timestamp: new Date().toISOString(),
      imageError: imageError
    })

  } catch (error) {
    console.error('Complete persona generation error:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    }
  })
}