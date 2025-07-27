import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MicrophoneIcon, StopCircleIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './aiAssistant.css';

// --- API 설정 ---
const API_BASE_URL = '/api/llm';
const CHAT_API_URL = `${API_BASE_URL}/text-chat`;
const CLEAR_HISTORY_API_URL = `${API_BASE_URL}/clear-history`;
const STT_API_URL = `${API_BASE_URL}/stt`;
const TTS_API_URL = `${API_BASE_URL}/tts`;
const TTS_STATUS_API_URL = `${API_BASE_URL}/tts-status`;
const TTS_TOGGLE_API_URL = `${API_BASE_URL}/tts-toggle`;

const AiAssistant = () => {
  // --- 상태 및 Ref 선언 ---
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState(null);
  const [currentPageInfo, setCurrentPageInfo] = useState(null);
  const [ttsAvailable, setTtsAvailable] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [textInput, setTextInput] = useState('');
  
  const sessionIdRef = useRef(`session_${Date.now()}`);
  const conversationContainerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);

  // 크기 조절을 위한 상태 추가
  const [panelSize, setPanelSize] = useState({ width: 420, height: 600 });
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartRef = useRef({ x: 0, y: 0, width: 0, height: 0 });

  // --- useEffect Hooks ---

  // TTS 서비스 상태 확인
  useEffect(() => {
    const checkTTSStatus = async () => {
      try {
        const response = await fetch(TTS_STATUS_API_URL);
        if (response.ok) {
          const data = await response.json();
          setTtsAvailable(data.available && data.korean_supported);
          setTtsEnabled(data.enabled || false);
          console.log('TTS 상태:', data);
          if (data.available && data.korean_supported) {
            console.log(`한국어 TTS가 지원됩니다! 현재 상태: ${data.enabled ? '활성화' : '비활성화'}`);
          }
        }
      } catch (err) {
        console.error('TTS 상태 확인 실패:', err);
        setTtsAvailable(false);
        setTtsEnabled(false);
      }
    };
    checkTTSStatus();
  }, []);

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

  // TTS 음성 중지 함수
  const stopTTS = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsSpeaking(false);
  };
  
  // TTS 켜기/끄기 토글 함수
  const toggleTTS = async () => {
    try {
      const newState = !ttsEnabled;
      const response = await fetch(TTS_TOGGLE_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: newState }),
      });

      if (response.ok) {
        const data = await response.json();
        setTtsEnabled(data.enabled);
        console.log(`TTS 상태 변경: ${data.enabled ? '활성화' : '비활성화'}`);
        
        // TTS가 비활성화되면 현재 재생 중인 음성 중지
        if (!data.enabled && isSpeaking) {
          stopTTS();
        }
      } else {
        console.error('TTS 토글 실패');
      }
    } catch (err) {
      console.error('TTS 토글 오류:', err);
    }
  };

  // 텍스트를 음성으로 변환하고 재생
  const playTTS = async (text) => {
    console.log('🔊 TTS 호출 - 조건 체크:', {
      text: !!text,
      textLength: text?.length,
      isSpeaking,
      ttsAvailable,
      ttsEnabled
    });
    
    if (!text || isSpeaking || !ttsAvailable || !ttsEnabled) {
      console.log('❌ TTS 건너뜀:', {
        noText: !text,
        alreadySpeaking: isSpeaking,
        notAvailable: !ttsAvailable,
        notEnabled: !ttsEnabled
      });
      return;
    }
    
    setIsSpeaking(true);
    setError(null);
    try {
      console.log(`🔊 TTS 요청 전송: "${text.substring(0, 50)}..."`);
      const response = await fetch(TTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        // JSON 응답인 경우 (오류 또는 비활성화 메시지)
        const data = await response.json();
        console.log('TTS JSON 응답:', data);
        if (data.enabled === false) {
          console.log('TTS가 비활성화되어 있습니다.');
        }
        setIsSpeaking(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`TTS 요청 실패: ${response.status}`);
      }

      const audioBlob = await response.blob();
      console.log(`✅ TTS 응답 받음: ${audioBlob.size} bytes`);
      
      if (audioBlob.size === 0) {
        console.warn('❌ 빈 오디오 데이터');
        setIsSpeaking(false);
        return;
      }

      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.onended = () => {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          console.log('🎵 TTS 재생 완료');
        };
        audioRef.current.onerror = (e) => {
          console.error('TTS 재생 오류:', e);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        };
        
        try {
          await audioRef.current.play();
          console.log('🎵 TTS 재생 시작');
        } catch (playError) {
          console.error('TTS 재생 시작 오류:', playError);
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
        }
      }

    } catch (err) {
      console.error('❌ TTS 처리 오류:', err);
      setError(`음성 변환 실패: ${err.message}`);
      setIsSpeaking(false);
    }
  };

  // 텍스트 메시지를 백엔드로 전송하고 응답을 처리하는 핵심 함수
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    stopTTS();
    setIsProcessing(true);
    setError(null);
    setConversation(prev => [...prev, { role: 'user', text: messageText }]);

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          message: messageText,
          pageInfo: currentPageInfo,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: '서버에서 응답을 받지 못했습니다.' }));
        throw new Error(errorData.detail);
      }

      const data = await response.json();
      
      // 디버깅: 받은 메시지 확인
      console.log('Received message:', data.message);
      console.log('Message type:', typeof data.message);
      console.log('Message length:', data.message ? data.message.length : 0);
      
      // 메시지에 마크다운 문자가 있는지 확인
      if (data.message) {
        const markdownChars = data.message.match(/[*#\-\[\]`>]/g);
        console.log('Markdown characters found:', markdownChars);
        
        // 줄바꿈 문자 확인
        const newlines = data.message.match(/\n/g);
        console.log('Newline characters found:', newlines ? newlines.length : 0);
      }
      
      setConversation(prev => [...prev, { role: 'assistant', text: data.message }]);
      
      if (data.message) {
        await playTTS(data.message);
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
    }
  };
  
  // 음성 녹음 시작
  const startRecording = async () => {
    stopTTS();
    setIsListening(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice.webm');
        
        console.log('STT FormData 생성:', {
          audioSize: audioBlob.size,
          audioType: audioBlob.type,
          formDataEntries: [...formData.entries()]
        });

        try {
        const sttResponse = await fetch(STT_API_URL, { 
          method: 'POST', 
          body: formData 
        });
        
        console.log('STT 응답 상태:', sttResponse.status);
        console.log('STT 응답 헤더:', Object.fromEntries(sttResponse.headers));
        
        if (!sttResponse.ok) {
          const errorText = await sttResponse.text();
          console.error('STT 오류 응답:', errorText);
          throw new Error('음성 인식에 실패했습니다.');
        }
        
          const { transcribedText } = await sttResponse.json();
        if (transcribedText) {
          await sendMessage(transcribedText);
        } else {
           setConversation(prev => [...prev, { role: 'assistant', text: "음성을 인식하지 못했습니다." }]);
          }
        } catch (err) {
          console.error('STT 처리 오류:', err);
          setError('음성 인식에 실패했습니다.');
        }
      };

      mediaRecorderRef.current.start();
    } catch (err) {
      console.error('마이크 접근 오류:', err);
      setError('마이크 접근 권한이 필요합니다.');
      setIsListening(false);
    }
  };

  // 음성 녹음 중지
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
    setIsListening(false);
  };

  // 대화내용 초기화
  const clearConversation = async () => {
    stopTTS();
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
    if (textInput.trim()) {
      sendMessage(textInput);
      setTextInput('');
    }
  };

  // 마크다운 렌더링 컴포넌트
  const MarkdownMessage = ({ content }) => {
    // 디버깅을 위한 로그
    console.log('=== MarkdownMessage Debug ===');
    console.log('Original content:', content);
    
    // content가 문자열인지 확인
    const textContent = typeof content === 'string' ? content : String(content || '');
    
    // 마크다운 특수 문자가 있는지 확인
    const hasMarkdown = /[*#\-\[\]`>]/.test(textContent);
    console.log('Has markdown characters:', hasMarkdown);
    
    // 샘플 텍스트로 일부 추출해서 확인
    console.log('First 200 chars:', textContent.substring(0, 200));
    console.log('Contains **:', textContent.includes('**'));
    console.log('Contains ##:', textContent.includes('##'));
    console.log('Contains 1.:', textContent.includes('1.'));
    console.log('Contains newlines:', textContent.includes('\n'));
    
    // 줄바꿈 문자가 제대로 있는지 확인
    const lines = textContent.split('\n');
    console.log('Number of lines:', lines.length);
    console.log('First 5 lines:', lines.slice(0, 5));

    // 테스트: 간단한 마크다운으로 테스트
    const testMarkdown = "## 테스트\n\n**볼드 텍스트** 일반 텍스트\n\n1. 첫 번째\n2. 두 번째";
    console.log('Test markdown render:');
    
    // 줄바꿈이 없다면 수동으로 추가 (임시 해결책)
    let processedContent = textContent;
    if (!textContent.includes('\n') && textContent.length > 100) {
      // 마크다운 패턴 앞에 줄바꿈 추가
      processedContent = textContent
        .replace(/(\s)?(#{1,3}\s)/g, '\n\n$2')  // 헤딩 앞에 줄바꿈
        .replace(/(\s)?(\d+\.)\s/g, '\n$2 ')     // 숫자 리스트 앞에 줄바꿈
        .replace(/(\s)?(\*\*[^*]+\*\*)/g, ' $2') // 볼드 텍스트 주변 공백 정리
        .replace(/(\s)?•/g, '\n• ')              // 불릿 포인트 앞에 줄바꿈
        .trim();
      
      console.log('Processed content (added newlines):', processedContent.substring(0, 200));
    }
    
    // 디버깅용 - 처음 몇 줄만 테스트
    const debugContent = processedContent.split('\n').slice(0, 10).join('\n');
    console.log('Debug content (first 10 lines):', debugContent);
    
    return (
      <div className="ai-markdown-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          breaks={true}  // 줄바꿈을 <br>로 변환
          skipHtml={false}  // HTML 태그 허용
          components={{
            // 볼드 텍스트 스타일링
            strong: ({ children }) => {
              console.log('Rendering strong:', children);
              return <strong className="ai-markdown-bold">{children}</strong>;
            },
            // 이탤릭 텍스트
            em: ({ children }) => {
              console.log('Rendering em:', children);
              return <em className="ai-markdown-italic">{children}</em>;
            },
            // 리스트 스타일링
            ul: ({ children }) => {
              console.log('Rendering ul:', children);
              return <ul className="ai-markdown-list">{children}</ul>;
            },
            ol: ({ children }) => {
              console.log('Rendering ol:', children);
              return <ol className="ai-markdown-ordered-list">{children}</ol>;
            },
            li: ({ children }) => {
              console.log('Rendering li:', children);
              return <li className="ai-markdown-list-item">{children}</li>;
            },
            // 헤딩 스타일링
            h1: ({ children }) => {
              console.log('Rendering h1:', children);
              return <h1 className="ai-markdown-h1">{children}</h1>;
            },
            h2: ({ children }) => {
              console.log('Rendering h2:', children);
              return <h2 className="ai-markdown-h2">{children}</h2>;
            },
            h3: ({ children }) => {
              console.log('Rendering h3:', children);
              return <h3 className="ai-markdown-h3">{children}</h3>;
            },
            // 코드 블록 스타일링
            code: ({ inline, children }) => {
              console.log('Rendering code:', inline, children);
              return inline ? (
                <code className="ai-markdown-code">{children}</code>
              ) : (
                <pre className="ai-markdown-pre">
                  <code className="ai-markdown-code-block">{children}</code>
                </pre>
              );
            },
            // 링크 스타일링
            a: ({ href, children }) => {
              console.log('Rendering link:', href, children);
              return (
                <a href={href} className="ai-markdown-link" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              );
            },
            // 문단 스타일링
            p: ({ children }) => {
              console.log('Rendering p:', children);
              return <p className="ai-markdown-paragraph">{children}</p>;
            },
            // 줄바꿈
            br: () => {
              console.log('Rendering br');
              return <br className="ai-markdown-break" />;
            },
            // 인용구
            blockquote: ({ children }) => {
              console.log('Rendering blockquote:', children);
              return <blockquote className="ai-markdown-blockquote">{children}</blockquote>;
            },
          }}
        >
          {processedContent}
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
              {isSpeaking && <SpeakerWaveIcon className="ai-speaker-icon" />}
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
                      {msg.role === 'assistant' ? (
                        <MarkdownMessage content={msg.text} />
                      ) : (
                        <p>{msg.text}</p>
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
            {/* 텍스트 입력 */}
            <form className="ai-text-input-form" onSubmit={handleTextSubmit}>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="메시지를 입력하세요..."
                disabled={isProcessing}
                className="ai-text-input"
              />
              <button type="submit" className="ai-send-button" disabled={!textInput.trim() || isProcessing}>
                📤
              </button>
            </form>

            {/* 버튼 그룹 */}
            <div className="ai-button-group">
              {/* TTS 토글 버튼 */}
              {ttsAvailable && (
                <button
                  className={`ai-tts-toggle-button ${ttsEnabled ? 'enabled' : 'disabled'}`}
                  onClick={toggleTTS}
                  disabled={isProcessing}
                  aria-label={`TTS ${ttsEnabled ? '끄기' : '켜기'}`}
                  title={`TTS ${ttsEnabled ? '끄기' : '켜기'}`}
                >
                  {ttsEnabled ? '🔊' : '🔇'}
                </button>
              )}

              {/* TTS 중지 버튼 (재생 중일 때만 표시) */}
              {isSpeaking && (
                <button
                  className="ai-tts-stop-button"
                  onClick={stopTTS}
                  aria-label="음성 중지"
                  title="음성 중지"
                >
                  ⏹️
                </button>
              )}

              {/* 음성 녹음 버튼 */}
              <button
                className={`ai-mic-button ${isListening ? 'listening' : ''}`}
                onClick={isListening ? stopRecording : startRecording}
                disabled={isProcessing}
                aria-label={isListening ? '녹음 중지' : '음성 녹음'}
              >
                {isListening ? (
                  <StopCircleIcon className="ai-mic-icon" />
                ) : (
                  <MicrophoneIcon className="ai-mic-icon" />
                )}
              </button>

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