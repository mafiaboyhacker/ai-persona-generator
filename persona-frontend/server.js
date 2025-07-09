const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Test API endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working',
    timestamp: new Date().toISOString(),
    apis: ['OpenAI', 'Replicate']
  });
});

// Test persona generation endpoint with real API calls
app.post('/api/generate-complete-persona', async (req, res) => {
  try {
    const startTime = Date.now();
    const { personaType, desiredStyle } = req.body;
    
    // Check for environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const replicateApiToken = process.env.REPLICATE_API_TOKEN;
    
    console.log('🔍 Environment check:');
    console.log('- OpenAI API Key:', openaiApiKey ? 'Available' : 'Missing');
    console.log('- Replicate API Token:', replicateApiToken ? 'Available' : 'Missing');
    
    if (!openaiApiKey) {
      return res.status(500).json({
        error: 'OpenAI API key not configured',
        message: 'Please set OPENAI_API_KEY environment variable'
      });
    }
    
    if (!replicateApiToken) {
      return res.status(500).json({
        error: 'Replicate API token not configured', 
        message: 'Please set REPLICATE_API_TOKEN environment variable'
      });
    }
    
    // Generate persona with OpenAI
    console.log('🤖 Generating persona with OpenAI...');
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `You are a hyper-realistic AI persona generation expert. Create creative and emotionally rich characters in Korean.

Create a detailed persona profile that includes:
1. Name (Korean name with English pronunciation)
2. Age and basic info
3. Personality traits
4. Physical appearance
5. Background story
6. Unique characteristics

Format in Korean with clear sections using ## headers.`
          },
          {
            role: 'user',
            content: `Create a ${personaType} persona with ${desiredStyle} style. Make it detailed and engaging.`
          }
        ],
        max_tokens: 2000,
        temperature: 0.8
      })
    });
    
    if (!openaiResponse.ok) {
      throw new Error(`OpenAI API error: ${openaiResponse.status}`);
    }
    
    const openaiData = await openaiResponse.json();
    const profile = openaiData.choices[0].message.content;
    
    // Generate image with Replicate
    console.log('🎨 Generating image with Replicate...');
    const Replicate = require('replicate');
    const replicate = new Replicate({
      auth: replicateApiToken,
    });
    
    const imagePrompt = `beautiful ${personaType} Korean woman with ${desiredStyle} style, photorealistic, high quality, detailed face, natural lighting, professional photography`;
    
    const modelParams = {
      prompt: imagePrompt,
      width: 768,
      height: 1024,
      guidance: 3.5,
      num_inference_steps: 30,
      safety_tolerance: 5,
      output_format: 'webp',
      output_quality: 80,
    };
    
    console.log('🔍 Replicate parameters:', modelParams);
    
    let imageUrl = null;
    let imageError = null;
    
    try {
      const output = await replicate.run('black-forest-labs/flux-1.1-pro', {
        input: modelParams
      });
      
      console.log('🔍 Replicate output:', typeof output, output);
      
      if (output && typeof output === 'object' && output.url) {
        imageUrl = await output.url();
        console.log('✅ Image generated successfully:', imageUrl);
      } else if (typeof output === 'string') {
        imageUrl = output;
        console.log('✅ Image URL received:', imageUrl);
      } else {
        throw new Error('Unexpected output format from Replicate');
      }
    } catch (replicateError) {
      console.error('❌ Replicate error:', replicateError);
      imageError = replicateError.message;
    }
    
    const processingTime = Date.now() - startTime;
    
    const response = {
      success: true,
      profile: profile,
      imageUrl: imageUrl,
      imagePrompt: imagePrompt,
      model_used: 'Persona-v.01',
      timestamp: new Date().toISOString(),
      imageError: imageError,
      processing_time_ms: processingTime
    };
    
    console.log('✅ Response ready:', {
      ...response,
      profile: response.profile ? `${response.profile.substring(0, 100)}...` : null
    });
    
    res.json(response);
    
  } catch (error) {
    console.error('❌ Server error:', error);
    res.status(500).json({
      error: 'Failed to generate persona',
      message: error.message
    });
  }
});

// Serve the main page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>AI Persona Generator - Test Server</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .container { max-width: 600px; margin: 0 auto; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 12px 20px; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        .result { margin-top: 20px; padding: 20px; background: #f8f9fa; border-radius: 4px; }
        .error { color: #dc3545; }
        .success { color: #28a745; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>AI Persona Generator - Test Server</h1>
        
        <div class="form-group">
          <label for="personaType">페르소나 타입:</label>
          <select id="personaType">
            <option value="cute">귀여운 (Cute)</option>
            <option value="elegant">우아한 (Elegant)</option>
            <option value="professional">전문적인 (Professional)</option>
            <option value="trendy">트렌디한 (Trendy)</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="desiredStyle">원하는 스타일:</label>
          <input type="text" id="desiredStyle" placeholder="예: 귀여운 스타일" value="귀여운 스타일">
        </div>
        
        <button onclick="generatePersona()">페르소나 생성</button>
        
        <div id="result" class="result" style="display: none;"></div>
      </div>

      <script>
        async function generatePersona() {
          const personaType = document.getElementById('personaType').value;
          const desiredStyle = document.getElementById('desiredStyle').value;
          const resultDiv = document.getElementById('result');
          
          try {
            resultDiv.innerHTML = '<div class="success">페르소나 생성 중...</div>';
            resultDiv.style.display = 'block';
            
            const response = await fetch('/api/generate-complete-persona', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                personaType: personaType,
                desiredStyle: desiredStyle,
                allowNsfw: false,
                fluxModel: 'Persona-v.01'
              })
            });
            
            const data = await response.json();
            
            if (data.success) {
              resultDiv.innerHTML = \`
                <div class="success">페르소나 생성 완료!</div>
                <h3>생성된 페르소나:</h3>
                <pre style="white-space: pre-wrap; background: white; padding: 15px; border-radius: 4px;">\${data.profile}</pre>
                <p><strong>이미지 프롬프트:</strong> \${data.imagePrompt}</p>
                <p><strong>모델:</strong> \${data.model_used}</p>
                <p><strong>처리 시간:</strong> \${data.processing_time_ms}ms</p>
                \${data.imageError ? \`<p class="error">이미지 생성 오류: \${data.imageError}</p>\` : ''}
              \`;
            } else {
              resultDiv.innerHTML = \`<div class="error">오류: \${data.error}</div>\`;
            }
          } catch (error) {
            resultDiv.innerHTML = \`<div class="error">요청 실패: \${error.message}</div>\`;
          }
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Test the API at: http://localhost:' + PORT);
});