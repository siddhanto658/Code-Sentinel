import React, { useState, useEffect } from 'react';
import { analyzeCodeSecurity } from './services/groqService';
import { AppState, AnalysisStatus, Vulnerability } from './types';
import { ShieldCheck, ShieldAlert, Loader2, Code2, Upload, ArrowRightLeft, History, ChevronDown } from './components/Icons';
import CodeBlock from './components/CodeBlock';
import VulnerabilityCard from './components/VulnerabilityCard';
import { demoExamples } from './data/demoExamples';

const INITIAL_CODE_PLACEHOLDER = `# Python Example: Insecure Login
import sqlite3

def login(username, password):
    # VULNERABLE: Direct string formatting allows SQL Injection
    query = f"SELECT * FROM users WHERE username = '{username}' AND password = '{password}'"
    
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    cursor.execute(query)
    user = cursor.fetchone()
    
    return user
`;

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    code: INITIAL_CODE_PLACEHOLDER,
    fileName: 'input_script.py',
    status: AnalysisStatus.IDLE,
    report: null,
    error: null,
    hackerMode: false,
    history: []
  });

  const [showDemoDropdown, setShowDemoDropdown] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState<'report' | 'fix' | 'diff'>('report');

  useEffect(() => {
    const savedCode = localStorage.getItem('codesentinel_code');
    const savedHistory = localStorage.getItem('codesentinel_history');
    if (savedCode) {
      setState(prev => ({ ...prev, code: savedCode }));
    }
    if (savedHistory) {
      setState(prev => ({ ...prev, history: JSON.parse(savedHistory) }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('codesentinel_code', state.code);
  }, [state.code]);

  const saveToHistory = (report: any) => {
    const historyItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      code: state.code,
      fileName: state.fileName,
      isSecure: report.isSecure,
      score: report.score,
      vulnerabilityCount: report.vulnerabilities.length,
      hackerMode: state.hackerMode
    };
    const newHistory = [historyItem, ...state.history].slice(0, 20);
    setState(prev => ({ ...prev, history: newHistory }));
    localStorage.setItem('codesentinel_history', JSON.stringify(newHistory));
  };

  const handleDemoSelect = (demo: any) => {
    setState(prev => ({
      ...prev,
      code: demo.code,
      fileName: `demo_${demo.id}.${demo.language === 'javascript' ? 'js' : 'py'}`,
      status: AnalysisStatus.IDLE,
      report: null,
      error: null
    }));
    setShowDemoDropdown(false);
  };

  const loadFromHistory = (item: HistoryItem) => {
    setState(prev => ({
      ...prev,
      code: item.code,
      fileName: item.fileName,
      status: AnalysisStatus.IDLE,
      report: null,
      error: null,
      hackerMode: item.hackerMode
    }));
    setShowHistory(false);
  };

  const handleScan = async () => {
    if (!state.code.trim()) return;
    
    setState(prev => ({ ...prev, status: AnalysisStatus.ANALYZING, error: null, report: null }));
    
    try {
      const report = await analyzeCodeSecurity(state.code, state.hackerMode);
      setState(prev => ({ ...prev, status: AnalysisStatus.COMPLETE, report }));
      saveToHistory(report);
    } catch (err: any) {
      setState(prev => ({ 
        ...prev, 
        status: AnalysisStatus.ERROR, 
        error: err.message || "An unexpected error occurred during analysis." 
      }));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setState(prev => ({
          ...prev,
          code: event.target?.result as string,
          fileName: file.name,
          report: null, // Reset report on new file
          status: AnalysisStatus.IDLE
        }));
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-cyber-black text-cyber-text font-sans selection:bg-cyber-accent selection:text-black">
      
      {/* Header */}
      <header className="border-b border-cyber-gray bg-cyber-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyber-accent to-blue-600 flex items-center justify-center text-black font-bold">
              <Code2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white">
              Code<span className="text-cyber-accent">Sentinel</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setShowDemoDropdown(!showDemoDropdown)}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyber-gray hover:bg-gray-700 text-xs text-white transition-colors"
              >
                <Code2 className="w-3 h-3" />
                Demo Examples
                <ChevronDown className={`w-3 h-3 transition-transform ${showDemoDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showDemoDropdown && (
                <div className="absolute top-full mt-1 right-0 w-56 bg-cyber-dark border border-cyber-gray rounded-lg shadow-xl z-50 overflow-hidden">
                  {demoExamples.map(demo => (
                    <button
                      key={demo.id}
                      onClick={() => handleDemoSelect(demo)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-cyber-gray transition-colors flex items-center justify-between"
                    >
                      <span className="text-white">{demo.name}</span>
                      <span className="text-xs text-cyber-dim">{demo.language}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button 
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2 px-3 py-1.5 rounded bg-cyber-gray hover:bg-gray-700 text-xs text-white transition-colors"
              >
                <History className="w-3 h-3" />
                History ({state.history.length})
              </button>
              {showHistory && (
                <div className="absolute top-full mt-1 right-0 w-72 bg-cyber-dark border border-cyber-gray rounded-lg shadow-xl z-50 overflow-hidden max-h-80 overflow-y-auto">
                  {state.history.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-cyber-dim">No scan history yet</div>
                  ) : (
                    state.history.map(item => (
                      <button
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-cyber-gray transition-colors border-b border-cyber-gray/30"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-white truncate">{item.fileName}</span>
                          <span className={`text-xs ${item.isSecure ? 'text-cyber-success' : 'text-cyber-danger'}`}>
                            {item.score}/100
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-cyber-dim">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-cyber-dim">
                            {item.vulnerabilityCount} issues
                          </span>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <label className="flex items-center cursor-pointer gap-2 group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={state.hackerMode}
                  onChange={(e) => setState(prev => ({ ...prev, hackerMode: e.target.checked }))}
                />
                <div className={`w-10 h-6 rounded-full transition-colors ${state.hackerMode ? 'bg-cyber-danger' : 'bg-cyber-gray'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${state.hackerMode ? 'translate-x-4' : 'translate-x-0'}`}></div>
              </div>
              <span className={`text-sm font-mono uppercase tracking-wider ${state.hackerMode ? 'text-cyber-danger' : 'text-gray-500'}`}>
                Hacker Mode
              </span>
            </label>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-4rem)]">
        
        {/* Left Column: Input */}
        <div className="flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-widest text-cyber-dim">Source Input</h2>
            <div className="flex gap-2">
              <label className="cursor-pointer px-3 py-1.5 rounded bg-cyber-gray hover:bg-gray-800 text-xs text-white flex items-center gap-2 transition-colors">
                <Upload className="w-3 h-3" />
                Upload File
                <input type="file" className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
          </div>
          
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyber-accent to-purple-600 rounded-lg opacity-20 group-hover:opacity-40 transition duration-500 blur"></div>
            <textarea
              value={state.code}
              onChange={(e) => setState(prev => ({ ...prev, code: e.target.value }))}
              className="relative w-full h-full bg-cyber-dark border border-cyber-gray rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:border-cyber-accent focus:ring-1 focus:ring-cyber-accent transition-all text-gray-300 leading-relaxed"
              spellCheck={false}
              placeholder="// Paste your code here..."
            />
          </div>

          <button
            onClick={handleScan}
            disabled={state.status === AnalysisStatus.ANALYZING || !state.code}
            className={`w-full py-4 rounded-lg font-bold text-lg uppercase tracking-widest transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
              state.status === AnalysisStatus.ANALYZING
                ? 'bg-cyber-gray text-gray-400 cursor-not-allowed'
                : 'bg-white text-black hover:bg-cyber-accent hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]'
            }`}
          >
            {state.status === AnalysisStatus.ANALYZING ? (
              <>
                <Loader2 className="animate-spin" /> Analyzing...
              </>
            ) : (
              <>
                <ShieldCheck /> Scan for Vulnerabilities
              </>
            )}
          </button>
        </div>

        {/* Right Column: Output */}
        <div className="flex flex-col h-full overflow-hidden bg-cyber-dark/50 border border-cyber-gray/50 rounded-xl backdrop-blur-sm">
          {state.status === AnalysisStatus.IDLE && (
            <div className="flex-1 flex flex-col items-center justify-center text-cyber-dim gap-4 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-cyber-gray/50 flex items-center justify-center">
                <Code2 className="w-10 h-10 opacity-50" />
              </div>
              <p>Ready to audit. Paste code and initiate scan.</p>
              <p className="text-xs max-w-xs opacity-50">Supported: Python, JS, Java, Go, C++, SQL and more.</p>
            </div>
          )}

          {state.status === AnalysisStatus.ANALYZING && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-cyber-gray rounded-full"></div>
                <div className="absolute top-0 left-0 w-16 h-16 border-4 border-cyber-accent rounded-full animate-spin border-t-transparent"></div>
              </div>
              <div className="text-center">
                <h3 className="text-white font-bold text-lg animate-pulse">Analyzing Logic...</h3>
                <p className="text-cyber-dim text-sm mt-2 font-mono">Comparing against CWE patterns</p>
                {state.hackerMode && <p className="text-cyber-danger text-xs mt-1 font-mono uppercase">Red Team Agents Active</p>}
              </div>
            </div>
          )}
          
          {state.status === AnalysisStatus.ERROR && (
             <div className="flex-1 flex flex-col items-center justify-center text-cyber-danger gap-4 p-8 text-center">
                <ShieldAlert className="w-16 h-16" />
                <h3 className="text-xl font-bold">Analysis Failed</h3>
                <p className="text-sm opacity-80">{state.error}</p>
             </div>
          )}

          {state.status === AnalysisStatus.COMPLETE && state.report && (
            <div className="flex flex-col h-full">
              {/* Report Header */}
              <div className={`p-6 border-b ${state.report.isSecure ? 'border-cyber-success/20 bg-emerald-950/10' : 'border-cyber-danger/20 bg-rose-950/10'}`}>
                <div className="flex justify-between items-center mb-4">
                   <div className="flex items-center gap-3">
                     {state.report.isSecure ? (
                       <div className="bg-cyber-success text-black p-2 rounded-lg"><ShieldCheck /></div>
                     ) : (
                       <div className="bg-cyber-danger text-black p-2 rounded-lg"><ShieldAlert /></div>
                     )}
                     <div>
                       <h2 className={`text-2xl font-bold ${state.report.isSecure ? 'text-cyber-success' : 'text-cyber-danger'}`}>
                         {state.report.isSecure ? 'Secure Code' : 'Vulnerabilities Detected'}
                       </h2>
                       <p className="text-xs text-cyber-dim font-mono uppercase tracking-wider">
                         Security Score: <span className="text-white">{state.report.score}/100</span>
                       </p>
                     </div>
                   </div>
                   <div className="text-right">
                      <div className="text-xs text-cyber-dim uppercase">Total Issues</div>
                      <div className="text-2xl font-bold text-white">{state.report.vulnerabilities.length}</div>
                   </div>
                </div>
                <p className="text-sm text-gray-300 leading-relaxed border-l-2 border-gray-700 pl-3">
                  {state.report.summary}
                </p>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-cyber-gray">
                <button 
                  onClick={() => setActiveTab('report')}
                  className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'report' ? 'border-cyber-accent text-cyber-accent bg-cyber-accent/5' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                  Audit Report
                </button>
                <button 
                  onClick={() => setActiveTab('fix')}
                  className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'fix' ? 'border-cyber-success text-cyber-success bg-cyber-success/5' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                  Patched Code
                </button>
                <button 
                   onClick={() => setActiveTab('diff')}
                   className={`flex-1 py-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'diff' ? 'border-blue-400 text-blue-400 bg-blue-400/5' : 'border-transparent text-gray-500 hover:text-white'}`}
                >
                  Diff View
                </button>
              </div>

              {/* Tab Content */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                {activeTab === 'report' && (
                  <div className="space-y-4">
                     {state.report.vulnerabilities.length === 0 ? (
                       <div className="text-center py-10 opacity-50">
                          <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-cyber-success" />
                          <p>No evident security flaws found.</p>
                       </div>
                     ) : (
                       state.report.vulnerabilities.map((vuln, idx) => (
                         <VulnerabilityCard key={idx} vuln={vuln} hackerMode={state.hackerMode} />
                       ))
                     )}
                  </div>
                )}
                
                {activeTab === 'fix' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-2">
                       <h3 className="text-sm text-cyber-success uppercase font-bold tracking-widest">Remediation</h3>
                       <button 
                         onClick={() => navigator.clipboard.writeText(state.report?.fixedCode || '')}
                         className="text-xs bg-cyber-gray hover:bg-gray-700 px-3 py-1 rounded text-white transition-colors"
                       >
                         Copy Code
                       </button>
                    </div>
                    <CodeBlock code={state.report.fixedCode} label="Patched" variant="secure" />
                  </div>
                )}

                {activeTab === 'diff' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                    <div className="space-y-2">
                      <div className="text-xs text-cyber-danger font-bold uppercase tracking-wider text-center bg-cyber-danger/10 py-1 rounded">Original (Vulnerable)</div>
                      <div className="text-[10px] sm:text-xs overflow-auto h-[500px] bg-rose-950/10 border border-cyber-danger/30 rounded p-2 font-mono text-gray-400">
                        <pre>{state.code}</pre>
                      </div>
                    </div>
                     {/* Mobile arrow */}
                    <div className="md:hidden flex justify-center text-gray-500"><ArrowRightLeft className="rotate-90" /></div>
                    
                    <div className="space-y-2">
                      <div className="text-xs text-cyber-success font-bold uppercase tracking-wider text-center bg-cyber-success/10 py-1 rounded">Fixed (Secure)</div>
                      <div className="text-[10px] sm:text-xs overflow-auto h-[500px] bg-emerald-950/10 border border-cyber-success/30 rounded p-2 font-mono text-gray-300">
                        <pre>{state.report.fixedCode}</pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;