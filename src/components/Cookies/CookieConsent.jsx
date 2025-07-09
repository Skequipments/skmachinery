"use client"

import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const consent = Cookies.get('cookie-consent');
    if (!consent) {
      setVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    // Set cookie with 1 year expiry
    Cookies.set('cookie-consent', 'true', { expires: 365 });
    setVisible(false);
  };

  const declineCookies = () => {
    // Set cookie with only essential consent
    Cookies.set('cookie-consent', 'essential', { expires: 365 });
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black bg-opacity-80 text-white p-4 z-40 rounded">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0 md:mr-8">
          <p className="text-sm">
            We use cookies to enhance your experience. By continuing to visit this site, you agree to our use of cookies.
            <a href="/privacy-policy" className="underline ml-1">Learn more</a>
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={declineCookies}
            className="px-4 py-2 text-sm border border-white rounded hover:bg-white hover:text-black transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-white text-black rounded hover:bg-gray-200 transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
