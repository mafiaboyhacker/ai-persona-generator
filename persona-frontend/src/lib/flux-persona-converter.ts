/**
 * Flux Persona Master Converter - TypeScript Version
 * 페르소나 프로필을 Flux 1.1 Pro 최적화 프롬프트로 변환하는 통합 시스템
 * 
 * 핵심 원칙:
 * 1. 사용자 입력 100% 보존
 * 2. 여성 매력 극대화
 * 3. 타입별 매력 DNA 완벽 구현
 * 4. Flux 1.1 Pro 성능 최대화
 */

// ==================== 타입 정의 ====================

// 페르소나 타입 정규화 (한국어 → 영어, 영어 → 영어 유지)
const PERSONA_TYPE_TRANSLATION: Record<string, string> = {
  // 기존 한국어 매핑 (하위 호환성)
  'AI 인플루언서': 'AI influencer',
  '배우': 'actress',
  '가수': 'singer',
  '버튜버': 'VTuber',
  '모델': 'model',
  '크리에이터': 'content creator',
  '기타': 'professional',
  // 새로운 영어 입력 매핑 (직접 사용)
  'AI influencer': 'AI influencer',
  'actress': 'actress',
  'singer': 'singer',
  'VTuber': 'VTuber',
  'model': 'model',
  'content creator': 'content creator',
  'professional': 'professional'
};

/**
 * 페르소나 타입을 영어로 정규화 (한국어 입력 시 영어로 변환, 영어 입력 시 그대로 유지)
 */
function normalizePersonaType(inputType: string): string {
  return PERSONA_TYPE_TRANSLATION[inputType] || inputType;
}

export interface UserSettings {
  personaType: string;
  desiredStyle: string;
  personalityTraits?: string;
  background?: string;
  visualPreferences?: string;
  allowNsfw?: boolean;
  allowRandomGeneration?: boolean;
}

export interface PersonaElements {
  name: string;
  age: string;
  appearance: {
    face: string;
    hair: string;
    body: string;
    style: string;
  };
  personality: {
    traits: string[];
    mood: string;
    expression: string;
  };
  background: string;
  profession: string;
  characteristics: string[];
}

export interface VisualMapping {
  subject: string;
  appearance: string;
  expression: string;
  pose: string;
  clothing: string;
  environment: string;
  lighting: string;
  composition: string;
  typeKeywords: string[];
  beautyEnhancement?: string;
  glamorousStyle?: string;
  idolQuality?: string;
  randomElement?: string;
}

export interface OptimizedData {
  filePrefix: string;
  qualityTags: string;
  technicalDetails: string;
  typeKeywords: string;
  photographyStyle: string;
  cameraSettings: string;
  visualMapping: VisualMapping;
}

export interface ValidationResult {
  isValid: boolean;
  score: number;
  issues: string[];
  suggestions: string[];
}

// ==================== 타입별 매력 DNA 정의 ====================

export const PERSONA_TYPE_DNA = {
  'AI 인플루언서': {
    core_essence: 'A digitally native individual who embodies the perfect blend of technological sophistication and authentic human connection, mastering the art of social media presence with natural grace',
    primary_attraction: 'captured from the perfect selfie angle that showcases her Instagram-worthy beauty with trendy modern appeal that seems effortlessly natural',
    secondary_attraction: 'dressed in contemporary fashion with urban chic styling that creates an engaging social presence, perfectly balancing accessibility with aspirational appeal',
    tertiary_attraction: 'demonstrating her trend curation ability and lifestyle influence through her authentic digital communication style that connects with audiences',
    visual_keywords: [
      'photographed from the perfect selfie angle with Instagram-worthy composition',
      'displaying trendy modern beauty that appears social media optimized yet natural',
      'wearing contemporary fashion with urban chic styling and approachable elegance',
      'featuring natural filter-like effect with engaging smile and lifestyle influencer aesthetic',
      'showcasing brand-ready visual appeal with Gen Z sensibility and authentic charm'
    ],
    environment: 'set against a modern urban background featuring trendy cafe ambiance or stylish apartment interior that reflects contemporary lifestyle',
    lighting: 'illuminated by natural daylight enhanced with soft ring light effects, creating Instagram-style lighting that flatters her features perfectly',
    pose: 'positioned in a confident social media pose with selfie-ready angle and engaging gesture that invites viewer connection'
  },
  
  '배우': {
    core_essence: 'An artist who embodies dramatic charisma with screen-perfect visual presence, possessing the rare ability to convey deep emotions through subtle expressions and commanding attention through pure talent',
    primary_attraction: 'showcasing dramatic beauty with classical elegance and captivating screen presence that draws viewers into her performance',
    secondary_attraction: 'revealing emotional expression depth through sophisticated styling with cinematic quality that elevates every frame she appears in',
    tertiary_attraction: 'demonstrating acting versatility and character immersion with memorable presence that leaves lasting impact on audiences',
    visual_keywords: [
      'displaying dramatic beauty with classical Korean actress elegance and cinematic quality',
      'captured in professional headshot style with elegant sophistication and emotional depth',
      'featuring expressive eyes and graceful posture that convey timeless beauty',
      'showcasing screen-worthy visual appeal with theatrical presence and refined features',
      'emanating captivating presence with award-winning actress aura and professional excellence'
    ],
    environment: 'positioned against an elegant studio background with classical interior elements and sophisticated setting that enhances her dramatic presence',
    lighting: 'enhanced by dramatic professional lighting with cinematic three-point lighting setup that creates depth and emotional resonance',
    pose: 'captured in professional headshot pose with elegant posture and expressive gesture that conveys her artistic depth'
  },
  
  '가수': {
    core_essence: 'A musical artist who radiates artistic sensibility with an innate musical aura, possessing the unique ability to transform emotions into visual expression and connect with audiences through her creative spirit',
    primary_attraction: 'embodying artistic beauty with musical expression and commanding stage presence that captivates audiences through her natural performer instincts',
    secondary_attraction: 'enhanced by creative styling and performance charisma with artistic flair that reflects her musical identity and creative vision',
    tertiary_attraction: 'showcasing musical talent through stage transformation and authentic fan connection that creates lasting emotional bonds',
    visual_keywords: [
      'radiating artistic beauty with musical aura and commanding stage presence',
      'displaying creative expression with performer charisma in dynamic pose',
      'enhanced by concert lighting effects with artistic makeup and creative styling',
      'showing passionate expression with artist authenticity and performance readiness',
      'embodying creative freedom through musical storytelling and emotional connection'
    ],
    environment: 'captured in creative studio setting with stage-like atmosphere and artistic background that reflects her musical world',
    lighting: 'illuminated by dynamic colorful lighting with stage lighting effects and creative illumination that enhances her artistic presence',
    pose: 'positioned in artistic expressive pose with performance stance and creative gesture that conveys her musical passion'
  },
  
  '버튜버': {
    core_essence: 'A virtual performer who embodies pure charm with intimate fan connection, creating a bridge between digital and human worlds through her authentic personality and genuine care for her community',
    primary_attraction: 'radiating kawaii aesthetic with innocent appeal and bright cheerful energy that brings joy and comfort to viewers',
    secondary_attraction: 'enhanced by colorful styling and playful personality with fan-friendly appearance that creates immediate emotional connection',
    tertiary_attraction: 'fostering authentic communication and unique character development with special fan bond that transcends virtual boundaries',
    visual_keywords: [
      'embodying kawaii aesthetic with anime-inspired beauty and bright cheerful expression',
      'displaying cute gestures with colorful styling and youthful charm',
      'featuring big expressive eyes with innocent appeal and playful personality',
      'showcasing virtual idol charm with fan-friendly appearance and adorable features',
      'radiating energetic vibe in streaming setup background with interactive elements'
    ],
    environment: 'set in colorful vibrant background with streaming setup elements and cute room decoration that reflects her virtual world',
    lighting: 'illuminated by bright cheerful lighting with colorful LED lighting effects that create a warm, inviting atmosphere',
    pose: 'positioned in cute playful pose with anime-inspired gesture and energetic stance that invites viewer interaction'
  },
  
  '모델': {
    core_essence: 'A professional model who embodies perfect visual excellence with professional mastery, possessing the rare combination of natural beauty and trained expertise that transforms every photograph into art',
    primary_attraction: 'showcasing supermodel beauty with perfect proportions and flawless appearance that sets the standard for visual excellence',
    secondary_attraction: 'enhanced by high fashion styling and professional posing with luxury aesthetic that elevates every frame',
    tertiary_attraction: 'representing brand excellence through commercial appeal and visual perfection that creates lasting brand association',
    visual_keywords: [
      'displaying supermodel beauty with perfect proportions and high fashion sensibility',
      'showcasing professional modeling skills with editorial quality and luxury aesthetic',
      'featuring flawless skin with statuesque elegance in designer fashion',
      'demonstrating commercial appeal with versatile beauty and camera-ready presence',
      'embodying fashion magazine quality with premium brand image and professional excellence'
    ],
    environment: 'captured in professional studio setup with luxury setting and fashion background that complements her high-end aesthetic',
    lighting: 'enhanced by precise studio lighting with controlled shadows and professional photography lighting that sculpts her features perfectly',
    pose: 'positioned in high fashion model pose with professional stance and editorial posing that showcases her modeling expertise'
  },
  
  '크리에이터': {
    core_essence: 'A creative professional who embodies authentic individuality with genuine creative expression, possessing the unique ability to inspire others through her original vision and honest connection with her craft',
    primary_attraction: 'radiating authentic charm with natural beauty and genuine expression that creates immediate trust and connection with viewers',
    secondary_attraction: 'enhanced by creative personality and individualistic style with artistic flair that sets her apart from conventional creators',
    tertiary_attraction: 'demonstrating professional expertise through authentic communication and creative quality that builds lasting audience relationships',
    visual_keywords: [
      'embodying authentic charm with creative personality and natural beauty',
      'displaying artistic expression with genuine smile in creative workspace setting',
      'showcasing individualistic style with approachable elegance and artistic flair',
      'featuring content creator aesthetic with casual sophistication and creative tools',
      'radiating authentic lifestyle with professional creativity and personal warmth'
    ],
    environment: 'positioned in creative workspace background with artistic studio elements and natural setting that reflects her authentic creative process',
    lighting: 'illuminated by natural warm lighting with creative studio lighting that enhances her genuine personality and artistic spirit',
    pose: 'captured in natural authentic pose with creative gesture and relaxed confidence that invites viewer engagement'
  }
} as const;

