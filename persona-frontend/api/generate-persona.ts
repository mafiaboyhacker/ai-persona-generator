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
      personaType, 
      desiredStyle, 
      personalityTraits, 
      background, 
      visualPreferences 
    } = req.body

    // OpenAI API 키 확인
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return res.status(500).json({ 
        error: 'OpenAI API key not configured',
        message: 'Please add OPENAI_API_KEY to environment variables'
      })
    }

    // OpenAI API 호출
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `당신은 창의적인 AI 페르소나 생성 전문가입니다. 사용자의 요청에 따라 상세하고 매력적인 캐릭터 프로필을 생성해주세요.

생성할 내용:
1. 기본 정보 (이름, 나이, 직업 등)
2. 외모 및 스타일 특징
3. 성격 및 심리적 특성
4. 배경 스토리와 서사적 요소
5. 디지털 활동 및 콘텐츠 전략
6. 상징적 요소 및 아키타입

한국어로 작성하며, 마크다운 형식을 사용해주세요.`
          },
          {
            role: 'user',
            content: `다음 조건에 맞는 AI 페르소나를 생성해주세요:
- 페르소나 타입: ${personaType}
- 원하는 스타일: ${desiredStyle}
- 성격 특성: ${personalityTraits}
- 배경: ${background}
- 시각적 선호도: ${visualPreferences}`
          }
        ],
        max_tokens: 2000,
        temperature: 0.8,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      return res.status(500).json({ 
        error: 'OpenAI API error',
        details: errorData
      })
    }

    const openaiData = await openaiResponse.json()
    const profile = openaiData.choices[0]?.message?.content

    if (!profile) {
      return res.status(500).json({ 
        error: 'No content generated',
        message: 'OpenAI returned empty response'
      })
    }

    // 성공 응답
    res.status(200).json({
      success: true,
      profile: profile,
      model: 'gpt-4',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Persona generation error:', error)
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}