// DOM Elements
const personaForm = document.getElementById('persona-form');
const generateBtn = document.getElementById('generate-btn');
const randomGenerateBtn = document.getElementById('random-generate-btn');

// 즉시 실행되는 디버깅
console.log('SCRIPT LOADED! randomGenerateBtn:', randomGenerateBtn);

// 직접 클릭 이벤트 추가 (백업)
setTimeout(() => {
    const btn = document.getElementById('random-generate-btn');
    if (btn) {
        btn.onclick = function() {
            alert('직접 onclick 이벤트로 클릭됨!');
            console.log('직접 onclick으로 랜덤 생성 호출');
        };
        console.log('직접 onclick 이벤트 추가됨');
    }
}, 100);

// Debug: DOM 요소 확인
console.log('🔍 DOM 요소 확인:');
console.log('- personaForm:', personaForm);
console.log('- generateBtn:', generateBtn);
console.log('- randomGenerateBtn:', randomGenerateBtn);
const loadingIndicator = document.getElementById('loading-indicator');
const outputResults = document.getElementById('output-results');
const personaProfileText = document.getElementById('persona-profile-text');
const personaImageContainer = document.getElementById('persona-image-container');
const personaImage = document.getElementById('persona-image');

// New elements for enhanced features
const saveProfileBtn = document.getElementById('save-profile-btn');
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const imagePromptTextarea = document.getElementById('image-prompt');
const regenerateImageBtn = document.getElementById('regenerate-image-btn');
const savedProfilesSidebar = document.getElementById('saved-profiles-sidebar');
const closeSidebarBtn = document.getElementById('close-sidebar-btn');
const savedProfilesList = document.getElementById('saved-profiles-list');

// Regenerate settings elements
const regenerateSettings = document.getElementById('regenerate-settings');
const confirmRegenerateBtn = document.getElementById('confirm-regenerate-btn');
const cancelRegenerateBtn = document.getElementById('cancel-regenerate-btn');
const regenFalModelSelect = document.getElementById('regen-fal-model');
const regenLoraModelSelect = document.getElementById('regen-lora-model');
const regenSeedInput = document.getElementById('regen-seed');
const regenNsfwInput = document.getElementById('regen-nsfw');

// Image gallery elements
const imageGalleryEl = document.getElementById('image-gallery');
const imageNavigation = document.getElementById('image-navigation');
const prevImageBtn = document.getElementById('prev-image-btn');
const nextImageBtn = document.getElementById('next-image-btn');
const imageCounter = document.getElementById('image-counter');

// Global variables
let currentPersonaData = null;
let currentImagePrompt = null;
let imageGallery = [];
let currentImageIndex = 0;

// Theme and Accessibility Variables
let currentTheme = 'auto';
let accessibilityOptions = [];

// Theme and Accessibility Elements
const themeToggleBtn = document.getElementById('theme-toggle');
const accessibilityToggleBtn = document.getElementById('accessibility-toggle');
const accessibilityMenu = document.getElementById('accessibility-menu');
const accessibilityBtns = document.querySelectorAll('.accessibility-btn');
const themeIcon = document.querySelector('.theme-icon');

// Sidebar and Collapsible Elements
const openSidebarBtn = document.getElementById('open-sidebar-btn');

// Input Fields
const personaTypeInput = document.getElementById('persona_type');
const desiredStyleInput = document.getElementById('desired_style');
// 상세도 수준 제거됨 - 항상 "상세"로 고정
const allowNsfwImageInput = document.getElementById('allow_nsfw_image');

// Advanced Settings Elements
const toggleAdvancedBtn = document.getElementById('toggle-advanced');
const advancedSettings = document.getElementById('advanced-settings');
const advancedArrow = document.getElementById('advanced-arrow');
const falModelSelect = document.getElementById('fal_model');
const loraModelSelect = document.getElementById('lora_model');
const seedInput = document.getElementById('seed');
const keepSeedInput = document.getElementById('keep_seed');

// Image Info Elements
const usedModelSpan = document.getElementById('used-model');
const usedLoraSpan = document.getElementById('used-lora');
const usedSeedSpan = document.getElementById('used-seed');
const copySeedBtn = document.getElementById('copy-seed-btn');

