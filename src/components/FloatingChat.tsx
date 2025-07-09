"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';

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

  // Enhanced bot responses
  const getBotResponse = (userInput: string) => {
    const inputLower = userInput.toLowerCase();

    // Greetings
    if (inputLower.includes('hi') || inputLower.includes('hello') || inputLower.includes('hey')) {
      return "Hello! Welcome to S.K. Equipments. How can I assist you with our testing equipment today?";
    }

    // Equipment categories
    if (inputLower.includes('leather')) {
      return "We offer comprehensive leather testing equipment including:\n- Martindale abrasion testers\n- Flexometers\n- Tensile testers\n- Color fastness testers\n- Perspiration testers\n\nWhich specific equipment are you interested in?";
    }
    
    if (inputLower.includes('textile') || inputLower.includes('fabric') || inputLower.includes('fibre') || inputLower.includes('yarn')) {
      return "Our textile testing equipment includes:\n- Fabric strength testers\n- Pilling testers\n- Tear strength testers\n- Bursting strength testers\n- Yarn evenness testers\n\nWould you like specifications for any particular machine?";
    }
    
    if (inputLower.includes('paper') || inputLower.includes('cardboard')) {
      return "We provide paper testing solutions such as:\n- Bursting strength testers\n- Tensile testers\n- Cobb sizing testers\n- Smoothness testers\n- Folding endurance testers\n\nLet me know which equipment you need details about.";
    }
    
    if (inputLower.includes('dyeing') || inputLower.includes('color')) {
      return "Our dyeing and color testing equipment includes:\n- Lab dyeing machines\n- Color matching cabinets\n- Color fastness testers\n- Spectrophotometers\n\nWould you like technical specifications or pricing for any of these?";
    }

    // Company information
    if (inputLower.includes('about') && (inputLower.includes('company') || inputLower.includes('sk') || inputLower.includes('equipments'))) {
      return "S.K. Equipments is a leading manufacturer of quality testing equipment since 1985. We specialize in:\n- Designing and manufacturing precision testing instruments\n- Serving industries like textiles, leather, paper, and packaging\n- Providing customized solutions\n- Offering excellent after-sales support\n\nWould you like to know more about our history or certifications?";
    }
    
    if (inputLower.includes('contact') || inputLower.includes('address') || inputLower.includes('location')) {
      return "You can reach us at:\n\n📌 Address: C-27, Sector-7, Noida, Uttar Pradesh, India\n📞 Phone: +91-120-1234567\n📧 Email: info@skequipments.com\n🌐 Website: www.skequipments.com\n\nOur office hours are Monday to Saturday, 9:00 AM to 6:00 PM IST.";
    }
    
    if (inputLower.includes('certif') || inputLower.includes('iso')) {
      return "All our equipment meets international standards and we hold:\n- ISO 9001:2015 certification\n- CE marking for applicable products\n- Regular calibration certificates\n\nWould you like specific certification details for any equipment?";
    }

    // Product information
    if (inputLower.includes('price') || inputLower.includes('cost') || inputLower.includes('quotation')) {
      return "For accurate pricing information:\n1. Please specify the equipment model\n2. Let me know your location for shipping costs\n3. Mention required accessories\n\nAlternatively, I can open the inquiry form for a detailed quote.";
    }
    
    if (inputLower.includes('spec') || inputLower.includes('technical') || inputLower.includes('feature')) {
      return "We provide detailed specifications for all our equipment including:\n- Test standards compliance\n- Power requirements\n- Dimensions\n- Test capacity\n- Accuracy levels\n\nPlease specify which equipment you need technical details for.";
    }
    
    if (inputLower.includes('catalog') || inputLower.includes('brochure') || inputLower.includes('datasheet')) {
      return "You can access our resources in these ways:\n1. Download full catalog from our website's Resources section\n2. Request specific datasheets by mentioning the equipment\n3. Get brochures emailed to you by providing your email address";
    }
    
    if (inputLower.includes('video') || inputLower.includes('demo')) {
      return "We have demonstration videos available for most equipment. Would you like:\n1. Product operation videos\n2. Testing procedure demonstrations\n3. Maintenance tutorials\n\nPlease specify the equipment you're interested in.";
    }

    // Services
    if (inputLower.includes('service') || inputLower.includes('support') || inputLower.includes('maintenance')) {
      return "We offer comprehensive support services:\n\n🔧 Installation & commissioning\n🛠️ Annual maintenance contracts\n⚙️ Calibration services\n🔄 Spare parts availability\n📞 Technical support hotline\n\nHow can we assist you with service?";
    }
    
    if (inputLower.includes('warranty')) {
      return "Our standard warranty coverage:\n- 1 year comprehensive warranty on all equipment\n- Lifetime support for technical queries\n- Optional extended warranty plans available\n\nWould you like details about our warranty terms or extended plans?";
    }
    
    if (inputLower.includes('calibrat') || inputLower.includes('accuracy')) {
      return "All our equipment is pre-calibrated and comes with:\n- Calibration certificate traceable to NABL\n- Recommended recalibration intervals\n- On-site calibration services available\n\nNeed calibration details for specific equipment?";
    }

    // Order process
    if (inputLower.includes('order') || inputLower.includes('buy') || inputLower.includes('purchase')) {
      return "Our ordering process is simple:\n1. Confirm equipment specifications\n2. Receive quotation\n3. Place purchase order\n4. Equipment delivery\n5. Installation & training\n\nWould you like me to connect you with our sales team?";
    }
    
    if (inputLower.includes('delivery') || inputLower.includes('shipping') || inputLower.includes('lead time')) {
      return "Delivery information:\n- Standard lead time: 2-4 weeks\n- Express delivery options available\n- Worldwide shipping with proper documentation\n- Installation support provided\n\nNeed delivery estimates for your location?";
    }
    
    if (inputLower.includes('payment') || inputLower.includes('terms')) {
      return "Our standard payment terms:\n- 50% advance with order\n- 50% before dispatch\n- We accept bank transfers, cheques, and major credit cards\n- Custom payment plans for large orders\n\nNeed clarification on any payment aspect?";
    }

    // Help and navigation
    if (inputLower.includes('help') || inputLower.includes('lost') || inputLower.includes('confused')) {
      return "I can help you with:\n1. Product information\n2. Technical specifications\n3. Pricing inquiries\n4. Order process\n5. Service support\n\nWhat would you like assistance with?";
    }
    
    if (inputLower.includes('inquiry') || inputLower.includes('form') || inputLower.includes('contact us')) {
      setActiveTab('inquiry');
      return "I've opened the inquiry form for you. Please fill in your details and our team will contact you shortly with the information you need.";
    }
    
    if (inputLower.includes('thank') || inputLower.includes('thanks')) {
      return "You're welcome! Is there anything else I can assist you with regarding our testing equipment?";
    }

    // Default response
    return "Thank you for your interest in S.K. Equipments. For more detailed information about our testing equipment, please specify:\n- The type of product you're interested in\n- Your specific requirements\n- Any technical parameters needed\n\nOr you can submit an inquiry form for a comprehensive response from our team.";
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

  // ... [rest of the component code remains the same]

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
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

    } catch (error: unknown) {
      console.error('Form submission error:', error);

      let userMessage = "There was an error submitting your inquiry. Please try again later.";

      if (error instanceof Error) {
        if (error.message.includes('required fields')) {
          userMessage = error.message;
        } else if (error.message.includes('valid email')) {
          userMessage = error.message;
        }
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
          <div className="w-6 h-6 relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
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
          z-index: 30;
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
          z-index: 30;
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