// ==================== 여성 매력 계층별 강화 시스템 ====================

export const FEMALE_ATTRACTION_LAYERS = {
  // 1차 매력 - 즉시 인지되는 완벽한 얼굴 (K-pop 스타일 참고)
  primary: {
    facial_perfection: [
      'perfect Korean beauty standards with flawless facial harmony and delicate features',
      'large expressive eyes with natural double eyelids and captivating gaze',
      'straight nose bridge with elegant proportions and refined shape',
      'heart-shaped face with soft delicate features and perfect symmetry',
      'gradient lips with natural pink tone and perfect cupid bow shape',
      'porcelain skin with glass skin effect and natural radiant glow',
      'flawless complexion with dewy finish and healthy luminous appearance'
    ],
    beauty_enhancement: [
      'breathtakingly beautiful 23-year-old Korean female with perfect idol-like features',
      'stunningly gorgeous Korean beauty with flawless visual appeal',
      'exceptionally beautiful with Korean idol-level charm and sophistication',
      'displaying breathtakingly pretty characteristics with K-pop star quality',
      'embodying absolutely stunning Korean beauty standards with idol presence',
      'manifesting extraordinarily beautiful features with perfect Korean facial harmony'
    ]
  },
  
  // 2차 매력 - 지속적 관심을 끄는 스타일과 분위기
  secondary: {
    glamorous_styling: [
      'styled with glamorous sophistication, displaying elegant posture that conveys confidence and poise',
      'wearing sophisticated fashion that perfectly complements her natural beauty and enhances her silhouette',
      'featuring perfect hair that flows naturally and frames her face in the most flattering way',
      'possessing graceful movement and refined elegance that speaks to her cultivated taste',
      'radiating an alluring presence with magnetic charm that makes her impossible to ignore',
      'embodying luxurious appearance with captivating style that sets her apart from others'
    ],
    body_attraction: [
      'having a perfect figure with ideal body proportions that exemplify feminine beauty',
      'displaying a graceful physique with elegant silhouette that moves with natural grace',
      'showcasing attractive curves that are perfectly balanced and naturally beautiful',
      'possessing a model-like body with statuesque figure and perfect posture',
      'embodying feminine grace in every movement and gesture with natural elegance'
    ]
  },
  
  // 3차 매력 - 팬덤 형성하는 전문성과 개성
  tertiary: {
    professional_excellence: [
      'demonstrating professional excellence with expert-level skills that showcase her industry-leading talent',
      'possessing charismatic presence that creates memorable character and distinctive style',
      'displaying authentic voice and unique personality that reveals her exceptional ability',
      'embodying mastery of her craft with refined technique and artistic sensibility'
    ],
    idol_quality: [
      'radiating idol-level beauty with star quality that commands attention and admiration',
      'possessing celebrity aura with superstar presence that meets entertainment industry standards',
      'displaying fan-magnetizing charm with idol-worthy visual appeal that creates lasting impact',
      'embodying star material with the kind of presence that naturally draws devoted followers'
    ]
  }
} as const;

// ==================== Flux 1.1 Pro 최적화 엔진 ====================

export const FLUX_OPTIMIZATION_ENGINE = {
  // Flux 1.1 Pro에 최적화된 품질 향상 키워드 (실사 강조)
  quality_tags: [
    '8K UHD resolution, photorealistic, masterpiece quality, ultra-realistic',
    'hyper-realistic portrait photography with exceptional detail and clarity, lifelike skin texture', 
    'professional studio photography with perfect lighting and composition, realistic human features',
    'highly detailed skin texture with professional retouching standard, photorealistic rendering',
    'commercial photography quality with flawless execution, realistic portrait photography',
    'ultra-high definition with perfect focus and realistic rendering, lifelike appearance'
  ],
  
  // Flux 1.1 Pro에 효과적인 기술적 디테일 (실사 강조)
  technical_details: [
    'soft studio lighting with key light and rim light setup, realistic skin illumination',
    'professional three-point lighting with perfect exposure, natural human skin tones',
    'shallow depth of field with beautiful bokeh background blur, lifelike depth perception',
    'natural studio lighting with controlled shadows and highlights, photorealistic lighting',
    'cinematic lighting quality with dramatic depth and contrast, realistic human proportions',
    'perfect lighting balance with natural skin tone rendering, authentic human appearance'
  ],
  
  // Flux 1.1 Pro 특화 현실감 강화 요소 (구체적 카메라 설정, 실사 강조)
  camera_settings: [
    'shot with Canon EOS R5 85mm f/1.4 lens, ultra-realistic human photography',
    'captured with Canon EOS R5 50mm f/1.2 for perfect portrait depth, photorealistic details',
    'professional Canon EOS R5 camera with 85mm portrait lens, lifelike skin texture',
    'shot with high-end DSLR Canon EOS R5 system, realistic human features',
    'captured with professional portrait lens 85mm f/1.4, authentic human appearance',
    'commercial photography setup with Canon EOS R5 quality, photorealistic rendering'
  ],
  
  // Flux 1.1 Pro 최적화 촬영 스타일 (실사 강조)
  photography_styles: [
    'professional headshot photography with commercial quality, photorealistic human features',
    'K-pop idol promotional photo style with perfect execution, ultra-realistic skin texture',
    'fashion photography with editorial standards and luxury aesthetic, lifelike appearance',
    'portrait photography with natural lighting and authentic expressions, realistic human photography',
    'beauty photography with perfect skin texture and flawless details, photorealistic rendering',
    'commercial photography with brand-ready visual appeal, authentic human realism'
  ]
} as const;

