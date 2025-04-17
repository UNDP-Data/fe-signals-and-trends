import { useState } from 'react';
import { ChatIcon } from './ChatIcon';

export function ChatBubble() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    // Add a small delay for the animation before opening the window
    setTimeout(() => {
      window.open(import.meta.env.VITE_UNDP_CHAT_URL, '_blank');
      // Reset the animation state after opening
      setTimeout(() => setIsClicked(false), 300);
    }, 150);
  };

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
      <button
        type="button"
        className="chat-bubble"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        style={{
          backgroundColor: 'var(--blue-600)',
          color: 'white',
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          transition: 'all 0.3s ease',
          transform: isClicked 
            ? 'scale(0.95)' 
            : isHovered 
              ? 'translateY(-5px)' 
              : 'translateY(0)',
          border: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: isClicked ? 0.8 : 1,
        }}
      >
        <ChatIcon />
      </button>
      {isHovered && !isClicked && (
        <div
          style={{
            position: 'absolute',
            bottom: '70px',
            right: '0',
            backgroundColor: 'white',
            padding: '1rem',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            width: '200px',
            color: 'var(--gray-700)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          Hi, I'm a new chatbot expert.
          <div
            style={{
              position: 'absolute',
              bottom: '-8px',
              right: '24px',
              width: '16px',
              height: '16px',
              backgroundColor: 'white',
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      )}
    </div>
  );
} 