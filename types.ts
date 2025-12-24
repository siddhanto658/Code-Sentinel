export interface Vulnerability {
  type: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  cweId: string;
  description: string;
  exploitScenario: string;
}

export interface SecurityReport {
  isSecure: boolean;
  score: number; // 0-100
  vulnerabilities: Vulnerability[];
  fixedCode: string;
  summary: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETE = 'COMPLETE',
  ERROR = 'ERROR'
}

export interface AppState {
  code: string;
  fileName: string;
  status: AnalysisStatus;
  report: SecurityReport | null;
  error: string | null;
  hackerMode: boolean;
}