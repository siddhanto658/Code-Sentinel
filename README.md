<div align="center">
<img width="1200" height="475" alt="CodeSentinel Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# CodeSentinel

AI-powered code vulnerability scanner that analyzes code for security issues and provides remediation suggestions.

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19.x-61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://www.typescriptlang.org)

</div>

## Features

- **AI-Powered Analysis** - Uses Google Gemini for intelligent vulnerability detection
- **Hacker Mode** - Red team perspective for aggressive security testing
- **Demo Examples** - Pre-loaded vulnerable code samples for testing
- **Scan History** - Automatic saving of previous scans
- **Auto-Save** - Code persists between sessions
- **Diff View** - Side-by-side comparison of vulnerable and fixed code
- **Security Score** - 0-100 scoring system

## Quick Start

### Prerequisites

- Node.js 18+
- Google Gemini API Key

### Installation

```bash
# Clone the repository
git clone https://github.com/siddhanto658/Code-Sentinel.git
cd Code-Sentinel

# Install dependencies
npm install
```

### Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your Gemini API key to `.env`:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

Get your API key from: https://aistudio.google.com/app/apikey

### Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

### Build for Production

```bash
npm run build
```

## Usage

1. **Paste or upload code** - Drop a file or paste directly into the editor
2. **Select a demo example** - Click "Demo Examples" for pre-loaded vulnerable code
3. **Enable Hacker Mode** - Toggle for red team perspective (optional)
4. **Scan** - Click "Scan for Vulnerabilities"
5. **Review Results** - Check the audit report, patched code, or diff view
6. **Export** - Copy the fixed code or review the security score

## Demo Examples Included

| Example | Description |
|---------|-------------|
| SQL Injection | Python vulnerable to SQL injection |
| XSS | JavaScript cross-site scripting |
| Hardcoded Secrets | API keys and passwords in source |
| Command Injection | OS command injection vulnerability |
| Path Traversal | Directory traversal attack |
| Secure Example | Properly secured code sample |

## Tech Stack

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite
- **AI:** Google Gemini API
- **Styling:** Custom CSS (Cyberpunk theme)

## Project Structure

```
Code-Sentinel/
├── src/
│   ├── components/       # React components
│   │   ├── CodeBlock.tsx
│   │   ├── Icons.tsx
│   │   └── VulnerabilityCard.tsx
│   ├── data/
│   │   └── demoExamples.ts
│   ├── services/
│   │   └── geminiService.ts
│   ├── App.tsx
│   ├── types.ts
│   └── main.tsx
├── .env.example
├── index.html
├── package.json
└── vite.config.ts
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key (required) |

## License

MIT License - feel free to use for personal and commercial projects.
