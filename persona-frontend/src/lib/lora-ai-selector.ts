// LoRA 데이터베이스 (하드코딩)
const loraDatabase = {
  "lora_models": [
    {
      "id": "korean-beauty",
      "name": "Korean Beauty Enhancement",
      "description": "한국 여성의 자연스러운 미모를 강조하는 LoRA 모델",
      "weight_range": [0.8, 0.95],
      "category": "beauty",
      "keywords": ["korean", "natural", "beauty", "elegant", "sophisticated"],
      "default_weight": 0.85,
      "trigger_words": ["korean beauty", "natural makeup", "elegant features"]
    },
    {
      "id": "realistic-korean",
      "name": "Realistic Korean Face",
      "description": "사실적인 한국인 얼굴 특징을 강화하는 모델",
      "weight_range": [0.75, 0.9],
      "category": "realistic",
      "keywords": ["realistic", "photorealistic", "natural", "authentic"],
      "default_weight": 0.8,
      "trigger_words": ["realistic korean", "natural features", "photorealistic"]
    },
    {
      "id": "soft-features",
      "name": "Soft Korean Features", 
      "description": "부드럽고 친근한 한국 여성의 특징",
      "weight_range": [0.75, 0.9],
      "category": "soft",
      "keywords": ["soft", "gentle", "friendly", "approachable", "warm"],
      "default_weight": 0.8,
      "trigger_words": ["soft features", "gentle expression", "warm smile"]
    },
    {
      "id": "idol-lora",
      "name": "K-Pop Idol Style",
      "description": "K-Pop 아이돌의 세련된 스타일과 메이크업",
      "weight_range": [0.85, 0.95],
      "category": "idol",
      "keywords": ["kpop", "idol", "stage makeup", "glamorous", "professional"],
      "default_weight": 0.9,
      "trigger_words": ["kpop idol", "stage makeup", "professional styling", "idol beauty"]
    },
    {
      "id": "fashion-model",
      "name": "Fashion Model Style",
      "description": "패션 모델의 세련되고 고급스러운 룩",
      "weight_range": [0.8, 0.95],
      "category": "fashion",
      "keywords": ["fashion", "model", "editorial", "high-fashion", "chic"],
      "default_weight": 0.85,
      "trigger_words": ["fashion model", "editorial style", "high fashion", "runway beauty"]
    },
    {
      "id": "influencer-beauty",
      "name": "Influencer Beauty",
      "description": "소셜미디어 인플루언서의 완벽한 비주얼",
      "weight_range": [0.8, 0.95],
      "category": "influencer",
      "keywords": ["influencer", "social media", "perfect", "flawless", "trendy"],
      "default_weight": 0.9,
      "trigger_words": ["influencer beauty", "perfect skin", "flawless makeup", "social media ready"]
    },
    {
      "id": "luxury-beauty",
      "name": "Luxury Beauty",
      "description": "고급 럭셔리 뷰티 스타일",
      "weight_range": [0.85, 0.95],
      "category": "luxury",
      "keywords": ["luxury", "premium", "high-end", "sophisticated", "elite"],
      "default_weight": 0.9,
      "trigger_words": ["luxury beauty", "premium makeup", "high-end styling", "sophisticated look"]
    },
    {
      "id": "celebrity-aura",
      "name": "Celebrity Aura",
      "description": "셀럽급 오라와 카리스마",
      "weight_range": [0.8, 0.95],
      "category": "celebrity",
      "keywords": ["celebrity", "star quality", "charismatic", "magnetic", "iconic"],
      "default_weight": 0.85,
      "trigger_words": ["celebrity aura", "star quality", "red carpet ready", "iconic beauty"]
    },
    {
      "id": "professional-makeup",
      "name": "Professional Makeup",
      "description": "전문 메이크업 아티스트급 완성도",
      "weight_range": [0.75, 0.9],
      "category": "professional",
      "keywords": ["professional", "makeup artist", "flawless", "studio quality", "editorial"],
      "default_weight": 0.8,
      "trigger_words": ["professional makeup", "studio quality", "flawless application", "editorial makeup"]
    },
    {
      "id": "editorial-fashion",
      "name": "Editorial Fashion",
      "description": "패션 매거진 에디토리얼급 스타일링",
      "weight_range": [0.8, 0.95],
      "category": "editorial",
      "keywords": ["editorial", "magazine", "high fashion", "avant-garde", "artistic"],
      "default_weight": 0.9,
      "trigger_words": ["editorial fashion", "magazine quality", "high fashion styling", "artistic vision"]
    },
    {
      "id": "actress-beauty",
      "name": "Actress Beauty",
      "description": "영화배우급 완벽한 비주얼과 표현력",
      "weight_range": [0.85, 0.95],
      "category": "actress",
      "keywords": ["actress", "cinematic", "dramatic", "expressive", "captivating"],
      "default_weight": 0.9,
      "trigger_words": ["actress beauty", "cinematic quality", "dramatic expression", "captivating presence"]
    },
    {
      "id": "glamour-model",
      "name": "Glamour Model",
      "description": "글래머 모델의 매혹적이고 세련된 스타일",
      "weight_range": [0.8, 0.95],
      "category": "glamour",
      "keywords": ["glamour", "seductive", "alluring", "sophisticated", "sensual"],
      "default_weight": 0.85,
      "trigger_words": ["glamour model", "seductive pose", "alluring gaze", "sophisticated glamour"]
    },
    {
      "id": "commercial-beauty",
      "name": "Commercial Beauty",
      "description": "광고 모델급 완벽하고 친근한 미모",
      "weight_range": [0.75, 0.9],
      "category": "commercial",
      "keywords": ["commercial", "friendly", "approachable", "clean", "fresh"],
      "default_weight": 0.8,
      "trigger_words": ["commercial beauty", "friendly smile", "clean beauty", "fresh appearance"]
    },
    {
      "id": "vintage-elegance",
      "name": "Vintage Elegance",
      "description": "클래식하고 우아한 빈티지 스타일",
      "weight_range": [0.7, 0.9],
      "category": "vintage",
      "keywords": ["vintage", "classic", "timeless", "elegant", "retro"],
      "default_weight": 0.8,
      "trigger_words": ["vintage elegance", "classic beauty", "timeless style", "retro glamour"]
    },
    {
      "id": "street-chic",
      "name": "Street Chic",
      "description": "도시적이고 트렌디한 스트릿 스타일",
      "weight_range": [0.7, 0.9],
      "category": "street",
      "keywords": ["street", "urban", "trendy", "casual", "modern"],
      "default_weight": 0.8,
      "trigger_words": ["street chic", "urban style", "trendy fashion", "modern casual"]
    },
    {
      "id": "artistic-portrait",
      "name": "Artistic Portrait",
      "description": "예술적이고 창의적인 포트레이트 스타일",
      "weight_range": [0.75, 0.9],
      "category": "artistic",
      "keywords": ["artistic", "creative", "expressive", "unique", "avant-garde"],
      "default_weight": 0.8,
      "trigger_words": ["artistic portrait", "creative expression", "unique style", "avant-garde beauty"]
    },
    {
      "id": "ethereal-beauty",
      "name": "Ethereal Beauty",
      "description": "몽환적이고 신비로운 아름다움",
      "weight_range": [0.75, 0.9],
      "category": "ethereal",
      "keywords": ["ethereal", "dreamy", "mystical", "angelic", "otherworldly"],
      "default_weight": 0.8,
      "trigger_words": ["ethereal beauty", "dreamy appearance", "mystical aura", "angelic features"]
    },
    {
      "id": "fierce-confidence",
      "name": "Fierce Confidence",
      "description": "강렬하고 자신감 넘치는 카리스마",
      "weight_range": [0.8, 0.95],
      "category": "fierce",
      "keywords": ["fierce", "confident", "powerful", "bold", "strong"],
      "default_weight": 0.85,
      "trigger_words": ["fierce confidence", "powerful presence", "bold expression", "strong character"]
    }
  ]
}

