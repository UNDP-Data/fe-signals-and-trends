import { useState } from 'react';
import { ChatIcon } from './ChatIcon';

const displayTitle = "Meet Echo!";
const displayMessage = "I'm your AI assistant for navigating Future Trends & Signals. Ask me anything about the platform or how to find what you're looking for.";

export function ChatBubble() {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [notificationDismissed, setNotificationDismissed] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    // Add a small delay for the animation before opening the window
    setTimeout(() => {
      window.open("https://future-signals-concierge.vercel.app/", '_blank');
      // Reset the animation state after opening
      setTimeout(() => setIsClicked(false), 300);
    }, 150);
  };

  const dismissNotification = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation(); // Prevent the main button click from triggering
    setNotificationDismissed(true);
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
          position: 'relative',
        }}
        aria-label="Chat with Echo, AI assistant"
      >
        <ChatIcon />
        {!notificationDismissed && (
          <button 
            type="button"
            style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: 'var(--red-500, #e53e3e)',
              color: 'white',
              borderRadius: '50%',
              width: '22px',
              height: '22px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              border: '2px solid white',
              cursor: 'pointer',
              padding: 0,
            }}
            onClick={dismissNotification}
            title="Dismiss notification"
          >
            {/* Echo */}
          </button>
        )}
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
            width: '280px',
            color: 'var(--gray-700)',
            animation: 'fadeIn 0.3s ease',
          }}
        >
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '8px',
            borderBottom: '1px solid var(--gray-200, #edf2f7)',
            paddingBottom: '8px'
          }}>
            <div style={{ 
              backgroundColor: 'var(--blue-600)', 
              borderRadius: '50%', 
              width: '36px', 
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px'
            }}>
              <ChatIcon />
            </div>
            <h3 style={{ 
              margin: '0', 
              fontSize: '18px', 
              fontWeight: 'bold',
              color: 'var(--gray-800, #2d3748)'
            }}>
              {displayTitle}
            </h3>
          </div>
          
          <p style={{ margin: '0', fontSize: '14px', lineHeight: '1.5' }}>
            {displayMessage}
          </p>
          
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