// API Configuration
const API_BASE_URL = 'http://localhost:5000';

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    // Initial state setup
    initializeApp();
    
    // Add event listener to generate button
    if (generateBtn) {
        generateBtn.addEventListener('click', handleGenerateClick);
        console.log('✅ 일반 생성 버튼 이벤트 리스너 등록됨');
    } else {
        console.error('❌ 일반 생성 버튼을 찾을 수 없음');
    }
    
    // Add event listener to random generate button
    if (randomGenerateBtn) {
        // 랜덤 버튼을 강제로 활성화
        randomGenerateBtn.disabled = false;
        randomGenerateBtn.style.pointerEvents = 'auto';
        randomGenerateBtn.style.opacity = '1';
        
        randomGenerateBtn.addEventListener('click', function(event) {
            console.log('🔥 랜덤 버튼 클릭됨!');
            alert('랜덤 버튼이 클릭되었습니다!');
            handleRandomGenerate(event);
        });
        console.log('✅ 랜덤 생성 버튼 이벤트 리스너 등록됨');
        
        // 추가 디버깅: 버튼 요소 자체 정보
        console.log('🔍 랜덤 버튼 정보:', {
            id: randomGenerateBtn.id,
            className: randomGenerateBtn.className,
            type: randomGenerateBtn.type,
            textContent: randomGenerateBtn.textContent,
            disabled: randomGenerateBtn.disabled,
            style: randomGenerateBtn.style.cssText
        });
        
        // 주기적으로 랜덤 버튼 상태 확인 (폼 유효성 검사가 비활성화하는 경우 대비)
        setInterval(() => {
            if (randomGenerateBtn.disabled) {
                console.log('⚠️ 랜덤 버튼이 비활성화됨. 다시 활성화합니다.');
                randomGenerateBtn.disabled = false;
            }
        }, 1000);
        
    } else {
        console.error('❌ 랜덤 생성 버튼을 찾을 수 없음');
    }
    
    // Add form submit listener to prevent default form submission
    personaForm.addEventListener('submit', function(event) {
        event.preventDefault();
        handleGenerateClick();
    });
    
    // New feature event listeners
    saveProfileBtn.addEventListener('click', handleSaveProfile);
    downloadPdfBtn.addEventListener('click', handleDownloadPdf);
    regenerateImageBtn.addEventListener('click', showRegenerateSettings);
    confirmRegenerateBtn.addEventListener('click', handleRegenerateImage);
    cancelRegenerateBtn.addEventListener('click', hideRegenerateSettings);
    closeSidebarBtn.addEventListener('click', closeSidebar);
    
    // Image gallery navigation
    prevImageBtn.addEventListener('click', showPreviousImage);
    nextImageBtn.addEventListener('click', showNextImage);
    
    // Advanced settings toggle
    toggleAdvancedBtn.addEventListener('click', toggleAdvancedSettings);
    
    // Load saved profiles on startup
    loadSavedProfiles();
});

// Initialize App
function initializeApp() {
    // Hide output results and loading indicator initially
    outputResults.classList.add('hidden');
    loadingIndicator.classList.add('hidden');
    
    // Enable generate buttons
    generateBtn.disabled = false;
    randomGenerateBtn.disabled = false;
    
    // Load available models and LoRAs
    loadAvailableModels();
    loadAvailableLoras();
}

// Toggle Advanced Settings
function toggleAdvancedSettings() {
    const isHidden = advancedSettings.classList.contains('hidden');
    
    if (isHidden) {
        advancedSettings.classList.remove('hidden');
        advancedArrow.style.transform = 'rotate(180deg)';
    } else {
        advancedSettings.classList.add('hidden');
        advancedArrow.style.transform = 'rotate(0deg)';
    }
}

