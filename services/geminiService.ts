import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SecurityReport } from "../types";

// Schema definition for structured output
const vulnerabilitySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    type: { type: Type.STRING, description: "Name of the vulnerability (e.g., SQL Injection)" },
    severity: { type: Type.STRING, enum: ["Critical", "High", "Medium", "Low"] },
    cweId: { type: Type.STRING, description: "The CWE ID (e.g., CWE-89)" },
    description: { type: Type.STRING, description: "Technical description of the flaw" },
    exploitScenario: { type: Type.STRING, description: "How a hacker would exploit this" },
  },
  required: ["type", "severity", "cweId", "description", "exploitScenario"]
};

const reportSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    isSecure: { type: Type.BOOLEAN },
    score: { type: Type.INTEGER, description: "Security score from 0 to 100" },
    vulnerabilities: { 
      type: Type.ARRAY, 
      items: vulnerabilitySchema 
    },
    fixedCode: { type: Type.STRING, description: "The secure version of the code" },
    summary: { type: Type.STRING, description: "Brief executive summary of findings" }
  },
  required: ["isSecure", "score", "vulnerabilities", "fixedCode", "summary"]
};

export const analyzeCodeSecurity = async (code: string, hackerMode: boolean): Promise<SecurityReport> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please set VITE_GEMINI_API_KEY in your .env file.");
  }

  const ai = new GoogleGenAI({ apiKey });

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
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Using Pro for deep code reasoning
      contents: prompt,
      config: {
        systemInstruction: persona,
        responseMimeType: "application/json",
        responseSchema: reportSchema,
        // Using Google Search to verify latest CWE/CVE info if relevant contexts are found in code comments or imports
        tools: [{ googleSearch: {} }] 
      }
    });

    const textResponse = response.text;
    if (!textResponse) {
      throw new Error("Empty response from Gemini");
    }

    const report = JSON.parse(textResponse) as SecurityReport;
    return report;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};