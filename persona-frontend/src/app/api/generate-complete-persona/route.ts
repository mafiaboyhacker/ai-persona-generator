import { NextRequest, NextResponse } from 'next/server'
import Replicate from 'replicate'
import { integrateWithAPI } from '../../../lib/flux-persona-converter'
import { selectOptimalLoras, buildLoraParams, integrateLoraTriggersToPrompt, estimateLoraTokenUsage, processManualLoraSelection } from '../../../lib/lora-ai-selector'

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API 요청 시작')
    const startTime = Date.now()
    
    const body = await request.json()
    console.log('📥 요청 본문:', JSON.stringify(body, null, 2))
    const { 
      personaType, 
      desiredStyle, 
      personalityTraits, 
      background, 
      visualPreferences,
      allowNsfw = false,
      fluxModel = "Persona-v.01",
      customImagePrompt = null,
      imageOnly = false,
      customSeed = null,
      manualLoraSelection = null,
      generateNewFace = false,
      lockSeed = false
    } = body

    // API 키 확인
    const openaiApiKey = process.env.OPENAI_API_KEY
    const replicateApiToken = process.env.REPLICATE_API_TOKEN

    console.log('🔑 API 키 확인:', {
      openai: openaiApiKey ? 'OK' : 'MISSING',
      replicate: replicateApiToken ? 'OK' : 'MISSING'
    })

    if (!openaiApiKey || !replicateApiToken) {
      console.error('❌ API 키 누락')
      return NextResponse.json({ 
        error: 'API keys not configured',
        message: 'Please add OPENAI_API_KEY and REPLICATE_API_TOKEN to environment variables',
        debug: {
          openai: openaiApiKey ? 'found' : 'missing',
          replicate: replicateApiToken ? 'found' : 'missing'
        }
      }, { status: 500 })
    }

    // Replicate 클라이언트 초기화
    const replicate = new Replicate({
      auth: replicateApiToken,
    })

    // 안전장치: 타임아웃 체크
    const MAX_PROCESSING_TIME = 300000 // 5분

    // 이미지 전용 모드 처리 (LoRA 적용)
    if (imageOnly && customImagePrompt) {
      console.log('🎨 Image-only mode: Using custom prompt with LoRA enhancement')
      
      const parsedResponse = {
        profile: "Existing persona profile maintained", 
        imagePrompt: customImagePrompt
      }
      
      // 이미지 생성으로 바로 이동
      let imageUrl = null
      let imageError = null
      let loraAnalysis = null
      // 시드 처리 로직 (generateNewFace 최우선)
      let actualSeed
      if (generateNewFace) {
        // 새로운 얼굴 생성 모드: lockSeed와 customSeed 무시하고 무조건 새 시드 생성
        actualSeed = Math.floor(Math.random() * 1000000)
        console.log('🔄 새로운 얼굴 생성 모드: lockSeed 무시하고 새 시드 강제 생성 -', actualSeed)
        if (lockSeed) {
          console.log('⚠️  시드 락이 활성화되어 있지만 새로운 얼굴 생성이 우선됩니다')
        }
      } else if (lockSeed && customSeed) {
        // 시드 락 활성화 시 기존 시드 유지
        actualSeed = customSeed
        console.log('🔒 시드 락 모드: 기존 시드 고정 -', actualSeed)
      } else {
        // 일반 모드: 사용자 시드 또는 랜덤 생성
        actualSeed = customSeed || Math.floor(Math.random() * 1000000)
        console.log('🎲 시드 사용:', actualSeed, customSeed ? '(사용자 지정)' : '(랜덤 생성)')
      }

      try {
        // LoRA 선택 로직 - 수동 선택 우선, 없으면 AI 자동 선택
        if (manualLoraSelection) {
          console.log('🎯 Image-only mode: 수동 LoRA 선택 사용')
          loraAnalysis = processManualLoraSelection(manualLoraSelection)
        } else {
          console.log('🤖 Image-only mode: AI LoRA 자동 선택 시작...')
          const userSettings = {
            personaType: personaType || 'AI influencer',
            desiredStyle: desiredStyle || 'Glamorous and dramatic',
            personalityTraits: personalityTraits || '',
            visualPreferences: visualPreferences || ''
          }
          
          // 프롬프트 기반으로 LoRA 선택 (빈 프로필로 대체)
          loraAnalysis = await selectOptimalLoras("AI Influencer persona with glamorous style", userSettings)
        }
        console.log('✅ Image-only LoRA 선택 완료:', loraAnalysis)

        const replicateModel = 'black-forest-labs/flux-1.1-pro'
        const modelUsed = 'Persona-v.01-AI-Pro'
        
        // LoRA 트리거 워드를 프롬프트에 통합
        const enhancedPrompt = integrateLoraTriggersToPrompt(parsedResponse.imagePrompt, loraAnalysis)
        console.log('🔄 Image-only LoRA 강화 프롬프트:', enhancedPrompt.substring(0, 100) + '...')
        
        // LoRA 파라미터 구성
        const loraParams = buildLoraParams(loraAnalysis)
        const modelParams = {
          prompt: enhancedPrompt,
          width: 1024,
          height: 1440,
          guidance: 5,
          safety_tolerance: 5,
          output_format: 'webp',
          output_quality: 90,
          seed: actualSeed,
          ...loraParams
        }

        console.log(`🎨 Starting image generation with ${modelUsed} (${replicateModel})`)
        console.log('🔍 Model parameters:', modelParams)
        
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Image generation timeout')), 180000) // 3분
        })
        
        // Replicate API 직접 호출
        const directApiCall = async () => {
          console.log('🌟 Making direct request to Replicate API (image-only)')
          
          const output = await replicate.run(
            'black-forest-labs/flux-1.1-pro',
            { input: modelParams }
          )
          
          return output
        }
        
        const imageGenerationPromise = directApiCall()
        
        console.log('🕐 Starting Replicate API call...')
        const output = await Promise.race([imageGenerationPromise, timeoutPromise])
        console.log('🕐 Replicate API call completed')

        console.log('🔍 Replicate output type:', typeof output)
        console.log('🔍 Replicate output value:', JSON.stringify(output, null, 2))

        // Replicate 출력 형식 처리 (Cloudflare Gateway 통과)
        if (output) {
          if (Array.isArray(output) && output.length > 0) {
            // 배열 형태 (일반적인 경우)
            imageUrl = output[0]
            console.log('✅ Found URL in array format')
          } else if (typeof output === 'string') {
            // 직접 URL 문자열
            imageUrl = output
            console.log('✅ Found direct URL string')
          } else {
            console.log('🔍 Unexpected output format:', output)
            throw new Error(`Unexpected output format from Replicate: ${typeof output}`)
          }
          console.log('✅ Image generation successful with Cloudflare Gateway')
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
        model_used: 'Persona-v.01-AI-Pro',
        timestamp: new Date().toISOString(),
        imageError: imageError,
        processing_time_ms: processingTime,
        mode: 'image-only',
        lora_analysis: loraAnalysis,
        lora_selection_mode: manualLoraSelection ? "manual" : "ai_auto",
        seed: actualSeed
      })
    }

    // 1단계: OpenAI로 페르소나 프로필 생성
    console.log('🧠 OpenAI API 호출 시작')
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
- **창의성 최우선**: 매번 새롭고 독창적인 이름을 생성하세요. 기존 예시는 참고만 하되 동일한 이름 반복 금지
- **한국어 이름**: 반드시 성+이름 형태로 생성. 성은 다양한 한국 성씨 활용. 이름은 2-4글자의 다양한 길이로 생성. 독특하고 매력적인 이름 선호
  (참고 예시: 김소연, 박지우, 이하늘, 최은서, 정수민아, 한예은이, 윤하늘별, 조소망이 - 이와 다른 새로운 이름 생성)