// Generate Button Click Handler
async function handleGenerateClick() {
    try {
        // Collect input values
        const personaData = collectInputData();
        
        // Validate input data
        if (!validateInputData(personaData)) {
            showError('모든 필드를 입력해주세요.');
            return;
        }
        
        // Show loading state
        showLoadingState();
        
        // Call API to generate persona
        const response = await generatePersona(personaData);
        
        if (response.success) {
            displayResults(response.data);
        } else {
            showError(response.error || '페르소나 생성에 실패했습니다.');
        }
        
    } catch (error) {
        console.error('Error generating persona:', error);
        showError('페르소나 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        hideLoadingState();
    }
}

// Collect Input Data
function collectInputData() {
    // Get selected radio button value
    const selectedDetailLevel = '상세';  // 항상 상세로 고정
    
    return {
        persona_type: personaTypeInput.value.trim(),
        desired_style: desiredStyleInput.value.trim(),
        output_detail_level: selectedDetailLevel,
        allow_nsfw_image: allowNsfwImageInput.checked
    };
}

// Validate Input Data
function validateInputData(data) {
    return data.persona_type && 
           data.desired_style;
}

// API Functions
async function generatePersona(personaData) {
    try {
        const response = await fetch(`${API_BASE_URL}/generate_persona`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(personaData)
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        throw new Error('API 호출 실패: ' + error.message);
    }
}

// Random Generate Handler
async function handleRandomGenerate(event) {
    console.log('🎲🎲🎲 랜덤 생성 함수 진입! 🎲🎲🎲');
    
    if (event) {
        event.preventDefault();
        console.log('✅ 기본 이벤트 방지됨');
    }
    
    try {
        // Show loading state
        showLoadingState(true);
        
        console.log('API 호출 시작...');
        // Call API to generate random persona
        const response = await generateRandomPersona();
        
        console.log('API 응답 수신:', response);
        
        if (response.success) {
            console.log('✅ 랜덤 페르소나 생성 성공');
            displayResults(response.data);
        } else {
            console.error('❌ 랜덤 생성 실패:', response.error);
            showError(response.error || '랜덤 페르소나 생성에 실패했습니다.');
        }
        
    } catch (error) {
        console.error('🚨 랜덤 생성 중 예외 발생:', error);
        showError('랜덤 페르소나 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
        hideLoadingState();
    }
}

// API Function for Random Persona
async function generateRandomPersona() {
    try {
        const requestData = {
            allow_nsfw_image: allowNsfwImageInput.checked
        };
        
        console.log('📡 서버로 전송할 데이터:', requestData);
        console.log('🌐 API URL:', `${API_BASE_URL}/generate_random_persona`);
        
        const response = await fetch(`${API_BASE_URL}/generate_random_persona`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });
        
        console.log('📥 HTTP 응답 상태:', response.status, response.statusText);
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ HTTP 오류 응답:', errorText);
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ 서버 응답 데이터:', data);
        return data;
    } catch (error) {
        console.error('🚨 API 호출 중 오류:', error);
        throw new Error('API 호출 실패: ' + error.message);
    }
}

// Loading State Management
function showLoadingState(isRandom = false) {
    loadingIndicator.classList.remove('hidden');
    
    if (isRandom) {
        randomGenerateBtn.disabled = true;
        randomGenerateBtn.textContent = '생성 중...';
        generateBtn.disabled = true;
    } else {
        generateBtn.disabled = true;
        generateBtn.textContent = '생성 중...';
        randomGenerateBtn.disabled = true;
    }
    
    outputResults.classList.add('hidden');
}

function hideLoadingState() {
    loadingIndicator.classList.add('hidden');
    generateBtn.disabled = false;
    generateBtn.textContent = '페르소나 생성';
    randomGenerateBtn.disabled = false;
    randomGenerateBtn.textContent = '🎲 랜덤 생성';
}

// Display Results
function displayResults(data) {
    // Store current data
    currentPersonaData = data;
    
    // Display persona profile text
    if (data.profile) {
        displayPersonaProfile(data.profile);
    }
    
    // Display persona image
    if (data.imageUrl) {
        displayPersonaImage(data.imageUrl);
    }
    
    // Display image prompt if available
    if (data.imagePrompt) {
        currentImagePrompt = data.imagePrompt;
        imagePromptTextarea.value = data.imagePrompt;
    }
    
    // Display image information
    updateImageInfo(data);
    
    // Show results section
    outputResults.classList.remove('hidden');
    
    // Scroll to results
    scrollToResults();
}

// Display Persona Profile
function displayPersonaProfile(profileText) {
    // Check if marked.js is available for markdown parsing
    if (typeof marked !== 'undefined') {
        // Use marked.js to parse markdown
        const htmlContent = marked.parse(profileText);
        personaProfileText.innerHTML = htmlContent;
    } else {
        // Fallback: Simple markdown-like formatting
        const htmlContent = simpleMarkdownParse(profileText);
        personaProfileText.innerHTML = htmlContent;
    }
}

// Simple Markdown Parser (fallback)
function simpleMarkdownParse(text) {
    return text
        // Headers
        .replace(/^### (.*$)/gm, '<h3>$1</h3>')
        .replace(/^## (.*$)/gm, '<h2>$1</h2>')
        .replace(/^# (.*$)/gm, '<h1>$1</h1>')
        // Bold and italic
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Line breaks
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        // Wrap in paragraphs
        .replace(/^(.+)$/gm, '<p>$1</p>')
        // Lists
        .replace(/^- (.*$)/gm, '<li>$1</li>')
        .replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
}

// Display Persona Image
function displayPersonaImage(imageUrl, isRegenerated = false) {
    if (isRegenerated) {
        // Add new image to gallery
        addImageToGallery(imageUrl, `재생성 ${imageGallery.length}`);
    } else {
        // Initial image - clear gallery and add first image
        imageGallery = [];
        currentImageIndex = 0;
        addImageToGallery(imageUrl, '원본');
    }
    
    updateImageNavigation();
}

// Add image to gallery
function addImageToGallery(imageUrl, label) {
    const imageData = {
        url: imageUrl,
        label: label,
        settings: {
            fal_model: currentPersonaData?.fal_model || 'flux-pro',
            lora_model: currentPersonaData?.lora_model || 'none',
            seed: currentPersonaData?.seed || null,
            prompt: currentImagePrompt || ''
        }
    };
    
    imageGallery.push(imageData);
    
    // Create new image container
    const containerEl = document.createElement('div');
    containerEl.className = 'persona-image-container';
    containerEl.innerHTML = `
        <img src="${imageUrl}" alt="생성된 페르소나 이미지">
        <div class="image-label">${label}</div>
    `;
    
    // Add click handler
    containerEl.addEventListener('click', () => {
        selectImage(imageGallery.length - 1);
    });
    
    imageGalleryEl.appendChild(containerEl);
    
    // Select the new image
    selectImage(imageGallery.length - 1);
}

// Select image in gallery
function selectImage(index) {
    currentImageIndex = index;
    
    // Update active state
    const containers = imageGalleryEl.querySelectorAll('.persona-image-container');
    containers.forEach((container, i) => {
        container.classList.toggle('active', i === index);
    });
    
    // Update current image reference
    const selectedImage = imageGallery[index];
    if (selectedImage) {
        personaImage.src = selectedImage.url;
        personaImage.style.display = 'block';
        
        // Update image prompt textarea
        imagePromptTextarea.value = selectedImage.settings.prompt;
        
        // Update image info
        updateImageInfo(selectedImage.settings);
    }
    
    updateImageNavigation();
}

// Navigation functions
function showPreviousImage() {
    if (currentImageIndex > 0) {
        selectImage(currentImageIndex - 1);
    }
}

function showNextImage() {
    if (currentImageIndex < imageGallery.length - 1) {
        selectImage(currentImageIndex + 1);
    }
}

// Update navigation UI
function updateImageNavigation() {
    if (imageGallery.length <= 1) {
        imageNavigation.classList.add('hidden');
        return;
    }
    
    imageNavigation.classList.remove('hidden');
    imageCounter.textContent = `${currentImageIndex + 1} / ${imageGallery.length}`;
    
    prevImageBtn.disabled = currentImageIndex === 0;
    nextImageBtn.disabled = currentImageIndex === imageGallery.length - 1;
}

// Update Image Information
function updateImageInfo(data) {
    // Get model name from data or use default
    const modelName = data.fal_model || 'flux-pro';
    const loraName = data.lora_model || 'none';
    const seedValue = data.seed || 'Random';
    
    // Update UI elements
    if (usedModelSpan) {
        usedModelSpan.textContent = modelName.toUpperCase().replace('-', ' ');
    }
    
    if (usedLoraSpan) {
        usedLoraSpan.textContent = loraName === 'none' ? 'None' : loraName.replace('-', ' ');
    }
    
    if (usedSeedSpan) {
        usedSeedSpan.textContent = seedValue;
    }
    
    // Update copy seed button functionality
    if (copySeedBtn && seedValue !== 'Random') {
        copySeedBtn.style.display = 'inline-block';
        copySeedBtn.onclick = () => {
            navigator.clipboard.writeText(seedValue).then(() => {
                showSuccess('Seed 값이 클립보드에 복사되었습니다!');
            }).catch(err => {
                console.error('Failed to copy seed:', err);
                showError('Seed 값 복사에 실패했습니다.');
            });
        };
    } else if (copySeedBtn) {
        copySeedBtn.style.display = 'none';
    }
}

// Error Handling
function showError(message) {
    console.error('Showing error:', message);
    
    // Display error in the UI instead of alert
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 0, 0, 0.9);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
    
    // Allow manual close on click
    errorDiv.addEventListener('click', () => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    });
}

// Utility Functions
function scrollToResults() {
    outputResults.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Form Reset Function (optional)
function resetForm() {
    personaForm.reset();
    outputResults.classList.add('hidden');
    loadingIndicator.classList.add('hidden');
    
    // Reset image gallery
    imageGallery = [];
    currentImageIndex = 0;
    imageGalleryEl.innerHTML = `
        <div id="persona-image-container" class="persona-image-container active">
            <img id="persona-image" src="" alt="생성된 페르소나 이미지" style="display: none;">
            <div class="image-placeholder">
                <p>이미지가 생성되면 여기에 표시됩니다</p>
            </div>
            <div class="image-label">원본</div>
        </div>
    `;
    
    // Hide navigation
    imageNavigation.classList.add('hidden');
}

// New Feature Functions

// Save Profile
function handleSaveProfile() {
    if (!currentPersonaData) {
        showError('저장할 프로필이 없습니다.');
        return;
    }
    
    // Extract persona name from profile text
    const profileText = currentPersonaData.profile || '';
    const nameMatch = profileText.match(/(?:이름|name)[:：]\s*([^\n\r]+)/i) || 
                     profileText.match(/([가-힣a-zA-Z\s]+)\s*[-–—]\s*\d+세/) ||
                     profileText.match(/^([가-힣a-zA-Z\s]+)/);
    
    const extractedName = nameMatch ? nameMatch[1].trim() : '';
    const currentDate = new Date().toLocaleDateString('ko-KR').replace(/\./g, '').replace(/\s/g, '');
    const defaultName = extractedName ? `${extractedName}_${currentDate}` : `Persona_${currentDate}`;
    
    const profileName = prompt('프로필 이름을 입력하세요:', defaultName);
    if (!profileName) return;
    
    const savedProfile = {
        id: Date.now().toString(),
        name: profileName,
        date: new Date().toISOString(),
        profile: currentPersonaData.profile,
        imageUrl: currentPersonaData.imageUrl,
        imagePrompt: currentImagePrompt,
        imageGallery: imageGallery.map(img => ({
            url: img.url,
            label: img.label,
            settings: img.settings
        })),
        settings: {
            fal_model: currentPersonaData.fal_model,
            lora_model: currentPersonaData.lora_model,
            seed: currentPersonaData.seed
        }
    };
    
    // Save to localStorage
    const savedProfiles = getSavedProfiles();
    savedProfiles.push(savedProfile);
    localStorage.setItem('aiPersonaProfiles', JSON.stringify(savedProfiles));
    
    // Update sidebar
    loadSavedProfiles();
    
    // Show sidebar
    openSidebar();
    
    showSuccess('프로필이 저장되었습니다!');
}

// Download PDF
async function handleDownloadPdf() {
    if (!currentPersonaData) {
        showError('다운로드할 프로필이 없습니다.');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // Use built-in fonts for better compatibility
        pdf.setFont('helvetica');
        
        // Add title
        pdf.setFontSize(20);
        pdf.text('AI Persona Profile', 20, 30);
        
        // Add generation date
        pdf.setFontSize(12);
        pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 45);
        
        // Convert Korean profile to English format for PDF
        pdf.setFontSize(10);
        const profileText = personaProfileText.innerText || personaProfileText.textContent;
        
        // Create English translation of sections
        const englishContent = translateProfileToEnglish(profileText);
        
        // Split text into lines with proper line breaks
        const maxLineLength = 80;
        const lines = englishContent.split('\n').reduce((acc, line) => {
            if (line.length <= maxLineLength) {
                acc.push(line);
            } else {
                const words = line.split(' ');
                let currentLine = '';
                words.forEach(word => {
                    if ((currentLine + word + ' ').length > maxLineLength) {
                        if (currentLine) {
                            acc.push(currentLine.trim());
                        }
                        currentLine = word + ' ';
                    } else {
                        currentLine += word + ' ';
                    }
                });
                if (currentLine) {
                    acc.push(currentLine.trim());
                }
            }
            return acc;
        }, []);
        
        // Add text to PDF
        let yPosition = 60;
        const lineHeight = 5;
        const pageHeight = pdf.internal.pageSize.height;
        
        lines.forEach(line => {
            if (yPosition > pageHeight - 30) {
                pdf.addPage();
                yPosition = 30;
            }
            pdf.text(line, 20, yPosition);
            yPosition += lineHeight;
        });
        
        // Add image if available
        if (personaImage.src && personaImage.style.display !== 'none') {
            try {
                const canvas = await html2canvas(personaImage);
                const imgData = canvas.toDataURL('image/jpeg', 0.8);
                const imgWidth = 80;
                const imgHeight = (canvas.height * imgWidth) / canvas.width;
                
                // Calculate position to add image on next page or current page
                const pageHeight = pdf.internal.pageSize.height;
                const currentY = 60 + (lines.length * 4);
                
                if (currentY + imgHeight > pageHeight - 20) {
                    pdf.addPage();
                    pdf.addImage(imgData, 'JPEG', 20, 20, imgWidth, imgHeight);
                } else {
                    pdf.addImage(imgData, 'JPEG', 20, currentY + 10, imgWidth, imgHeight);
                }
            } catch (imgError) {
                console.warn('Failed to add image to PDF:', imgError);
            }
        }
        
        // Save PDF
        const fileName = `AI_Persona_${new Date().toISOString().slice(0, 10)}.pdf`;
        pdf.save(fileName);
        
        showSuccess('PDF가 다운로드되었습니다!');
        
    } catch (error) {
        console.error('PDF generation error:', error);
        showError('PDF 생성 중 오류가 발생했습니다.');
    }
}

// Show Regenerate Settings Panel
function showRegenerateSettings() {
    regenerateSettings.classList.remove('hidden');
    
    // Set current values
    regenFalModelSelect.value = currentPersonaData?.fal_model || 'flux-pro';
    regenLoraModelSelect.value = currentPersonaData?.lora_model || 'none';
    regenSeedInput.value = currentPersonaData?.seed || '';
    regenNsfwInput.checked = allowNsfwImageInput.checked;
}

// Hide Regenerate Settings Panel
function hideRegenerateSettings() {
    regenerateSettings.classList.add('hidden');
}

// Regenerate Image with Settings
async function handleRegenerateImage() {
    const imagePrompt = imagePromptTextarea.value.trim();
    if (!imagePrompt) {
        showError('이미지 프롬프트를 입력해주세요.');
        return;
    }
    
    try {
        confirmRegenerateBtn.disabled = true;
        confirmRegenerateBtn.textContent = '생성 중...';
        
        // Enhanced prompt for photorealism
        const enhancedPrompt = enhancePromptForRealism(imagePrompt);
        
        const response = await fetch(`${API_BASE_URL}/regenerate_image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                image_prompt: enhancedPrompt,
                allow_nsfw_image: regenNsfwInput.checked,
                fal_model: regenFalModelSelect.value,
                lora_model: regenLoraModelSelect.value,
                seed: regenSeedInput.value ? parseInt(regenSeedInput.value) : null,
                keep_seed: false
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            // Update current persona data with new settings
            const newImageData = {
                fal_model: regenFalModelSelect.value,
                lora_model: regenLoraModelSelect.value,
                seed: data.data.seed,
                prompt: enhancedPrompt
            };
            
            // Update current persona data
            currentPersonaData = { ...currentPersonaData, ...newImageData };
            currentImagePrompt = enhancedPrompt;
            
            // Add regenerated image to gallery
            displayPersonaImage(data.data.imageUrl, true);
            
            hideRegenerateSettings();
            showSuccess('이미지가 재생성되었습니다!');
        } else {
            showError(data.error || '이미지 재생성에 실패했습니다.');
        }
        
    } catch (error) {
        console.error('Image regeneration error:', error);
        showError('이미지 재생성 중 오류가 발생했습니다.');
    } finally {
        confirmRegenerateBtn.disabled = false;
        confirmRegenerateBtn.textContent = '확인';
    }
}

// Enhance prompt for photorealism
function enhancePromptForRealism(originalPrompt) {
    const realismKeywords = [
        'hyperrealistic',
        'photorealistic', 
        'ultra realistic',
        '8k uhd',
        'professional photography',
        'DSLR camera',
        'cinematic lighting',
        'sharp focus',
        'detailed skin texture',
        'natural lighting',
        'high resolution',
        'lifelike',
        'studio quality',
        'perfect anatomy',
        'realistic proportions'
    ];
    
    const qualityBoosts = [
        'masterpiece',
        'best quality',
        'highly detailed',
        'award winning photography',
        'professional portrait'
    ];
    
    const enhancedPrompt = `${originalPrompt}, ${realismKeywords.join(', ')}, ${qualityBoosts.join(', ')}`;
    
    return enhancedPrompt;
}

// Sidebar Management
function openSidebar() {
    savedProfilesSidebar.classList.add('open');
    savedProfilesSidebar.classList.remove('hidden');
}

function closeSidebar() {
    savedProfilesSidebar.classList.remove('open');
}

// Load Saved Profiles
function loadSavedProfiles() {
    const savedProfiles = getSavedProfiles();
    savedProfilesList.innerHTML = '';
    
    if (savedProfiles.length === 0) {
        savedProfilesList.innerHTML = '<p style="color: rgba(255,255,255,0.5); text-align: center; padding: 2rem;">저장된 프로필이 없습니다.</p>';
        return;
    }
    
    savedProfiles.reverse().forEach(profile => {
        const profileElement = createProfileElement(profile);
        savedProfilesList.appendChild(profileElement);
    });
}

// Create Profile Element
function createProfileElement(profile) {
    const div = document.createElement('div');
    div.className = 'saved-profile-item';
    
    const date = new Date(profile.date).toLocaleDateString('ko-KR');
    
    div.innerHTML = `
        <h4>${profile.name}</h4>
        <p>${profile.profile.substring(0, 100)}...</p>
        <div class="profile-date">${date}</div>
        <div class="profile-actions-small">
            <button class="action-btn save-btn" onclick="loadProfile('${profile.id}')">불러오기</button>
            <button class="action-btn download-btn" onclick="deleteProfile('${profile.id}')">삭제</button>
        </div>
    `;
    
    return div;
}

// Profile Actions
function loadProfile(profileId) {
    const savedProfiles = getSavedProfiles();
    const profile = savedProfiles.find(p => p.id === profileId);
    
    if (profile) {
        currentPersonaData = {
            profile: profile.profile,
            imageUrl: profile.imageUrl,
            imagePrompt: profile.imagePrompt,
            fal_model: profile.settings?.fal_model || 'flux-pro',
            lora_model: profile.settings?.lora_model || 'none',
            seed: profile.settings?.seed || null
        };
        
        currentImagePrompt = profile.imagePrompt;
        
        // Restore image gallery if available
        if (profile.imageGallery && profile.imageGallery.length > 0) {
            imageGallery = profile.imageGallery;
            restoreImageGallery();
        } else {
            // Fallback for old saves without gallery
            displayPersonaImage(profile.imageUrl, false);
        }
        
        // Display profile text
        displayPersonaProfile(profile.profile);
        
        // Update image prompt
        imagePromptTextarea.value = profile.imagePrompt;
        
        // Update image info
        updateImageInfo(currentPersonaData);
        
        // Show results section
        outputResults.classList.remove('hidden');
        scrollToResults();
        
        closeSidebar();
        showSuccess('프로필이 불러와졌습니다!');
    }
}

// Restore image gallery from saved data
function restoreImageGallery() {
    // Clear existing gallery
    imageGalleryEl.innerHTML = '';
    currentImageIndex = 0;
    
    // Rebuild gallery
    imageGallery.forEach((imageData, index) => {
        const containerEl = document.createElement('div');
        containerEl.className = 'persona-image-container';
        if (index === 0) containerEl.classList.add('active');
        
        containerEl.innerHTML = `
            <img src=\"${imageData.url}\" alt=\"생성된 페르소나 이미지\">
            <div class=\"image-label\">${imageData.label}</div>
        `;
        
        // Add click handler
        containerEl.addEventListener('click', () => {
            selectImage(index);
        });
        
        imageGalleryEl.appendChild(containerEl);
    });
    
    // Select first image
    if (imageGallery.length > 0) {
        selectImage(0);
    }
    
    updateImageNavigation();
}

function deleteProfile(profileId) {
    if (confirm('이 프로필을 삭제하시겠습니까?')) {
        const savedProfiles = getSavedProfiles();
        const filteredProfiles = savedProfiles.filter(p => p.id !== profileId);
        localStorage.setItem('aiPersonaProfiles', JSON.stringify(filteredProfiles));
        loadSavedProfiles();
        showSuccess('프로필이 삭제되었습니다.');
    }
}

// Utility Functions
function getSavedProfiles() {
    try {
        return JSON.parse(localStorage.getItem('aiPersonaProfiles') || '[]');
    } catch (error) {
        console.error('Error loading saved profiles:', error);
        return [];
    }
}

function showSuccess(message) {
    // Simple success notification - you can enhance this
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #6bcf7f, #4ecdc4);
        color: #000;
        padding: 1rem 2rem;
        border-radius: 12px;
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 8px 25px rgba(107, 207, 127, 0.3);
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Translate Korean profile to English format for PDF
function translateProfileToEnglish(koreanText) {
    // Basic translation mapping for common Korean terms
    const translations = {
        '이름': 'Name',
        '나이': 'Age',
        '국적': 'Nationality',
        '직업': 'Profession',
        '특징': 'Features',
        '성격': 'Personality',
        '배경': 'Background',
        '스타일': 'Style',
        '관심사': 'Interests',
        '목표': 'Goals',
        '콘텐츠': 'Content',
        '활동': 'Activities',
        '한국': 'Korea',
        '서울': 'Seoul',
        '인플루언서': 'Influencer',
        '모델': 'Model',
        '배우': 'Actor',
        '가수': 'Singer',
        '디자이너': 'Designer'
    };
    
    let englishText = koreanText;
    
    // Replace Korean terms with English equivalents
    Object.keys(translations).forEach(korean => {
        const regex = new RegExp(korean, 'g');
        englishText = englishText.replace(regex, translations[korean]);
    });
    
    // Clean up any remaining Korean characters by replacing with romanized equivalents
    englishText = englishText.replace(/[가-힣]/g, '*'); // Replace Korean characters with asterisks
    
    return englishText;
}

// Make functions globally available
window.loadProfile = loadProfile;
window.deleteProfile = deleteProfile;

// Keyboard shortcuts (optional enhancement)
document.addEventListener('keydown', function(event) {
    // Ctrl + Enter or Cmd + Enter to generate
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (!generateBtn.disabled) {
            handleGenerateClick();
        }
    }
    
    // Ctrl + S to save profile
    if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        if (currentPersonaData) {
            handleSaveProfile();
        }
    }
});

// Load Available Models
async function loadAvailableModels() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/models`);
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                populateModelSelect(result.data);
                console.log('Models loaded successfully:', Object.keys(result.data).length, 'models');
                return;
            }
        }
        throw new Error('Failed to load models from API');
    } catch (error) {
        console.error('Error loading models:', error);
        // Keep default options in HTML if API fails
        console.log('Using default model options');
    }
}

// Load Available LoRAs
async function loadAvailableLoras() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/loras`);
        if (response.ok) {
            const result = await response.json();
            if (result.success) {
                populateLoraSelect(result.data);
                console.log('LoRAs loaded successfully:', result.data.length, 'options');
                return;
            }
        }
        throw new Error('Failed to load LoRAs from API');
    } catch (error) {
        console.error('Error loading LoRAs:', error);
        // Keep default "None" option if API fails
        console.log('Using default LoRA options');
    }
}

// Populate Model Select
function populateModelSelect(models) {
    falModelSelect.innerHTML = '';
    
    Object.entries(models).forEach(([key, model]) => {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = `${model.name} - ${model.description}`;
        falModelSelect.appendChild(option);
    });
}

// Populate LoRA Select
function populateLoraSelect(loras) {
    loraModelSelect.innerHTML = '';
    
    loras.forEach(lora => {
        const option = document.createElement('option');
        option.value = lora.id;
        option.textContent = `${lora.name} - ${lora.description}`;
        loraModelSelect.appendChild(option);
    });
}

// ==========================================
// THEME AND ACCESSIBILITY SYSTEM
// ==========================================

// Initialize Theme System
function initializeThemeSystem() {
    // Load saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'auto';
    const savedAccessibility = JSON.parse(localStorage.getItem('accessibility') || '[]');
    
    currentTheme = savedTheme;
    accessibilityOptions = savedAccessibility;
    
    // Apply theme and accessibility options
    applyTheme(currentTheme);
    applyAccessibilityOptions(accessibilityOptions);
    
    // Update UI states
    updateThemeIcon();
    updateAccessibilityButtons();
}

// Apply Theme
function applyTheme(theme) {
    const body = document.body;
    
    // Remove existing theme attributes
    body.removeAttribute('data-theme');
    
    if (theme !== 'auto') {
        body.setAttribute('data-theme', theme);
    }
    
    // Update theme icon
    updateThemeIcon();
    
    // Save preference
    localStorage.setItem('theme', theme);
}

// Update Theme Icon
function updateThemeIcon() {
    if (currentTheme === 'light' || 
        (currentTheme === 'auto' && window.matchMedia('(prefers-color-scheme: light)').matches)) {
        themeIcon.textContent = '☀️';
    } else {
        themeIcon.textContent = '🌙';
    }
}

// Apply Accessibility Options
function applyAccessibilityOptions(options) {
    const body = document.body;
    
    // Clear existing accessibility attributes
    body.removeAttribute('data-accessibility');
    
    if (options.length > 0) {
        body.setAttribute('data-accessibility', options.join(' '));
    }
    
    // Save preferences
    localStorage.setItem('accessibility', JSON.stringify(options));
}

// Update Accessibility Button States
function updateAccessibilityButtons() {
    accessibilityBtns.forEach(btn => {
        const action = btn.getAttribute('data-action');
        if (accessibilityOptions.includes(action)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Toggle Theme
function toggleTheme() {
    const themes = ['auto', 'dark', 'light'];
    const currentIndex = themes.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themes.length;
    
    currentTheme = themes[nextIndex];
    applyTheme(currentTheme);
    
    // Add visual feedback
    themeToggleBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        themeToggleBtn.style.transform = '';
    }, 150);
}

// Toggle Accessibility Option
function toggleAccessibilityOption(option) {
    const index = accessibilityOptions.indexOf(option);
    
    if (index === -1) {
        accessibilityOptions.push(option);
    } else {
        accessibilityOptions.splice(index, 1);
    }
    
    applyAccessibilityOptions(accessibilityOptions);
    updateAccessibilityButtons();
}

// Toggle Accessibility Menu
function toggleAccessibilityMenu() {
    accessibilityMenu.classList.toggle('hidden');
    
    // Add visual feedback
    accessibilityToggleBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        accessibilityToggleBtn.style.transform = '';
    }, 150);
}

// Close accessibility menu when clicking outside
function handleClickOutside(event) {
    if (!accessibilityMenu.contains(event.target) && 
        !accessibilityToggleBtn.contains(event.target) &&
        !accessibilityMenu.classList.contains('hidden')) {
        accessibilityMenu.classList.add('hidden');
    }
}

// Event Listeners for Theme and Accessibility
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
}

if (accessibilityToggleBtn) {
    accessibilityToggleBtn.addEventListener('click', toggleAccessibilityMenu);
}

if (accessibilityBtns) {
    accessibilityBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.getAttribute('data-action');
            toggleAccessibilityOption(action);
        });
    });
}

// Listen for system theme changes
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (currentTheme === 'auto') {
            updateThemeIcon();
        }
    });
}

// Close accessibility menu on outside click
document.addEventListener('click', handleClickOutside);

// Initialize theme system when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeThemeSystem);

// ==========================================
// LANGFLOW STYLE COMPONENTS
// ==========================================

// Toggle Advanced Settings with Smooth Animation
function toggleAdvancedSettings() {
    const isCollapsed = advancedSettings.classList.contains('collapsed');
    
    if (isCollapsed) {
        advancedSettings.classList.remove('collapsed');
        advancedSettings.classList.add('expanded');
        advancedArrow.textContent = '▲';
        advancedArrow.style.transform = 'rotate(180deg)';
    } else {
        advancedSettings.classList.remove('expanded');
        advancedSettings.classList.add('collapsed');
        advancedArrow.textContent = '▼';
        advancedArrow.style.transform = 'rotate(0deg)';
    }
    
    // Add visual feedback to button
    toggleAdvancedBtn.style.transform = 'scale(0.98)';
    setTimeout(() => {
        toggleAdvancedBtn.style.transform = '';
    }, 150);
}

// Open Saved Profiles Sidebar
function openSavedProfilesSidebar() {
    savedProfilesSidebar.classList.remove('hidden');
    
    // Add overlay for mobile
    if (window.innerWidth <= 768) {
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            backdrop-filter: blur(4px);
        `;
        document.body.appendChild(overlay);
        
        // Close sidebar when overlay is clicked
        overlay.addEventListener('click', closeSavedProfilesSidebar);
    }
    
    // Visual feedback
    if (openSidebarBtn) {
        openSidebarBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            openSidebarBtn.style.transform = '';
        }, 150);
    }
}

