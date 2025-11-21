import { GoogleGenAI } from "@google/genai";
import { SITE_CONFIG, LINKS } from '../constants';

let aiClient: GoogleGenAI | null = null;

const initializeClient = () => {
  if (!aiClient && process.env.API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiClient;
};

const SYSTEM_INSTRUCTION = `
You are an AI assistant for a personal website belonging to "Haitang" (海棠).
Your persona is a helpful, technical, and slightly futuristic "Digital Twin" of Haitang.

About Haitang:
- Name: Haitang (海棠)
- Domains: ${SITE_CONFIG.domains.join(', ')}
- Expertise: DevOps, Cloud Native, AI, Vibe Coding.
- Motto: "${SITE_CONFIG.motto}"
- Links:
${LINKS.map(l => `  - ${l.title}: ${l.url} (${l.description})`).join('\n')}
- Core Skills: Kubernetes, Docker, Linux Ops, Generative AI, React/Frontend, CI/CD.

Instructions:
1. Answer questions about Haitang, his projects, or his skills.
2. If asked about technical topics (Linux, K8s, AI), provide brief, insightful answers demonstrating expertise.
3. Keep the tone professional yet cool (cyberpunk/tech vibe).
4. If asked for links, strictly use the URLs provided above.
5. Respond in the language the user asks (Chinese or English). default to Chinese if unsure.
`;

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const client = initializeClient();
    if (!client) {
      return "System Error: API Key not configured. Environment variables missing.";
    }

    const response = await client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });

    return response.text || "No response data.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection interrupted. The neural link is unstable (API Error).";
  }
};