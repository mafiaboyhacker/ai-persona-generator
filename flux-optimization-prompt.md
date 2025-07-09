# Flux 1.1 Pro 최적화 지침 프롬프트

## 개요
이 문서는 AI 페르소나 프로필을 Flux 1.1 Pro에 최적화된 이미지 생성 프롬프트로 변환하는 중간 지침 시스템입니다. 사용자 입력을 100% 보존하면서 Flux 1.1 Pro의 성능을 최대화하는 변환 로직을 제공합니다.

## 핵심 원칙

### 1. 사용자 입력 절대 보존
- **personaType**: 사용자가 선택한 페르소나 타입 100% 반영
- **desiredStyle**: 사용자가 원하는 스타일 방향 완전 적용
- **allowRandomGeneration**: 랜덤 요소 허용 여부 엄격 준수
- **사용자 직접 입력**: 최우선 반영 대상

### 2. 기술적 최적화만 담당
- 내용 변경 없이 Flux 1.1 Pro 문법으로 변환
- 품질 향상 키워드 추가 (의미 변경 없이)
- 자연어 프롬프트 구조로 재구성

### 3. 조건부 처리 구현
- `allowRandomGeneration` 플래그에 따른 분기 처리
- 사용자 맞춤형 스타일 정확 반영

## 변환 시스템 구조

```
입력: 페르소나 프로필 텍스트 + 사용자 설정
↓
1. 페르소나 핵심 요소 추출
↓
2. 시각적 요소 매핑
↓
3. Flux 1.1 Pro 최적화 적용
↓
4. 자연어 프롬프트 구성
↓
출력: 최적화된 이미지 생성 프롬프트
```

## 실제 구현을 위한 변환 로직

### 1. 페르소나 핵심 요소 추출 함수

```javascript
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
        setting: '',
        profession: ''
    };
    
    // 정규식을 사용한 정보 추출
    const nameMatch = personaProfile.match(/(?:이름|명칭):\s*(.+?)(?:\n|$)/);
    const ageMatch = personaProfile.match(/(?:나이|연령):\s*(.+?)(?:\n|$)/);
    const appearanceMatch = personaProfile.match(/(?:외모|외관|외형)[\s\S]*?(?=##|$)/);
    const personalityMatch = personaProfile.match(/(?:성격|심리|감정)[\s\S]*?(?=##|$)/);
    
    if (nameMatch) elements.name = nameMatch[1].trim();
    if (ageMatch) elements.age = ageMatch[1].trim();
    
    // 외모 정보 세부 추출
    if (appearanceMatch) {
        const appearanceText = appearanceMatch[0];
        elements.appearance.face = extractFacialFeatures(appearanceText);
        elements.appearance.hair = extractHairDescription(appearanceText);
        elements.appearance.body = extractBodyDescription(appearanceText);
        elements.appearance.style = extractStyleDescription(appearanceText);
    }
    
    // 성격 정보 세부 추출
    if (personalityMatch) {
        const personalityText = personalityMatch[0];
        elements.personality.traits = extractPersonalityTraits(personalityText);
        elements.personality.mood = extractMoodDescription(personalityText);
        elements.personality.expression = extractExpressionDescription(personalityText);
    }
    
    return elements;
}
```

### 2. 시각적 요소 매핑 함수

```javascript
function mapPersonaToVisualElements(elements, personaType, desiredStyle) {
    const visualMapping = {
        subject: '',
        appearance: '',
        expression: '',
        pose: '',
        clothing: '',
        environment: '',
        lighting: '',
        composition: ''
    };
    
    // 페르소나 타입별 기본 매핑
    const typeMapping = {
        'AI 인플루언서': {
            pose: 'confident social media pose',
            environment: 'modern urban background',
            lighting: 'natural daylight with soft shadows',
            composition: 'medium shot portrait'
        },
        '배우': {
            pose: 'professional headshot pose',
            environment: 'elegant studio background',
            lighting: 'dramatic professional lighting',
            composition: 'close-up portrait'
        },
        '가수': {
            pose: 'artistic expressive pose',
            environment: 'creative studio or stage setting',
            lighting: 'dynamic colorful lighting',
            composition: 'artistic portrait'
        },
        '버튜버': {
            pose: 'cute playful pose',
            environment: 'colorful vibrant background',
            lighting: 'bright cheerful lighting',
            composition: 'anime-inspired portrait'
        },
        '모델': {
            pose: 'high fashion model pose',
            environment: 'professional studio setup',
            lighting: 'studio lighting with controlled shadows',
            composition: 'fashion portrait'
        },
        '크리에이터': {
            pose: 'natural authentic pose',
            environment: 'creative workspace background',
            lighting: 'natural warm lighting',
            composition: 'lifestyle portrait'
        }
    };
    
    // 기본 매핑 적용
    const baseMapping = typeMapping[personaType] || typeMapping['크리에이터'];
    Object.assign(visualMapping, baseMapping);
    
    // 개인 특성 반영
    visualMapping.subject = `${elements.age || 'young adult'} ${personaType}`;
    visualMapping.appearance = combineAppearanceFeatures(elements.appearance);
    visualMapping.expression = mapPersonalityToExpression(elements.personality);
    
    // 스타일 반영
    visualMapping.clothing = adaptStyleToClothing(desiredStyle, personaType);
    visualMapping.environment = adaptStyleToEnvironment(desiredStyle, visualMapping.environment);
    
    return visualMapping;
}
```

### 3. Flux 1.1 Pro 최적화 적용 함수

```javascript
function applyFluxOptimization(visualMapping, personaType, desiredStyle) {
    const optimizedPrompt = {
        filePrefix: generateFilePrefix(),
        mainDescription: '',
        technicalDetails: '',
        qualityTags: '',
        styleModifiers: ''
    };
    
    // 파일 접두사 생성 (현실감 강화)
    optimizedPrompt.filePrefix = 'IMG_' + Math.floor(Math.random() * 9999).toString().padStart(4, '0') + '.jpg';
    
    // 메인 설명 자연어 구성
    optimizedPrompt.mainDescription = constructNaturalLanguageDescription(visualMapping);
    
    // 기술적 디테일 추가
    optimizedPrompt.technicalDetails = generateTechnicalDetails(personaType, desiredStyle);
    
    // 품질 태그 추가
    optimizedPrompt.qualityTags = generateQualityTags();
    
    // 스타일 수정자 추가
    optimizedPrompt.styleModifiers = generateStyleModifiers(desiredStyle);
    
    return optimizedPrompt;
}
```

### 4. 자연어 프롬프트 구성 함수

```javascript
function constructNaturalLanguageDescription(visualMapping) {
    const description = [];
    
    // 주제 설명
    description.push(`A ${visualMapping.composition} of a ${visualMapping.subject}`);
    
    // 외모 설명
    if (visualMapping.appearance) {
        description.push(`with ${visualMapping.appearance}`);
    }
    
    // 표정 설명
    if (visualMapping.expression) {
        description.push(`showing ${visualMapping.expression}`);
    }
    
    // 포즈 설명
    if (visualMapping.pose) {
        description.push(`in ${visualMapping.pose}`);
    }
    
    // 의상 설명
    if (visualMapping.clothing) {
        description.push(`wearing ${visualMapping.clothing}`);
    }
    
    // 환경 설명
    if (visualMapping.environment) {
        description.push(`against ${visualMapping.environment}`);
    }
    
    // 조명 설명
    if (visualMapping.lighting) {
        description.push(`with ${visualMapping.lighting}`);
    }
    
    return description.join(', ');
}
```

## 완성된 변환 함수

```javascript
function convertPersonaToFluxPrompt(personaProfile, userSettings) {
    const { personaType, desiredStyle, allowRandomGeneration } = userSettings;
    
    // 1. 페르소나 핵심 요소 추출
    const elements = extractPersonaElements(personaProfile);
    
    // 2. 시각적 요소 매핑
    const visualMapping = mapPersonaToVisualElements(elements, personaType, desiredStyle);
    
    // 3. 랜덤 요소 처리
    if (allowRandomGeneration) {
        visualMapping = addRandomElements(visualMapping);
    }
    
    // 4. Flux 1.1 Pro 최적화 적용
    const optimizedPrompt = applyFluxOptimization(visualMapping, personaType, desiredStyle);
    
    // 5. 최종 프롬프트 구성
    const finalPrompt = [
        optimizedPrompt.filePrefix,
        optimizedPrompt.mainDescription,
        optimizedPrompt.technicalDetails,
        optimizedPrompt.qualityTags,
        optimizedPrompt.styleModifiers
    ].filter(Boolean).join(', ');
    
    return finalPrompt;
}
```

## 품질 향상 키워드 템플릿

### 기본 품질 태그
```
hyperrealistic, photorealistic, high resolution, 4k, detailed facial features, natural skin texture, realistic hair texture, professional photography, studio quality
```

