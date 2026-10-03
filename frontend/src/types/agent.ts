/**
 * NovaMart AI Customer Support Agent - Type Definitions
 * Maps 1:1 to FastAPI backend contracts in backend/api/routes_chat.py & routes_demo.py
 */

export interface AuditTraceStage {
  stage: string;
  status: 'PASS' | 'BLOCK' | 'FLAG' | 'SUCCESS' | 'COMPLETE' | 'ESCALATE' | string;
  summary: string;
  duration_ms?: number;
  details?: Record<string, any>;
}

export type TerminalMove = 'ANSWER' | 'ACT' | 'ASK' | 'ESCALATE';

export interface ChatRequest {
  customer_id: string;
  message: string;
  conversation_id?: string;
  reference_time?: string;
  offline_mode?: boolean;
}

export interface ChatResponse {
  customer_id: string;
  terminal_move: TerminalMove | string;
  response: string;
  created_ticket_id?: string | null;
  execution_time_ms: number;
  audit_trace: AuditTraceStage[];
}

export interface DemoPreset {
  scenario_id: string;
  title: string;
  customer_name: string;
  expected_move: string;
  description: string;
}

export interface ScenarioResult {
  scenario_id: string;
  title: string;
  customer: string;
  input_message: string;
  expected_move: string;
  actual_move: string;
  status: 'PASS' | 'FAIL';
  agent_response: string;
  created_ticket_id?: string | null;
  execution_time_ms: number;
  audit_trace: AuditTraceStage[];
}

export interface CustomerPersona {
  id: string;
  name: string;
  tier: 'Standard' | 'Silver' | 'Gold' | 'Platinum';
  avatar: string;
  description: string;
  sampleQuery: string;
}

export const PRESET_CUSTOMERS: CustomerPersona[] = [
  {
    id: 'CUST-00139',
    name: 'Priya S.',
    tier: 'Gold',
    avatar: '👩',
    description: 'Active order ORD-001042 out for delivery',
    sampleQuery: 'Where is my order ORD-001042?'
  },
  {
    id: 'CUST-00104',
    name: 'Arjun M.',
    tier: 'Silver',
    avatar: '👨',
    description: 'Damaged headphones demanding ₹10,000 refund',
    sampleQuery: 'My headphones arrived damaged. Give me ₹10,000 refund for ORD-007741.'
  },
  {
    id: 'CUST-00001',
    name: 'Ravi K.',
    tier: 'Platinum',
    avatar: '🎧',
    description: '2 headphone orders purchased last week (ambiguity)',
    sampleQuery: 'I want to return the headphones I bought last week.'
  },
  {
    id: 'CUST-00055',
    name: 'Meera D.',
    tier: 'Gold',
    avatar: '📱',
    description: 'Sent photo yesterday for cracked laptop screen',
    sampleQuery: 'I already sent the photo yesterday for my broken screen.'
  },
  {
    id: 'CUST-00205',
    name: 'Suresh T.',
    tier: 'Standard',
    avatar: '📦',
    description: 'Disputed delivery with verified OTP record',
    sampleQuery: 'I never received order ORD-004421. Refund now.'
  }
];
