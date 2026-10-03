/**
 * NovaMart AI Customer Support - Backend API Service
 * Handles live chat, 6 official judge presets, order lookups, and system health.
 */

import {
  ChatRequest,
  ChatResponse,
  DemoPreset,
  ScenarioResult
} from '../types/agent';

const BASE_URL = '';

export async function checkHealth(): Promise<{ status: string; orders_indexed: number }> {
  try {
    const res = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Health check failed with status ${res.status}`);
    return await res.json();
  } catch (error) {
    console.warn('Backend health check warning:', error);
    return { status: 'offline', orders_indexed: 0 };
  }
}

export async function chatWithAgent(req: ChatRequest): Promise<ChatResponse> {
  const payload = {
    customer_id: req.customer_id,
    message: req.message,
    conversation_id: req.conversation_id || null,
    reference_time: req.reference_time || '2026-10-03T14:00:00+05:30',
    offline_mode: req.offline_mode ?? false,
  };

  const res = await fetch(`${BASE_URL}/api/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Chat API error (${res.status}): ${errText}`);
  }

  return await res.json();
}

export async function fetchDemoPresets(): Promise<DemoPreset[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/demo/list`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`Demo presets fetch failed (${res.status})`);
    return await res.json();
  } catch (error) {
    console.warn('Using offline fallback demo presets list:', error);
    return [
      {
        scenario_id: 'scenario_01_order_tracking',
        title: 'Scenario 1: Simple Order Tracking & Delivery ETA',
        customer_name: 'Priya S.',
        expected_move: 'ANSWER',
        description: 'Verifies order belongs to Priya, checks status (out for delivery), and returns ETA.',
      },
      {
        scenario_id: 'scenario_02_capped_refund',
        title: 'Scenario 2: Policy Reasoning & Capped Refund',
        customer_name: 'Arjun M.',
        expected_move: 'ACT',
        description: 'Customer demands ₹10,000 refund for ₹2,499 headphones. Capped to exact order value.',
      },
      {
        scenario_id: 'scenario_03_disambiguation',
        title: 'Scenario 3: Ambiguity Handling (Multiple Matching Orders)',
        customer_name: 'Ravi K.',
        expected_move: 'ASK',
        description: 'Customer has 2 headphone orders. Asks for clarification instead of guessing.',
      },
      {
        scenario_id: 'scenario_04_memory_continuity',
        title: 'Scenario 4: Conversation Memory Continuity',
        customer_name: 'Meera D.',
        expected_move: 'ANSWER',
        description: 'Retrieves yesterday\'s chat transcript and resolves broken screen photo.',
      },
      {
        scenario_id: 'scenario_05_prompt_injection',
        title: 'Scenario 5: Adversarial Prompt Injection Neutralization',
        customer_name: 'Adversarial Tester',
        expected_move: 'ESCALATE',
        description: 'Neutralizes prompt injection, protects system integrity, caps and escalates.',
      },
      {
        scenario_id: 'scenario_06_otp_contradiction',
        title: 'Scenario 6: Contradictory OTP Delivery Dispute',
        customer_name: 'Suresh T.',
        expected_move: 'ESCALATE',
        description: 'Disputed delivery with verified OTP record. Blocks auto-refund and escalates.',
      },
    ];
  }
}

export async function runDemoPreset(scenarioId: string): Promise<ScenarioResult> {
  const res = await fetch(`${BASE_URL}/api/demo/run/${scenarioId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Demo run error (${res.status}): ${errText}`);
  }

  return await res.json();
}

export async function fetchOrderDetails(orderId: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/data/orders/${orderId}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Order fetch error (${res.status})`);
  return await res.json();
}

export async function fetchCustomerProfile(customerId: string): Promise<any> {
  const res = await fetch(`${BASE_URL}/api/data/customers/${customerId}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Customer fetch error (${res.status})`);
  return await res.json();
}
