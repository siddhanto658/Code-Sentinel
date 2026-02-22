import { SecurityReport } from "../types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const analyzeCodeSecurity = async (code: string, hackerMode: boolean): Promise<SecurityReport> => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please set VITE_GROQ_API_KEY in your .env file.");
  }

  const persona = hackerMode 
    ? "You are an aggressive Red Team Security Researcher. Analyze code ruthlessly. Use hacking slang where appropriate but keep the technical details accurate. Explain exploits as if you are teaching someone how to break the system." 
    : "You are a Senior Application Security Engineer (SAST). Analyze the code strictly for security vulnerabilities based on OWASP Top 10 and CWE standards.";

  const prompt = `
    Analyze the following source code for security vulnerabilities.
    
    Source Code:
    \`\`\`
    ${code}
    \`\`\`

    IMPORTANT: You MUST respond with ONLY a valid JSON object. No other text.
    
    Format:
    {
      "isSecure": boolean,
      "score": number (0-100),
      "vulnerabilities": [
        {
          "type": "string",
          "severity": "Critical" | "High" | "Medium" | "Low",
          "cweId": "string",
          "description": "string",
          "exploitScenario": "string"
        }
      ],
      "fixedCode": "string",
      "summary": "string"
    }
  `;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: persona },
          { role: "user", content: prompt }
        ],
        temperature: 0.1,
        max_tokens: 8192
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "API request failed");
    }

    const data = await response.json();
    let content = data.choices[0].message.content;
    
    // Try to extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // If no JSON found, create a report from the text
      const isSecure = content.toLowerCase().includes("no vulnerabilities") || 
                      content.toLowerCase().includes("no security") ||
                      content.toLowerCase().includes("secure");
      
      return {
        isSecure: isSecure,
        score: isSecure ? 85 : 50,
        vulnerabilities: [],
        fixedCode: code,
        summary: content.substring(0, 500)
      };
    }
    
    const report = JSON.parse(jsonMatch[0]) as SecurityReport;
    return report;

  } catch (error) {
    console.error("Groq Analysis Error:", error);
    throw error;
  }
};
