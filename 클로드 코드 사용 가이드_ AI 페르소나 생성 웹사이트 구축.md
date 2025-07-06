
## 클로드 코드 사용 가이드: AI 페르소나 생성 웹사이트 구축

이 문서는 비개발자 사용자가 Anthropic의 Claude Code를 활용하여 AI 페르소나 생성 웹사이트를 성공적으로 구축하고 실행할 수 있도록 단계별 지침을 제공합니다. 이 가이드에 따라 클로드 코드에 파일을 업로드하고 프롬프트를 입력하면 웹사이트가 자동으로 생성될 것입니다.

### 1. 준비물

웹사이트 구축을 시작하기 전에 다음 준비물이 필요합니다:

1.  **클로드 코드 (Claude Code) 환경:** Anthropic에서 제공하는 클로드 코드 환경에 접근할 수 있어야 합니다. (설치 및 설정은 Anthropic 공식 문서를 참고하세요.)
2.  **OpenAI API 키:** OpenAI 계정에서 발급받은 API 키가 필요합니다. (텍스트 생성 비용 발생)
3.  **Fal.ai API 키:** Fal.ai 계정에서 발급받은 API 키가 필요합니다. (이미지 생성 비용 발생)

### 2. 파일 업로드

클로드 코드 환경에 다음 파일들을 업로드해야 합니다. 이 파일들은 웹사이트 구축에 필요한 설계도 역할을 합니다.

*   `Apex-v10-Odyssey.txt` (시스템 프롬프트 원본)
*   `BellaLeePersona.txt` (페르소나 예시 텍스트)
*   `technical_stack_research.md` (기술 스택 조사 결과)
*   `website_design_analysis.md` (웹사이트 디자인 분석)
*   `system_prompt_optimization.md` (개선된 시스템 프롬프트)
*   `claude_code_prompt.md` (클로드 코드용 상세 프롬프트)
*   `prd_and_dev_guide.md` (PRD 및 개발 가이드)

**참고:** `BellaLeePersona.pdf` 파일은 `BellaLeePersona.txt`로 변환되었으므로, `BellaLeePersona.txt` 파일만 업로드하면 됩니다. 이미지 파일 `0_Bk0rg7raccWKCFTN.jpg`는 디자인 참고용이므로 직접 업로드할 필요는 없지만, 클로드 코드에게 디자인을 설명할 때 이 이미지를 참고했다고 언급할 수 있습니다.

### 3. 클로드 코드에 입력할 프롬프트 (단계별)

클로드 코드에 다음 프롬프트들을 순서대로 입력하여 웹사이트를 구축합니다. 각 단계가 완료될 때마다 클로드 코드의 응답을 확인하고 다음 단계로 진행하세요.

#### 3.1. 프로젝트 초기 설정 및 파일 구조 생성

이 프롬프트는 웹사이트의 기본 파일 구조를 생성합니다.

**클로드 코드에 입력할 프롬프트:**

```
AI 페르소나 생성 웹사이트 프로젝트를 위한 기본 파일 구조를 설정해줘. 다음 파일들을 포함해야 해:
- `index.html`
- `style.css`
- `script.js`
- `server.py` (Flask 기반 백엔드)

각 파일의 초기 내용은 비워두거나 최소한의 기본 구조만 포함하도록 해. `server.py`는 Flask 앱의 기본 설정과 `/generate_persona` 엔드포인트의 스켈레톤만 포함해줘.
```

#### 3.2. `index.html` 파일 작성

이 프롬프트는 웹사이트의 메인 페이지 (`index.html`)의 구조와 내용을 정의합니다.

**클로드 코드에 입력할 프롬프트:**

