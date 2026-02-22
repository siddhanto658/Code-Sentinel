import { SecurityReport } from "../types";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const vulnerabilitySchema = {
  type: "object",
  properties: {
    type: { type: "string", description: "Name of the vulnerability (e.g., SQL Injection)" },
    severity: { type: "string", enum: ["Critical", "High", "Medium", "Low"] },
    cweId: { type: "string", description: "The CWE ID (e.g., CWE-89)" },
    description: { type: "string", description: "Technical description of the flaw" },
    exploitScenario: { type: "string", description: "How a hacker would exploit this" },
  },
  required: ["type", "severity", "cweId", "description", "exploitScenario"]
};

const reportSchema = {
  type: "object",
  properties: {
    isSecure: { type: "boolean" },
    score: { type: "integer", description: "Security score from 0 to 100" },
    vulnerabilities: { 
      type: "array", 
      items: vulnerabilitySchema 
    },
    fixedCode: { type: "string", description: "The secure version of the code" },
    summary: { type: "string", description: "Brief executive summary of findings" }
  },
  required: ["isSecure", "score", "vulnerabilities", "fixedCode", "summary"]
};

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

    If vulnerabilities are found, provide the specific CWE, a detailed exploit scenario, and a fully corrected, secure version of the code.
    If the code is secure, explain why it is robust.
    
    Ensure the 'fixedCode' contains the FULL corrected code block, not just snippets.
    
    IMPORTANT: Respond ONLY with valid JSON in this exact format:
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
    const content = data.choices[0].message.content;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid response format from API");
    }
    
    const report = JSON.parse(jsonMatch[0]) as SecurityReport;
    return report;

  } catch (error) {
    console.error("Groq Analysis Error:", error);
    throw error;
  }
};
