# CodeSentinel

AI-powered code vulnerability scanner that analyzes code for security issues and provides remediation suggestions.

**Powered by Groq - Ultra-fast free AI inference**

## Features

- **AI-Powered Analysis** - Uses Groq (Llama 3.3) for intelligent vulnerability detection
- **Free API** - No credit card required, ultra-fast free tier
- **Hacker Mode** - Red team perspective for aggressive security testing
- **Demo Examples** - Pre-loaded vulnerable code samples for testing
- **Scan History** - Automatic saving of previous scans
- **Auto-Save** - Code persists between sessions
- **Diff View** - Side-by-side comparison of vulnerable and fixed code
- **Security Score** - 0-100 scoring system

## Quick Start

### Prerequisites

- Node.js 18+
- Groq API Key (Free!)

### Installation

```bash
git clone https://github.com/siddhanto658/Code-Sentinel.git
cd Code-Sentinel
npm install
```

### Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your Groq API key to `.env`:
```
VITE_GROQ_API_KEY=your_api_key_here
```

Get your free API key from: https://console.groq.com/keys

> **Note:** Groq provides free inference with no credit card required!

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
- **AI:** Groq (Llama 3.3 70B - Free)
- **Styling:** Tailwind CSS (Cyberpunk theme)

## Project Structure

```
Code-Sentinel/
├── src/
│   ├── components/
│   ├── data/
│   ├── services/
│   ├── App.tsx
│   └── types.ts
├── .env.example
└── package.json
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_GROQ_API_KEY` | Groq API key (required) |

## Available Models

You can change the model in `services/groqService.ts`. Popular free options:

- `llama-3.3-70b-versatile` (Default - Recommended)
- `llama-3.1-70b-versatile`
- `mixtral-8x7b-32768`

## License

MIT License
