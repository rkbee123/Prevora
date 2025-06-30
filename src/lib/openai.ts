const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export const generateAIResponse = async (messages: ChatMessage[]): Promise<string> => {
  // Check if API key is available
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured');
    return 'Prevora AI is currently unavailable. Please configure the OpenAI API key to enable AI features.';
  }

  try {
    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I encountered an error processing your request.';
  } catch (error) {
    console.error('OpenAI API error:', error);
    return 'I apologize, but I\'m currently unable to process your request. Please try again later.';
  }
};

export const generateHealthReport = async (signals: any[], events: any[]): Promise<string> => {
  // Check if API key is available
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured');
    return 'AI health report generation is currently unavailable. Please configure the OpenAI API key to enable AI features.';
  }

  const systemPrompt = `You are Prevora AI, a health intelligence assistant for the Prevora early disease detection platform. 
  Generate a comprehensive health intelligence report based on the provided signals and events data. 
  Focus on trends, patterns, risk assessment, and actionable recommendations.
  Structure the report with clear sections and provide specific insights.
  Keep the response professional, informative, and under 800 words.`;

  // Analyze signal patterns
  const signalsByLocation = signals.reduce((acc, signal) => {
    const location = signal.location.split(',')[0];
    acc[location] = (acc[location] || 0) + 1;
    return acc;
  }, {});

  const signalsBySeverity = signals.reduce((acc, signal) => {
    acc[signal.severity] = (acc[signal.severity] || 0) + 1;
    return acc;
  }, {});

  const signalsByType = signals.reduce((acc, signal) => {
    acc[signal.type] = (acc[signal.type] || 0) + 1;
    return acc;
  }, {});

  const recentSignals = signals.filter(s => {
    const signalDate = new Date(s.created_at);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return signalDate > oneDayAgo;
  });

  const userPrompt = `Generate a comprehensive health intelligence report based on this data:

SIGNAL ANALYSIS:
- Total Signals: ${signals.length}
- Recent Signals (24h): ${recentSignals.length}
- Signal Distribution by Severity: ${JSON.stringify(signalsBySeverity)}
- Signal Distribution by Type: ${JSON.stringify(signalsByType)}
- Top Affected Locations: ${JSON.stringify(signalsByLocation)}

EVENT ANALYSIS:
- Total Events: ${events.length}
- Active Events: ${events.filter(e => e.status === 'active').length}
- High Severity Events: ${events.filter(e => e.severity === 'high').length}
- Recent Events: ${events.filter(e => {
    const eventDate = new Date(e.created_at);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return eventDate > oneDayAgo;
  }).length}

SYSTEM PERFORMANCE:
- Detection Rate: ${recentSignals.length > 0 ? 'Active' : 'Low'}
- Coverage Areas: ${Object.keys(signalsByLocation).length} locations
- Alert Generation: ${events.length > 0 ? 'Operational' : 'Standby'}

Please provide:
1. Executive Summary
2. Current Health Status Assessment
3. Geographic Risk Analysis
4. Trend Analysis
5. Recommended Actions
6. System Performance Summary

Focus on actionable insights and clear risk communication.`;

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

// Helper function to convert any value to a string for React rendering
const convertToString = (item: any): string => {
  if (typeof item === 'string') {
    return item;
  }
  if (typeof item === 'object' && item !== null) {
    // If it's an object with common properties, extract the most relevant one
    if (item.advice) return item.advice;
    if (item.recommendation) return item.recommendation;
    if (item.action) return item.action;
    if (item.text) return item.text;
    if (item.content) return item.content;
    if (item.description) return item.description;
    // If it has a 'for' property, combine it with other properties
    if (item.for && item.advice) return `${item.for}: ${item.advice}`;
    if (item.for && item.action) return `${item.for}: ${item.action}`;
    // Fallback: stringify the object
    return JSON.stringify(item);
  }
  // Convert any other type to string
  return String(item);
};