// ==================== 핵심 변환 함수들 ====================

/**
 * 페르소나 프로필에서 핵심 요소 추출
 */
export function extractPersonaElements(personaProfile: string): PersonaElements {
  const elements: PersonaElements = {
    name: '',
    age: '',
    appearance: {
      face: '',
      hair: '',
      body: '',
      style: ''
    },
    personality: {
      traits: [],
      mood: '',
      expression: ''
    },
    background: '',
    profession: '',
    characteristics: []
  };
  
  // 이름 추출
  const nameMatch = personaProfile.match(/(?:이름|명칭|Name):\s*([^\n]+)/i);
  if (nameMatch) elements.name = nameMatch[1].trim();
  
  // 나이 추출
  const ageMatch = personaProfile.match(/(?:나이|연령|Age):\s*([^\n]+)/i);
  if (ageMatch) elements.age = ageMatch[1].trim();
  
  // 외모 정보 추출
  const appearanceSection = personaProfile.match(/(?:외모|외관|외형|Appearance)[\s\S]*?(?=##|$)/i);
  if (appearanceSection) {
    const appearanceText = appearanceSection[0];
    elements.appearance.face = extractFacialFeatures(appearanceText);
    elements.appearance.hair = extractHairDescription(appearanceText);
    elements.appearance.body = extractBodyDescription(appearanceText);
    elements.appearance.style = extractStyleDescription(appearanceText);
  }
  
  // 성격 정보 추출
  const personalitySection = personaProfile.match(/(?:성격|심리|감정|Personality)[\s\S]*?(?=##|$)/i);
  if (personalitySection) {
    const personalityText = personalitySection[0];
    elements.personality.traits = extractPersonalityTraits(personalityText);
    elements.personality.mood = extractMoodDescription(personalityText);
    elements.personality.expression = extractExpressionDescription(personalityText);
  }
  
  return elements;
}

/**
 * 얼굴 특징 추출 (확장된 한국어 패턴)
 */
function extractFacialFeatures(text: string): string {
  const features: string[] = [];
  
  // 눈 관련 (확장)
  if (text.match(/(?:큰|아름다운|매력적인|반짝이는|또렷한|선명한|생생한|깊은|신비로운|매혹적인|빛나는|영롱한|화려한|도톰한|시원한|날카로운|커다란|동그란|아몬드형|고양이).*?눈/)) {
    features.push('captivating expressive eyes');
  }
  if (text.match(/(?:이중|쌍|겹).*?눈꺼풀/)) {
    features.push('beautiful double eyelid');
  }
  if (text.match(/(?:긴|짧은|두꺼운|얇은|진한|자연스러운|카리스마|섹시한).*?(?:속눈썹|눈썹)/)) {
    features.push('well-defined eyebrows and lashes');
  }
  
  // 코 관련 (확장)
  if (text.match(/(?:높은|오똑한|예쁜|곧은|서구적인|콧대|스트레이트|날씬한|세련된|조각같은|완벽한|균형잡힌|우아한|자연스러운|매력적인).*?코/)) {
    features.push('elegant refined nose');
  }
  if (text.match(/(?:작은|아담한|귀여운|동그란|쪼꼼한).*?코/)) {
    features.push('cute petite nose');
  }
  
  // 입 관련 (확장)
  if (text.match(/(?:예쁜|매력적인|아름다운|도톰한|부드러운|섹시한|선명한|붉은|핑크|자연스러운|윤기나는|촉촉한|미소|웃는|하트형|꽃잎).*?입/)) {
    features.push('beautiful alluring lips');
  }
  if (text.match(/(?:하얀|깨끗한|가지런한|완벽한|밝은|반짝이는).*?(?:이|치아|이빨)/)) {
    features.push('perfect white teeth');
  }
  
  // 얼굴형 관련 (확장)
  if (text.match(/(?:갸름한|브이라인|V라인|날씬한|샤프한|세련된|조각같은).*?얼굴/)) {
    features.push('elegant V-line face shape');
  }
  if (text.match(/(?:둥근|동그란|귀여운|아기|애기|포근한|사랑스러운).*?얼굴/)) {
    features.push('cute round face shape');
  }
  if (text.match(/(?:타원형|계란형|완벽한|이상적인|황금비율|균형잡힌|고급스러운).*?얼굴/)) {
    features.push('perfect oval face shape');
  }
  if (text.match(/(?:각진|사각|남성적인|카리스마|강인한|시크한).*?얼굴/)) {
    features.push('sophisticated angular face shape');
  }
  
  // 피부 관련 (추가)
  if (text.match(/(?:깨끗한|하얀|투명한|윤기나는|촉촉한|부드러운|매끄러운|글로우|빛나는|밝은|맑은|뽀얀|우윳빛|도자기|글래스|glassskin|꿀광|물광).*?피부/)) {
    features.push('flawless glowing skin');
  }
  if (text.match(/(?:건강한|생기있는|화사한|활기찬|핑크빛|장미빛|복숭아빛).*?피부/)) {
    features.push('healthy radiant skin');
  }
  
  // 전체적인 얼굴 분위기 (추가)
  if (text.match(/(?:청순한|순수한|맑은|깨끗한|천사같은|인형같은|동화같은|몽환적인|환상적인|신비로운|고혹적인|요염한|섹시한|매혹적인|카리스마|도도한|시크한|쿨톤|웜톤|지적인|우아한|고급스러운|세련된|모던한|트렌디한|자연스러운|소녀같은|여성스러운|성숙한|어른스러운).*?(?:얼굴|인상|분위기|느낌|매력|아름다움|이미지)/)) {
    features.push('captivating facial aura');
  }
  
  return features.join(', ');
}

/**
 * 헤어 스타일 추출
 */
function extractHairDescription(text: string): string {
  const hairFeatures: string[] = [];
  
  // 길이
  if (text.match(/(?:긴|장발|웨이브).*?머리/)) {
    hairFeatures.push('long hair');
  } else if (text.match(/(?:짧은|단발|밥).*?머리/)) {
    hairFeatures.push('short hair');
  }
  
  // 색상
  if (text.match(/(?:검은|흑발).*?머리/)) {
    hairFeatures.push('black hair');
  } else if (text.match(/(?:갈색|브라운).*?머리/)) {
    hairFeatures.push('brown hair');
  }
  
  // 스타일
  if (text.match(/(?:웨이브|곱슬).*?머리/)) {
    hairFeatures.push('wavy hair');
  } else if (text.match(/(?:직모|생머리).*?머리/)) {
    hairFeatures.push('straight hair');
  }
  
  return hairFeatures.join(', ');
}

/**
 * 몸매 설명 추출
 */
function extractBodyDescription(text: string): string {
  const bodyFeatures: string[] = [];
  
  if (text.match(/(?:슬림|날씬|마른).*?몸매/)) {
    bodyFeatures.push('slim figure');
  }
  if (text.match(/(?:글래머|볼륨|풍만).*?몸매/)) {
    bodyFeatures.push('glamorous figure');
  }
  if (text.match(/(?:키|큰|작은).*?(?:크다|작다|높다)/)) {
    bodyFeatures.push('ideal height');
  }
  
  return bodyFeatures.join(', ');
}

/**
 * 스타일 설명 추출 (확장된 한국어 패턴)
 */
function extractStyleDescription(text: string): string {
  const styleFeatures: string[] = [];
  
  // 모던하고 세련된 스타일 (확장)
  if (text.match(/(?:모던|세련된|현대적|트렌디한|스타일리시한|도시적|심플|미니멀|클린|깔끔한|단정한|정리된|센스있는|쿨한|시크한|젊은|프레시한|컨템포러리|감각적인)/)) {
    styleFeatures.push('modern sophisticated style');
  }
  
  // 클래식하고 우아한 스타일 (확장)
  if (text.match(/(?:클래식|우아한|고급|고상한|품격있는|품위있는|단아한|정숙한|엘레강트|럭셔리|귀족적|상류층|고전적|빈티지|앤틱|클라시컬|전통적|격조높은|세련미|고급스러운)/)) {
    styleFeatures.push('elegant classic style');
  }
  
  // 귀엽고 사랑스러운 스타일 (확장)
  if (text.match(/(?:귀여운|큐트|사랑스러운|깜찍한|예쁜|아기자기한|앙증맞은|러블리한|스위트한|달콤한|포근한|부드러운|온화한|따뜻한|친근한|친숙한|편안한|캐주얼|내추럴|순수한|청순한)/)) {
    styleFeatures.push('cute lovely style');
  }
  
  // 섹시하고 글래머러스한 스타일 (확장)
  if (text.match(/(?:섹시한|글래머러스|매혹적인|세련된|고급스러운|도시적|성숙한|어른스러운|매력적인|감각적인|유혹적인|시크한|쿨한|카리스마있는|독특한|개성있는|대담한|과감한|파워풀한|강렬한)/)) {
    styleFeatures.push('glamorous sophisticated style');
  }
  
  // 스포티하고 활동적인 스타일 (확장)
  if (text.match(/(?:스포티|액티브|활동적|건강한|활기찬|에너지넘치는|역동적|다이나믹|젊은|활발한|생동감있는|운동|체육|피트니스|헬시|상쾌한|활력있는|프레시한|발랄한|생기있는|편안한)/)) {
    styleFeatures.push('sporty active style');
  }
  
  // 아티스틱하고 창의적인 스타일 (확장)
  if (text.match(/(?:아티스틱|예술적|창의적|개성있는|독특한|개성적|유니크|특별한|독창적|실험적|혁신적|모던아트|현대미술|감각적|색다른|참신한|새로운|혁신|전위적|보헤미안|히피|자유로운)/)) {
    styleFeatures.push('artistic creative style');
  }
  
  // 비즈니스하고 전문적인 스타일 (확장)
  if (text.match(/(?:비즈니스|프로페셔널|전문적|업무|오피스|포멀|정장|수트|격식있는|공식적|단정한|깔끔한|정리된|체계적|완벽한|신중한|차분한|안정적|신뢰할수있는|성실한)/)) {
    styleFeatures.push('professional business style');
  }
  
  // 로맨틱하고 페미닌한 스타일 (확장)
  if (text.match(/(?:로맨틱|페미닌|여성스러운|로맨스|낭만적|드레시|프린세스|공주|꽃|플라워|레이스|시폰|파스텔|핑크|로즈|리본|프릴|드레스|여신|엔젤|엘프|요정|비너스)/)) {
    styleFeatures.push('romantic feminine style');
  }
  
  // 스트리트하고 캐주얼한 스타일 (확장)
  if (text.match(/(?:스트리트|캐주얼|편안한|일상|데일리|자연스러운|내추럴|릴렉스|여유로운|느긋한|자유로운|무심한|힙|힙스터|젊은|트렌디|유스|대학생|청춘|소녀|레저|휴일|바캉스)/)) {
    styleFeatures.push('casual street style');
  }
  
  // 고딕하고 다크한 스타일 (확장)
  if (text.match(/(?:고딕|다크|어둠|블랙|검은|차가운|쿨|시크|미스터리|신비|고독|독특|개성|펑크|록|메탈|하드|강렬|카리스마|매혹|유혹|섹시|도도한|독립적|강인한)/)) {
    styleFeatures.push('gothic dark style');
  }
  
  return styleFeatures.join(', ');
}

/**
 * 성격 특성 추출 (확장된 한국어 패턴)
 */
function extractPersonalityTraits(text: string): string[] {
  const traits: string[] = [];
  
  // 밝고 긍정적인 성격 (확장)
  if (text.match(/(?:밝은|활발한|활기찬|쾌활한|긍정적인|명랑한|생기발랄한|에너지넘치는|유쾌한|생동감있는|화사한|기운찬|발랄한|톡톡튀는|싱그러운|상쾌한|생생한|활력있는|역동적인|생기있는)/)) {
    traits.push('bright and lively personality');
  }
  
  // 차분하고 안정적인 성격 (확장)
  if (text.match(/(?:차분한|조용한|평온한|안정적인|담담한|고요한|침착한|냉정한|신중한|점잖은|얌전한|수줍은|내성적인|온화한|부드러운|섬세한|우아한|정적인|편안한|여유로운)/)) {
    traits.push('calm and serene personality');
  }
  
  // 자신감 있는 성격 (확장)
  if (text.match(/(?:자신감|당당한|자신있는|확신에찬|대담한|과감한|거침없는|적극적인|진취적인|리더십|카리스마|카리스마있는|강인한|의지가강한|결단력있는|추진력있는|용감한|패기넘치는|도전적인|자기주도적)/)) {
    traits.push('confident and charismatic');
  }
  
  // 친근하고 따뜻한 성격 (확장)
  if (text.match(/(?:친근한|따뜻한|친화적인|상냥한|다정한|자상한|배려심깊은|친절한|온순한|포근한|다가가기쉬운|사교적인|인간적인|정감있는|마음씨좋은|사랑스러운|다정다감한|인정많은|의리있는|정이많은)/)) {
    traits.push('warm and approachable');
  }
  
  // 신비롭고 매력적인 성격 (확장)
  if (text.match(/(?:신비로운|미스터리|신비스러운|수수께끼같은|알수없는|독특한|개성있는|특별한|독창적인|매혹적인|매력적인|유혹적인|감각적인|도도한|고급스러운|우아한|세련된|지적인|철학적인|예술적인)/)) {
    traits.push('mysterious and captivating');
  }
  
  // 귀엽고 순수한 성격 (확장)
  if (text.match(/(?:귀여운|깜찍한|사랑스러운|순수한|천진난만한|순진한|해맑은|맑은|청순한|깨끗한|순수무구한|어린아이같은|장난스러운|발랄한|까불거리는|엉뚱한|재미있는|유머러스한|개구쟁이|무해한)/)) {
    traits.push('cute and innocent charm');
  }
  
  // 성숙하고 지적인 성격 (확장)
  if (text.match(/(?:성숙한|어른스러운|지적인|똑똑한|현명한|슬기로운|지혜로운|교양있는|세련된|품격있는|고상한|우아한|단아한|정숙한|품위있는|고급스러운|클래식한|전문적인|능력있는|재능있는)/)) {
    traits.push('mature and sophisticated');
  }
  
  // 열정적이고 도전적인 성격 (확장)
  if (text.match(/(?:열정적인|정열적인|뜨거운|화끈한|불타는|에너지가넘치는|역동적인|도전적인|모험적인|진취적인|추진력있는|패기있는|야망있는|목표지향적인|완벽주의|집중력강한|근성있는|끈기있는|노력하는|성실한)/)) {
    traits.push('passionate and ambitious');
  }
  
  // 로맨틱하고 감성적인 성격 (확장)
  if (text.match(/(?:로맨틱한|낭만적인|감성적인|감수성풍부한|감정이풍부한|섬세한|예민한|민감한|서정적인|시적인|예술적인|창의적인|상상력풍부한|꿈꾸는|몽상적인|이상주의적|감각적인|취향이좋은|미적감각|센스있는)/)) {
    traits.push('romantic and artistic soul');
  }
  
  // 강인하고 독립적인 성격 (확장)
  if (text.match(/(?:강인한|강한|독립적인|자립적인|주관이뚜렷한|의지가강한|결단력있는|용감한|대담한|거침없는|소신있는|자기만의|개성강한|독특한|창의적인|혁신적인|선도적인|트렌디한|모던한|젊은감각)/)) {
    traits.push('strong and independent spirit');
  }
  
  return traits;
}

/**
 * 분위기 설명 추출
 */
function extractMoodDescription(text: string): string {
  if (text.match(/(?:밝은|활발한|긍정적)/)) {
    return 'bright and positive mood';
  }
  if (text.match(/(?:차분한|평온한|안정된)/)) {
    return 'calm and serene mood';
  }
  if (text.match(/(?:신비로운|매력적인|독특한)/)) {
    return 'mysterious and captivating mood';
  }
  return 'charming and attractive mood';
}

/**
 * 표정 설명 추출
 */
function extractExpressionDescription(text: string): string {
  if (text.match(/(?:미소|웃음|스마일)/)) {
    return 'beautiful smile';
  }
  if (text.match(/(?:진지한|집중된|깊은)/)) {
    return 'serious and focused expression';
  }
  if (text.match(/(?:부드러운|온화한|따뜻한)/)) {
    return 'gentle and warm expression';
  }
  return 'engaging and attractive expression';
}

/**
 * 시각적 요소 매핑 (사용자 설정 완전 활용)
 */
export function mapPersonaToVisualElements(
  elements: PersonaElements, 
  personaType: string, 
  desiredStyle: string,
  userSettings?: UserSettings
): VisualMapping {
  const typeDNA = PERSONA_TYPE_DNA[personaType as keyof typeof PERSONA_TYPE_DNA] || PERSONA_TYPE_DNA['크리에이터'];
  
  // 사용자 배경 설정 활용 (확장된 한국어 패턴)
  let enhancedEnvironment: string = typeDNA.environment;
  if (userSettings?.background) {
    const backgroundKeywords = extractBackgroundKeywords(userSettings.background);
    if (backgroundKeywords.length > 0) {
      enhancedEnvironment = backgroundKeywords.join(', ');
    }
  }
  
  // 페르소나 타입을 영어로 번역
  const englishPersonaType = normalizePersonaType(personaType);
  
  const visualMapping: VisualMapping = {
    subject: `${elements.age || 'young adult'} ${englishPersonaType}`,
    appearance: combineAppearanceFeatures(elements.appearance),
    expression: mapPersonalityToExpression(elements.personality, userSettings),
    pose: typeDNA.pose,
    clothing: adaptStyleToClothing(desiredStyle, personaType, userSettings),
    environment: enhancedEnvironment,
    lighting: typeDNA.lighting,
    composition: 'professional portrait',
    typeKeywords: [...typeDNA.visual_keywords] // readonly 배열을 mutable로 변환
  };
  
  return visualMapping;
}

/**
 * 외모 특징 결합
 */
function combineAppearanceFeatures(appearance: PersonaElements['appearance']): string {
  const features: string[] = [];
  
  if (appearance.face) features.push(appearance.face);
  if (appearance.hair) features.push(appearance.hair);
  if (appearance.body) features.push(appearance.body);
  if (appearance.style) features.push(appearance.style);
  
  return features.join(', ');
}

/**
 * 성격을 표정으로 매핑 (사용자 설정 활용)
 */
function mapPersonalityToExpression(personality: PersonaElements['personality'], userSettings?: UserSettings): string {
  const expressions: string[] = [];
  
  if (personality.traits.includes('bright and energetic')) {
    expressions.push('bright cheerful expression');
  }
  if (personality.traits.includes('confident')) {
    expressions.push('confident and captivating look');
  }
  if (personality.traits.includes('friendly and warm')) {
    expressions.push('warm and engaging smile');
  }
  
  // 사용자 성격 특성 추가 반영
  if (userSettings?.personalityTraits) {
    const traitsLower = userSettings.personalityTraits.toLowerCase();
    if (traitsLower.includes('밝은') || traitsLower.includes('bright')) {
      expressions.push('bright cheerful expression');
    }
    if (traitsLower.includes('신비로운') || traitsLower.includes('mysterious')) {
      expressions.push('mysterious and captivating gaze');
    }
    if (traitsLower.includes('차분한') || traitsLower.includes('calm')) {
      expressions.push('serene and composed expression');
    }
    if (traitsLower.includes('장난스러운') || traitsLower.includes('playful')) {
      expressions.push('playful and mischievous smile');
    }
    if (traitsLower.includes('우아한') || traitsLower.includes('elegant')) {
      expressions.push('elegant and refined expression');
    }
  }
  
  if (expressions.length === 0) {
    expressions.push('naturally attractive expression');
  }
  
  // 중복 제거
  const uniqueExpressions = Array.from(new Set(expressions));
  
  return uniqueExpressions.slice(0, 3).join(', '); // 최대 3개로 제한
}

/**
 * 배경/환경 키워드 추출 (확장된 한국어 패턴)
 */
function extractBackgroundKeywords(text: string): string[] {
  const backgrounds: string[] = [];
  
  // 실내 환경 (확장)
  if (text.match(/(?:스튜디오|촬영장|전문촬영|촬영실|백스크린|흰배경|검은배경|그레이배경|스크린|백드롭|무대|사진관|포토존|포토스튜디오|작업실|아틀리에|워크숍|실내|인테리어|방|룸|공간|환경|조명|플래시|스트로보|조명장비)/)) {
    backgrounds.push('professional studio setup with controlled lighting and artistic background');
  }
  
  // 카페/레스토랑 (확장)
  if (text.match(/(?:카페|커피숍|커피전문점|다방|찻집|까페|레스토랑|식당|카페테리아|브런치|베이커리|디저트카페|루프탑|테라스|바|펜션|호텔|리조트|라운지|클럽|웨딩홀|파티장|이벤트홀)/)) {
    backgrounds.push('trendy modern cafe with warm ambiance and aesthetic interior');
  }
  
  // 야외 자연 환경 (확장)
  if (text.match(/(?:야외|자연|공원|정원|꽃밭|숲|산|바다|해변|해안|강|호수|연못|계곡|폭포|들판|초원|꽃길|산책로|나무|벚꽃|단풍|가을|봄|여름|겨울|하늘|구름|일출|일몰|석양|새벽|달빛|별|밤하늘)/)) {
    backgrounds.push('beautiful natural outdoor setting with stunning landscape background');
  }
  
  // 도시 환경 (확장)
  if (text.match(/(?:도시|시내|거리|길|골목|건물|빌딩|고층빌딩|아파트|상가|백화점|쇼핑몰|마트|편의점|지하철|버스정류장|공항|역|터미널|교량|다리|강변|한강|광장|광화문|명동|강남|홍대|신촌|이태원|압구정|청담|판교|분당)/)) {
    backgrounds.push('urban cityscape with modern architecture and vibrant street atmosphere');
  }
  
  // 학교/교육 환경 (확장)
  if (text.match(/(?:학교|교실|강의실|도서관|연구실|실험실|교무실|교장실|체육관|운동장|강당|음악실|미술실|과학실|컴퓨터실|도서관|독서실|스터디룸|대학교|고등학교|중학교|초등학교|유치원|어린이집|학원|교습소|문화센터|평생교육원)/)) {
    backgrounds.push('educational environment with academic atmosphere and learning space');
  }
  
  // 예술/문화 환경 (확장)
  if (text.match(/(?:미술관|박물관|갤러리|전시관|전시회|아트센터|문화센터|오페라하우스|콘서트홀|극장|영화관|공연장|무대|연극|뮤지컬|오케스트라|합창단|댄스스튜디오|연습실|녹음실|방송국|촬영소|드라마|영화|방송|예술|문화|창작|아티스트|크리에이터)/)) {
    backgrounds.push('artistic cultural venue with creative atmosphere and inspiring environment');
  }
  
  // 스포츠/운동 환경 (확장)
  if (text.match(/(?:체육관|헬스장|피트니스|요가원|필라테스|수영장|테니스장|골프장|축구장|야구장|농구장|배구장|배드민턴장|탁구장|볼링장|스키장|스케이트장|사이클링|등산|하이킹|캠핑|낚시|서핑|스노보드|스쿠버다이빙|암벽등반|요가|필라테스|크로스핏|런닝|조깅|마라톤)/)) {
    backgrounds.push('sports and fitness environment with energetic and healthy atmosphere');
  }
  
  // 비즈니스/오피스 환경 (확장)
  if (text.match(/(?:사무실|오피스|회사|사무실|회의실|미팅룸|컨퍼런스룸|비즈니스센터|코워킹스페이스|은행|금융|증권|보험|병원|의료|약국|클리닉|법무|회계|세무|컨설팅|마케팅|광고|PR|언론|신문|잡지|출판|방송|미디어|정부|공공기관|시청|구청|동사무소)/)) {
    backgrounds.push('professional business environment with modern office atmosphere');
  }
  
  // 쇼핑/상업 환경 (확장)
  if (text.match(/(?:쇼핑몰|백화점|마트|슈퍼마켓|편의점|매장|상점|부티크|브랜드샵|아울렛|시장|전통시장|재래시장|플리마켓|벼룩시장|팝업스토어|전시장|쇼룸|디스플레이|진열|판매|쇼핑|구매|소비|패션|의류|화장품|뷰티|액세서리|보석|시계|가방|신발|모자|선글라스)/)) {
    backgrounds.push('stylish shopping environment with fashionable commercial atmosphere');
  }
  
  // 휴양/휴식 환경 (확장)
  if (text.match(/(?:휴양지|리조트|펜션|호텔|모텔|게스트하우스|에어비앤비|휴가|여행|관광|온천|찜질방|스파|마사지|에스테틱|뷰티살롱|네일샵|헤어샵|미용실|카페|찻집|휴게소|공원|산책로|힐링|치유|명상|요가|테라피|웰니스|라이프스타일|여유|편안|안락|포근|따뜻|아늑|평온|고요|정적|조용|평화)/)) {
    backgrounds.push('relaxing vacation environment with peaceful and serene atmosphere');
  }
  
  return backgrounds;
}

/**
 * 스타일을 의상으로 적응 (사용자 설정 완전 활용)
 */
function adaptStyleToClothing(desiredStyle: string, personaType: string, userSettings?: UserSettings): string {
  let baseClothing = '';
  
  switch (personaType) {
    case 'AI 인플루언서':
      baseClothing = 'trendy modern outfit, contemporary fashion';
      break;
    case '배우':
      baseClothing = 'elegant sophisticated attire, classic fashion';
      break;
    case '가수':
      baseClothing = 'artistic creative outfit, performer styling';
      break;
    case '버튜버':
      baseClothing = 'cute colorful outfit, kawaii fashion';
      break;
    case '모델':
      baseClothing = 'high fashion designer outfit, luxury styling';
      break;
    case '크리에이터':
      baseClothing = 'casual creative outfit, artistic fashion';
      break;
    default:
      baseClothing = 'stylish contemporary outfit';
  }
  
  // 사용자 스타일 선호도 적용
  if (desiredStyle.includes('모던') || desiredStyle.includes('modern')) {
    baseClothing += ', modern styling';
  }
  if (desiredStyle.includes('세련된') || desiredStyle.includes('sophisticated')) {
    baseClothing += ', sophisticated elegance';
  }
  if (desiredStyle.includes('귀여운') || desiredStyle.includes('cute')) {
    baseClothing += ', adorable styling';
  }
  if (desiredStyle.includes('클래식') || desiredStyle.includes('classic')) {
    baseClothing += ', classic elegance';
  }
  if (desiredStyle.includes('아티스틱') || desiredStyle.includes('artistic')) {
    baseClothing += ', artistic flair';
  }
  if (desiredStyle.includes('럭셔리') || desiredStyle.includes('luxury')) {
    baseClothing += ', luxury aesthetic';
  }
  
  // visualPreferences 적용
  if (userSettings?.visualPreferences) {
    const visualPrefs = userSettings.visualPreferences.toLowerCase();
    if (visualPrefs.includes('미니멀') || visualPrefs.includes('minimal')) {
      baseClothing += ', minimalist design';
    }
    if (visualPrefs.includes('빈티지') || visualPrefs.includes('vintage')) {
      baseClothing += ', vintage inspired';
    }
    if (visualPrefs.includes('스트리트') || visualPrefs.includes('street')) {
      baseClothing += ', street fashion';
    }
    if (visualPrefs.includes('포멀') || visualPrefs.includes('formal')) {
      baseClothing += ', formal attire';
    }
  }
  
  return baseClothing;
}

/**
 * 여성 매력 강화 적용
 */
export function applyFemaleAttractionEnhancement(
  visualMapping: VisualMapping, 
  personaType: string
): VisualMapping {
  const primary = FEMALE_ATTRACTION_LAYERS.primary;
  const secondary = FEMALE_ATTRACTION_LAYERS.secondary;
  const tertiary = FEMALE_ATTRACTION_LAYERS.tertiary;
  
  // 1차 매력 - 완벽한 얼굴 강화
  const beautyEnhancement = primary.beauty_enhancement[Math.floor(Math.random() * primary.beauty_enhancement.length)];
  const facialPerfection = primary.facial_perfection.slice(0, 3).join(', ');
  
  // 2차 매력 - 글래머러스 스타일 강화
  const glamorousStyle = secondary.glamorous_styling.slice(0, 2).join(', ');
  const bodyAttraction = secondary.body_attraction.slice(0, 2).join(', ');
  
  // 3차 매력 - 아이돌 퀄리티 강화
  const idolQuality = tertiary.idol_quality.slice(0, 2).join(', ');
  
  // 기존 매핑에 매력 강화 요소 추가
  visualMapping.beautyEnhancement = `${beautyEnhancement}, ${facialPerfection}`;
  visualMapping.glamorousStyle = `${glamorousStyle}, ${bodyAttraction}`;
  visualMapping.idolQuality = idolQuality;
  
  return visualMapping;
}

/**
 * Flux 1.1 Pro 최적화 적용
 */
export function applyFluxOptimization(
  visualMapping: VisualMapping, 
  personaType: string, 
  desiredStyle: string
): OptimizedData {
  const optimization = FLUX_OPTIMIZATION_ENGINE;
  
  // 파일 접두사 생성 (현실감 강화)
  const filePrefix = 'IMG_' + Math.floor(Math.random() * 9999).toString().padStart(4, '0') + '.jpg';
  
  // Flux 1.1 Pro 최적화된 품질 태그 선택 (1-2개로 제한하여 자연스럽게)
  const qualityTags = optimization.quality_tags[Math.floor(Math.random() * optimization.quality_tags.length)];
  
  // 기술적 디테일 선택 (1-2개로 제한)
  const technicalDetails = optimization.technical_details.slice(0, 2).join(' and ');
  
  // 촬영 스타일 추가 (페르소나 타입에 맞는 스타일 선택)
  const photographyStyle = getPhotographyStyleForPersona(personaType, optimization.photography_styles);
  
  // 타입별 키워드 선택 (3-4개로 제한하여 집중도 높이기)
  const typeKeywords = visualMapping.typeKeywords.slice(0, 3).join(', ');
  
  // 카메라 설정 요소 추가 (K-pop 스타일 참고)
  const cameraSettings = optimization.camera_settings[Math.floor(Math.random() * optimization.camera_settings.length)];
  
  return {
    filePrefix,
    qualityTags,
    technicalDetails,
    typeKeywords,
    photographyStyle,
    cameraSettings,
    visualMapping
  };
}

/**
 * 페르소나 타입에 맞는 촬영 스타일 선택
 */
function getPhotographyStyleForPersona(personaType: string, photographyStyles: readonly string[]): string {
  const typeStyleMap: Record<string, string> = {
    'AI 인플루언서': photographyStyles[3], // lifestyle photography
    '배우': photographyStyles[0], // professional headshot
    '가수': photographyStyles[1], // fashion photography
    '버튜버': photographyStyles[4], // beauty photography
    '모델': photographyStyles[1], // fashion photography
    '크리에이터': photographyStyles[2] // portrait photography
  };
  
  return typeStyleMap[personaType] || photographyStyles[2];
}

/**
 * Flux 1.1 Pro 최적화 자연어 프롬프트 구성 (K-pop 스타일 참고)
 */
export function constructNaturalLanguagePrompt(optimizedData: OptimizedData): string {
  const { filePrefix, qualityTags, technicalDetails, typeKeywords, photographyStyle, cameraSettings, visualMapping } = optimizedData;
  
  // K-pop 스타일 참고 프롬프트 구조 (콤마로 구분된 구조화된 방식)
  const promptElements: string[] = [];
  
  // 1. 카메라 설정 및 촬영 스타일 (참고 프롬프트 시작 방식)
  if (cameraSettings) {
    promptElements.push(cameraSettings);
  }
  
  // 2. 기본 인물 정보 (나이, 국적, 타입)
  if (visualMapping.beautyEnhancement) {
    promptElements.push(visualMapping.beautyEnhancement);
  }
  
  // 3. 얼굴 특징 (참고 프롬프트의 세부적 접근)
  if (visualMapping.appearance) {
    promptElements.push(visualMapping.appearance);
  }
  
  // 4. 글래머러스 스타일 및 체형
  if (visualMapping.glamorousStyle) {
    promptElements.push(visualMapping.glamorousStyle);
  }
  
  // 5. 표정과 포즈
  if (visualMapping.expression) {
    promptElements.push(visualMapping.expression);
  }
  
  // 6. 의상 및 스타일링
  if (visualMapping.clothing) {
    promptElements.push(visualMapping.clothing);
  }
  
  // 7. 조명 설정
  if (technicalDetails) {
    promptElements.push(technicalDetails);
  }
  
  // 8. 배경 설정
  if (visualMapping.environment) {
    promptElements.push(visualMapping.environment);
  }
  
  // 9. 촬영 스타일 및 타입별 특화
  if (photographyStyle) {
    promptElements.push(photographyStyle);
  }
  
  // 10. 아이돌 퀄리티
  if (visualMapping.idolQuality) {
    promptElements.push(visualMapping.idolQuality);
  }
  
  // 11. 최종 품질 키워드 (참고 프롬프트의 마지막 품질 강조)
  if (qualityTags) {
    promptElements.push(qualityTags);
  }
  
  // 12. 랜덤 요소 (허용된 경우만)
  if (visualMapping.randomElement) {
    promptElements.push(`enhanced with ${visualMapping.randomElement}`);
  }
  
  // 실사 강조 키워드 추가
  const realismKeywords = [
    'photorealistic',
    'ultra-realistic',
    'lifelike human appearance',
    'realistic skin texture',
    'authentic human features'
  ];
  
  // 랜덤한 실사 키워드 추가
  const randomRealismKeyword = realismKeywords[Math.floor(Math.random() * realismKeywords.length)];
  promptElements.push(randomRealismKeyword);
  
  // 콤마로 구분된 구조화된 프롬프트 생성 (K-pop 스타일 참고, 실사 강조)
  let finalPrompt = promptElements.filter(element => element && element.trim()).join(', ');
  
  // 파일 접두사 추가 (현실감 강화)
  if (filePrefix) {
    finalPrompt = `${filePrefix}, ${finalPrompt}`;
  }
  
  return finalPrompt;
}

/**
 * 랜덤 요소 추가 (허용된 경우만)
 */
function addRandomElements(visualMapping: VisualMapping): VisualMapping {
  // 랜덤 요소는 매력을 해치지 않는 범위에서만 추가
  const randomEnhancements = [
    'subtle makeup enhancement',
    'natural lighting variation',
    'elegant accessory detail',
    'sophisticated background element'
  ];
  
  const randomElement = randomEnhancements[Math.floor(Math.random() * randomEnhancements.length)];
  visualMapping.randomElement = randomElement;
  
  return visualMapping;
}

/**
 * 에러 시 기본 프롬프트 생성
 */
function generateFallbackPrompt(personaType: string, desiredStyle: string): string {
  const englishPersonaType = normalizePersonaType(personaType);
  const typeDNA = PERSONA_TYPE_DNA[personaType as keyof typeof PERSONA_TYPE_DNA] || PERSONA_TYPE_DNA['크리에이터'];
  const beauty = FEMALE_ATTRACTION_LAYERS.primary.beauty_enhancement[0];
  const facial = FEMALE_ATTRACTION_LAYERS.primary.facial_perfection.slice(0, 2).join(', ');
  const glamour = FEMALE_ATTRACTION_LAYERS.secondary.glamorous_styling.slice(0, 2).join(', ');
  const camera = FLUX_OPTIMIZATION_ENGINE.camera_settings[0];
  const quality = FLUX_OPTIMIZATION_ENGINE.quality_tags[0];
  
  // K-pop 스타일 참고 구조로 fallback 프롬프트 생성
  const fallbackElements = [
    camera,
    beauty,
    facial,
    glamour,
    `confident ${englishPersonaType} pose with charismatic presence`,
    typeDNA.lighting,
    quality
  ];
  
  const filePrefix = `IMG_${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}.jpg`;
  
  return `${filePrefix}, ${fallbackElements.join(', ')}`;
}

/**
 * 생성된 프롬프트 품질 검증
 */
export function validatePromptQuality(prompt: string, userSettings: UserSettings): ValidationResult {
  const validation: ValidationResult = {
    isValid: true,
    score: 0,
    issues: [],
    suggestions: []
  };
  
  // 사용자 입력 반영도 검증
  const { personaType, desiredStyle } = userSettings;
  
  if (!prompt.includes(personaType)) {
    validation.issues.push('페르소나 타입이 프롬프트에 반영되지 않았습니다');
    validation.score -= 20;
  }
  
  // 여성 매력 요소 검증
  const beautyKeywords = ['beautiful', 'stunning', 'gorgeous', 'attractive'];
  const hasBeautyKeyword = beautyKeywords.some(keyword => prompt.includes(keyword));
  
  if (!hasBeautyKeyword) {
    validation.issues.push('여성 매력 강화 요소가 부족합니다');
    validation.score -= 15;
  }
  
  // Flux 최적화 요소 검증
  const fluxKeywords = ['hyperrealistic', 'photorealistic', 'professional'];
  const hasFluxKeyword = fluxKeywords.some(keyword => prompt.includes(keyword));
  
  if (!hasFluxKeyword) {
    validation.issues.push('Flux 최적화 요소가 부족합니다');
    validation.score -= 10;
  }
  
  // 프롬프트 길이 검증
  if (prompt.length < 100) {
    validation.issues.push('프롬프트가 너무 짧습니다');
    validation.score -= 10;
  }
  
  if (prompt.length > 500) {
    validation.issues.push('프롬프트가 너무 깁니다');
    validation.score -= 5;
  }
  
  // 점수 계산
  validation.score = Math.max(0, 100 + validation.score);
  validation.isValid = validation.score >= 70;
  
  return validation;
}

// ==================== 메인 변환 함수 ====================

/**
 * 복합 표현 처리 - 'A하고 B한' 형태의 한국어 복합 표현을 분석하고 처리
 */
function processCompoundExpressions(text: string): string {
  // 'A하고 B한' 형태의 복합 표현 처리
  const compoundPattern = /([가-힣]+)하고\s*([가-힣]+)한/g;
  let processedText = text;
  
  // 복합 표현 분해 및 처리
  const compoundMatches = text.match(compoundPattern);
  if (compoundMatches) {
    compoundMatches.forEach(match => {
      const parts = match.match(/([가-힣]+)하고\s*([가-힣]+)한/);
      if (parts) {
        const [, first, second] = parts;
        // 각 부분을 개별적으로 처리
        const firstProcessed = processIndividualExpression(first);
        const secondProcessed = processIndividualExpression(second);
        
        // 결합된 영어 표현 생성
        const combinedExpression = `${firstProcessed} and ${secondProcessed}`;
        processedText = processedText.replace(match, combinedExpression);
      }
    });
  }
  
  // 'A한 B' 형태의 복합 표현 처리
  const adjectivePattern = /([가-힣]+)한\s+([가-힣]+)/g;
  processedText = processedText.replace(adjectivePattern, (match, adjective, noun) => {
    const processedAdjective = processIndividualExpression(adjective);
    const processedNoun = processIndividualExpression(noun);
    return `${processedAdjective} ${processedNoun}`;
  });
  
  return processedText;
}

/**
 * 개별 표현 처리 - 단일 한국어 표현을 영어로 매핑
 */
function processIndividualExpression(expression: string): string {
  // 기본 형용사 매핑
  const adjectiveMap: Record<string, string> = {
    '밝': 'bright',
    '어둡': 'dark',
    '차분': 'calm',
    '활발': 'lively',
    '우아': 'elegant',
    '섹시': 'sexy',
    '귀여운': 'cute',
    '아름다운': 'beautiful',
    '멋진': 'cool',
    '신비로운': 'mysterious',
    '강인': 'strong',
    '부드러운': 'soft',
    '날카로운': 'sharp',
    '온화': 'gentle',
    '대담': 'bold',
    '세련된': 'sophisticated',
    '트렌디': 'trendy',
    '클래식': 'classic',
    '모던': 'modern',
    '빈티지': 'vintage'
  };
  
  // 직접 매핑이 있는 경우
  if (adjectiveMap[expression]) {
    return adjectiveMap[expression];
  }
  
  // 부분 매칭 시도
  for (const [korean, english] of Object.entries(adjectiveMap)) {
    if (expression.includes(korean)) {
      return english;
    }
  }
  
  // 매핑되지 않은 경우 원본 반환
  return expression;
}

/**
 * 메인 변환 함수 - 페르소나 프로필을 Flux 1.1 Pro 최적화 프롬프트로 변환
 */
export function convertPersonaToFluxPrompt(personaProfile: string, userSettings: UserSettings): string {
  const { personaType, desiredStyle, allowRandomGeneration } = userSettings;
  
  try {
    // 0. 복합 표현 전처리
    const processedProfile = processCompoundExpressions(personaProfile);
    
    // 1. 페르소나 핵심 요소 추출
    const elements = extractPersonaElements(processedProfile);
    
    // 2. 시각적 요소 매핑 (사용자 설정 완전 활용)
    let visualMapping = mapPersonaToVisualElements(elements, personaType, desiredStyle, userSettings);
    
    // 3. 여성 매력 강화 적용
    visualMapping = applyFemaleAttractionEnhancement(visualMapping, personaType);
    
    // 4. 랜덤 요소 처리 (허용된 경우만)
    if (allowRandomGeneration) {
      visualMapping = addRandomElements(visualMapping);
    }
    
    // 5. Flux 1.1 Pro 최적화 적용
    const optimizedData = applyFluxOptimization(visualMapping, personaType, desiredStyle);
    
    // 6. 자연어 프롬프트 구성
    const finalPrompt = constructNaturalLanguagePrompt(optimizedData);
    
    return finalPrompt;
    
  } catch (error) {
    console.error('Persona conversion error:', error);
    
    // 에러 시 기본 프롬프트 생성
    return generateFallbackPrompt(personaType, desiredStyle);
  }
}

/**
 * API 라우트에서 사용할 메인 함수
 */
export function integrateWithAPI(responseText: string, userSettings: UserSettings): string {
  try {
    // 기존 IMAGE_PROMPT 추출 시도
    const imagePromptMatch = responseText.match(/\*\*IMAGE_PROMPT:\*\*\s*(.+)/i);
    
    if (imagePromptMatch) {
      // 기존 프롬프트를 개선된 프롬프트로 변환
      const optimizedPrompt = convertPersonaToFluxPrompt(responseText, userSettings);
      
      // 품질 검증
      const validation = validatePromptQuality(optimizedPrompt, userSettings);
      
      if (validation.isValid) {
        return optimizedPrompt;
      } else {
        console.warn('Prompt quality validation failed:', validation);
        return optimizedPrompt; // 품질이 낮아도 개선된 프롬프트 사용
      }
    } else {
      // IMAGE_PROMPT가 없는 경우 전체 프로필로 프롬프트 생성
      return convertPersonaToFluxPrompt(responseText, userSettings);
    }
    
  } catch (error) {
    console.error('API integration error:', error);
    return generateFallbackPrompt(userSettings.personaType, userSettings.desiredStyle);
  }
}