export interface LoraModel {
  id: string
  name: string
  description: string
  weight_range: [number, number]
  category: string
  keywords: string[]
  default_weight: number
  trigger_words: string[]
}

export interface LoraSelection {
  id: string
  weight: number
  trigger_words: string[]
}

export interface LoraAnalysis {
  selectedLoras: LoraSelection[]
  reasoning: string
  totalWeight: number
}

/**
 * OpenAI API를 사용하여 페르소나 프롬프트를 분석하고 최적의 LoRA 조합을 선택
 */
export async function selectOptimalLoras(
  personaContent: string,
  userPreferences: {
    personaType?: string
    desiredStyle?: string
    visualPreferences?: string
    personalityTraits?: string
  }
): Promise<LoraAnalysis> {
  try {
    console.log('🤖 selectOptimalLoras 함수 시작')
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.error('❌ OpenAI API key not found in selectOptimalLoras')
      throw new Error('OpenAI API key not found')
    }
    console.log('✅ OpenAI API key found in selectOptimalLoras')

    // 페르소나 내용을 요약하여 분석용 프롬프트 생성
    console.log('🔄 summarizePersonaForLora 호출 중...')
    const analysisPrompt = summarizePersonaForLora(personaContent, userPreferences)
    console.log('✅ analysisPrompt 생성 완료')
    
    console.log('🤖 AI LoRA 분석 시작:', analysisPrompt.substring(0, 100) + '...')

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are an expert AI image generation consultant specializing in LoRA (Low-Rank Adaptation) model selection for Korean female persona image generation.

Your task is to analyze persona descriptions and select the most suitable LoRA models from the available database to create diverse and appealing Korean female faces.

Available LoRA Models:
${JSON.stringify(loraDatabase.lora_models, null, 2)}

Selection Rules:
- Maximum 3 LoRA models per generation
- Primary LoRA: weight 0.85-0.95 (main style - high quality)
- Secondary LoRA: weight 0.8-0.9 (supporting features - professional level)  
- Tertiary LoRA: weight 0.75-0.85 (accent features - refined quality)
- Total combined weight should not exceed 3.0 (increased for luxury quality)
- Prioritize luxury, celebrity, and professional-grade LoRA models
- For influencers/actresses: Use luxury-beauty, celebrity-aura, professional-makeup
- Use natural language trigger words like "red carpet ready", "magazine quality", "studio lighting"
- Emphasize photorealistic, cinematic quality for professional results

Response Format (JSON only):
{
  "selectedLoras": [
    {
      "id": "model-id",
      "weight": 0.8,
      "trigger_words": ["keyword1", "keyword2"]
    }
  ],
  "reasoning": "Brief explanation of selection logic",
  "totalWeight": 1.6
}

Respond with JSON only, no additional text.`
          },
          {
            role: 'user',
            content: `Analyze this persona and select optimal LoRA models:

${analysisPrompt}

Select LoRA models that will create a distinctive and appealing Korean female appearance matching this persona's characteristics.`
          }
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content

    if (!content) {
      throw new Error('No response from OpenAI')
    }

    // JSON 응답 파싱
    let analysis: LoraAnalysis
    try {
      analysis = JSON.parse(content)
      console.log('✅ AI LoRA 분석 완료:', analysis)
    } catch (parseError) {
      console.error('❌ JSON 파싱 실패:', content)
      // 기본값으로 폴백
      analysis = getDefaultLoraSelection(userPreferences)
    }

    // 선택된 LoRA 모델 검증 및 조정
    analysis = validateAndAdjustSelection(analysis)
    
    return analysis

  } catch (error) {
    console.error('❌ AI LoRA 선택 오류:', error)
    console.error('❌ LoRA 선택 에러 스택:', error instanceof Error ? error.stack : 'No stack trace')
    // 오류 시 기본 선택사항 반환
    console.log('🔄 기본 LoRA 선택사항으로 폴백')
    return getDefaultLoraSelection(userPreferences)
  }
}