```
`index.html` 파일을 다음 요구사항에 맞춰 작성해줘:

1.  **기본 HTML 구조:** `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>` 태그를 포함한 표준 HTML5 구조.
2.  **메타 태그:** `charset`, `viewport` 설정 (반응형 디자인을 위해 `width=device-width, initial-scale=1.0`).
3.  **CSS 및 JavaScript 연결:** `<head>` 태그 내에 `style.css` 파일을 연결하고, `<body>` 닫는 태그 바로 위에 `script.js` 파일을 연결해줘.
4.  **헤더 (`<header>`):**
    *   웹사이트 로고 (텍스트 또는 간단한 SVG 아이콘)와 제목 (`AI Persona Generator`).
    *   다크 테마에 어울리는 스타일.
5.  **메인 콘텐츠 영역 (`<main>`):**
    *   **페르소나 입력 폼 섹션 (`<section id='input-form'>`):**
        *   제목: `AI 페르소나 생성하기`
        *   **입력 필드:**
            *   **페르소나 유형 (`persona_type`):** 드롭다운 메뉴 (`<select>`)로 제공. 옵션: `AI 인플루언서`, `AI 배우`, `AI 가수`, `AI 모델`, `AI 버튜버`, `기타`.
            *   **원하는 스타일 (`desired_style`):** 텍스트 입력 필드 (`<input type='text'>`). 플레이스홀더: `예: 도회적이고 세련된, 한예슬 초창기 느낌`.
            *   **핵심 특성 (`key_traits`):** 텍스트 입력 필드 (`<input type='text'>`). 플레이스홀더: `예: 겉은 도도하지만 속은 따뜻한 INFJ`.
            *   **배경 스토리 요소 (`background_story_elements`):** 텍스트 입력 필드 (`<input type='text'>`). 플레이스홀더: `예: 패션 디자이너 부모를 둔 외동딸, 청소년기 외모 콤플렉스 경험`.
            *   **시각적 선호도 (`visual_preferences`):** 텍스트 입력 필드 (`<input type='text'>`). 플레이스홀더: `예: 172cm 슬림 글래머, 고양이형 눈매, 루비 레드 립스틱`.
            *   **상세도 수준 (`output_detail_level`):** 라디오 버튼 (`<input type='radio'>`)으로 제공. 옵션: `간략`, `표준`, `상세`. 기본값은 `표준`으로 선택.
        *   **생성 버튼:** `페르소나 생성` 텍스트를 가진 버튼 (`<button>`). 클릭 시 `script.js`의 함수를 호출하도록 `id` 부여.
        *   **로딩 인디케이터:** 생성 중임을 나타내는 간단한 스피너 또는 텍스트 (`<div id='loading-indicator'>`). 초기에는 숨김 처리.
    *   **생성 결과 표시 영역 (`<section id='output-results'>`):**
        *   제목: `생성된 AI 페르소나` (초기에는 숨김 처리)
        *   **페르소나 이미지 표시 영역 (`<div id='persona-image-container'>`):** `<img>` 태그를 포함. 초기에는 비워둠.
        *   **페르소나 프로필 텍스트 표시 영역 (`<div id='persona-profile-text'>`):** 생성된 마크다운 텍스트를 렌더링할 영역. 초기에는 비워둠.

6.  **푸터 (`<footer>`):** 간단한 저작권 정보 (예: `© 2025 AI Persona Generator`).

모든 입력 필드와 버튼에는 적절한 `id`를 부여하여 JavaScript에서 쉽게 접근할 수 있도록 해줘. 각 섹션은 디자인 가이드라인을 고려하여 시각적으로 구분되도록 해줘.
```

#### 3.3. `style.css` 파일 작성

이 프롬프트는 웹사이트의 디자인과 레이아웃을 정의합니다. `0_Bk0rg7raccWKCFTN.jpg` 이미지를 참고하여 현대적이고 세련된 UI를 구현합니다.

**클로드 코드에 입력할 프롬프트:**

```
`style.css` 파일을 다음 디자인 가이드라인에 맞춰 작성해줘:

1.  **전역 스타일:**
    *   `body`에 다크 테마 배경 색상, 폰트 패밀리, 기본 텍스트 색상 적용.
    *   `margin: 0; padding: 0; box-sizing: border-box;` 초기화.
2.  **헤더 스타일:**
    *   배경색, 패딩, 텍스트 정렬, 폰트 크기 등.
3.  **메인 콘텐츠 영역 스타일:**
    *   `display: flex; flex-direction: column; align-items: center;`를 사용하여 중앙 정렬 및 세로 배치.
    *   최대 너비 설정 및 좌우 여백 자동 조정.
4.  **섹션 스타일 (`#input-form`, `#output-results`):**
    *   `background-color`에 반투명 효과 적용 (글래스모피즘).
    *   `backdrop-filter: blur(10px);` 적용 (글래스모피즘 효과).
    *   `border-radius` 적용.
    *   `padding`, `margin`, `box-shadow` 적용.
5.  **입력 필드 (`<input>`, `<select>`, `<textarea>`):**
    *   배경색, 텍스트 색상, 테두리, `border-radius` 적용.
    *   `focus` 시 강조 색상 테두리 효과.
6.  **버튼 스타일:**
    *   강조 색상 그라데이션 배경 적용.
    *   `border-radius`, `padding`, `color`, `font-weight` 적용.
    *   `cursor: pointer;` 및 `transition` 효과 추가.
    *   `hover` 시 미묘한 애니메이션 효과 (예: `transform: translateY(-2px);`).
7.  **로딩 인디케이터 스타일:**
    *   간단한 스피너 애니메이션 또는 텍스트 스타일.
8.  **이미지 표시 영역 (`#persona-image-container`):**
    *   이미지가 중앙에 오도록 `display: flex; justify-content: center; align-items: center;` 적용.
    *   `max-width`, `height`, `border-radius`, `box-shadow` 등 이미지 컨테이너 스타일.
