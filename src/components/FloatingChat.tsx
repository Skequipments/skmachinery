"use client";

import { useEffect } from 'react';

const FloatingChat = () => {
  useEffect(() => {
    // Inject Tawk.to script
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/687099c3ca9b1d190e69e638/1ivrth9tb';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);

    // Inject custom style to hide the widget
    const style = document.createElement('style');
    style.innerHTML = `
      a#einik2t8cmjk1752215629079 {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

export default FloatingChat;
