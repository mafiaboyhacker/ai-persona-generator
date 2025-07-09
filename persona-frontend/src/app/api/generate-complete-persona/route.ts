import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { integrateWithAPI } from '../../../lib/flux-persona-converter'

export async function POST(request: NextRequest) {
  try {
    const startTime = Date.now()
    
    const body = await request.json()
    const { 
      personaType, 
      desiredStyle, 
      personalityTraits, 
      background, 
      visualPreferences,
      allowNsfw = false,
      fluxModel = "Persona-v.01",
      customImagePrompt = null,
      imageOnly = false
    } = body

    // API 키 확인
    const openaiApiKey = process.env.OPENAI_API_KEY
    const replicateApiToken = process.env.REPLICATE_API_TOKEN

    if (!openaiApiKey || !replicateApiToken) {
      return NextResponse.json({ 
        error: 'API keys not configured',
        message: 'Please add OPENAI_API_KEY and REPLICATE_API_TOKEN to environment variables'
      }, { status: 500 })
    }

    // Replicate 클라이언트 초기화
    const replicate = new Replicate({
      auth: replicateApiToken,
    })

    // 안전장치: 타임아웃 체크
    const MAX_PROCESSING_TIME = 300000 // 5분

    // 이미지 전용 모드 처리
    if (imageOnly && customImagePrompt) {
      console.log('🎨 Image-only mode: Using custom prompt')
      
      const parsedResponse = {
        profile: "Existing persona profile maintained", 
        imagePrompt: customImagePrompt
      }
      
      // 이미지 생성으로 바로 이동
      let imageUrl = null
      let imageError = null

      try {
        // Persona-v.01 모델 고정 설정 (실사 강조)
        const replicateModel = 'black-forest-labs/flux-1.1-pro'
        const modelUsed = 'Persona-v.01'
        const modelParams = {
          prompt: parsedResponse.imagePrompt,
          width: 768,
          height: 1024,
          guidance: 3.5,
          num_inference_steps: 30,
          safety_tolerance: 5,
          output_format: 'webp',
          output_quality: 80,
        }

        console.log(`🎨 Starting image generation with ${modelUsed} (${replicateModel})`)
        console.log('🔍 Model parameters:', modelParams)
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Image generation timeout')), 180000) // 3분
        })
        
        const imageGenerationPromise = replicate.run(replicateModel, {
          input: modelParams
        })
        
        console.log('🕐 Starting replicate.run...')
        const output = await Promise.race([imageGenerationPromise, timeoutPromise])
        console.log('🕐 Replicate.run completed')

        console.log('🔍 Replicate output type:', typeof output)
        console.log('🔍 Replicate output value:', JSON.stringify(output, null, 2))

        // Replicate 출력 형식 처리 (FileOutput 지원)
        if (output) {
          if (output && typeof output === 'object' && output.constructor && output.constructor.name === 'FileOutput') {
            console.log('✅ Found FileOutput object')
            const fileOutput = output as any; // 타입 안전성을 위해 any로 캐스팅
            if (fileOutput.url && typeof fileOutput.url === 'function') {
              console.log('🔍 Calling FileOutput.url() function...')
              const urlResult = await fileOutput.url()
              imageUrl = urlResult.toString()
              console.log('✅ Successfully extracted URL from FileOutput')
            } else {
              throw new Error('FileOutput object does not have url() function')
            }
          } else {
            console.log('🔍 Unexpected output format:', output)
            throw new Error(`Unexpected output format from Replicate: ${typeof output}`)
          }
          console.log('✅ Image generation successful with Replicate')
          console.log('🔗 Final image URL:', imageUrl)
        } else {
          throw new Error('No image output received from Replicate')
        }

      } catch (replicateError) {
        console.error('❌ Replicate image generation failed:', replicateError)
        imageError = {
          error: 'Failed to generate image',
          message: replicateError instanceof Error ? replicateError.message : 'Unknown error'
        }
      }

      const processingTime = Date.now() - startTime
      
      return NextResponse.json({
        success: true,
        profile: null, // 이미지 전용 모드에서는 프로필 반환 안함
        imageUrl: imageUrl,
        imagePrompt: parsedResponse.imagePrompt,
        model_used: 'Persona-v.01',
        timestamp: new Date().toISOString(),
        imageError: imageError,
        processing_time_ms: processingTime,
        mode: 'image-only'
      })
    }

    // 1단계: OpenAI로 페르소나 프로필 생성
    const personaResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a hyper-realistic AI persona generation expert. Create creative and emotionally rich characters.

