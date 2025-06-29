const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const generateAIResponse = async (messages: ChatMessage[]): Promise<string> => {
  // Check if API key is available
  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not configured');
    return 'AI assistant is currently unavailable. Please configure the OpenRouter API key to enable AI features.';
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Prevora AI Assistant'
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: messages,
        temperature: 0.7,
        max_tokens: 500,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I encountered an error processing your request.';
  } catch (error) {
    console.error('OpenRouter API error:', error);
    return 'I apologize, but I\'m currently unable to process your request. Please try again later.';
  }
};

export const generateHealthReport = async (signals: any[], events: any[]): Promise<string> => {
  // Check if API key is available
  if (!OPENROUTER_API_KEY) {
    console.warn('OpenRouter API key not configured');
    return 'AI health report generation is currently unavailable. Please configure the OpenRouter API key to enable AI features.';
  }

  const systemPrompt = `You are Panpath AI, a health intelligence assistant for the Prevora early disease detection platform. 
  Generate a comprehensive health report based on the provided signals and events data. 
  Focus on trends, patterns, risk assessment, and actionable recommendations.
  Keep the response professional, informative, and under 400 words.`;

  const userPrompt = `Generate a health intelligence report based on this data:
  
  Signals: ${signals.length} total signals
  Events: ${events.length} total events
  Active Events: ${events.filter(e => e.status === 'active').length}
  High Severity Events: ${events.filter(e => e.severity === 'high').length}
  
  Recent Signal Types: ${signals.slice(0, 10).map(s => s.type).join(', ')}
  Recent Locations: ${signals.slice(0, 10).map(s => s.location).join(', ')}
  
  Please provide insights on current health trends, risk levels, and recommendations.`;

  try {
    return await generateAIResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
  } catch (error) {
    console.error('Error generating health report:', error);
    return 'Unable to generate health report at this time. Please try again later.';
  }
};