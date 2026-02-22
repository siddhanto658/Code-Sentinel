export interface DemoExample {
  id: string;
  name: string;
  language: string;
  code: string;
}

export const demoExamples: DemoExample[] = [
  {
    id: 'sql-injection',
    name: 'SQL Injection',
    language: 'python',
    code: `import sqlite3

def login(username, password):
    # VULNERABLE: Direct string formatting allows SQL Injection
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(query)
    user = cursor.fetchone()
    
    return user
`
  },
  {
    id: 'xss',
    name: 'Cross-Site Scripting (XSS)',
    language: 'javascript',
    code: `// Express.js vulnerable to XSS
app.get('/search', (req, res) => {
  const query = req.query.q;
  // VULNERABLE: Directly rendering user input
  res.send(\`<h1>Search results for: \${query}</h1>\`);
});
`
  },
  {
    id: 'hardcoded-secrets',
    name: 'Hardcoded Secrets',
    language: 'python',
    code: `import requests

# VULNERABLE: Hardcoded credentials
API_KEY = "sk_live_abc123xyz789"
DATABASE_URL = "postgresql://admin:password123@localhost/mydb"

def fetch_user_data(user_id):
    headers = {"Authorization": f"Bearer {API_KEY}"}
    return requests.get(f"{DATABASE_URL}/users/{user_id}", headers=headers)
`
  },
  {
    id: 'command-injection',
    name: 'Command Injection',
    language: 'python',
    code: `import os
import subprocess

def ping_host(hostname):
    # VULNERABLE: User input directly passed to shell
    os.system(f"ping -c 1 {hostname}")
    
def traceroute(ip_address):
    # VULNERABLE: Same issue with subprocess
    subprocess.run(["traceroute", ip_address], shell=True)
`
  },
  {
    id: 'path-traversal',
    name: 'Path Traversal',
    language: 'python',
    code: `from flask import Flask, send_from_directory
import os

app = Flask(__name__)

@app.route('/download')
def download_file():
    # VULNERABLE: No sanitization of user input
    filename = request.args.get('file')
    return send_from_directory('uploads', filename)
`
  },
  {
    id: 'secure-example',
    name: 'Secure Code Example',
    language: 'python',
    code: `import sqlite3
from typing import Optional

def login(username: str, password: str) -> Optional[dict]:
    # SECURE: Using parameterized queries prevents SQL injection
    query = "SELECT id, username FROM users WHERE username = ? AND password = ?"
    
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(query, (username, password))
    user = cursor.fetchone()
    
    if user:
        return {"id": user[0], "username": user[1]}
    return None
`
  }
];
