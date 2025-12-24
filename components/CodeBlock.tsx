import React from 'react';

interface CodeBlockProps {
  code: string;
  label?: string;
  variant?: 'normal' | 'secure' | 'danger';
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, label, variant = 'normal' }) => {
  let borderColor = 'border-cyber-gray';
  let bgColor = 'bg-cyber-dark';

  if (variant === 'secure') {
    borderColor = 'border-cyber-success/30';
    bgColor = 'bg-emerald-950/20';
  } else if (variant === 'danger') {
    borderColor = 'border-cyber-danger/30';
    bgColor = 'bg-rose-950/20';
  }

  return (
    <div className={`relative rounded-lg border ${borderColor} ${bgColor} overflow-hidden font-mono text-sm shadow-sm group`}>
      {label && (
        <div className={`absolute top-0 left-0 px-3 py-1 text-xs font-bold uppercase tracking-wider ${
          variant === 'secure' ? 'bg-cyber-success text-black' : 
          variant === 'danger' ? 'bg-cyber-danger text-black' : 'bg-cyber-gray text-cyber-dim'
        }`}>
          {label}
        </div>
      )}
      <div className="p-4 pt-8 overflow-x-auto">
        <pre className="whitespace-pre">
          <code className="text-cyber-text">{code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeBlock;