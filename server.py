from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import requests
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__, static_folder='.')
CORS(app)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')

# API Keys
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
FAL_AI_API_KEY = os.getenv('FAL_AI_API_KEY')

# Load system prompt files
def load_system_prompt():
    try:
        with open('Apex-v10-Odyssey.txt', 'r', encoding='utf-8') as f:
            apex_prompt = f.read()
        return json.loads(apex_prompt)
    except Exception as e:
        print(f"Warning: Could not load Apex-v10-Odyssey.txt: {e}")
        return None

def load_guidelines_prompt():
    try:
        with open('system_prompt.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        print(f"Warning: Could not load system_prompt.json: {e}")
        return None

# Load prompts
APEX_SYSTEM_PROMPT = load_system_prompt()
GUIDELINES_PROMPT = load_guidelines_prompt()

# Fal.ai Model Configuration
FAL_AI_MODELS = {
    'flux-pro': {
        'endpoint': 'fal-ai/flux-pro/v1.1',
        'name': 'FLUX.1 Pro v1.1',
        'description': '최고 품질의 이미지 생성 (권장)'
    },
    'flux-dev': {
        'endpoint': 'fal-ai/flux/dev',
        'name': 'FLUX.1 Dev',
        'description': '빠른 생성 속도와 좋은 품질'
    },
    'flux-schnell': {
        'endpoint': 'fal-ai/flux/schnell',
        'name': 'FLUX.1 Schnell',
        'description': '가장 빠른 생성 속도'
    },
    'flux-lora': {
        'endpoint': 'fal-ai/flux-lora',
        'name': 'FLUX.1 with LoRA',
        'description': 'LoRA 모델 지원'
    }
}

# Reference Persona Example (BellaLeePersona.txt content excerpt)
REFERENCE_PERSONA = """
벨라 리 (Bella Lee) - 24세 한국계 미국인 여성
- 외형: 도회적인 세련됨과 친근한 현실감을 동시에 지님. '한예슬 초창기'의 도시적 이미지
- 성격: 겉으로는 도도하고 거리감 있지만, 마음을 열면 깊고 따뜻한 정을 보임
- 배경: LA 출생, 현재 서울 거주. 패션 디자이너 부모, FIT 뉴욕 유학
- 스타일: 절제된 섹시함, 실루엣 강조형 룩. 루비 레드 립스틱, 고양이눈 아이라인이 시그니처
- 특성: 172cm 슬림 글래머, 고양이형 눈매, 밀크톤 피부
"""

@app.route('/')
def home():
    """Serve the main HTML page"""
    return send_from_directory('.', 'index.html')

@app.route('/api/health')
def health():
    """Basic health check endpoint"""
    return jsonify({
        'status': 'success',
        'message': 'AI Persona Generator API is running'
    })

@app.route('/api/models')
def get_models():
    """Get available Fal.ai models"""
    return jsonify({
        'success': True,
        'data': FAL_AI_MODELS
    })

@app.route('/api/loras')
def get_loras():
    """Get available LoRA models (placeholder for now)"""
    # This would typically fetch from Fal.ai API or a curated list
    sample_loras = [
        {'id': 'none', 'name': 'None', 'description': 'No LoRA applied'},
        {'id': 'realistic-portrait', 'name': 'Realistic Portrait', 'description': 'Enhanced realistic portrait generation'},
        {'id': 'anime-style', 'name': 'Anime Style', 'description': 'Anime/manga character style'},
        {'id': 'photography', 'name': 'Professional Photography', 'description': 'Professional photo style'},
        {'id': 'artistic', 'name': 'Artistic Style', 'description': 'Artistic and painterly effects'}
    ]
    return jsonify({
        'success': True,
        'data': sample_loras
    })

@app.route('/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('.', filename)

@app.route('/regenerate_image', methods=['POST'])
def regenerate_image():
    """
    Regenerate persona image with custom prompt
    
    Expected JSON payload:
    {
        "image_prompt": "string",
        "allow_nsfw_image": boolean
    }
    """
    try:
        # Get request data
        data = request.get_json()
        
        # Validate required fields
        if not data.get('image_prompt'):
            return jsonify({
                'success': False,
                'error': 'Missing required field: image_prompt'
            }), 400
        
        image_prompt = data['image_prompt']
        allow_nsfw_image = data.get('allow_nsfw_image', False)
        fal_model = data.get('fal_model', 'flux-pro')
        lora_model = data.get('lora_model', 'none')
        seed = data.get('seed', None)
        keep_seed = data.get('keep_seed', False)
        
        # Check API key
        if not FAL_AI_API_KEY:
            return jsonify({
                'success': False,
                'error': 'Fal.ai API key not configured'
            }), 500
        
        # Generate persona image using Fal.ai API
        image_result = generate_persona_image_with_fal(
            image_prompt, allow_nsfw_image, fal_model, lora_model, seed, keep_seed
        )
        
        if not image_result['success']:
            return jsonify({
                'success': False,
                'error': f'Fal.ai API error: {image_result["error"]}'
            }), 500
        
        return jsonify({
            'success': True,
            'data': {
                'imageUrl': image_result['image_url'],
                'seed': image_result.get('seed', None),
                'fal_model': fal_model,
                'lora_model': lora_model
            }
        })
        
    except Exception as e:
        app.logger.error(f"Error in regenerate_image: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }), 500

@app.route('/generate_random_persona', methods=['POST'])
def generate_random_persona():
    """
    Generate a completely random AI persona using LLM creativity
    
    Expected JSON payload:
    {
        "allow_nsfw_image": boolean
    }
    """
    try:
        print("🎲 랜덤 페르소나 생성 요청 받음")
        
        # Get request data
        data = request.get_json()
        allow_nsfw_image = data.get('allow_nsfw_image', False)
        
        print(f"📦 요청 데이터: {data}")
        print(f"🔞 NSFW 허용: {allow_nsfw_image}")
        
        # Check API keys
        if not OPENAI_API_KEY:
            print("❌ OpenAI API 키가 설정되지 않음")
            return jsonify({
                'success': False,
                'error': 'OpenAI API key not configured'
            }), 500
        
        if not FAL_AI_API_KEY:
            print("❌ Fal.ai API 키가 설정되지 않음")
            return jsonify({
                'success': False,
                'error': 'Fal.ai API key not configured'
            }), 500
        
        print("✅ API 키 확인 완료")
        
        # Generate random persona parameters using OpenAI
        print("🎯 랜덤 파라미터 생성 시작...")
        random_params = generate_random_persona_params()
        
        if not random_params['success']:
            error_msg = f'Random parameter generation failed: {random_params["error"]}'
            print(f"❌ 랜덤 파라미터 생성 실패: {error_msg}")
            return jsonify({
                'success': False,
                'error': error_msg
            }), 500
        
        print(f"✅ 랜덤 파라미터 생성 성공: {random_params}")
        
        # Generate persona profile using OpenAI API with random parameters
        print("📝 페르소나 프로필 생성 시작...")
        persona_result = generate_persona_profile_with_openai(
            random_params['persona_type'], 
            random_params['desired_style'], 
            random_params['output_detail_level'], 
            allow_nsfw_image
        )
        
        if not persona_result['success']:
            return jsonify({
                'success': False,
                'error': f'OpenAI API error: {persona_result["error"]}'
            }), 500
        
        persona_profile = persona_result['profile']
        image_prompt = persona_result['image_prompt']
        
        # Generate persona image using Fal.ai API with random model selection
        import random
        fal_model = random.choice(['flux-pro', 'flux-dev'])
        lora_model = random.choice(['none', 'realistic-portrait', 'photography'])
        
        image_result = generate_persona_image_with_fal(
            image_prompt, allow_nsfw_image, fal_model, lora_model
        )
        
        if not image_result['success']:
            return jsonify({
                'success': False,
                'error': f'Fal.ai API error: {image_result["error"]}'
            }), 500
        
        return jsonify({
            'success': True,
            'data': {
                'profile': persona_profile,
                'imageUrl': image_result['image_url'],
                'imagePrompt': image_prompt,
                'seed': image_result.get('seed', None),
                'fal_model': fal_model,
                'lora_model': lora_model,
                'random_params': random_params
            }
        })
        
    except Exception as e:
        app.logger.error(f"Error in generate_random_persona: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }), 500

def generate_random_persona_params():
    """
    Generate completely random persona parameters using OpenAI's creativity
    """
    try:
        print("🎲 OpenAI를 사용하여 랜덤 파라미터 생성 중...")
        # System message for random persona generation
        system_message = """
You are a creative AI persona generator. Create completely random and unique persona parameters that would result in interesting, diverse, and compelling AI characters.

Your task is to generate:
1. A random persona type
2. A detailed and creative style description
3. An appropriate detail level

Be creative and diverse in your choices. Include different:
- Ethnicities and cultural backgrounds
- Age ranges (18-35)
- Professions and interests
- Personality types
- Visual styles
- Unique characteristics

Output your response in this exact JSON format:
{
    "persona_type": "string",
    "desired_style": "string", 
    "output_detail_level": "string"
}

Make the desired_style very detailed and specific, including personality traits, visual characteristics, background story elements, and unique quirks.
"""

        user_prompt = """
Generate a completely random and creative AI persona with unique characteristics. 
Make it interesting, diverse, and compelling. Include specific details about:
- Cultural background and ethnicity
- Age and profession
- Personality traits and quirks
- Visual style and fashion sense
- Interests and hobbies
- Background story elements

Be very creative and don't use generic descriptions. Make each persona truly unique and memorable.
"""

        # OpenAI API call
        headers = {
            'Authorization': f'Bearer {OPENAI_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': 'gpt-4o-mini',
            'messages': [
                {'role': 'system', 'content': system_message},
                {'role': 'user', 'content': user_prompt}
            ],
            'max_tokens': 1000,
            'temperature': 1.2  # High creativity
        }
        
        print("📡 OpenAI API 호출 중...")
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=60
        )
        
        print(f"📥 OpenAI API 응답 상태: {response.status_code}")
        
        if response.status_code != 200:
            error_msg = f'OpenAI API error: {response.status_code} - {response.text}'
            print(f"❌ OpenAI API 오류: {error_msg}")
            return {
                'success': False,
                'error': error_msg
            }
        
        result = response.json()
        content = result['choices'][0]['message']['content']
        
        print(f"📝 OpenAI 응답 내용: {content}")
        
        # Parse JSON response
        try:
            params = json.loads(content)
            print(f"✅ 랜덤 파라미터 파싱 성공: {params}")
            return {
                'success': True,
                'persona_type': params['persona_type'],
                'desired_style': params['desired_style'],
                'output_detail_level': params['output_detail_level']
            }
        except json.JSONDecodeError as e:
            # Fallback random parameters if JSON parsing fails
            print(f"⚠️ JSON 파싱 실패, 기본값 사용: {e}")
            print(f"📝 파싱 실패한 내용: {content}")
            
            import random
            persona_types = ['AI 인플루언서', 'AI 모델', 'AI 배우', 'AI 가수', 'AI 아티스트']
            detail_levels = ['간략', '표준', '상세']
            
            fallback_params = {
                'success': True,
                'persona_type': random.choice(persona_types),
                'desired_style': '창의적이고 독특한 스타일의 AI 페르소나. 다양한 문화적 배경과 개성 있는 특징을 가진 매력적인 캐릭터.',
                'output_detail_level': random.choice(detail_levels)
            }
            
            print(f"🔄 폴백 파라미터 사용: {fallback_params}")
            return fallback_params
        
    except Exception as e:
        print(f"🚨 랜덤 파라미터 생성 중 예외: {str(e)}")
        return {
            'success': False,
            'error': str(e)
        }

@app.route('/generate_persona', methods=['POST'])
def generate_persona():
    """
    Generate AI persona based on user input
    
    Expected JSON payload:
    {
        "persona_type": "string",
        "desired_style": "string",
        "key_traits": "string",
        "background_story_elements": "string",
        "visual_preferences": "string",
        "output_detail_level": "string"
    }
    """
    try:
        # Get request data
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['persona_type', 'desired_style']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'error': f'Missing required field: {field}'
                }), 400
        
        # Extract parameters
        persona_type = data['persona_type']
        desired_style = data['desired_style']
        output_detail_level = data.get('output_detail_level', '표준')
        allow_nsfw_image = data.get('allow_nsfw_image', False)
        fal_model = data.get('fal_model', 'flux-pro')
        lora_model = data.get('lora_model', 'none')
        seed = data.get('seed', None)
        keep_seed = data.get('keep_seed', False)
        
        # Check API keys
        if not OPENAI_API_KEY:
            return jsonify({
                'success': False,
                'error': 'OpenAI API key not configured'
            }), 500
        
        if not FAL_AI_API_KEY:
            return jsonify({
                'success': False,
                'error': 'Fal.ai API key not configured'
            }), 500
        
        # Generate persona profile using OpenAI API
        persona_result = generate_persona_profile_with_openai(
            persona_type, desired_style, output_detail_level, allow_nsfw_image
        )
        
        if not persona_result['success']:
            return jsonify({
                'success': False,
                'error': f'OpenAI API error: {persona_result["error"]}'
            }), 500
        
        persona_profile = persona_result['profile']
        image_prompt = persona_result['image_prompt']
        
        # Generate persona image using Fal.ai API
        image_result = generate_persona_image_with_fal(
            image_prompt, allow_nsfw_image, fal_model, lora_model, seed, keep_seed
        )
        
        if not image_result['success']:
            return jsonify({
                'success': False,
                'error': f'Fal.ai API error: {image_result["error"]}'
            }), 500
        
        return jsonify({
            'success': True,
            'data': {
                'profile': persona_profile,
                'imageUrl': image_result['image_url'],
                'imagePrompt': image_prompt,
                'seed': image_result.get('seed', None),
                'fal_model': fal_model,
                'lora_model': lora_model
            }
        })
        
    except Exception as e:
        app.logger.error(f"Error in generate_persona: {str(e)}")
        return jsonify({
            'success': False,
            'error': f'Internal server error: {str(e)}'
        }), 500

def generate_persona_profile_with_openai(persona_type, desired_style, output_detail_level, allow_nsfw_image):
    """
    Generate persona profile text using OpenAI API
    """
    try:
        # Construct the user prompt
        nsfw_instruction = ""
        if allow_nsfw_image:
            nsfw_instruction = """
- NSFW 이미지 생성 허용: 예 (성인 콘텐츠 포함 가능, 단 윤리적 경계 준수)
- 이미지 프롬프트에 성인 콘텐츠 요소를 포함할 수 있으나, 불법적이거나 비동의적인 콘텐츠는 절대 금지
"""
        else:
            nsfw_instruction = """
- NSFW 이미지 생성 허용: 아니오 (가족친화적 콘텐츠만 생성)
- 이미지 프롬프트는 반드시 가족친화적이고 적절한 수준을 유지해야 함
"""

        # Construct user prompt with guidelines
        guidelines_text = ""
        if GUIDELINES_PROMPT:
            guidelines_text = f"""
지침 프롬프트:
{json.dumps(GUIDELINES_PROMPT, ensure_ascii=False, indent=2)}
"""

        user_prompt = f"""
사용자 입력:
- 페르소나 유형: {persona_type}
- 원하는 스타일: {desired_style}
- 상세도 수준: {output_detail_level}
{nsfw_instruction}

{guidelines_text}

참고 예시:
{REFERENCE_PERSONA}

위 사용자 입력의 원하는 스타일을 바탕으로 상세하고 매력적인 AI 페르소나 프로필을 생성해주세요. 
제공된 지침 프롬프트의 구조와 스타일을 따라 다음을 수행해주세요:

1. 사용자가 제공한 "원하는 스타일" 정보를 분석하여 다음 요소들을 자동으로 파악하고 반영:
   - 핵심 성격 특성 (도도함, 따뜻함, 외향/내향성 등)
   - 배경 스토리 요소 (가족관계, 과거 경험, 트라우마 등)
   - 시각적 특성 (외모, 체형, 패션 스타일, 시그니처 아이템 등)
   - 직업적 특성 (활동 분야, 콘텐츠 스타일, 커뮤니케이션 톤 등)

2. 지침 프롬프트에 명시된 12개 섹션을 모두 포함한 마크다운 형식의 상세한 페르소나 프로필

3. 마지막에 "---IMAGE_PROMPT---" 구분자 후 Fal.ai Flux 모델용 이미지 생성 프롬프트

이미지 프롬프트는 영어로 작성하고, 페르소나의 외모, 스타일, 분위기를 생생하게 묘사해주세요.

윤리적 지침 준수:
- Apex v10–Odyssey 엔진의 ethics_framework를 준수
- 성인 콘텐츠가 허용된 경우에도 합의적, 성인 대상, 비착취적, 비그래픽적, 서사적 목적에만 해당
- 감정적, 심리적 깊이에 집중하고 생리학적 세부사항은 지양

중요: 사용자가 제공한 스타일 정보에서 명시적으로 언급되지 않은 부분은 페르소나의 일관성과 매력을 위해 창의적이고 논리적으로 보완해주세요.
"""

        # System message using Apex-v10-Odyssey
        if APEX_SYSTEM_PROMPT:
            system_message = f"""
{json.dumps(APEX_SYSTEM_PROMPT, ensure_ascii=False, indent=2)}

You are operating under the Apex v10–Odyssey Engine for Advanced Persona Simulation. Create detailed, realistic persona profiles following the engine's advanced creative protocols.
"""
        else:
            # Fallback system message
            system_message = """
You are an advanced AI persona generator. Create detailed, realistic persona profiles with deep emotional and narrative complexity.
Follow the provided guidelines to create compelling personas that feel like real people with depth, flaws, and unique characteristics.
"""

        # OpenAI API call
        headers = {
            'Authorization': f'Bearer {OPENAI_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'model': 'gpt-4o-mini',
            'messages': [
                {'role': 'system', 'content': system_message},
                {'role': 'user', 'content': user_prompt}
            ],
            'max_tokens': 4000,
            'temperature': 0.8
        }
        
        response = requests.post(
            'https://api.openai.com/v1/chat/completions',
            headers=headers,
            json=payload,
            timeout=60
        )
        
        if response.status_code != 200:
            return {
                'success': False,
                'error': f'OpenAI API error: {response.status_code} - {response.text}'
            }
        
        result = response.json()
        content = result['choices'][0]['message']['content']
        
        # Split content into profile and image prompt
        if '---IMAGE_PROMPT---' in content:
            parts = content.split('---IMAGE_PROMPT---')
            profile = parts[0].strip()
            image_prompt = parts[1].strip() if len(parts) > 1 else ""
        else:
            profile = content
            image_prompt = f"A hyperrealistic portrait of a {persona_type.lower()}, {desired_style}, {visual_preferences}"
        
        return {
            'success': True,
            'profile': profile,
            'image_prompt': image_prompt
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def generate_persona_image_with_fal(image_prompt, allow_nsfw_image, fal_model='flux-pro', lora_model='none', seed=None, keep_seed=False):
    """
    Generate persona image using Fal.ai API with specified Flux model
    """
    try:
        headers = {
            'Authorization': f'Key {FAL_AI_API_KEY}',
            'Content-Type': 'application/json'
        }
        
        # Enhanced prompt for hyperrealistic results
        realism_keywords = "hyperrealistic, photorealistic, ultra realistic, 8k uhd, professional photography, DSLR camera, cinematic lighting, sharp focus, detailed skin texture, natural lighting, high resolution, lifelike, studio quality, perfect anatomy, realistic proportions"
        quality_keywords = "masterpiece, best quality, highly detailed, award winning photography, professional portrait"
        enhanced_prompt = f"{image_prompt}, {realism_keywords}, {quality_keywords}"
        
        # Configure safety checker based on NSFW allowance
        enable_safety_checker = not allow_nsfw_image
        
        # Get model endpoint
        model_config = FAL_AI_MODELS.get(fal_model, FAL_AI_MODELS['flux-pro'])
        endpoint = model_config['endpoint']
        
        # Base payload with optimized settings for realism
        payload = {
            'prompt': enhanced_prompt,
            'image_size': 'portrait_4_3',  # Better for person portraits
            'num_inference_steps': 35,     # More steps for better quality
            'guidance_scale': 4.0,         # Higher guidance for realism
            'num_images': 1,
            'enable_safety_checker': enable_safety_checker,
            'format': 'jpeg',              # Better quality format
            'quality': 95                  # High quality output
        }
        
        # Add seed if provided
        if seed is not None:
            payload['seed'] = int(seed)
        
        # Add LoRA configuration if not 'none'
        if lora_model != 'none' and fal_model == 'flux-lora':
            payload['loras'] = [{'path': lora_model, 'scale': 1.0}]
        
        # Use specified model endpoint
        response = requests.post(
            f'https://fal.run/{endpoint}',
            headers=headers,
            json=payload,
            timeout=120
        )
        
        if response.status_code != 200:
            return {
                'success': False,
                'error': f'Fal.ai API error: {response.status_code} - {response.text}'
            }
        
        result = response.json()
        
        # Extract image URL and seed from response
        if 'images' in result and len(result['images']) > 0:
            image_url = result['images'][0]['url']
            response_seed = result.get('seed', None)
            return {
                'success': True,
                'image_url': image_url,
                'seed': response_seed
            }
        else:
            return {
                'success': False,
                'error': 'No image generated in Fal.ai response'
            }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

if __name__ == '__main__':
    # Check if API keys are configured
    if not OPENAI_API_KEY:
        print("Warning: OPENAI_API_KEY not found in environment variables")
        print("Please set OPENAI_API_KEY in your .env file")
    if not FAL_AI_API_KEY:
        print("Warning: FAL_AI_API_KEY not found in environment variables")
        print("Please set FAL_AI_API_KEY in your .env file")
    
    print("Starting AI Persona Generator Server...")
    print("API Endpoints:")
    print("  GET  / - Health check")
    print("  POST /generate_persona - Generate AI persona profile and image")
    print("  POST /generate_random_persona - Generate random AI persona")
    print("  POST /regenerate_image - Regenerate persona image")
    
    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5000)