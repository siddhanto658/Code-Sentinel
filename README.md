# CodeSentinel

AI-powered code vulnerability scanner that analyzes code for security issues and provides remediation suggestions.

**OpenRouter for free AI inference**

## Features

- **AI-Powered Analysis** - Uses OpenRouter (Llama 3.1) for intelligent vulnerability detection
- **Free API** - No credit card required, generous free tier
- **Hacker Mode** - Red team perspective for aggressive security testing
- **Demo Examples** - Pre-loaded vulnerable code samples for testing
- **Scan History** - Automatic saving of previous scans
- **Auto-Save** - Code persists between sessions
- **Diff View** - Side-by-side comparison of vulnerable and fixed code
- **Security Score** - 0-100 scoring system

## Quick Start

### Prerequisites

- Node.js 18+
- OpenRouter API Key (Free!)

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

2. Add your OpenRouter API key to `.env`:
```
VITE_OPENROUTER_API_KEY=your_api_key_here
```

Get your free API key from: https://openrouter.ai/settings/api-keys

> **Note:** OpenRouter provides free credits for new users. No credit card required!

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
- **AI:** OpenRouter (Llama 3.1 8B - Free)
- **Styling:** Custom CSS (Cyberpunk theme)

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
| `VITE_OPENROUTER_API_KEY` | OpenRouter API key (required) |

## Available Models

You can change the model in `services/openRouterService.ts`. Popular free options:

- `meta-llama/llama-3.1-8b-instruct` (Default)
- `google/gemma-2-9b-it`
- `mistralai/mistral-7b-instruct`

## License

MIT License