**Important**: Each persona must have clear reasons and background stories for why they chose their profession, developed their style, and formed their personality. Provide logical and emotional motivations, not just simple settings.

**Category Guidelines**: Reflect the expertise and characteristics appropriate to the user-specified persona type (AI influencer, actress, singer, VTuber, model, content creator, professional). Accurately implement activity methods, fan base, revenue structure, and content style for each category.

**Language Note**: Generate persona names and profiles in Korean, but ensure all content is rich and detailed.

Provide responses in markdown format.

프로필 구조:
## 페르소나 이름: [한국어 이름] ([영어 이름])

**이름 생성 지침**:
- **한국어 이름**: 반드시 성+이름 형태로 생성. 성은 일반적인 한국 성씨 사용. 이름은 2-4글자의 다양한 길이로 생성. 독특하고 매력적인 이름 선호. 
  예: 김소연, 박지우, 이하늘, 최은서, 정수민아, 한예은이, 윤하늘별, 조소망이 등
- **영어 이름**: 성+이름 형태로 생성. 매력적이고 기억하기 쉬운 이름. 일반적인 이름과 독특한 이름의 조합. 
  예: Kim Soyeon, Park Jiwoo, Lee Haneul, Choi Eunseo, Jung Aria, Han Luna, Yoon Stella, Jo Zara 등
- **한국 성씨 예시**: 김, 이, 박, 최, 정, 한, 윤, 조, 장, 임, 오, 강, 송, 유, 홍, 전, 고, 문, 신, 남 등
- **페르소나 타입별 이름 특성**:
  - AI 인플루언서: 모던하고 트렌디한 이름
  - 배우: 클래식하면서도 기억하기 쉬운 이름
  - 가수: 예술적이고 매력적인 이름
  - 버튜버: 귀엽고 친근한 이름
  - 모델: 세련되고 국제적인 이름
  - 크리에이터: 창의적이고 개성 있는 이름

### 0. 페르소나 개념과 창조 의도
• **페르소나 타입**: [AI 인플루언서/배우/가수/버튜버/모델/크리에이터/기타 중에서 구체적 분류]
• **창조 의도**: [왜 이런 인물을 만들었는지, 어떤 매력과 가치를 전달하고자 하는지]
• **타겟 오디언스**: [주요 팬층과 그들이 이 페르소나에게 끌리는 이유]
• **차별화 포인트**: [기존 유사 인물들과 구별되는 독특한 특징]
• **핵심 메시지**: [이 페르소나가 세상에 전하고자 하는 메시지나 가치관]

**분류별 특화 요소:**
- **AI 인플루언서**: SNS 중심 라이프스타일, 브랜드 콜라보, 팬 소통 방식
- **배우**: 연기 경력, 작품 선택 기준, 캐릭터 해석 방식
- **가수**: 음악 장르, 작사/작곡 능력, 무대 퍼포먼스 스타일
- **버튜버**: 아바타 설정, 방송 콘텐츠, 시청자와의 상호작용
- **모델**: 워킹 스타일, 패션 센스, 브랜드 이미지
- **크리에이터**: 창작 분야, 플랫폼 활용, 콘텐츠 제작 철학
- **기타**: 해당 분야의 전문성과 독특한 특징

### 1. 기본 프로필
• **이름**: [한국어 이름] ([영어 이름])
• **나이**: [구체적 나이]세
• **성별/성향**: [성별] ([성적 지향성])
• **출생지/거주지**: [출생지], 현재 [거주지] 거주
• **신체 정보**: [키]cm / [몸무게]kg, [체형 특징]
• **MBTI**: [MBTI 유형] ([구체적 성격 분석])
• **외형적 이미지 인상**: [4-5줄의 매우 상세한 첫인상]
• **직업**: [현재 직업과 과거 경력 - 사용자가 지정한 분류(AI 인플루언서/배우/가수/버튜버/모델/크리에이터/기타)에 정확히 맞춰서]
• **직업 선택 이유**: [왜 이 직업을 선택했는지, 어떤 계기와 동기가 있었는지]
• **전문 분야**: [해당 분류에서의 구체적 전문성과 특기]
• **활동 플랫폼**: [주요 활동 플랫폼과 각 플랫폼에서의 전략]
• **수익 구조**: [해당 분야의 일반적인 수익 방식과 개인적 전략]
• **가족관계**: [가족 구성과 관계]
• **가족이 페르소나에게 미친 영향**: [가족 배경이 현재 성격과 가치관에 어떤 영향을 미쳤는지]

