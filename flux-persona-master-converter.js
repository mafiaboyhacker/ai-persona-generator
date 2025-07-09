/**
 * Flux Persona Master Converter
 * 페르소나 프로필을 Flux 1.1 Pro 최적화 프롬프트로 변환하는 통합 시스템
 * 
 * 핵심 원칙:
 * 1. 사용자 입력 100% 보존
 * 2. 여성 매력 극대화
 * 3. 타입별 매력 DNA 완벽 구현
 * 4. Flux 1.1 Pro 성능 최대화
 */

// ==================== 타입별 매력 DNA 정의 ====================

const PERSONA_TYPE_DNA = {
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
};

// ==================== 여성 매력 계층별 강화 시스템 ====================

const FEMALE_ATTRACTION_LAYERS = {
    // 1차 매력 - 즉시 인지되는 완벽한 얼굴
    primary: {
        facial_perfection: [
            'with stunningly beautiful facial features that display perfect symmetry and flawless, porcelain-like complexion',
            'possessing captivating eyes that sparkle with depth and intelligence, framed by naturally long lashes',
            'featuring an elegantly shaped nose and naturally beautiful lips that form a mesmerizing smile',
            'showcasing Korean beauty standards with radiant, healthy skin that glows with natural luminescence',
            'displaying photogenic facial structure with refined bone structure and delicate features',
            'having goddess-like beauty with ethereal qualities that seem almost otherworldly in their perfection'
        ],
        beauty_enhancement: [
            'who is exceptionally beautiful with an otherworldly charm that immediately captures attention',
            'possessing stunningly gorgeous features that create an unforgettable first impression',
            'displaying breathtakingly pretty characteristics with natural elegance and grace',
            'embodying absolutely stunning beauty that radiates confidence and sophistication',
            'showing remarkably attractive qualities with a magnetic presence that draws the eye',
            'manifesting extraordinarily beautiful features with perfect harmony and balance'
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
};

// ==================== Flux 1.1 Pro 최적화 엔진 ====================

const FLUX_OPTIMIZATION_ENGINE = {
    // Flux 1.1 Pro에 최적화된 품질 향상 키워드
    quality_tags: [
        'hyperrealistic portrait photography with exceptional detail and clarity',
        'professional studio photography with perfect lighting and composition',
        'high resolution capture with natural skin texture and facial detail',
        '4k quality with sharp focus and realistic hair texture',
        'photorealistic rendering with authentic colors and perfect exposure',
        'DSLR quality with professional camera settings and studio lighting'
    ],
    
    // Flux 1.1 Pro에 효과적인 기술적 디테일
    technical_details: [
        'shallow depth of field with beautiful bokeh effect in the background',
        'natural studio lighting with soft shadows and three-point lighting setup',
        'golden hour lighting quality with cinematic depth and dramatic contrast',
        'professional photography lighting with detailed background texture',
        'realistic skin texture with perfect facial features and natural expressions',
        'authentic color grading with film-like quality and artistic composition'
    ],
    
    // Flux 1.1 Pro 특화 현실감 강화 요소
    file_realism: [
        'shot on professional camera with Canon EOS R5 quality',
        'captured with 50mm f/1.2 lens for perfect portrait depth',
        'professional photography session with studio lighting setup',
        'high-end camera capture with RAW format processing',
        'DSLR photography with professional post-processing techniques',
        'commercial photography standards with magazine-quality results'
    ],
    
    // Flux 1.1 Pro 최적화 촬영 스타일
    photography_styles: [
        'professional headshot photography with commercial quality',
        'fashion photography with editorial standards and luxury aesthetic',
        'portrait photography with natural lighting and authentic expressions',
        'lifestyle photography with contemporary styling and modern appeal',
        'beauty photography with perfect skin texture and flawless details',
        'commercial photography with brand-ready visual appeal'
    ]
};

// ==================== 핵심 변환 함수들 ====================

/**
 * 페르소나 프로필에서 핵심 요소 추출
 */
function extractPersonaElements(personaProfile) {
    const elements = {
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
 * 얼굴 특징 추출
 */
function extractFacialFeatures(text) {
    const features = [];
    
    // 눈 관련
    if (text.match(/(?:큰|아름다운|매력적인|반짝이는).*?눈/)) {
        features.push('captivating eyes');
    }
    if (text.match(/(?:이중|쌍).*?눈꺼풀/)) {
        features.push('double eyelid');
    }
    
    // 코 관련
    if (text.match(/(?:높은|오똑한|예쁜).*?코/)) {
        features.push('elegant nose');
    }
    
    // 입 관련
    if (text.match(/(?:예쁜|매력적인|아름다운).*?입/)) {
        features.push('beautiful lips');
    }
    
    // 얼굴형 관련
    if (text.match(/(?:갸름한|둥근|타원형).*?얼굴/)) {
        features.push('perfect face shape');
    }
    
    return features.join(', ');
}

/**
 * 헤어 스타일 추출
 */
function extractHairDescription(text) {
    const hairFeatures = [];
    
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
function extractBodyDescription(text) {
    const bodyFeatures = [];
    
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
 * 스타일 설명 추출
 */
function extractStyleDescription(text) {
    const styleFeatures = [];
    
    if (text.match(/(?:세련된|모던|현대적)/)) {
        styleFeatures.push('sophisticated style');
    }
    if (text.match(/(?:귀여운|큐트|사랑스러운)/)) {
        styleFeatures.push('cute style');
    }
    if (text.match(/(?:우아한|고급|클래식)/)) {
        styleFeatures.push('elegant style');
    }
    
    return styleFeatures.join(', ');
}

/**
 * 성격 특성 추출
 */
function extractPersonalityTraits(text) {
    const traits = [];
    
    if (text.match(/(?:밝은|활발한|에너지)/)) {
        traits.push('bright and energetic');
    }
    if (text.match(/(?:차분한|조용한|침착한)/)) {
        traits.push('calm and composed');
    }
    if (text.match(/(?:자신감|당당한|확신)/)) {
        traits.push('confident');
    }
    if (text.match(/(?:친근한|다정한|따뜻한)/)) {
        traits.push('friendly and warm');
    }
    
    return traits;
}

/**
 * 분위기 설명 추출
 */
function extractMoodDescription(text) {
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
function extractExpressionDescription(text) {
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
 * 시각적 요소 매핑
 */
function mapPersonaToVisualElements(elements, personaType, desiredStyle) {
    const typeDNA = PERSONA_TYPE_DNA[personaType] || PERSONA_TYPE_DNA['크리에이터'];
    
    const visualMapping = {
        subject: `${elements.age || 'young adult'} ${personaType}`,
        appearance: combineAppearanceFeatures(elements.appearance),
        expression: mapPersonalityToExpression(elements.personality),
        pose: typeDNA.pose,
        clothing: adaptStyleToClothing(desiredStyle, personaType),
        environment: typeDNA.environment,
        lighting: typeDNA.lighting,
        composition: 'professional portrait',
        typeKeywords: typeDNA.visual_keywords
    };
    
    return visualMapping;
}

/**
 * 외모 특징 결합
 */
function combineAppearanceFeatures(appearance) {
    const features = [];
    
    if (appearance.face) features.push(appearance.face);
    if (appearance.hair) features.push(appearance.hair);
    if (appearance.body) features.push(appearance.body);
    if (appearance.style) features.push(appearance.style);
    
    return features.join(', ');
}

/**
 * 성격을 표정으로 매핑
 */
function mapPersonalityToExpression(personality) {
    const expressions = [];
    
    if (personality.traits.includes('bright and energetic')) {
        expressions.push('bright cheerful expression');
    }
    if (personality.traits.includes('confident')) {
        expressions.push('confident and captivating look');
    }
    if (personality.traits.includes('friendly and warm')) {
        expressions.push('warm and engaging smile');
    }
    
    if (expressions.length === 0) {
        expressions.push('naturally attractive expression');
    }
    
    return expressions.join(', ');
}

/**
 * 스타일을 의상으로 적응
 */
function adaptStyleToClothing(desiredStyle, personaType) {
    const typeDNA = PERSONA_TYPE_DNA[personaType] || PERSONA_TYPE_DNA['크리에이터'];
    
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
    
    // 스타일 적용
    if (desiredStyle.includes('모던') || desiredStyle.includes('modern')) {
        baseClothing += ', modern styling';
    }
    if (desiredStyle.includes('세련된') || desiredStyle.includes('sophisticated')) {
        baseClothing += ', sophisticated elegance';
    }
    if (desiredStyle.includes('귀여운') || desiredStyle.includes('cute')) {
        baseClothing += ', adorable styling';
    }
    
    return baseClothing;
}

/**
 * 여성 매력 강화 적용
 */
function applyFemaleAttractionEnhancement(visualMapping, personaType) {
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
function applyFluxOptimization(visualMapping, personaType, desiredStyle) {
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
    
    // 파일 현실감 요소 추가
    const fileRealism = optimization.file_realism[Math.floor(Math.random() * optimization.file_realism.length)];
    
    return {
        filePrefix,
        qualityTags,
        technicalDetails,
        typeKeywords,
        photographyStyle,
        fileRealism,
        visualMapping
    };
}

/**
 * 페르소나 타입에 맞는 촬영 스타일 선택
 */
function getPhotographyStyleForPersona(personaType, photographyStyles) {
    const typeStyleMap = {
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
 * Flux 1.1 Pro 최적화 자연어 프롬프트 구성
 */
function constructNaturalLanguagePrompt(optimizedData) {
    const { filePrefix, qualityTags, technicalDetails, typeKeywords, photographyStyle, fileRealism, visualMapping } = optimizedData;
    
    // Flux 1.1 Pro는 자연스러운 문장 구조를 선호함
    let prompt = '';
    
    // 파일 접두사 (현실감 강화)
    if (filePrefix) {
        prompt += `${filePrefix} `;
    }
    
    // 메인 자연어 설명 - Flux가 이해하기 쉬운 자연스러운 문장으로 구성
    prompt += `A professional portrait photograph featuring a ${visualMapping.subject}`;
    
    // 미적 매력 강화 - 자연스러운 흐름으로 연결
    if (visualMapping.beautyEnhancement) {
        prompt += ` ${visualMapping.beautyEnhancement}`;
    }
    
    // 외모 특징 - 구체적이고 시각적인 설명
    if (visualMapping.appearance) {
        prompt += `, ${visualMapping.appearance}`;
    }
    
    // 글래머러스 스타일 - 매력적인 요소 강조
    if (visualMapping.glamorousStyle) {
        prompt += `. She is ${visualMapping.glamorousStyle}`;
    }
    
    // 표정과 포즈 - 감정적 연결
    if (visualMapping.expression && visualMapping.pose) {
        prompt += `, ${visualMapping.expression} while ${visualMapping.pose}`;
    } else if (visualMapping.expression) {
        prompt += `, ${visualMapping.expression}`;
    } else if (visualMapping.pose) {
        prompt += ` ${visualMapping.pose}`;
    }
    
    // 의상 - 스타일 완성
    if (visualMapping.clothing) {
        prompt += `, ${visualMapping.clothing}`;
    }
    
    // 환경 설정 - 배경과 분위기
    if (visualMapping.environment) {
        prompt += `. The scene is ${visualMapping.environment}`;
    }
    
    // 조명 - 기술적 품질 향상
    if (visualMapping.lighting) {
        prompt += `, ${visualMapping.lighting}`;
    }
    
    // 아이돌 퀄리티 - 특별한 매력 강조
    if (visualMapping.idolQuality) {
        prompt += `. She ${visualMapping.idolQuality}`;
    }
    
    // 타입별 특화 키워드 - 자연스럽게 통합
    if (typeKeywords) {
        prompt += `. The image captures her ${typeKeywords}`;
    }
    
    // 촬영 스타일 - 페르소나 타입에 맞는 전문 스타일
    if (photographyStyle) {
        prompt += `. This is ${photographyStyle}`;
    }
    
    // 파일 현실감 요소 - 기술적 품질 향상
    if (fileRealism) {
        prompt += `, ${fileRealism}`;
    }
    
    // 기술적 디테일 - 품질 향상
    if (technicalDetails) {
        prompt += ` with ${technicalDetails}`;
    }
    
    // 최종 품질 보장
    if (qualityTags) {
        prompt += `. The result is ${qualityTags}`;
    }
    
    // 랜덤 요소 (허용된 경우만)
    if (visualMapping.randomElement) {
        prompt += `, enhanced with ${visualMapping.randomElement}`;
    }
    
    return prompt;
}

// ==================== 메인 변환 함수 ====================

/**
 * 메인 변환 함수 - 페르소나 프로필을 Flux 1.1 Pro 최적화 프롬프트로 변환
 */
function convertPersonaToFluxPrompt(personaProfile, userSettings) {
    const { personaType, desiredStyle, allowRandomGeneration } = userSettings;
    
    try {
        // 1. 페르소나 핵심 요소 추출
        const elements = extractPersonaElements(personaProfile);
        
        // 2. 시각적 요소 매핑
        let visualMapping = mapPersonaToVisualElements(elements, personaType, desiredStyle);
        
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
 * 랜덤 요소 추가 (허용된 경우만)
 */
function addRandomElements(visualMapping) {
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
function generateFallbackPrompt(personaType, desiredStyle) {
    const typeDNA = PERSONA_TYPE_DNA[personaType] || PERSONA_TYPE_DNA['크리에이터'];
    const beauty = FEMALE_ATTRACTION_LAYERS.primary.beauty_enhancement[0];
    const facial = FEMALE_ATTRACTION_LAYERS.primary.facial_perfection.slice(0, 3).join(', ');
    const glamour = FEMALE_ATTRACTION_LAYERS.secondary.glamorous_styling.slice(0, 2).join(', ');
    const quality = FLUX_OPTIMIZATION_ENGINE.quality_tags.slice(0, 3).join(', ');
    
    return `IMG_${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}.jpg, A professional portrait of a ${beauty} ${personaType} with ${facial}, ${glamour}, ${typeDNA.pose}, ${typeDNA.environment}, ${typeDNA.lighting}, ${quality}`;
}

// ==================== 실시간 품질 검증 ====================

/**
 * 생성된 프롬프트 품질 검증
 */
function validatePromptQuality(prompt, userSettings) {
    const validation = {
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

// ==================== API 통합 함수 ====================

/**
 * API 라우트에서 사용할 메인 함수
 */
function integrateWithAPI(responseText, userSettings) {
    try {
        // 기존 IMAGE_PROMPT 추출 시도
        const imagePromptMatch = responseText.match(/\*\*IMAGE_PROMPT:\*\*\s*(.+)/i);
        
        if (imagePromptMatch) {
            // 기존 프롬프트를 개선된 프롬프트로 변환
            const originalPrompt = imagePromptMatch[1].trim();
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

// ==================== 모듈 내보내기 ====================

// Node.js 환경에서 사용할 경우
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        convertPersonaToFluxPrompt,
        integrateWithAPI,
        validatePromptQuality,
        PERSONA_TYPE_DNA,
        FEMALE_ATTRACTION_LAYERS,
        FLUX_OPTIMIZATION_ENGINE
    };
}

// 브라우저 환경에서 사용할 경우
if (typeof window !== 'undefined') {
    window.FluxPersonaConverter = {
        convertPersonaToFluxPrompt,
        integrateWithAPI,
        validatePromptQuality,
        PERSONA_TYPE_DNA,
        FEMALE_ATTRACTION_LAYERS,
        FLUX_OPTIMIZATION_ENGINE
    };
}

/* 
사용 예시:

const userSettings = {
    personaType: 'AI 인플루언서',
    desiredStyle: '모던하고 세련된',
    allowRandomGeneration: false
};

const personaProfile = "페르소나 프로필 텍스트...";
const optimizedPrompt = convertPersonaToFluxPrompt(personaProfile, userSettings);

// API 라우트에서 사용 시:
const finalPrompt = integrateWithAPI(responseText, userSettings);
*/