### 조명 키워드
```
natural lighting, soft shadows, professional studio lighting, golden hour lighting, dramatic lighting, ambient lighting, three-point lighting
```

### 기술적 키워드
```
shallow depth of field, bokeh effect, professional camera, DSLR quality, sharp focus, detailed background, realistic textures, authentic colors
```

### 스타일별 키워드

**AI 인플루언서**:
```
modern, trendy, social media ready, urban aesthetic, contemporary fashion, lifestyle photography
```

**배우**:
```
elegant, sophisticated, theatrical, dramatic, professional headshot, cinematic quality
```

**가수**:
```
artistic, creative, expressive, dynamic, performance-ready, music industry style
```

**버튜버**:
```
anime-inspired, cute, playful, colorful, vibrant, youthful, kawaii aesthetic
```

**모델**:
```
high fashion, editorial, professional modeling, fashion photography, stylish, elegant posing
```

**크리에이터**:
```
authentic, natural, creative, artistic, workspace aesthetic, genuine expression
```

## 사용 예시

### 입력 예시
```json
{
    "personaProfile": "## 페르소나 이름: 소연 (Soyeon)\n\n### 기본 정보\n- 나이: 24세\n- 직업: AI 인플루언서\n...",
    "userSettings": {
        "personaType": "AI 인플루언서",
        "desiredStyle": "모던하고 세련된",
        "allowRandomGeneration": false
    }
}
```

### 출력 예시
```
IMG_1234.jpg, A medium shot portrait of a young adult AI 인플루언서 with long wavy brown hair, bright expressive eyes, and a confident smile, showing cheerful and engaging expression, in confident social media pose, wearing modern trendy outfit with contemporary accessories, against modern urban background with soft city lights, with natural daylight with soft shadows, hyperrealistic, photorealistic, high resolution, 4k, detailed facial features, natural skin texture, professional photography, modern, trendy, social media ready, urban aesthetic, contemporary fashion, lifestyle photography
```

## 실제 코드 통합 방안

### API 라우트 수정 방향

```javascript
// 기존 코드 (358-412행 부분)
// 응답 파싱 - IMAGE_PROMPT 추출
let parsedResponse
try {
    const imagePromptMatch = responseText.match(/\*\*IMAGE_PROMPT:\*\*\s*(.+)/i)
    let imagePrompt = null
    
    if (imagePromptMatch) {
        imagePrompt = imagePromptMatch[1].trim()
        
        // 새로운 변환 시스템 적용
        imagePrompt = convertPersonaToFluxPrompt(responseText, {
            personaType,
            desiredStyle,
            allowRandomGeneration: false // 또는 사용자 설정에서 가져옴
        })
    }
    
    // 기존 fallback 로직은 동일하게 유지
    if (!imagePrompt) {
        // 기존 타입별 프롬프트 생성 로직
        imagePrompt = convertPersonaToFluxPrompt(responseText, {
            personaType,
            desiredStyle,
            allowRandomGeneration: false
        })
    }
    
    // 나머지 로직은 동일
    parsedResponse = {
        profile: profile,
        imagePrompt: imagePrompt
    }
} catch (error) {
    // 에러 처리
}
```

## 테스트 및 검증 방안

### 1. A/B 테스트
- 기존 시스템과 새 시스템 결과 비교
- 사용자 만족도 측정
- 이미지 품질 객관적 평가

### 2. 품질 지표
- 페르소나 텍스트와 이미지 일치도
- 사용자 입력 반영도
- 이미지 현실감 및 품질

### 3. 성능 지표
- 이미지 생성 성공률
- 평균 생성 시간
- 사용자 재시도 빈도

## 지속적 개선 방안

### 1. 피드백 수집
- 사용자 만족도 조사
- 이미지 품질 평가
- 개선 요청 사항 수집

### 2. 모델 업데이트 대응
- Flux 모델 업데이트 시 프롬프트 최적화
- 새로운 기능 및 키워드 반영

### 3. 데이터 기반 개선
- 성공적인 프롬프트 패턴 분석
- 실패 케이스 분석 및 개선

## 결론

이 지침 프롬프트 시스템은 사용자 입력을 100% 보존하면서 Flux 1.1 Pro의 성능을 최대화하는 중간 변환 레이어를 제공합니다. 기존 GPT 시스템을 건드리지 않고 이미지 품질을 대폭 향상시킬 수 있는 실용적인 해결책입니다.