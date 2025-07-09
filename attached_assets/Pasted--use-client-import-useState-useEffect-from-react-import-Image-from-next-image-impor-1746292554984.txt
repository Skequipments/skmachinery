"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ChatImg from '@/images/speak.png';

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    { text: "Welcome to S.K. Equipments! How can I assist you about our testing equipment?", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Inquiry form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Sample bot responses
  const getBotResponse = (userInput) => {
    const inputLower = userInput.toLowerCase();

    if (inputLower.includes('leather')) {
      return "We offer various leather testing equipment including tensile testers, abrasion testers, and flexometers. Would you like specifications for any particular machine?";
    }
    if (inputLower.includes('contact') || inputLower.includes('address')) {
      return "Our office is located in Noida, Uttar Pradesh. For detailed contact information, please visit our contact page or call +91-XXXXXXXXXX.";
    }
    if (inputLower.includes('price') || inputLower.includes('cost')) {
      return "For pricing information, please provide the specific equipment model you're interested in, or you can submit an inquiry form for a customized quote.";
    }
    if (inputLower.includes('catalog') || inputLower.includes('brochure')) {
      return "You can download our full product catalog from the 'Resources' section of our website, or I can have our sales team email it to you.";
    }
    if (inputLower.includes('inquiry') || inputLower.includes('form')) {
      setActiveTab('inquiry');
      return "I've opened the inquiry form for you. Please fill in your details and our team will contact you shortly.";
    }

    return "Thank you for your inquiry. For detailed information about our testing equipment, please specify the product type or you can submit an inquiry form.";
  };

  const handleSend = () => {
    if (input.trim()) {
      setMessages(prev => [...prev, { text: input, sender: 'user' }]);
      setInput('');
      setIsLoading(true);

      setTimeout(() => {
        const response = getBotResponse(input);
        setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
        setIsLoading(false);
      }, 800);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.message) {
        throw new Error('Please fill all required fields');
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Web3Forms submission
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: "09f0bbbe-5923-4d2e-83a1-375f2184ab23",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          interest: formData.interest || 'Not specified',
          message: formData.message,
          redirect: false // Prevent Web3Forms thank you page
        })
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Form submission failed');
      }

      setFormSubmitted(true);
      setMessages(prev => [
        ...prev,
        { text: "I've submitted an inquiry form", sender: 'user' },
        { text: "Thank you for your inquiry! Our sales team will contact you shortly.", sender: 'bot' }
      ]);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          interest: ''
        });
        setFormSubmitted(false);
        setActiveTab('chat');
      }, 3000);

    } catch (error) {
      console.error('Form submission error:', error);

      let userMessage = "There was an error submitting your inquiry. Please try again later.";

      if (error.message.includes('required fields')) {
        userMessage = error.message;
      } else if (error.message.includes('valid email')) {
        userMessage = error.message;
      }

      setMessages(prev => [
        ...prev,
        { text: userMessage, sender: 'bot' }
      ]);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen ? (
        <div className="chat-window">
          <div className="chat-header">
            <div className="tabs">
              <button
                className={activeTab === 'chat' ? 'active' : ''}
                onClick={() => setActiveTab('chat')}
              >
                Live Chat
              </button>
              <button
                className={activeTab === 'inquiry' ? 'active' : ''}
                onClick={() => setActiveTab('inquiry')}
              >
                Inquiry Form
              </button>
            </div>
            <button onClick={() => setIsOpen(false)} className="close-btn">×</button>
          </div>

          {activeTab === 'chat' ? (
            <>
              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`message ${msg.sender}`}>
                    {msg.text}
                  </div>
                ))}
                {isLoading && (
                  <div className="message bot typing">
                    <span>•</span><span>•</span><span>•</span>
                  </div>
                )}
              </div>
              <div className="chat-input">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about our equipment..."
                />
                <button onClick={handleSend}>Send</button>
              </div>
            </>
          ) : (
            <div className="inquiry-form">
              {formSubmitted ? (
                <div className="success-message">
                  <h4>Thank You!</h4>
                  <p>Your inquiry has been submitted successfully. Our team will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleFormSubmit}>
                  <div className="form-group">
                    <label>Full Name*</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email*</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone Number*</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Product Interest</label>
                    <select
                      name="interest"
                      value={formData.interest}
                      onChange={handleFormChange}
                    >
                      <option value="">Select an option</option>
                      <option value="leather">Leather Testing Equipment</option>
                      <option value="fibre">Fibre/Yarn Testing Equipment</option>
                      <option value="paper">Paper Testing Equipment</option>
                      <option value="dyeing">Dyeing Machines</option>
                      <option value="other">Other Equipment</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Your Message*</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <button type="submit" className="submit-btn" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      ) : (
        <button className="chat-toggle" onClick={() => setIsOpen(true)}>
          <Image
            src={ChatImg}
            alt="Chat"
            width={24}
            height={24}
          />
          <span className="hidden md:block">Equipment Help</span>
        </button>
      )}

      <style jsx>{`
        .chat-window {
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 380px;
          height: 500px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 5px 25px rgba(0,0,0,0.15);
          display: flex;
          flex-direction: column;
          z-index: 1000;
          overflow: hidden;
          border: 1px solid #e0e0e0;
        }

        @media (max-width: 767px) {
        .chat-toggle {
        position: fixed !important;
        bottom: 78px !important;
        right: 5px !important;
        padding: 13px 15px !important;
          }
        }

        @media (max-width: 767px) {
        .chat-window  {
        position: fixed !important;
        bottom: 9px !important;
        right: 3px !important;
          }
        }

        .chat-header {
          background: #2c3e50;
          color: white;
          padding: 0 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tabs {
          display: flex;
        }
        .tabs button {
          background: none;
          border: none;
          color: rgba(255,255,255,0.7);
          padding: 15px 20px;
          font-size: 0.9rem;
          cursor: pointer;
          position: relative;
        }
        .tabs button.active {
          color: white;
          font-weight: 500;
        }
        .tabs button.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: white;
        }
        .close-btn {
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          padding: 15px;
        }
        .chat-messages {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
          background: #f9f9f9;
        }
        .message {
          margin: 8px 0;
          padding: 10px 15px;
          border-radius: 18px;
          max-width: 80%;
          word-wrap: break-word;
        }
        .user {
          background: #2c3e50;
          color: white;
          margin-left: auto;
          border-bottom-right-radius: 5px;
        }
        .bot {
          background: #e9e9e9;
          color: #333;
          margin-right: auto;
          border-bottom-left-radius: 5px;
        }
        .typing {
          display: flex;
          width: 50px;
        }
        .typing span {
          margin: 0 2px;
          animation: bounce 1s infinite;
        }
        .typing span:nth-child(2) {
          animation-delay: 0.2s;
        }
        .typing span:nth-child(3) {
          animation-delay: 0.4s;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .chat-input {
          display: flex;
          padding: 10px;
          border-top: 1px solid #eee;
          background: white;
        }
        .chat-input input {
          flex: 1;
          padding: 10px 15px;
          border: 1px solid #ddd;
          border-radius: 20px;
          margin-right: 10px;
        }
        .chat-input button {
          background: #2c3e50;
          color: white;
          border: none;
          padding: 0 20px;
          border-radius: 20px;
          cursor: pointer;
        }
        .chat-toggle {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #2c3e50;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 30px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          box-shadow: 0 3px 15px rgba(0,0,0,0.2);
          z-index: 999;
        }
        .inquiry-form {
          flex: 1;
          padding: 15px;
          overflow-y: auto;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: 500;
          color: #333;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 0.9rem;
        }
        .form-group textarea {
          height: 80px;
          resize: vertical;
        }
        .submit-btn {
          width: 100%;
          padding: 12px;
          background: #2c3e50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          margin-top: 10px;
        }
        .submit-btn:disabled {
          background: #cccccc;
          cursor: not-allowed;
        }
        .success-message {
          text-align: center;
          padding: 40px 20px;
        }
        .success-message h4 {
          color: #2c3e50;
          margin-bottom: 10px;
        }
        .success-message p {
          color: #666;
        }
      `}</style>
    </>
  );
}