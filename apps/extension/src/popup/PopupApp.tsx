import React from 'react';

const PopupApp: React.FC = () => {
  return (
    <div style={{ 
      width: '350px', 
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <h1 style={{ 
        fontSize: '20px', 
        fontWeight: '600', 
        marginBottom: '16px',
        color: '#1f2937'
      }}>
        Contextual Web Notes
      </h1>
      <p style={{ 
        color: '#6b7280', 
        fontSize: '14px',
        marginBottom: '16px'
      }}>
        Welcome! The extension is active. Visit any website to see the content script in action.
      </p>
      <div style={{
        padding: '12px',
        backgroundColor: '#f3f4f6',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#4b5563'
      }}>
        <strong>Status:</strong> Ready
      </div>
    </div>
  );
};

export default PopupApp;

