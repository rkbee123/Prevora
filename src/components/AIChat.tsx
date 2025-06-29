import React, { useState } from 'react';
import { Bot, Send, X, Minimize2, Maximize2 } from 'lucide-react';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIChat: React.FC<AIChatProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm Panpath AI, your health intelligence assistant. I can help you understand health signals, analyze trends, and provide insights about disease prevention. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const quickQuestions = [
    "What are the current health alerts in my area?",
    "Explain how early detection works",
    "What should I do if there's a health alert?",
    "How accurate are your predictions?",
    "Show me recent disease trends"
  ];

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: generateAIResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (question: string) => {
    const responses = {
      'alert': "Based on current data, there are 3 active health alerts in major metropolitan areas. The most significant is a respiratory cluster in Mumbai with moderate severity. I recommend staying informed through our dashboard and following local health guidelines.",
      'detection': "Our early detection system works by analyzing multiple data streams: wearable device signals, wastewater sampling, pharmacy trends, and environmental factors. AI algorithms identify patterns and anomalies that might indicate emerging health threats, often 1-2 weeks before traditional surveillance methods.",
      'accuracy': "Our prediction accuracy is currently at 92% for high-confidence alerts. We use multiple validation layers and expert review to minimize false positives while ensuring we don't miss genuine threats.",
      'trends': "Recent trends show seasonal respiratory patterns in northern regions, with some unusual clusters in urban areas. Air quality correlations are particularly strong this month. Would you like me to show you specific regional data?",
      'action': "If there's a health alert in your area: 1) Stay calm and informed, 2) Follow recommended precautions (masks, hygiene, distancing), 3) Monitor your health closely, 4) Avoid unnecessary travel to affected areas, 5) Seek medical attention if you develop symptoms."
    };

    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('alert') || lowerQuestion.includes('area')) return responses.alert;
    if (lowerQuestion.includes('detection') || lowerQuestion.includes('work')) return responses.detection;
    if (lowerQuestion.includes('accurate') || lowerQuestion.includes('accuracy')) return responses.accuracy;
    if (lowerQuestion.includes('trend') || lowerQuestion.includes('recent')) return responses.trends;
    if (lowerQuestion.includes('do') || lowerQuestion.includes('should')) return responses.action;

    return "That's a great question! I can help you understand health signals, current alerts, prevention strategies, and how our AI detection system works. Could you be more specific about what you'd like to know?";
  };

  const handleQuickQuestion = (question: string) => {
    setInputMessage(question);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`bg-white rounded-2xl shadow-2xl transition-all duration-300 ${
        isMinimized ? 'w-80 h-16' : 'w-full max-w-4xl h-[80vh]'
      }`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Panpath AI</h3>
              <p className="text-purple-100 text-sm">Your Health Intelligence Assistant</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMinimized ? <Maximize2 className="h-5 w-5" /> : <Minimize2 className="h-5 w-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Chat Messages */}
            <div className="flex-1 p-6 overflow-y-auto max-h-96">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                        message.isBot
                          ? 'bg-gray-100 text-gray-800'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.isBot ? 'text-gray-500' : 'text-purple-100'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Questions */}
            <div className="px-6 py-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm hover:bg-purple-100 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me about health signals, alerts, or prevention..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AIChat;