/**
 * 페르소나 내용을 LoRA 분석에 적합한 형태로 요약
 */
function summarizePersonaForLora(
  personaContent: string, 
  userPreferences: any
): string {
  // 페르소나에서 핵심 정보 추출
  const summary = `
Persona Type: ${userPreferences.personaType || 'AI 인플루언서'}
Desired Style: ${userPreferences.desiredStyle || '모던하고 세련된'}
Visual Preferences: ${userPreferences.visualPreferences || '자연스럽고 우아한'}
Personality Traits: ${userPreferences.personalityTraits || '친근하고 매력적인'}

Key Persona Elements:
${personaContent.substring(0, 1000)}...

Focus on selecting LoRA models that will create a unique and appealing Korean female appearance that matches these characteristics.
  `.trim()

  return summary
}

/**
 * 기본 LoRA 선택사항 (AI 분석 실패 시 사용)
 */
function getDefaultLoraSelection(userPreferences: any): LoraAnalysis {
  const personaType = userPreferences.personaType?.toLowerCase() || ''
  
  let selectedLoras: LoraSelection[]

  if (personaType.includes('idol') || personaType.includes('가수') || personaType.includes('singer')) {
    selectedLoras = [
      { id: 'idol-lora', weight: 0.95, trigger_words: ['kpop idol', 'stage makeup', 'idol beauty'] },
      { id: 'celebrity-aura', weight: 0.85, trigger_words: ['celebrity aura', 'star quality', 'red carpet ready'] },
      { id: 'professional-makeup', weight: 0.8, trigger_words: ['professional makeup', 'studio quality'] }
    ]
  } else if (personaType.includes('actress') || personaType.includes('배우')) {
    selectedLoras = [
      { id: 'actress-beauty', weight: 0.95, trigger_words: ['actress beauty', 'cinematic quality', 'dramatic expression'] },
      { id: 'celebrity-aura', weight: 0.9, trigger_words: ['celebrity aura', 'star quality', 'captivating presence'] },
      { id: 'luxury-beauty', weight: 0.85, trigger_words: ['luxury beauty', 'premium makeup', 'sophisticated look'] }
    ]
  } else if (personaType.includes('model') || personaType.includes('모델')) {
    selectedLoras = [
      { id: 'fashion-model', weight: 0.95, trigger_words: ['fashion model', 'editorial style', 'runway beauty'] },
      { id: 'editorial-fashion', weight: 0.9, trigger_words: ['editorial fashion', 'magazine quality', 'high fashion styling'] },
      { id: 'luxury-beauty', weight: 0.85, trigger_words: ['luxury beauty', 'premium makeup'] }
    ]
  } else if (personaType.includes('influencer') || personaType.includes('인플루언서')) {
    selectedLoras = [
      { id: 'influencer-beauty', weight: 0.95, trigger_words: ['influencer beauty', 'perfect skin', 'social media ready'] },
      { id: 'luxury-beauty', weight: 0.9, trigger_words: ['luxury beauty', 'premium makeup', 'high-end styling'] },
      { id: 'celebrity-aura', weight: 0.85, trigger_words: ['celebrity aura', 'star quality'] }
    ]
  } else if (personaType.includes('content creator') || personaType.includes('크리에이터')) {
    selectedLoras = [
      { id: 'street-chic', weight: 0.9, trigger_words: ['street chic', 'urban style', 'trendy fashion'] },
      { id: 'commercial-beauty', weight: 0.85, trigger_words: ['commercial beauty', 'friendly smile', 'clean beauty'] },
      { id: 'artistic-portrait', weight: 0.8, trigger_words: ['artistic portrait', 'creative expression'] }
    ]
  } else if (personaType.includes('vtuber') || personaType.includes('버튜버')) {
    selectedLoras = [
      { id: 'ethereal-beauty', weight: 0.9, trigger_words: ['ethereal beauty', 'dreamy appearance', 'mystical aura'] },
      { id: 'commercial-beauty', weight: 0.85, trigger_words: ['commercial beauty', 'friendly smile', 'fresh appearance'] },
      { id: 'artistic-portrait', weight: 0.8, trigger_words: ['artistic portrait', 'unique style'] }
    ]
  } else if (personaType.includes('professional') || personaType.includes('전문')) {
    selectedLoras = [
      { id: 'professional-makeup', weight: 0.9, trigger_words: ['professional makeup', 'studio quality', 'editorial makeup'] },
      { id: 'luxury-beauty', weight: 0.85, trigger_words: ['luxury beauty', 'sophisticated look'] },
      { id: 'realistic-korean', weight: 0.8, trigger_words: ['realistic korean', 'natural features'] }
    ]
  } else if (personaType.includes('glamour') || personaType.includes('글래머')) {
    selectedLoras = [
      { id: 'glamour-model', weight: 0.95, trigger_words: ['glamour model', 'seductive pose', 'alluring gaze'] },
      { id: 'fierce-confidence', weight: 0.9, trigger_words: ['fierce confidence', 'powerful presence', 'bold expression'] },
      { id: 'luxury-beauty', weight: 0.85, trigger_words: ['luxury beauty', 'premium makeup'] }
    ]
  } else if (personaType.includes('vintage') || personaType.includes('클래식')) {
    selectedLoras = [
      { id: 'vintage-elegance', weight: 0.9, trigger_words: ['vintage elegance', 'classic beauty', 'timeless style'] },
      { id: 'luxury-beauty', weight: 0.85, trigger_words: ['luxury beauty', 'sophisticated look'] },
      { id: 'realistic-korean', weight: 0.8, trigger_words: ['realistic korean', 'natural features'] }
    ]
  } else {
    // 기본값: AI 인플루언서 (고급 설정)
    selectedLoras = [
      { id: 'influencer-beauty', weight: 0.95, trigger_words: ['influencer beauty', 'perfect skin', 'social media ready'] },
      { id: 'luxury-beauty', weight: 0.9, trigger_words: ['luxury beauty', 'premium makeup', 'high-end styling'] },
      { id: 'celebrity-aura', weight: 0.85, trigger_words: ['celebrity aura', 'star quality'] }
    ]
  }

  const totalWeight = selectedLoras.reduce((sum, lora) => sum + lora.weight, 0)

  return {
    selectedLoras,
    reasoning: `기본 선택: ${userPreferences.personaType || 'AI 인플루언서'} 타입에 적합한 LoRA 조합`,
    totalWeight
  }
}