9.  **프로필 텍스트 표시 영역 (`#persona-profile-text`):**
    *   텍스트 가독성을 위한 `line-height`, `font-size` 조정.
    *   마크다운 렌더링을 고려한 기본 스타일 (예: `h1`, `h2`, `p`, `ul`, `li` 등).
10. **반응형 디자인:** 미디어 쿼리 (`@media screen and (max-width: 768px)`)를 사용하여 모바일 환경에 최적화된 레이아웃 조정.

디자인 가이드라인을 철저히 준수하여 시각적으로 매력적인 웹사이트를 만들어줘.
```

#### 3.4. `script.js` 파일 작성

이 프롬프트는 웹사이트의 클라이언트 측 로직(사용자 인터랙션, API 호출 등)을 정의합니다.

**클로드 코드에 입력할 프롬프트:**

```
`script.js` 파일을 다음 요구사항에 맞춰 작성해줘:

1.  **DOM 요소 참조:** 필요한 모든 입력 필드, 버튼, 로딩 인디케이터, 결과 표시 영역의 DOM 요소를 `document.getElementById()`를 사용하여 참조.
2.  **이벤트 리스너:** `페르소나 생성` 버튼에 `click` 이벤트 리스너를 추가.
3.  **`generatePersona()` 비동기 함수:**
    *   버튼 클릭 시 호출될 함수.
    *   **입력 값 수집:** 각 입력 필드에서 현재 값을 수집.
    *   **로딩 상태 관리:** `loading-indicator`를 표시하고, 버튼을 비활성화하여 중복 클릭 방지.
    *   **API 호출:** 백엔드 (`/generate_persona` 엔드포인트)로 `fetch` API를 사용하여 `POST` 요청을 보냄. 수집된 입력 값들을 JSON 형식으로 전송.
    *   **응답 처리:**
        *   성공적인 응답 시, 백엔드에서 받은 JSON 데이터(페르소나 프로필 텍스트, 이미지 URL)를 파싱.
        *   페르소나 프로필 텍스트는 마크다운 형식으로 올 것이므로, 이를 HTML로 변환하여 `#persona-profile-text`에 표시. (간단한 마크다운 파서 라이브러리 사용 또는 직접 구현 고려. 예를 들어, `marked.js` 같은 라이브러리 사용을 제안할 수 있음).
        *   이미지 URL을 `#persona-image-container` 내의 `<img>` 태그의 `src` 속성에 할당.
        *   `#output-results` 섹션을 보이도록 설정.
    *   **에러 처리:** API 호출 실패 시 사용자에게 에러 메시지 표시 (예: `alert()` 또는 화면에 메시지 표시).
    *   **로딩 상태 해제:** `loading-indicator`를 숨기고, 버튼을 다시 활성화.

4.  **마크다운 렌더링:** `marked.js`와 같은 라이브러리를 사용하여 마크다운 텍스트를 HTML로 변환하는 로직을 포함해줘. (CDN 링크를 `index.html`에 추가하는 것도 고려).

5.  **초기 상태 설정:** 페이지 로드 시 `output-results` 섹션과 `loading-indicator`는 숨겨진 상태로 시작하도록 해줘.
```

#### 3.5. `server.py` 파일 작성 (백엔드 로직)

이 프롬프트는 Flask 기반의 백엔드 서버 (`server.py`)를 정의합니다. OpenAI 및 Fal.ai API와의 연동을 처리합니다.

**클로드 코드에 입력할 프롬프트:**

```
`server.py` 파일을 Flask 기반으로 다음 요구사항에 맞춰 작성해줘:

1.  **Flask 앱 초기화:** 필요한 라이브러리 (`Flask`, `request`, `jsonify`, `os`, `requests`) 임포트 및 Flask 앱 초기화.
2.  **CORS 설정:** 프론트엔드와 백엔드 간의 통신을 위해 CORS를 허용하도록 설정 (`flask_cors` 라이브러리 사용).
3.  **환경 변수:** OpenAI API 키와 Fal.ai API 키를 환경 변수에서 로드하도록 설정 (`os.environ.get()`).
4.  **`/generate_persona` 엔드포인트 (`POST` 요청):**
    *   클라이언트로부터 JSON 데이터를 받음 (페르소나 유형, 스타일 등).
    *   **OpenAI API 호출:**
        *   클라이언트로부터 받은 입력 값과 `system_prompt_optimization.md`에 정의된 개선된 시스템 프롬프트(JSON 형식)를 조합하여 OpenAI API에 요청을 보냄.
        *   `BellaLeePersona.txt`의 내용을 참고 자료로 함께 제공하여 상세하고 유행에 맞는 프로필 생성을 유도.
        *   OpenAI API 응답에서 페르소나 프로필 텍스트와 이미지 생성 프롬프트(Fal.ai용)를 추출.
    *   **Fal.ai API 호출:**
        *   OpenAI API에서 받은 이미지 생성 프롬프트를 사용하여 Fal.ai API (Flux 1.1 Pro 모델)에 이미지 생성 요청을 보냄.
        *   Fal.ai API 응답에서 생성된 이미지의 URL을 추출.
    *   **응답 반환:** 생성된 페르소나 프로필 텍스트와 이미지 URL을 JSON 형식으로 클라이언트에 반환.
    *   **에러 처리:** API 호출 실패 시 적절한 에러 메시지와 상태 코드를 반환.

