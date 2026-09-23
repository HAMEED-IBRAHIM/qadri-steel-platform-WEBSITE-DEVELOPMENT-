import React, { useState } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaHistory } from 'react-icons/fa';
import './Assistant.css';

const Assistant = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I am your Qadri Steel AI Assistant. How can I help you today? You can ask me to check stock, look up prices, or track an order.", sender: "ai" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    
    const newMsg = { id: Date.now(), text: input, sender: 'user' };
    setMessages([...messages, newMsg]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      let reply = "I'm sorry, I couldn't process that request right now.";
      const lowerInput = input.toLowerCase();
      
      if (lowerInput.includes('stock') || lowerInput.includes('available')) {
        reply = "Currently, we have 450 units of MS Square Pipe (2x2) and 200 units of TMT Bars (12mm) in stock at the Royapuram godown.";
      } else if (lowerInput.includes('price') || lowerInput.includes('rate')) {
        reply = "The current rate for Tata Tiscon TMT Bar (12mm) is Rs. 850 per piece. MPL Square Pipe (72x72) is Rs. 1,200.";
      } else if (lowerInput.includes('order') || lowerInput.includes('track')) {
        reply = "Order ORD-003 for Malik & Sons is currently 'Processing' and is scheduled for dispatch tomorrow morning.";
      } else if (lowerInput.includes('contact') || lowerInput.includes('phone')) {
        reply = "You can reach the main office at 9384902028 or 86103 88075.";
      } else {
        reply = "I found some results in the catalog. Would you like me to create a quote for you?";
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: reply, sender: 'ai' }]);
    }, 800);
  };

  return (
    <div className="assistant-page">
      <div className="assistant-header">
        <div>
          <h1>AI Search Assistant</h1>
          <p>Your intelligent business helper for Qadri Steel & Tubes.</p>
        </div>
        <button className="secondary-btn"><FaHistory /> Clear Chat</button>
      </div>

      <div className="chat-container">
        <div className="chat-history">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-message ${msg.sender}`}>
              <div className="message-icon">
                {msg.sender === 'ai' ? <FaRobot /> : <FaUser />}
              </div>
              <div className="message-bubble">
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        
        <div className="chat-input-area">
          <input 
            type="text" 
            placeholder="Ask about prices, stock levels, or order status..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button className="send-btn" onClick={handleSend}><FaPaperPlane /></button>
        </div>
      </div>
      
      <div className="quick-prompts">
        <button onClick={() => setInput("What's the price of TMT 12mm?")}>"What's the price of TMT 12mm?"</button>
        <button onClick={() => setInput("Check stock for MS Square Pipes")}>"Check stock for MS Square Pipes"</button>
        <button onClick={() => setInput("Track order ORD-003")}>"Track order ORD-003"</button>
      </div>
    </div>
  );
};

export default Assistant;