### 2. 외모 및 스타일
• **피부**: [피부 톤, 질감, 특이사항]
• **얼굴형**: [얼굴형과 각 부위별 특징]
• **눈**: [눈 모양, 색깔, 표정 변화]
• **머리카락**: [현재 스타일, 관리 루틴]
• **체형**: [신체 비율, 장단점, 운동 습관]
• **패션 스타일**: [TPO별 스타일링, 선호 브랜드]
• **스타일 철학과 선택 이유**: [왜 이런 스타일을 추구하는지, 어떤 메시지를 전달하고자 하는지]
• **시그니처 아이템**: [필수 액세서리, 향수]
• **시그니처 아이템의 의미**: [각 아이템이 가진 개인적 의미와 스토리]

### 3. 성격 및 심리
• **핵심 성격**: [기본 성격과 상황별 변화]
• **성격 형성 배경**: [왜 이런 성격을 가지게 되었는지, 어떤 경험들이 영향을 미쳤는지]
• **트라우마 & 상처**: [과거 상처와 현재 영향]
• **트라우마가 현재에 미치는 영향**: [상처가 어떻게 현재의 행동과 선택에 영향을 주는지]
• **인간관계 패턴**: [친밀감 형성 방식]
• **연애 성향**: [이상형, 연애 패턴]
• **스트레스 반응**: [스트레스 상황 대처법]
• **취미/열정**: [진짜 관심사]
• **취미 선택 이유**: [왜 이런 취미를 가지게 되었는지, 어떤 의미와 만족을 주는지]
• **가치관**: [인생관, 도덕적 기준]
• **가치관 형성 배경**: [이런 가치관을 가지게 된 결정적 경험이나 영향]
• **두려움**: [가장 무서워하는 것들]
• **두려움의 근원**: [왜 이것을 두려워하는지, 어떤 경험에서 비롯되었는지]
• **꿈과 야망**: [진짜 원하는 것과 현실적 목표]
• **꿈의 동기**: [왜 이런 꿈을 가지게 되었는지, 어떤 의미와 가치를 추구하는지]

### 4. 배경 스토리
• **유년기**: [가족 환경, 형성적 경험]
• **청소년기**: [정체성 형성, 첫 경험들]
• **청년기**: [독립, 진로 탐색, 중요한 관계들]
• **현재**: [현재 상황, 당면 과제]
• **현재 선택의 이유**: [왜 지금 이런 삶을 살고 있는지, 어떤 목표를 향해 가고 있는지]
• **인생 전환점**: [3개의 중요한 순간과 변화]
• **전환점이 준 교훈**: [각 전환점에서 배운 것과 그것이 현재에 미치는 영향]

### 5. 디지털 페르소나
• **온라인 정체성**: [실제 자아 vs 온라인 페르소나의 차이]
• **SNS별 캐릭터**: [플랫폼별 다른 모습]
• **콘텐츠 철학**: [무엇을 보여주고 숨기는지]
• **콘텐츠 철학의 이유**: [왜 이런 콘텐츠를 만드는지, 어떤 영향을 주고 싶은지]
• **팬과의 경계**: [친밀함의 정도]
• **경계 설정 이유**: [왜 이런 경계를 만들었는지, 어떤 경험에서 비롯되었는지]
• **브랜드 가치**: [추구하는 이미지와 수익 전략]
• **브랜드 가치 선택 이유**: [왜 이런 브랜드 가치를 추구하는지, 어떤 신념에서 비롯되었는지]

### 6. 내러티브 시뮬레이션
**시나리오 1: 일상 스트레스 상황**
[구체적 상황] → [캐릭터 반응] → [내적 독백] → [해결 방식]

**시나리오 2: 친밀한 관계 상호작용**
[상대방과의 관계] → [진짜 모습] → [감정 표현] → [관계 dynamics]

**시나리오 3: 공적 페르소나 vs 진짜 자아**
[공개적 모습] → [내적 갈등] → [가면과 진심] → [균형점]

### 7. 감정적 아크 분석
• **핵심 감정 DNA**: [성격을 정의하는 주요 감정 패턴]
• **감정 표현 스펙트럼**: [상황별 감정 표현 방식의 변화]
• **감정 트리거**: [강한 반응을 일으키는 특정 상황들]
• **성장 벡터**: [감정적 성숙을 위한 과제와 방향]

### 8. 콘텐츠 미리보기
**SNS 포스팅 스타일 예시**
[실제 올릴 법한 포스팅 3개 예시]

**영상 콘텐츠 컨셉**
[제작할 영상의 스타일과 메시지]

**팬과의 소통 방식**
[댓글 답변 스타일과 경계선]