export const generateEventRecommendations = async (eventData: any, relatedSignals: any[]): Promise<{ recommendations: string[], precautions: string[] }> => {
  if (!OPENAI_API_KEY) {
    return {
      recommendations: ['Contact local health authorities', 'Monitor symptoms closely', 'Practice good hygiene'],
      precautions: ['Health authorities have been notified', 'Monitoring systems are active']
    };
  }

  const systemPrompt = `You are Prevora AI, a health intelligence assistant. Generate specific, actionable recommendations and precautions for a health event. 
  Provide practical advice for residents, healthcare providers, and authorities.
  Return the response as a JSON object with "recommendations" and "precautions" arrays containing only simple strings.`;

  const userPrompt = `Generate recommendations and precautions for this health event:

EVENT DETAILS:
- Title: ${eventData.title}
- Location: ${eventData.location}
- Type: ${eventData.event_type || eventData.type}
- Severity: ${eventData.severity}
- Signal Count: ${eventData.signal_count}
- Description: ${eventData.description}

RELATED SIGNALS: ${relatedSignals.length} signals detected
- Signal Types: ${relatedSignals.map(s => s.type).join(', ')}
- Severity Distribution: ${relatedSignals.reduce((acc, s) => {
    acc[s.severity] = (acc[s.severity] || 0) + 1;
    return acc;
  }, {})}

Provide 6-8 specific recommendations for residents and 4-6 precautionary measures being taken.`;

  try {
    const response = await generateAIResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);

    // Try to parse JSON response, fallback to default if parsing fails
    try {
      const parsed = JSON.parse(response);
      
      // Ensure all recommendations and precautions are strings
      const recommendations = (parsed.recommendations || []).map(convertToString);
      const precautions = (parsed.precautions || []).map(convertToString);
      
      return {
        recommendations: recommendations.length > 0 ? recommendations : ['Monitor symptoms closely', 'Practice good hygiene', 'Stay informed about local updates'],
        precautions: precautions.length > 0 ? precautions : ['Health authorities have been notified', 'Monitoring systems are active']
      };
    } catch {
      // Fallback: extract recommendations and precautions from text
      const lines = response.split('\n').filter(line => line.trim());
      const recommendations = lines.filter(line => line.includes('•') || line.includes('-')).slice(0, 8).map(convertToString);
      const precautions = lines.filter(line => line.includes('authority') || line.includes('monitor') || line.includes('system')).slice(0, 6).map(convertToString);
      
      return {
        recommendations: recommendations.length > 0 ? recommendations : ['Monitor symptoms closely', 'Practice good hygiene', 'Stay informed about local updates'],
        precautions: precautions.length > 0 ? precautions : ['Health authorities have been notified', 'Monitoring systems are active']
      };
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      recommendations: ['Monitor symptoms closely', 'Practice good hygiene', 'Stay informed about local health updates'],
      precautions: ['Health authorities have been notified', 'Monitoring systems are active']
    };
  }
};

export const generateBlogContent = async (eventData: any, signals: any[]): Promise<string> => {
  if (!OPENAI_API_KEY) {
    return `# Health Alert: ${eventData.title}

Our monitoring system has detected unusual health signal patterns in ${eventData.location}. This early warning indicates potential health concerns that warrant attention.

## Alert Summary
- Location: ${eventData.location}
- Severity: ${eventData.severity}
- Signals Detected: ${eventData.signal_count}

## Recommended Actions
- Monitor symptoms closely
- Practice good hygiene
- Stay informed about local updates

*This alert was generated by the Prevora AI Prevention Network.*`;
  }

  const systemPrompt = `You are Prevora AI, creating detailed health blog posts for the Prevora early detection platform.
  Generate comprehensive, informative blog content with proper markdown formatting.
  Include sections for summary, analysis, recommendations, and visual data representations.
  Make it engaging but professional, suitable for both medical professionals and the general public.`;

  const signalAnalysis = signals.reduce((acc, signal) => {
    acc.total++;
    acc.byType[signal.type] = (acc.byType[signal.type] || 0) + 1;
    acc.bySeverity[signal.severity] = (acc.bySeverity[signal.severity] || 0) + 1;
    return acc;
  }, { total: 0, byType: {}, bySeverity: {} });

  const userPrompt = `Create a comprehensive blog post for this health event:

EVENT INFORMATION:
- Title: ${eventData.title}
- Location: ${eventData.location}
- Type: ${eventData.event_type || eventData.type}
- Severity: ${eventData.severity}
- Status: ${eventData.status}
- Description: ${eventData.description}

SIGNAL ANALYSIS:
- Total Signals: ${signalAnalysis.total}
- Signal Types: ${JSON.stringify(signalAnalysis.byType)}
- Severity Distribution: ${JSON.stringify(signalAnalysis.bySeverity)}

Create a blog post with these sections:
1. Executive Summary with key alert information
2. What We Detected (detailed analysis)
3. Geographic Impact and Timeline
4. Recommended Actions (for residents, healthcare providers, authorities)
5. How Our System Works (brief explanation)
6. Data Visualization (describe charts/graphs that would be shown)
7. Community Response Guidelines
8. Important Disclaimers

Use proper markdown formatting with headers, lists, tables, and emphasis.
Include specific data points and make it informative yet accessible.`;

  try {
    return await generateAIResponse([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ]);
  } catch (error) {
    console.error('Error generating blog content:', error);
    return `# Health Alert: ${eventData.title}

Our AI monitoring system has detected significant health signal activity in ${eventData.location}. This comprehensive analysis provides important information for community awareness and response.

## Alert Summary
- **Location:** ${eventData.location}
- **Severity Level:** ${eventData.severity.toUpperCase()}
- **Signals Detected:** ${eventData.signal_count}
- **Status:** ${eventData.status}

## What We Detected
${eventData.description}

## Recommended Actions
- Monitor symptoms closely and seek medical attention if needed
- Practice enhanced hygiene measures
- Stay informed through official health channels
- Follow local health authority guidance

## Important Note
This is an early warning system for prevention. Always consult healthcare professionals for medical advice.

*Generated by Prevora AI Prevention Network*`;
  }
};