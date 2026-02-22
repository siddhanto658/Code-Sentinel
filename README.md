# CodeSentinel

AI-powered code vulnerability scanner that analyzes code for security issues and provides remediation suggestions.

<div align="center">

![CodeSentinel](Screenshot%202026-02-22%20205051.png)

</div>

## Features

- **AI-Powered Analysis** - Uses Groq (Llama 3.3 70B) for intelligent vulnerability detection
- **Ultra-Fast** - Groq provides industry-leading inference speed
- **Free API** - Generous free tier with no credit card required
- **Hacker Mode** - Red team perspective for aggressive security testing
- **Demo Examples** - Pre-loaded vulnerable code samples for testing
- **Scan History** - Automatic saving of previous scans (last 20)
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
VITE_GROQ_API_KEY=your_groq_api_key_here
```

Get your free API key from: https://console.groq.com/keys

### Run Development Server

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Usage

1. **Paste or upload code** - Drop a file or paste directly into the editor
2. **Select a demo example** - Click "Demo Examples" for pre-loaded vulnerable code
3. **Enable Hacker Mode** - Toggle for red team perspective
4. **Scan** - Click "Scan for Vulnerabilities"
5. **Review Results** - Check audit report, patched code, or diff view
6. **Export** - Copy the fixed code

## Demo Examples Included

| Example | Language | Description |
|---------|----------|-------------|
| SQL Injection | Python | Direct string formatting SQL injection |
| XSS | JavaScript | Cross-site scripting vulnerability |
| Hardcoded Secrets | Python | API keys and passwords in source |
| Command Injection | Python | OS command injection |
| Path Traversal | Python | Directory traversal attack |
| Secure Example | Python | Properly secured code |

## Tech Stack

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite
- **AI:** Groq (Llama 3.3 70B)
- **Styling:** Tailwind CSS (Cyberpunk theme)

## Available Models

You can change the model in `services/groqService.ts`:

- `llama-3.3-70b-versatile` (Default)
- `llama-3.1-70b-versatile`
- `mixtral-8x7b-32768`

## License

MIT License

---

## Example Output

![CodeSentinel Example](Screenshot%202026-02-22%20205051.png)

---

Built with ❤️ by [siddhanto658](https://github.com/siddhanto658)