### 9. 상징적 아이덴티티
• **컬러 팔레트**: [대표 색상과 의미]
• **상징 요소**: [동물, 꽃, 음악, 향수 등]
• **미래 시나리오**: [1년 후, 3년 후, 5년 후 모습]
• **숨겨진 잠재력**: [아직 발견되지 않은 재능과 가능성]

**응답 끝에 다음 형식으로 이미지 프롬프트를 추가해주세요:**

---
**IMAGE_PROMPT:** [위에서 생성한 페르소나의 실제 외모, 스타일, 성격, 배경을 정확히 반영한 상세한 영어 이미지 생성 프롬프트. 
페르소나의 나이, 성별, 체형, 얼굴형, 머리카락, 패션 스타일, 성격이 드러나는 표정과 포즈, 그리고 직업과 배경에 맞는 환경을 모두 포함해야 함. 
예: "A 25-year-old Korean woman with shoulder-length wavy brown hair, oval face, warm brown eyes, slim figure (164cm), wearing modern casual pastel clothing, sitting in a cozy plant-filled café, warm smile reflecting her friendly ENFP personality, soft natural lighting, realistic portrait photography, detailed facial features"]`
          },
          {
            role: 'user',
            content: `Please generate an AI persona that meets the following conditions. Do not refuse due to insufficient information, but creatively supplement to create a complete persona:

**Required Conditions:**
- Persona Type: ${personaType}
- Desired Style: ${desiredStyle}
- Personality Traits: ${personalityTraits}
- Background: ${background}
- Visual Preferences: ${visualPreferences}
- NSFW Allowed: ${allowNsfw ? 'Yes' : 'No'}

