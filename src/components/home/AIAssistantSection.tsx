import React, { useState } from 'react';
import { Bot, MessageSquare, Zap, Shield } from 'lucide-react';
import AIChat from '../AIChat';

const AIAssistantSection = () => {
  const [showAIChat, setShowAIChat] = useState(false);

  const features = [
    {
      icon: MessageSquare,
      title: 'Natural Conversations',
      description: 'Ask questions in plain English about alerts, trends, and health data'
    },
    {
      icon: Zap,
      title: 'Instant Insights',
      description: 'Get immediate analysis and explanations of complex health patterns'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'All interactions are encrypted and data remains completely anonymized'
    }
  ];

  const exampleQueries = [
    '"Show me alerts near Chennai"',
    '"Explain the latest anomaly cluster"',
    '"How can I help my community?"',
    '"What\'s the current risk level in my area?"'
  ];

  return (
    <>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl">
                    <Bot className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
                    Your AI companion
                  </h2>
                </div>
                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Meet Prevora AI, built right into your dashboard. Ask anything about health signals, 
                  get instant insights, and receive personalized guidance for your community.
                </p>

                <div className="space-y-6 mb-8">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 p-2 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg">
                        <feature.icon className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                        <p className="text-gray-600 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-gray-600 mb-6">
                  Powered by secure AI APIs, it's always ready to guide you through complex health data 
                  and help you make informed decisions.
                </p>

                <button 
                  onClick={() => setShowAIChat(true)}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
                >
                  Try Prevora AI
                </button>
              </div>

              {/* Right Content - Chat Interface Preview */}
              <div className="relative">
                <div className="bg-gradient-to-br from-gray-900 to-purple-900 rounded-2xl p-6 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-700">
                    <div className="p-2 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg">
                      <Bot className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">Prevora AI</h3>
                      <p className="text-xs text-gray-400">Online • Ready to help</p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-white p-3 rounded-lg max-w-xs">
                        <p className="text-sm">Hello! I'm here to help you understand health signals and alerts. What would you like to know?</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-lg max-w-xs">
                        <p className="text-sm">Show me recent alerts in Mumbai</p>
                      </div>
                    </div>

                    <div className="flex justify-start">
                      <div className="bg-gray-800 text-white p-3 rounded-lg max-w-xs">
                        <p className="text-sm">I found 3 active alerts in Mumbai. The most significant is a cough cluster in Andheri West with high severity. Would you like details?</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wide">Try asking:</p>
                    {exampleQueries.map((query, index) => (
                      <button
                        key={index}
                        onClick={() => setShowAIChat(true)}
                        className="block w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        {query}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AIChat isOpen={showAIChat} onClose={() => setShowAIChat(false)} />
    </>
  );
};

export default AIAssistantSection;