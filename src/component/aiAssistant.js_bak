import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MicrophoneIcon, StopCircleIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';
import './aiAssistant.css'; // CSS 파일명도 통일성을 위해 aiAssistant.css를 사용한다고 가정합니다.

// --- API 설정 ---
// 모든 API 요청은 메인 백엔드(Node.js)의 프록시를 통하도록 상대 경로로 설정합니다.
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
  const [isSpeaking, setIsSpeaking] = useState(false); // 음성 재생 상태 추가
  const [conversation, setConversation] = useState([]);
  const [error, setError] = useState(null);
  const [currentPageInfo, setCurrentPageInfo] = useState(null);
  const [ttsAvailable, setTtsAvailable] = useState(false); // TTS 가용성
  
  const sessionIdRef = useRef(`session_${Date.now()}`);
  const conversationContainerRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef(null);
  const audioRef = useRef(null); // 음성 재생 Audio 객체를 위한 ref
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

  // Ollama 유휴 상태 방지 (5분마다 keep-alive 요청)
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
        console.error('Keep-alive 실패:', err);
      }
    };

    // 초기 실행
    keepAlive();
    
    // 5분마다 실행
    const interval = setInterval(keepAlive, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  // 대화창 스크롤을 항상 아래로 유지
  useEffect(() => {
    if (conversationContainerRef.current) {
      conversationContainerRef.current.scrollTop = conversationContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  // 현재 페이지의 URL을 분석하여 컨텍스트 정보 생성
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
      audioRef.current.src = ''; // 리소스 해제
    }
    setIsSpeaking(false);
  };
  
  // 텍스트를 음성으로 변환하고 재생
  const playTTS = async (text) => {
    if (!text || isSpeaking || !ttsAvailable) return; // TTS 가용성 체크 추가
    setIsSpeaking(true);
    setError(null);
    try {
      const response = await fetch(TTS_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      
      // JSON 응답인지 확인 (한국어 미지원 에러)
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
      
      stopTTS(); // 기존 오디오 중지
      
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

  // 텍스트 메시지를 백엔드로 전송하고 응답을 처리하는 단일 함수
  const sendMessage = async (messageText) => {
    if (!messageText.trim()) return;

    stopTTS(); // 새 메시지 전송 시 기존 음성 중지
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
      setConversation(prev => [...prev, { role: 'assistant', text: data.message }]);
      
      if (data.message) {
        await playTTS(data.message); // AI 응답 음성 재생
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
    stopTTS(); // 녹음 시작 시 음성 중지
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
        
        // STT 서버에 폼 데이터로 전송
        const formData = new FormData();
        formData.append('audio', audioBlob, 'voice.webm');

        const sttResponse = await fetch(STT_API_URL, { method: 'POST', body: formData });
        if (!sttResponse.ok) throw new Error('음성 인식에 실패했습니다.');
        
        const { text: transcribedText } = await sttResponse.json();
        if (transcribedText) {
          await sendMessage(transcribedText);
        } else {
           setConversation(prev => [...prev, { role: 'assistant', text: "음성을 인식하지 못했습니다." }]);
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

  // 대화 내용 초기화
  const clearConversation = async () => {
    stopTTS(); // 대화 초기화 시 음성 중지
    await fetch(CLEAR_HISTORY_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: sessionIdRef.current }),
    });
    setConversation([]);
  };

  // --- UI 헬퍼 및 액션 함수 ---

  // 패널 열기/닫기 토글
  const togglePanel = () => {
    if (isPanelOpen) {
        stopTTS(); // 패널을 닫을 때 음성 중지
    }
    setIsPanelOpen(prev => !prev);
  };

  // AI 응답 텍스트를 HTML로 포매팅
  const formatAIResponse = (text = '') => {
    if (!text) return '';
    
    // 1. HTML/CSS/JavaScript 코드 블록 완전 제거
    let cleanText = text
      // HTML 태그 제거 (더 강력한 정규식)
      .replace(/<[^>]*>/gi, '')
      // CSS 스타일 블록 제거
      .replace(/\{[^}]*\}/g, '')
      // JavaScript 코드 패턴 제거
      .replace(/function\s*\([^)]*\)\s*\{[^}]*\}/gi, '')
      .replace(/const\s+\w+\s*=.*?;/gi, '')
      .replace(/let\s+\w+\s*=.*?;/gi, '')
      .replace(/var\s+\w+\s*=.*?;/gi, '')
      // 마크다운 코드 블록 제거
      .replace(/```[\s\S]*?```/g, '')
      .replace(/`[^`]*`/g, '')
      // 특수 문자 이스케이프
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      // 줄바꿈을 <br>로 변환 (안전한 HTML만)
      .replace(/\n/g, '<br />');
    
    // 2. 중복 공백 정리
    cleanText = cleanText.replace(/\s+/g, ' ').trim();
    
    // 3. 빈 응답 처리 (너무 엄격한 조건 완화)
    if (!cleanText || cleanText.trim().length === 0) {
      return '죄송합니다. 다시 말씀해 주시겠어요?';
    }
    
    return cleanText;
  };

  // 백엔드에서 받은 액션 처리
  const handleAction = (action) => {
    if (action.action === 'navigate' && action.payload?.route) {
      setTimeout(() => navigate(action.payload.route), 1000);
    }
    if (action.action === 'search' && action.payload) {
      const params = new URLSearchParams(action.payload).toString();
      setTimeout(() => navigate(`/shop?${params}`), 1000);
    }
  };
  
  // --- 렌더링 ---
  return (
    <>
      {!isPanelOpen && (
        <button className="floating-button" onClick={togglePanel}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
            <path d="M5 3v4"/>
            <path d="M19 17v4"/>
            <path d="M3 5h4"/>
            <path d="M17 19h4"/>
          </svg>
        </button>
      )}
      {isPanelOpen && (
        <div className="ai-assistant-panel active" ref={panelRef}>
          <div className="ai-assistant-header">
            <h3>Blanky</h3>
            <div className="header-controls">
                {isSpeaking && ttsAvailable && <SpeakerWaveIcon className="speaker-icon" />}
            </div>
            <button onClick={togglePanel} className="close-button">×</button>
          </div>

          <div className="conversation-container" ref={conversationContainerRef}>
            {conversation.length === 0 ? (
              <div className="empty-state">
                <p>안녕하세요! 무엇을 도와드릴까요?</p>
                <p className="hint">궁금한 것을 물어보세요.</p>
              </div>
            ) : (
              conversation.map((msg, index) => (
                <div key={index} className={`message ${msg.role}`}>
                  <span className="role">{msg.role === 'user' ? '나' : 'Blanky'}</span>
                  <p dangerouslySetInnerHTML={{ __html: formatAIResponse(msg.text) }} />
                </div>
              ))
            )}
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="controls">
            <button
              className={`mic-button ${isListening ? 'listening' : ''}`}
              onClick={isListening ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isListening 
                ? <StopCircleIcon className="mic-icon" />
                : <MicrophoneIcon className="mic-icon" />
              }
            </button>
            <form
              className="text-input-form"
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(e.target.elements.textInput.value);
                e.target.elements.textInput.value = '';
              }}
            >
              <input
                type="text"
                name="textInput"
                placeholder="메시지를 입력하세요..."
                disabled={isProcessing}
              />
              <button type="submit" disabled={isProcessing}>전송</button>
            </form>
            {conversation.length > 0 && (
              <button onClick={clearConversation} className="clear-button" title="대화 초기화">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AiAssistant; 