**Instructions:**
1. Create a complete persona based on the above conditions
2. Creatively supplement any missing information according to the persona type
3. Never refuse with reasons like "insufficient information"
4. Write profile in markdown format and include IMAGE_PROMPT at the end
5. Generate Korean names and profile content in Korean as specified in the system prompt`
          }
        ],
        max_tokens: 6000,
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

    // 응답 파싱 - Flux 1.1 Pro 최적화 프롬프트 생성
    let parsedResponse
    try {
      // 프로필에서 IMAGE_PROMPT 부분 제거 (기존 방식 호환)
      let profile = responseText.replace(/---\s*\*\*IMAGE_PROMPT:\*\*[\s\S]*$/i, '').trim()
      
      // Flux 1.1 Pro 최적화 프롬프트 생성 (개선된 시스템 사용)
      const userSettings = {
        personaType: personaType || 'AI 인플루언서',
        desiredStyle: desiredStyle || '모던하고 세련된',
        personalityTraits: personalityTraits || '',
        background: background || '',
        visualPreferences: visualPreferences || '',
        allowNsfw: allowNsfw,
        allowRandomGeneration: false // 안정성을 위해 기본적으로 비활성화
      }
      
      console.log('🔄 Generating Flux-optimized prompt with settings:', userSettings)
      const optimizedPrompt = integrateWithAPI(responseText, userSettings)
      console.log('✅ Flux-optimized prompt generated:', optimizedPrompt.substring(0, 100) + '...')
      
      parsedResponse = {
        profile: profile,
        imagePrompt: optimizedPrompt
      }
    } catch (error) {
      console.error('❌ Flux optimization error:', error)
      
      // 에러 시 기본 프롬프트 생성 (fallback)
      const fallbackPrompt = `Professional portrait of a ${personaType}, ${desiredStyle} style, ${visualPreferences}, high quality realistic photography, detailed facial features, natural lighting, 4k resolution`
      console.log('🔄 Using fallback prompt:', fallbackPrompt)
      
      parsedResponse = {
        profile: responseText,
        imagePrompt: fallbackPrompt
      }
    }

    // 2단계: Replicate로 이미지 생성 (Persona-v.01 모델 고정)
    let imageUrl = null
    let imageError = null

    try {
      // Persona-v.01 모델 고정 설정 (실사 강조)
      const replicateModel = 'black-forest-labs/flux-1.1-pro'
      const modelUsed = 'Persona-v.01'
      const modelParams = {
        prompt: parsedResponse.imagePrompt,
        width: 768,
        height: 1024,
        guidance: 3.5,
        num_inference_steps: 30,
        safety_tolerance: 5,
        output_format: 'webp',
        output_quality: 80,
      }

      console.log(`🎨 Starting image generation with ${modelUsed} (${replicateModel})`)
      console.log('🔍 Model parameters:', modelParams)
      
      // 타임아웃 설정
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Image generation timeout')), 180000) // 3분 타임아웃
      })
      
      const imageGenerationPromise = replicate.run(replicateModel, {
        input: modelParams
      })
      
      console.log('🕐 Starting replicate.run...')
      const output = await Promise.race([imageGenerationPromise, timeoutPromise])
      console.log('🕐 Replicate.run completed')

      console.log('🔍 Replicate output type:', typeof output)
      console.log('🔍 Replicate output value:', JSON.stringify(output, null, 2))

      // Replicate 출력 형식 처리 (FileOutput 지원)
      if (output) {
        if (output && typeof output === 'object' && output.constructor && output.constructor.name === 'FileOutput') {
          console.log('✅ Found FileOutput object')
          const fileOutput = output as any; // 타입 안전성을 위해 any로 캐스팅
          if (fileOutput.url && typeof fileOutput.url === 'function') {
            console.log('🔍 Calling FileOutput.url() function...')
            const urlResult = await fileOutput.url()
            imageUrl = urlResult.toString() // URL 객체를 문자열로 변환
            console.log('✅ Successfully extracted URL from FileOutput')
          } else {
            throw new Error('FileOutput object does not have url() function')
          }
        } else if (Array.isArray(output) && output.length > 0) {
          const firstOutput = output[0]
          
          // FileOutput 처리
          if (firstOutput && typeof firstOutput === 'object' && firstOutput.constructor && firstOutput.constructor.name === 'FileOutput') {
            console.log('✅ Found FileOutput in array')
            const fileOutput = firstOutput as any; // 타입 안전성을 위해 any로 캐스팅
            if (fileOutput.url && typeof fileOutput.url === 'function') {
              const urlResult = await fileOutput.url()
              imageUrl = urlResult.toString()
            } else {
              throw new Error('FileOutput in array does not have url() function')
            }
          }
          // ReadableStream 처리
          else if (firstOutput && typeof firstOutput === 'object' && firstOutput.constructor.name === 'ReadableStream') {
            console.log('🔍 Found ReadableStream, converting to blob URL...')
            
            // ReadableStream을 Blob으로 변환
            const response = new Response(firstOutput)
            const blob = await response.blob()
            const arrayBuffer = await blob.arrayBuffer()
            
            // Base64로 인코딩하여 data URL 생성
            const base64 = Buffer.from(arrayBuffer).toString('base64')
            imageUrl = `data:image/jpeg;base64,${base64}`
            
            console.log('✅ ReadableStream converted to data URL')
          } else if (typeof firstOutput === 'string') {
            imageUrl = firstOutput
          } else {
            console.log('🔍 First output type:', typeof firstOutput)
            console.log('🔍 First output constructor:', firstOutput?.constructor?.name)
            throw new Error(`Unexpected first output format: ${typeof firstOutput}`)
          }
        } else if (typeof output === 'string') {
          imageUrl = output
        } else if (typeof output === 'object' && output !== null) {
          // 객체 형태인 경우 가능한 URL 필드들 체크
          const possibleUrlFields = ['url', 'image', 'image_url', 'output', 'result']
          const outputObj = output as Record<string, any>
          for (const field of possibleUrlFields) {
            if (outputObj[field]) {
              imageUrl = outputObj[field]
              break
            }
          }
          if (!imageUrl) {
            console.log('🔍 Object output structure:', Object.keys(outputObj))
            console.log('🔍 Object constructor:', outputObj.constructor?.name)
            throw new Error(`Unable to extract image URL from object: ${JSON.stringify(outputObj)}`)
          }
        } else {
          console.log('🔍 Unexpected output format:', output)
          throw new Error(`Unexpected output format from Replicate: ${typeof output}`)
        }
        console.log('✅ Image generation successful with Replicate')
        console.log('🔗 Final image URL:', imageUrl)
      } else {
        throw new Error('No image output received from Replicate')
      }

    } catch (replicateError) {
      console.error('❌ Replicate image generation failed:', replicateError)
      imageError = {
        error: 'Failed to generate image',
        message: replicateError instanceof Error ? replicateError.message : 'Unknown error'
      }
    }

    // 처리 시간 체크
    const processingTime = Date.now() - startTime
    
    // 성공 응답 (이미지 실패해도 프로필은 반환)
    return NextResponse.json({
      success: true,
      profile: parsedResponse.profile,
      imageUrl: imageUrl,
      imagePrompt: parsedResponse.imagePrompt,
      model_used: 'Persona-v.01',
      timestamp: new Date().toISOString(),
      imageError: imageError,
      processing_time_ms: processingTime,
      apex_engine: 'v10-Odyssey-Hybrid',
      token_estimate: Math.floor(parsedResponse.profile?.length / 4) || 0
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