- **영어 이름**: 성+이름 형태로 생성. 매력적이고 기억하기 쉬운 이름. 일반적인 이름과 독특한 이름의 창의적 조합
  (참고 예시: Kim Soyeon, Park Jiwoo, Lee Haneul, Choi Eunseo, Jung Aria, Han Luna, Yoon Stella, Jo Zara - 이와 다른 새로운 이름 생성)
- **성씨 다양화**: 김, 이, 박, 최, 정, 한, 윤, 조, 장, 임, 오, 강, 송, 유, 홍, 전, 고, 문, 신, 남 등 다양한 성씨 활용하여 창의적 조합
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
        temperature: 1.0,
      }),
    })

    console.log('🧠 OpenAI API 응답 상태:', personaResponse.status)
    
    if (!personaResponse.ok) {
      console.error('❌ OpenAI API 오류 발생')
      const errorData = await personaResponse.json()
      console.error('❌ OpenAI 오류 상세:', errorData)
      return NextResponse.json({ 
        error: 'OpenAI API error',
        details: errorData
      }, { status: 500 })
    }

    console.log('🧠 OpenAI API 응답 파싱 중...')
    const personaData = await personaResponse.json()
    const responseText = personaData.choices[0]?.message?.content
    console.log('✅ OpenAI 응답 텍스트 길이:', responseText?.length || 0)

    if (!responseText) {
      console.error('❌ OpenAI에서 콘텐츠가 생성되지 않음')
      return NextResponse.json({ 
        error: 'No content generated from OpenAI'
      }, { status: 500 })
    }

    // 응답 파싱 - Flux 최적화 프롬프트 생성
    let parsedResponse
    try {
      console.log('🔄 응답 파싱 시작')
      // 프로필에서 IMAGE_PROMPT 부분 제거 (기존 방식 호환)
      let profile = responseText.replace(/---\s*\*\*IMAGE_PROMPT:\*\*[\s\S]*$/i, '').trim()
      console.log('✅ 프로필 텍스트 정리 완료')
      
      // Flux 최적화 프롬프트 생성 (개선된 시스템 사용)
      console.log('🔄 Flux 최적화 프롬프트 생성 시작')
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

    // 2단계: AI LoRA 선택 및 이미지 생성
    let imageUrl = null
    let imageError = null
    let loraAnalysis = null
    // 시드 처리 로직 (generateNewFace 최우선)
    let actualSeed
    if (generateNewFace) {
      // 새로운 얼굴 생성 모드: lockSeed와 customSeed 무시하고 무조건 새 시드 생성
      actualSeed = Math.floor(Math.random() * 1000000)
      console.log('🔄 새로운 얼굴 생성 모드: lockSeed 무시하고 새 시드 강제 생성 -', actualSeed)
      if (lockSeed) {
        console.log('⚠️  시드 락이 활성화되어 있지만 새로운 얼굴 생성이 우선됩니다')
      }
    } else if (lockSeed && customSeed) {
      // 시드 락 활성화 시 기존 시드 유지
      actualSeed = customSeed
      console.log('🔒 시드 락 모드: 기존 시드 고정 -', actualSeed)
    } else {
      // 일반 모드: 사용자 시드 또는 랜덤 생성
      actualSeed = customSeed || Math.floor(Math.random() * 1000000)
      console.log('🎲 시드 사용:', actualSeed, customSeed ? '(사용자 지정)' : '(랜덤 생성)')
    }

    try {
      // LoRA 선택 로직 - 수동 선택 우선, 없으면 AI 자동 선택
      if (manualLoraSelection) {
        console.log('🎯 수동 LoRA 선택 사용')
        loraAnalysis = processManualLoraSelection(manualLoraSelection)
      } else {
        console.log('🤖 AI LoRA 자동 선택 시작...')
        const userSettings = {
          personaType: personaType || 'AI 인플루언서',
          desiredStyle: desiredStyle || '모던하고 세련된',
          personalityTraits: personalityTraits || '',
          visualPreferences: visualPreferences || ''
        }
        
        loraAnalysis = await selectOptimalLoras(parsedResponse.profile, userSettings)
      }
      console.log('✅ LoRA 선택 완료:', loraAnalysis)

      // Persona-v.01-AI 모델 설정 (LoRA 지원)
      const replicateModel = 'black-forest-labs/flux-1.1-pro'
      const modelUsed = 'Persona-v.01-AI-Pro'
      
      // LoRA 트리거 워드를 프롬프트에 통합
      const enhancedPrompt = integrateLoraTriggersToPrompt(parsedResponse.imagePrompt, loraAnalysis)
      console.log('🔄 LoRA 강화 프롬프트:', enhancedPrompt.substring(0, 100) + '...')
      
      // LoRA 파라미터 구성
      const loraParams = buildLoraParams(loraAnalysis)
      const modelParams = {
        prompt: enhancedPrompt,
        width: 1024,
        height: 1440,
        guidance: 5,
        safety_tolerance: 5,
        output_format: 'webp',
        output_quality: 90,
        seed: actualSeed,
        ...loraParams
      }

      console.log(`🎨 Starting image generation with ${modelUsed} (${replicateModel})`)
      console.log('🔍 Model parameters:', modelParams)
      
      // 타임아웃 설정
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Image generation timeout')), 180000) // 3분 타임아웃
      })
      
      // Replicate API 직접 호출
      const directApiCall = async () => {
        console.log('🌟 Making direct request to Replicate API')
        
        const output = await replicate.run(
          'black-forest-labs/flux-1.1-pro',
          { input: modelParams }
        )
        
        return output
      }
      
      const imageGenerationPromise = directApiCall()
      
      console.log('🕐 Starting Replicate API call...')
      const output = await Promise.race([imageGenerationPromise, timeoutPromise])
      console.log('🕐 Replicate API call completed')

      console.log('🔍 Replicate output type:', typeof output)
      console.log('🔍 Replicate output value:', JSON.stringify(output, null, 2))

      // Replicate 출력 형식 처리 (Cloudflare Gateway 통과)
      if (output) {
        if (Array.isArray(output) && output.length > 0) {
          // 배열 형태 (일반적인 경우)
          imageUrl = output[0]
          console.log('✅ Found URL in array format')
        } else if (typeof output === 'string') {
          // 직접 URL 문자열
          imageUrl = output
          console.log('✅ Found direct URL string')
        } else {
          console.log('🔍 Unexpected output format:', output)
          throw new Error(`Unexpected output format from Replicate: ${typeof output}`)
        }
        console.log('✅ Image generation successful')
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
      model_used: 'Persona-v.01-AI-Pro',
      timestamp: new Date().toISOString(),
      imageError: imageError,
      processing_time_ms: processingTime,
      apex_engine: 'v10-Odyssey-Hybrid',
      token_estimate: Math.floor(parsedResponse.profile?.length / 4) || 0,
      lora_analysis: loraAnalysis,
      lora_selection_mode: manualLoraSelection ? "manual" : "ai_auto",
      lora_token_usage: estimateLoraTokenUsage(),
      seed: actualSeed
    })

  } catch (error) {
    console.error('❌ Complete persona generation error:', error)
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
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