// Close Saved Profiles Sidebar
function closeSavedProfilesSidebar() {
    savedProfilesSidebar.classList.add('hidden');
    
    // Remove overlay
    const overlay = document.querySelector('.sidebar-overlay');
    if (overlay) {
        overlay.remove();
    }
    
    // Visual feedback
    if (closeSidebarBtn) {
        closeSidebarBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            closeSidebarBtn.style.transform = '';
        }, 150);
    }
}

// Add Neon Effect to Elements on Interaction
function addNeonEffect(element) {
    element.style.animation = 'neon-pulse 0.6s ease-out';
    
    setTimeout(() => {
        element.style.animation = '';
    }, 600);
}

// Enhanced Form Interactions with Neon Effects
function enhanceFormInteractions() {
    const neonElements = document.querySelectorAll('.neon-focus');
    
    neonElements.forEach(element => {
        element.addEventListener('focus', () => {
            addNeonEffect(element);
        });
        
        element.addEventListener('blur', () => {
            element.style.boxShadow = '';
        });
    });
}

// Initialize Collapsible Sections
function initializeCollapsibleSections() {
    // Set initial state for advanced settings
    if (advancedSettings) {
        advancedSettings.style.maxHeight = '0px';
        advancedSettings.style.overflow = 'hidden';
    }
    
    // Add transition styles
    const style = document.createElement('style');
    style.textContent = `
        .collapsible-section {
            transition: max-height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                       opacity 0.3s ease;
        }
        .collapsible-section.collapsed {
            max-height: 0 !important;
            opacity: 0;
        }
        .collapsible-section.expanded {
            max-height: 1000px !important;
            opacity: 1;
        }
        .sidebar-btn {
            background: linear-gradient(135deg, #8B5CF6, #A855F7);
            color: white;
        }
        .sidebar-btn:hover {
            background: linear-gradient(135deg, #9333EA, #C084FC);
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
}

// Event Listeners for Langflow Components
if (toggleAdvancedBtn) {
    toggleAdvancedBtn.addEventListener('click', toggleAdvancedSettings);
}

if (openSidebarBtn) {
    openSidebarBtn.addEventListener('click', openSavedProfilesSidebar);
}

if (closeSidebarBtn) {
    closeSidebarBtn.addEventListener('click', closeSavedProfilesSidebar);
}

// Enhanced Button Click Effects
function addButtonClickEffect(button) {
    button.addEventListener('click', () => {
        addNeonEffect(button);
    });
}

// Initialize Enhanced Components
function initializeEnhancedComponents() {
    enhanceFormInteractions();
    initializeCollapsibleSections();
    
    // Add click effects to all neon-border elements
    const neonBorderElements = document.querySelectorAll('.neon-border');
    neonBorderElements.forEach(addButtonClickEffect);
    
    // Mobile responsive adjustments
    if (window.innerWidth <= 768) {
        // Add mobile-specific styles
        const mobileStyle = document.createElement('style');
        mobileStyle.textContent = `
            @media (max-width: 768px) {
                .profile-actions {
                    flex-direction: column;
                    gap: 0.5rem;
                }
                .action-btn {
                    width: 100%;
                    justify-content: center;
                }
            }
        `;
        document.head.appendChild(mobileStyle);
    }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initializeEnhancedComponents);

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        // Remove mobile overlay if window is resized to desktop
        const overlay = document.querySelector('.sidebar-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
});