/**
 * 선택된 LoRA 모델들을 검증하고 필요시 조정
 */
function validateAndAdjustSelection(analysis: LoraAnalysis): LoraAnalysis {
  const availableModels = loraDatabase.lora_models
  const validLoras: LoraSelection[] = []

  // 유효한 LoRA만 필터링
  for (const selectedLora of analysis.selectedLoras) {
    const model = availableModels.find(m => m.id === selectedLora.id)
    if (model) {
      // 가중치 범위 조정
      const [minWeight, maxWeight] = model.weight_range
      const adjustedWeight = Math.max(minWeight, Math.min(maxWeight, selectedLora.weight))
      
      validLoras.push({
        ...selectedLora,
        weight: adjustedWeight,
        trigger_words: selectedLora.trigger_words || model.trigger_words
      })
    }
  }

  // 최대 3개로 제한
  const limitedLoras = validLoras.slice(0, 3)
  const totalWeight = limitedLoras.reduce((sum, lora) => sum + lora.weight, 0)

  // 총 가중치가 3.0을 초과하면 조정 (고급 설정으로 한도 증가)
  if (totalWeight > 3.0) {
    const scaleFactor = 3.0 / totalWeight
    limitedLoras.forEach(lora => {
      lora.weight = Math.round(lora.weight * scaleFactor * 100) / 100
    })
  }

  return {
    selectedLoras: limitedLoras,
    reasoning: analysis.reasoning,
    totalWeight: limitedLoras.reduce((sum, lora) => sum + lora.weight, 0)
  }
}

