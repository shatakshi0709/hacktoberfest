
export type HfChatMessage = { role: 'system' | 'user' | 'assistant'; content: string }


export async function inferWithHuggingFace(messages: HfChatMessage[]) {
  const envToken = import.meta.env.VITE_AI_TOKEN as string | undefined
  const token = (envToken && envToken !== 'undefined' ? String(envToken) : '')
    .replace(/^["']|["']$/g, '')
    .trim()
    
  if (!token) throw new Error('Missing VITE_AI_TOKEN (set it in .env and restart server)')

  // For now, return a simple mock response since the HuggingFace API is having issues
  // This allows the chatbot to work while we debug the API connection
  const userMessage = messages[messages.length - 1]?.content || ''
  
  // Simple rule-based responses for dashboard queries
  if (userMessage.toLowerCase().includes('hi') || userMessage.toLowerCase().includes('hello')) {
    return "Hello! I'm your dashboard assistant. I can help you with ISS tracking information and news articles. What would you like to know?"
  }
  
  if (userMessage.toLowerCase().includes('iss') || userMessage.toLowerCase().includes('position') || userMessage.toLowerCase().includes('location')) {
    return "I can help you with ISS position data! However, I need the ISS telemetry to be loaded first. Please check if the ISS tracking is active on the dashboard."
  }
  
  if (userMessage.toLowerCase().includes('news') || userMessage.toLowerCase().includes('article')) {
    return "I can help you with news articles! Please make sure the news section is loaded on the dashboard so I can access the latest articles."
  }
  
  return "I'm your dashboard assistant. I can answer questions about ISS tracking data and news articles from the dashboard. Please make sure the relevant data is loaded on the dashboard first."
}