5.  **앱 실행:** 개발 서버에서 앱을 실행할 수 있도록 `if __name__ == '__main__':` 블록 추가.

**참고:** `system_prompt_optimization.md`에 있는 개선된 시스템 프롬프트 JSON 내용을 `server.py` 내부에 문자열 형태로 포함하거나, 별도의 파일로 로드하는 방식을 고려해줘. `BellaLeePersona.txt` 내용도 마찬가지야.
```

#### 3.6. API 키 설정 (`.env` 파일 생성)

클로드 코드가 모든 파일을 생성한 후, API 키를 설정해야 합니다. 프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가하세요.

**클로드 코드에 입력할 프롬프트 (또는 직접 파일 생성):**

```
프로젝트 루트 디렉토리에 `.env` 파일을 생성하고 다음 내용을 추가해줘. YOUR_OPENAI_API_KEY와 YOUR_FAL_AI_API_KEY는 실제 API 키로 대체해야 해.

OPENAI_API_KEY=YOUR_OPENAI_API_KEY
FAL_AI_API_KEY=YOUR_FAL_AI_API_KEY
```

#### 3.7. `system_prompt.json` 파일 생성

`system_prompt_optimization.md`에 정의된 개선된 시스템 프롬프트 JSON 내용을 별도의 파일로 저장해야 합니다. 이 파일은 `server.py`에서 읽어 OpenAI API 호출 시 사용됩니다.

**클로드 코드에 입력할 프롬프트 (또는 직접 파일 생성):**

```
`system_prompt.json` 파일을 생성하고, `system_prompt_optimization.md` 문서에 있는 '3. 개선된 시스템 프롬프트 초안' 섹션의 JSON 내용을 그대로 복사해서 넣어줘.
```

### 4. 웹사이트 실행 및 배포

클로드 코드가 모든 파일을 생성하고 `.env` 및 `system_prompt.json` 파일까지 준비되었다면, 웹사이트를 실행할 수 있습니다.

1.  **Python 가상 환경 설정 및 라이브러리 설치:**
    클로드 코드 환경에서 다음 명령어를 실행하여 Python 가상 환경을 설정하고 필요한 라이브러리를 설치합니다.
    ```bash
    python3 -m venv venv
    source venv/bin/activate # Linux/macOS
    # venv\Scripts\activate # Windows (명령 프롬프트)
    # venv\Scripts\Activate.ps1 # Windows (PowerShell)
    
    pip install Flask Flask-CORS requests python-dotenv
    pip install markdown # 마크다운 렌더링을 위해 필요
    ```
2.  **백엔드 서버 실행:**
    ```bash
    python server.py
    ```
    서버가 `http://127.0.0.1:5000` (기본 Flask 포트)에서 실행됩니다.
3.  **프론트엔드 접근:**
    웹 브라우저에서 `index.html` 파일을 직접 열거나, 간단한 정적 파일 서버(예: `python -m http.server` 명령어를 프로젝트 루트 디렉토리에서 실행 후 `http://localhost:8000`으로 접속)를 사용하여 `index.html`에 접근합니다.

**배포:**
웹사이트를 영구적으로 배포하려면 `prd_and_dev_guide.md` 문서의 '5.6. 배포 가이드라인' 섹션을 참고하세요. 비개발자에게는 정적 웹사이트 호스팅(프론트엔드)과 서버리스 배포(백엔드)의 조합이 가장 권장됩니다.

### 5. 문제 해결 팁

*   **API 키 오류:** `.env` 파일에 API 키가 올바르게 설정되었는지, 그리고 `server.py`에서 환경 변수를 제대로 로드하는지 확인하세요.
*   **CORS 오류:** `flask-cors`가 `server.py`에 올바르게 적용되었는지 확인하세요.
*   **마크다운 렌더링 오류:** `script.js`에서 `marked.js` 라이브러리가 올바르게 로드되고 사용되는지 확인하세요.
*   **로딩 문제:** 백엔드 서버가 제대로 실행 중인지, 그리고 프론트엔드에서 백엔드 엔드포인트 URL이 올바른지 확인하세요.

이 가이드라인을 통해 AI 페르소나 생성 웹사이트를 성공적으로 구축하시길 바랍니다. 궁금한 점이 있다면 언제든지 다시 질문해주세요.

---