/**
 * LoRA 파라미터를 Replicate API 형식으로 변환
 */
export function buildLoraParams(loraAnalysis: LoraAnalysis): Record<string, any> {
  const params: Record<string, any> = {}
  
  loraAnalysis.selectedLoras.forEach((lora, index) => {
    // Replicate flux-dev-lora 형식에 맞춰 파라미터 구성
    params[`lora_${index + 1}`] = lora.id
    params[`lora_${index + 1}_weight`] = lora.weight
  })

  console.log('🔧 LoRA 파라미터 구성:', params)
  return params
}

/**
 * LoRA 트리거 워드들을 프롬프트에 통합
 */
export function integrateLoraTriggersToPrompt(
  originalPrompt: string, 
  loraAnalysis: LoraAnalysis
): string {
  const triggerWords = loraAnalysis.selectedLoras
    .flatMap(lora => lora.trigger_words)
    .join(', ')
  
  if (triggerWords) {
    // LoRA 효과 강화를 위해 트리거 워드를 앞에 배치하고 강조
    return `LORA_ENHANCED: ${triggerWords}, masterpiece quality, ultra-detailed, ${originalPrompt}`
  }
  
  return originalPrompt
}

/**
 * 수동 LoRA 선택을 처리하는 함수
 */
export function processManualLoraSelection(manualSelection: {
  lora1: string,
  lora2?: string | null,
  lora3?: string | null
}): LoraAnalysis {
  const availableModels = loraDatabase.lora_models
  const selectedLoras: LoraSelection[] = []
  
  console.log('🎯 수동 LoRA 선택 처리 시작:', manualSelection)
  
  // 각 LoRA 모델 처리
  const loraIds = [manualSelection.lora1, manualSelection.lora2, manualSelection.lora3].filter(Boolean)
  
  loraIds.forEach((loraId, index) => {
    const model = availableModels.find(m => m.id === loraId)
    if (model) {
      // 가중치 설정 (수동 선택 시 더 높게 설정하여 LoRA 효과 극대화)
      const weight = index === 0 ? 0.95 : (index === 1 ? 0.9 : 0.85)
      
      selectedLoras.push({
        id: model.id,
        weight: weight,
        trigger_words: model.trigger_words
      })
      
      console.log(`✅ LoRA ${index + 1} 추가: ${model.name} (weight: ${weight})`)
    } else {
      console.log(`❌ LoRA ID '${loraId}' 데이터베이스에서 찾을 수 없음`)
    }
  })
  
  const totalWeight = selectedLoras.reduce((sum, lora) => sum + lora.weight, 0)
  
  const result = {
    selectedLoras,
    reasoning: `수동 선택: ${selectedLoras.map(l => l.id).join(', ')}`,
    totalWeight
  }
  
  console.log('✅ 수동 LoRA 선택 처리 완료:', result)
  return result
}

/**
 * 토큰 사용량 추정 (LoRA 분석용)
 */
export function estimateLoraTokenUsage(): number {
  // OpenAI API 호출 시 대략적인 토큰 사용량
  // 시스템 프롬프트 + 사용자 프롬프트 + 응답
  return 1200
}