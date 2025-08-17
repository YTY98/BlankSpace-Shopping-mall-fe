import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PhotoIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './aiAssistant.css';

// --- API 설정 ---
const API_BASE_URL = '/api/llm';
const CHAT_API_URL = `${API_BASE_URL}/text-chat`;
const CLEAR_HISTORY_API_URL = `${API_BASE_URL}/clear-history`;
// STT/TTS API 제거
const IMAGE_CHAT_API_URL = `${API_BASE_URL}/image-chat`;

const AiAssistant = () => {
  // --- 상태 및 Ref 선언 ---
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  // STT/TTS 상태 제거
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState(null);
  const [currentPageInfo, setCurrentPageInfo] = useState(null);
  // TTS 상태 제거
  const [textInput, setTextInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const sessionIdRef = useRef(`session_${Date.now()}`);
  const conversationContainerRef = useRef(null);
  // 음성 관련 ref 제거
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);
  const fileInputRef = useRef(null);

  // 크기 조절을 위한 상태 추가
  const [panelSize, setPanelSize] = useState({ width: 420, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // --- useEffect Hooks ---

  // TTS 서비스 제거됨

  // Ollama 웜업 상태 방지 (3분마다 keep-alive 요청)
  useEffect(() => {
    const keepAlive = async () => {
      try {
        await fetch(CHAT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: 'keep-alive',
            message: 'ping',
            pageInfo: { type: 'keep-alive' },
          }),
        });
        console.log('Ollama keep-alive ping sent');
      } catch (err) {
        console.error('Keep-alive 실행:', err);
      }
    };

    // 초기 실행
    keepAlive();

    // 3분마다 실행 (5분에서 3분으로 변경)
    const interval = setInterval(keepAlive, 3 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // 대화창 스크롤을 항상 아래로 이동
  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  // 현재 페이지 URL을 분석하여 컨텍스트 정보 생성
  useEffect(() => {
    const path = location.pathname;
    const params = new URLSearchParams(location.search);
    let pageInfo = { type: 'unknown', path };

    if (path.match(/\/product\/([^/]+)$/)) {
      pageInfo = { type: 'product', path, productId: path.split('/').pop() };
    } else if (path === '/shop') {
      pageInfo = { type: 'shop', path, category: params.get('category'), query: params.get('name') };
    } else if (path === '/cart') {
      pageInfo = { type: 'cart', path };
    } else if (path === '/') {
      pageInfo = { type: 'home', path };
    } else if (path.match(/\/mypage/)) {
      pageInfo = { type: 'mypage', path };
    }
    
    console.log('페이지 컨텍스트 정보:', pageInfo);
    setCurrentPageInfo(pageInfo);
  }, [location]);

  // --- 핵심 로직 함수 ---

  // 이미지 선택 처리
  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file);
      
      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else if (file) {
      setError('이미지 파일만 업로드 가능합니다.');
    }
  };

  // 이미지 제거
  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 크기 조절 시작
  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      width: panelSize.width,
      height: panelSize.height
    };
  };

  // 크기 조절 중
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const deltaX = resizeStartRef.current.x - e.clientX;
      const deltaY = resizeStartRef.current.y - e.clientY;
      
      const newWidth = Math.max(350, Math.min(window.innerWidth * 0.9, resizeStartRef.current.width + deltaX));
      const newHeight = Math.max(400, Math.min(window.innerHeight * 0.8, resizeStartRef.current.height + deltaY));
      
      setPanelSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // 드래그 중 텍스트 선택 방지
      document.body.style.userSelect = 'none';
      document.body.classList.add('resizing');
      // 패널에도 resizing 클래스 추가
      if (panelRef.current) {
        panelRef.current.classList.add('resizing');
      }
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.classList.remove('resizing');
      // 패널에서도 resizing 클래스 제거
      if (panelRef.current) {
        panelRef.current.classList.remove('resizing');
      }
    };
  }, [isResizing]);

  // TTS 관련 함수 제거

  // playTTS 함수 제거

  // 텍스트 메시지를 백엔드로 전송하고 응답을 처리하는 핵심 함수
  const sendMessage = async (messageText, imageFile = null) => {
    if (!messageText.trim() && !imageFile) return;

    // TTS 제거됨
    setIsProcessing(true);
    setError(null);
    
    // 대화에 메시지 추가 (이미지 포함)
    const userMessage = { 
      role: 'user', 
      text: messageText,
      image: imageFile ? imagePreview : null
    };
    setConversation(prev => [...prev, userMessage]);

    try {
      let response;
      
      if (imageFile) {
        // 이미지가 있는 경우 FormData 사용
        const formData = new FormData();
        formData.append('sessionId', sessionIdRef.current);
        formData.append('message', messageText);
        formData.append('pageInfo', JSON.stringify(currentPageInfo));
        formData.append('image', imageFile);
        
        response = await fetch(IMAGE_CHAT_API_URL, {
          method: 'POST',
          body: formData,
        });
      } else {
        // 텍스트만 있는 경우 기존 방식 사용
        response = await fetch(CHAT_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: sessionIdRef.current,
            message: messageText,
            pageInfo: currentPageInfo,
          }),
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '서버에서 응답을 받지 못했습니다.' }));
        throw new Error(errorData.detail);
      }

      const data = await response.json();
      
      // 줄바꿈 확인 (디버깅용)
      if (data.message && data.message.includes('여름')) {
        console.log('Raw message:', data.message);
        console.log('Message includes actual newlines:', data.message.includes('\n'));
        console.log('Message includes escaped newlines:', data.message.includes('\\n'));
      }
      
      setConversation(prev => [...prev, { role: 'assistant', text: data.message }]);
      
      if (data.message) {
        // TTS 제거됨
      }
      
      if (data.action) {
        handleAction(data.action);
      }

    } catch (err) {
      console.error('메시지 처리 오류:', err);
      const errorMessage = '죄송합니다. 메시지 처리 중 오류가 발생했습니다.';
      setError(errorMessage);
      setConversation(prev => [...prev, { role: 'assistant', text: errorMessage }]);
    } finally {
      setIsProcessing(false);
      // 메시지 전송 후 이미지 초기화
      removeImage();
    }
  };
  
  // STT 함수 제거

  // 대화내용 초기화
  const clearConversation = async () => {
    // TTS 제거됨
    await fetch(CLEAR_HISTORY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionIdRef.current }),
    });
    setConversation([]);
    setError(null);
  };

  // 액션 처리 (상품 추천 등)
  const handleAction = (action) => {
    if (action.action === 'recommend_products' && action.payload?.products) {
      console.log('상품 추천:', action.payload.products);
      // 여기서 상품 카드 UI를 추가할 수 있습니다
    }
  };

  // 텍스트 입력 폼 제출
  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim() || selectedImage) {
      sendMessage(textInput, selectedImage);
      setTextInput('');
    }
  };

  // 마크다운 렌더링 컴포넌트
  const MarkdownMessage = ({ content }) => {
    // content가 문자열인지 확인
    const textContent = typeof content === 'string' ? content : String(content || '');
    
    return (
      <div className="ai-markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          breaks={true}  // 줄바꿈을 <br>로 변환
          skipHtml={false}  // HTML 태그 허용
          components={{
            // 볼드 텍스트 스타일링
            strong: ({ children }) => (
              <strong className="ai-markdown-bold">{children}</strong>
            ),
            // 이탤릭 텍스트
            em: ({ children }) => (
              <em className="ai-markdown-italic">{children}</em>
            ),
            // 리스트 스타일링
            ul: ({ children }) => (
              <ul className="ai-markdown-list">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="ai-markdown-ordered-list">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="ai-markdown-list-item">{children}</li>
            ),
            // 헤딩 스타일링
            h1: ({ children }) => (
              <h1 className="ai-markdown-h1">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="ai-markdown-h2">{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 className="ai-markdown-h3">{children}</h3>
            ),
            // 코드 블록 스타일링
            code: ({ inline, children }) => (
              inline ? (
                <code className="ai-markdown-code">{children}</code>
              ) : (
                <pre className="ai-markdown-pre">
                  <code className="ai-markdown-code-block">{children}</code>
                </pre>
              )
            ),
            // 링크 스타일링
            a: ({ href, children }) => (
              <a href={href} className="ai-markdown-link" target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
            // 문단 스타일링
            p: ({ children }) => (
              <p className="ai-markdown-paragraph">{children}</p>
            ),
            // 줄바꿈
            br: () => (
              <br className="ai-markdown-break" />
            ),
            // 인용구
            blockquote: ({ children }) => (
              <blockquote className="ai-markdown-blockquote">{children}</blockquote>
            ),
            // 테이블 관련 컴포넌트 추가
            table: ({ children }) => (
              <table className="ai-markdown-table" style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '10px',
                marginBottom: '10px'
              }}>
                {children}
              </table>
            ),
            thead: ({ children }) => (
              <thead className="ai-markdown-thead">{children}</thead>
            ),
            tbody: ({ children }) => (
              <tbody className="ai-markdown-tbody">{children}</tbody>
            ),
            tr: ({ children }) => (
              <tr className="ai-markdown-tr">{children}</tr>
            ),
            th: ({ children }) => (
              <th className="ai-markdown-th" style={{
                padding: '8px 12px',
                borderBottom: '2px solid #ddd',
                backgroundColor: '#f5f5f5',
                textAlign: 'left',
                fontWeight: 'bold'
              }}>
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="ai-markdown-td" style={{
                padding: '8px 12px',
                borderBottom: '1px solid #eee'
              }}>
                {children}
              </td>
            ),
          }}
        >
          {textContent}
        </ReactMarkdown>
        
        {/* 디버깅용 - 원본 텍스트 표시 (숨김) */}
        {/*<details style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          <summary>디버그: 원본 텍스트</summary>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '10px' }}>
            {textContent}
          </pre>
        </details>*/}
      </div>
    );
  };

  return (
    <>
      {/* 플로팅 액션 버튼 */}
      <button
        className="ai-floating-button"
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        aria-label="AI 어시스턴트 열기/닫기"
      >
        💬
        </button>

      {/* AI 어시스턴트 패널 */}
      {isPanelOpen && (
        <div 
          className="ai-assistant-panel" 
          ref={panelRef}
          style={{ width: `${panelSize.width}px`, height: `${panelSize.height}px` }}
        >
          {/* 크기 조절 핸들 - 왼쪽 위 */}
          <div 
            className="ai-resize-handle"
            onMouseDown={handleResizeStart}
          >
            <div className="ai-resize-icon">⋮⋮</div>
          </div>

          {/* 헤더 */}
          <div className="ai-assistant-header">
            <h3>✨ Blanky AI 어시스턴트</h3>
            <div className="ai-header-controls">
              {/* 스피커 아이콘 제거 */}
              <button
                className="ai-close-button"
                onClick={() => setIsPanelOpen(false)}
                aria-label="패널 닫기"
              >
                ✕
              </button>
            </div>
          </div>

          {/* 대화창 */}
          <div className="ai-conversation-container" ref={conversationContainerRef}>
            {conversation.length === 0 ? (
              <div className="ai-empty-state">
                <div className="ai-empty-icon">🛍️</div>
                <h4>안녕하세요! Blanky입니다</h4>
                <p>패션 관련 질문을 해보세요!</p>
                <div className="ai-suggestions">
                  <button onClick={() => sendMessage("장마철 옷 추천해줘")}>
                    🌧️ 장마철 옷 추천
                  </button>
                  <button onClick={() => sendMessage("여름 코디 추천해줘")}>
                    ☀️ 여름 코디 추천
                  </button>
                </div>
              </div>
            ) : (
              conversation.map((msg, index) => (
                <div key={index} className={`ai-message ${msg.role}`}>
                  <div className="ai-message-avatar">
                    {msg.role === 'user' ? '👤' : '🤖'}
                  </div>
                  <div className="ai-message-content">
                    <div className="ai-message-role">
                      {msg.role === 'user' ? '나' : 'Blanky'}
                    </div>
                    <div className="ai-message-bubble">
                      {msg.image && (
                        <div className="ai-message-image">
                          <img src={msg.image} alt="업로드된 이미지" />
                        </div>
                      )}
                      {msg.role === 'assistant' ? (
                        <MarkdownMessage content={msg.text} />
                      ) : (
                        <p>{msg.text || '이미지를 업로드했습니다.'}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isProcessing && (
              <div className="ai-message assistant">
                <div className="ai-message-avatar">🤖</div>
                <div className="ai-message-content">
                  <div className="ai-message-role">Blanky</div>
                  <div className="ai-message-bubble">
                    <div className="ai-typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 오류 메시지 */}
          {error && <div className="ai-error-message">{error}</div>}

          {/* 컨트롤 영역 */}
          <div className="ai-controls">
            {/* 이미지 미리보기 */}
            {imagePreview && (
              <div className="ai-image-preview">
                <img src={imagePreview} alt="미리보기" />
                <button className="ai-remove-image" onClick={removeImage}>✕</button>
              </div>
            )}
            
            {/* 텍스트 입력 */}
            <form className="ai-text-input-form" onSubmit={handleTextSubmit}>
              {/* 숨겨진 파일 입력 */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                style={{ display: 'none' }}
              />
              
              {/* 이미지 업로드 버튼 */}
              <button
                type="button"
                className="ai-image-button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessing}
              >
                <PhotoIcon className="ai-image-icon" />
              </button>
              
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                disabled={isProcessing}
                className="ai-text-input"
              />
              <button type="submit" className="ai-send-button" disabled={(!textInput.trim() && !selectedImage) || isProcessing}>
                📤
              </button>
            </form>

            {/* 버튼 그룹 */}
            <div className="ai-button-group">
              {/* TTS/STT 버튼 제거 */}

              {/* 대화 초기화 버튼 */}
              <button
                className="ai-clear-button"
                onClick={clearConversation}
                disabled={isProcessing}
                aria-label="대화 초기화"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant; 