import React, { useEffect, useState, useRef } from 'react';
import '../Style/LandingPage.css';

const FadeUp = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible) {
            setIsVisible(true);
            observerInstance.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2, // 20% 이상 보이면 슬라이드 효과 재생
      }
    );

    const target = elementRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [isVisible]);

  return (
    <div ref={elementRef} className={`fade-up ${isVisible ? 'visible' : ''}`}>
      {children}
    </div>
  );
};

export default FadeUp;
