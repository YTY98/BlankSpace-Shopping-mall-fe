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
  const [textInput, setTextInput] = useState('');

  const sessionIdRef = useRef(`session_${Date.now()}`);
  const conversationContainerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const panelRef = useRef(null);

  // --- useEffect Hooks ---

  // TTS 서비스 상태 확인
  useEffect(() => {
    const checkTTSStatus = async () => {
      try {
        const response = await fetch(TTS_STATUS_API_URL);
        if (response.ok) {
          const data = await response.json();
          setTtsAvailable(data.available && data.korean_supported);
          if (!data.korean_supported && data.available) {
            console.log('TTS는 사용 가능하지만 한국어를 지원하지 않습니다.');
          }
        }
      } catch (err) {
        console.error('TTS 상태 확인 실패:', err);
        setTtsAvailable(false);
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

  // TTS 음성 중지 함수
  const stopTTS = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    setIsSpeaking(false);
  };

  // 텍스트를 음성으로 변환하고 재생
  const playTTS = async (text) => {
    if (!text || isSpeaking || !ttsAvailable) return;
    setIsSpeaking(true);
    setError(null);
    try {
      const response = await fetch(TTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (data.error) {
          console.log('TTS 미지원:', data.message);
          setIsSpeaking(false);
          return;
        }
      }

      if (!response.ok) throw new Error('TTS 음성 생성에 실패했습니다.');

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      stopTTS();

      const newAudio = new Audio(audioUrl);
      audioRef.current = newAudio;
      newAudio.play();

      newAudio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      newAudio.onerror = () => {
        console.log('음성 재생 실패 - 한국어 TTS가 지원되지 않을 수 있습니다.');
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
    } catch (err) {
      console.error('TTS 처리 오류:', err);
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

        try {
          const sttResponse = await fetch(STT_API_URL, { method: 'POST', body: formData });
          if (!sttResponse.ok) throw new Error('음성 인식에 실패했습니다.');
          
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
        <details style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
          <summary>디버그: 원본 텍스트</summary>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f0f0f0', padding: '10px' }}>
            {textContent}
          </pre>
        </details>
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
        <div className="ai-assistant-panel" ref={panelRef}>
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