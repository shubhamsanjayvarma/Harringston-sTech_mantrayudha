# Layer 6: Observability, Telemetry & SRE Reliability Engineering

> **Scope & Authority:** This document establishes the production observability standards, site reliability engineering (SRE) mathematical models, distributed telemetry pipelines, and incident response mechanics. AI coding agents and platform engineers must implement these contracts to ensure all systems are fully observable, diagnosable, and resilient against alert fatigue.

---

## 1. Executive Observability Topology

```
                         ENTERPRISE DISTRIBUTED TELEMETRY PIPELINE
                         
   [ Application Pods (App / Sidecar) ]
     │ (mTLS / OTLP gRPC :4317)
     ▼
   ┌─────────────────────────────────────────────────────────────┐
   │ Agent Tier: DaemonSet / Local Sidecar OTel Collector       │
   │  - PII Scrubbing (Regex masking on Bearer, SSN, PAN)        │
   │  - Compression: Snappy / ZSTD                               │
   │  - LoadBalancing Exporter (Trace-ID Consistent Hashing)     │
   └──────────────────────────────┬──────────────────────────────┘
                                  │ (Routing by TraceID)
                                  ▼
   ┌─────────────────────────────────────────────────────────────┐
   │ Gateway Tier: Clustered OTel Collectors (Tail-Sampling)     │
   │  - MemoryLimiter Processor (Hard ceiling to prevent OOM)     │
   │  - Tail-Based Sampling (100% Errors & p99, 1% 200 OKs)       │
   └──────────────┬───────────────┬────────────────┬─────────────┘
                  │               │                │
        (Traces)  │      (Logs)   │       (Metrics)│
                  ▼               ▼                ▼
   ┌──────────────────────┐ ┌──────────────┐ ┌───────────────────┐
   │ Distributed Tracing  │ │ Log Archive  │ │ Metrics Engine    │
   │ (Jaeger / Tempo)     │ │ (OpenSearch) │ │ (Prometheus/Thanos│
   └──────────────────────┘ └──────────────┘ └───────────────────┘
```

---

## 2. SRE Reliability Metrics & Multi-Burn-Rate Alerting

```yaml
sre_cardinal_definitions:
  sli: "Quantifiable metric observed in production: (Good Events / Total Events) * 100"
  slo: "Target reliability threshold over a 30-day rolling window (e.g., 99.9%)"
  error_budget: "Permissible unreliability: ErrorBudget = 1 - SLO (0.1% for 99.9%)"
  burn_rate: "Rate at which the error budget is consumed relative to standard exhaustion"
```

### 2.1 Multi-Window Multi-Burn-Rate Mathematical Formulation

Static alert thresholds (e.g., "CPU > 80%" or "Error Rate > 1%") generate catastrophic false positives during traffic troughs or miss critical budget-draining anomalies. Production alerting must adhere to the **Google SRE Multi-Window Multi-Burn-Rate Standard**.

#### The Burn Rate Equation:
$$B = \frac{\text{Observed Error Rate}}{\text{Permissible Error Budget}} = \frac{e / N}{1 - \text{SLO}}$$
- $B = 1.0$: Exactly $100\%$ of the 30-day error budget will be consumed in 30 days.
- $B = 14.4$: Consumes $2\%$ of the monthly budget in 1 hour (Sev-1 Critical Emergency).
- $B = 6.0$: Consumes $5\%$ of the monthly budget in 6 hours (Sev-1 Urgent Page).
- $B = 1.0$: Consumes $10\%$ of the monthly budget in 3 days (Sev-2 Ticket / Ticket-Tracked).

```yaml
google_sre_multi_burn_rate_matrix:
  sev1_flash_burn:
    severity: "PAGE (Sev-1 Immediate Escalation)"
    budget_consumed: "2.0% in 1 hour"
    long_window: "1 hour (Burn Rate >= 14.4)"
    short_window: "5 minutes (Burn Rate >= 14.4)"
    rationale: "Requires short-window verification to ensure outage is actively ongoing"
  sev1_sustained_burn:
    severity: "PAGE (Sev-1 Immediate Escalation)"
    budget_consumed: "5.0% in 6 hours"
    long_window: "6 hours (Burn Rate >= 6.0)"
    short_window: "30 minutes (Burn Rate >= 6.0)"
    rationale: "Detects medium-intensity burns draining budget before engineers log in"
  sev2_slow_burn:
    severity: "TICKET (Sev-2 Business Hours Next-Day Action)"
    budget_consumed: "10.0% in 3 days"
    long_window: "3 days (Burn Rate >= 1.0)"
    short_window: "6 hours (Burn Rate >= 1.0)"
    rationale: "Prevents death-by-a-thousand-cuts low-frequency budget erosion"
```

---

### 2.2 Low-QPS Statistical Guardrails in PromQL

#### The Low-Throughput False Page Hazard:
In microservices handling low traffic (e.g., $< 2\text{ QPS}$ or internal batch endpoints):
- Over a 5-minute window, total requests $N = 300$.
- If a single request fails ($e = 1$), the observed error rate is $\frac{1}{300} = 0.333\%$.
- Against a $99.9\%$ SLO (Error budget $= 0.1\%$), the burn rate computes to:
  $$B = \frac{0.00333}{0.001} = 3.33$$
- In a 1-minute window with 1 error out of 10 requests ($e=1, N=10$), $B = 100.0$, immediately triggering a Sev-1 on-call page for a single transient network retry!

#### Production PromQL Alert Rules with Statistical Guards:
Alert rules must enforce **Sample Volume Thresholds** (`increase() >= 100` total requests and `increase() >= 5` errors) before evaluating burn rate:

```promql
# Sev-1 1-Hour Flash Burn Alert with Low-QPS Statistical Guards
(
  # Long window (1h) burn rate exceeds 14.4
  (
    sum(increase(http_requests_total{status=~"5.."}[1h]))
    /
    sum(increase(http_requests_total[1h]))
  ) > (14.4 * (1 - 0.999))
)
and
(
  # Short window (5m) burn rate exceeds 14.4
  (
    sum(increase(http_requests_total{status=~"5.."}[5m]))
    /
    sum(increase(http_requests_total[5m]))
  ) > (14.4 * (1 - 0.999))
)
and
(
  # Statistical Guard 1: Minimum 100 total requests in 1h window
  sum(increase(http_requests_total[1h])) >= 100
)
and
(
  # Statistical Guard 2: Minimum 5 absolute errors in 1h window
  sum(increase(http_requests_total{status=~"5.."}[1h])) >= 5
)
```

---

## 3. Telemetry Architectural Frameworks

```yaml
telemetry_framework_scope:
  red_method: "Designed for synchronous request-driven services (APIs, Web Services, RPCs)"
  use_method: "Designed for resources (CPUs, Memory, Disks, Network Interfaces, Thread Pools)"
```

### 3.1 The RED Method (Request-Driven Microservices)

For every microservice endpoint:
1. **Rate:** Number of incoming requests per second:
   ```promql
   sum(rate(http_requests_total{job="order-service"}[1m])) by (endpoint, method)
   ```
2. **Errors:** Number of failed requests per second:
   ```promql
   sum(rate(http_requests_total{job="order-service", status=~"5.."}[1m])) by (endpoint)
   ```
3. **Duration:** Execution latency distribution via exponential histogram buckets:
   ```promql
   # Calculate 99th percentile latency over 5m window
   histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{job="order-service"}[5m])) by (le, endpoint))
   ```

---

### 3.2 The USE Method (Resource Utilization & Saturation)

For every hardware and software resource (Brendan Gregg Model):
1. **Utilization:** The time the resource was busy servicing work:
   - *CPU:* `1 - avg(rate(node_cpu_seconds_total{mode="idle"}[1m]))`
   - *Disk I/O:* `rate(node_disk_io_time_seconds_total[1m])`
2. **Saturation:** The degree to which extra work is queued waiting for the resource:
   - *CPU Load:* `node_load1 / count(node_cpu_seconds_total{mode="idle"})`
   - *Memory:* Linux Pressure Stall Information (PSI): `rate(node_pressure_memory_stalled_seconds_total[1m])`
   - *Thread Pool:* `thread_pool_queued_tasks / thread_pool_queue_capacity`
3. **Errors:** Explicit hardware or driver error events:
   - *Network:* `rate(node_network_receive_errs_total[1m])`
   - *Disk:* `rate(node_disk_read_errors_total[1m])`

---

## 4. Distributed Tracing & W3C Context Propagation

```yaml
tracing_axioms:
  context_wire_format: "W3C TraceContext RFC standard: traceparent and tracestate"
  async_messaging: "Batch consumers MUST use SpanLinks instead of parent-child spans"
  tail_sampling: "Buffer in-flight spans in memory to retain 100% of errors and p99 anomalies"
```

### 4.1 W3C TraceContext Wire Standard
Every outbound HTTP header, gRPC metadata block, and Kafka message header must inject the W3C `traceparent` header:
```
traceparent: 00-4bf92f3577b34da6a3ce929d0e0e4736-00f067aa0ba902b7-01
             │  └───────────────┬──────────────┘ └───────┬──────┘ └─┬┘
             │             Trace ID (16B)            Parent ID (8B) TraceFlags (01=Sampled)
          Version (00)
```

- **Tracestate:** Transmits vendor-specific routing state (e.g. `rojo=1,congo=2`).
- **Baggage (`baggage`):** Key-value pairs propagated across boundaries (e.g., `tenant_id=42, tier=enterprise`).
- **Security Boundary Rule:** Ingress gateways MUST strip untrusted client-supplied `baggage` headers to prevent privilege spoofing (`role=admin`).

---

### 4.2 Asynchronous Messaging Invariant: SpanLinks vs. Parent Spans

In asynchronous batch messaging (Apache Kafka, RabbitMQ):
- **The Anti-Pattern (Parent-Child Span):** Setting the producer's message span as the parent of the consumer's batch execution span. If a Kafka consumer polls 500 messages from 500 distinct traces, a single batch execution cannot have 500 parents. Forcing a single parent corrupts the trace duration graph (making a 5ms DB write appear to take 4 hours because the message sat in Kafka).
- **The Mandatory Solution (OpenTelemetry `SpanLink`):**
  1. The consumer starts a fresh independent root trace for the poll/process loop.
  2. Each message unpacked from the batch adds a **`SpanLink`** referencing the producer's original `trace_id` and `span_id`.
  3. Tracing UIs render the causal link without corrupting $p99$ execution times or pinning memory buffers.

---

### 4.3 Tail-Based Sampling Architecture & Heap Sizing Formula

```yaml
tail_sampling_pipeline:
  tier_1_load_balancing_exporter:
    routing: "Hash(TraceID) % GatewayCollectorInstances"
    guarantee: "All spans for a given TraceID arrive at the EXACT same Collector instance"
  tier_2_gateway_collector:
    processors:
      - memory_limiter: "Hard limit; drops non-sampled spans if heap reaches 80%"
      - tail_sampling: "Buffers spans for T_wait = 30 seconds"
    sampling_rules:
      - rule_1: "status.code == ERROR -> 100% Sampled"
      - rule_2: "duration >= 500ms (p99 threshold) -> 100% Sampled"
      - rule_3: "http.status_code == 200 -> 1% Sampled"
```

#### Collector Heap Memory Bounding Formula:
Wire Protobuf representation significantly understates Go heap runtime allocation. To calculate the physical RAM required for a gateway tail-sampling collector:
$$M_{\text{heap}} = R \cdot S_{\text{span}} \cdot \kappa_{\text{heap}} \cdot T_{\text{wait}} \cdot (1 + \mu_{\text{stragglers}}) \cdot (1 + \Phi_{\text{GOGC}})$$

```yaml
heap_calculation_variables:
  r_rate: 50000          # 50,000 spans per second
  s_span: 800            # 800 bytes per wire span
  kappa_heap: 4.5        # Go struct pointer & runtime heap expansion factor
  t_wait: 30             # 30-second trace completion decision window
  mu_stragglers: 0.20    # 20% memory buffer for out-of-order straggler spans
  phi_gogc: 1.0          # GOGC=100 doubling memory footprint before GC sweep
```

$$M_{\text{heap}} = 50,000 \times 800 \times 4.5 \times 30 \times (1 + 0.20) \times (1 + 1.0)$$
$$M_{\text{heap}} = 5,400,000,000 \times 1.20 \times 2.0 = 12.96\text{ GB (Base Heap)}$$
$$\text{Production RSS Ceiling} = \frac{M_{\text{heap}}}{0.75} \approx 17.28\text{ GB RAM}$$

- **Mandatory Invariant:** The `memory_limiter` processor MUST sit directly before `tail_sampling` in the OpenTelemetry pipeline to force emergency drop behavior if heap usage breaches $85\%$.

---

## 5. Structured Logging & Event Correlation

Every log entry must be emitted as a single-line JSON document to `stdout` conforming to the OpenTelemetry / Elastic Common Schema (ECS) standard:

```json
{
  "timestamp": "2026-09-04T20:45:00.123Z",
  "level": "ERROR",
  "service.name": "order-service",
  "service.version": "2.4.1",
  "trace.id": "4bf92f3577b34da6a3ce929d0e0e4736",
  "span.id": "00f067aa0ba902b7",
  "tenant.id": "tenant_enterprise_42",
  "user.id": "usr_99812",
  "message": "Payment authorization rejected by upstream gateway",
  "exception": {
    "type": "PaymentGatewayTimeoutException",
    "message": "Gateway failed to respond within 3000ms",
    "stacktrace": "com.company.payment.GatewayClient.execute(GatewayClient.java:142)..."
  },
  "context": {
    "order_id": "ord_887123",
    "amount_cents": 45000,
    "idempotency_key": "idemp_3fa85f64"
  }
}
```

```yaml
logging_guardrails:
  pii_masking: "All logs must pass through a streaming zero-allocation regex filter masking credit cards (Luhn-matching 16 digits), SSNs, and Authorization headers"
  synchronous_io_ban: "Application code must NEVER execute blocking disk I/O in logger calls; use async lock-free LMAX Disruptor or ring buffer loggers"
```

---

## 6. Symptom-Based Alerting & On-Call Engineering

```yaml
alerting_philosophy:
  cardinal_rule: "Page humans ONLY on user-impacting symptoms, never on speculative causes"
  page_vs_ticket:
    page: "User-facing SLO error budget is burning rapidly; requires immediate human intervention within 15 minutes"
    ticket: "Non-urgent degradation, low burn rate, or redundancy loss (e.g. single disk failure in RAID array)"
  mandatory_alert_metadata:
    runbook_url: "Every page MUST include a direct HTTPS link to a verified step-by-step remediation guide"
    dashboard_url: "Direct link to focused triage dashboard pre-filtered to the alerting service and timeframe"
```

---

## 7. Health Check Taxonomy & Probing Protocol

Conflating health probes creates catastrophic cascading failure loops where a minor database hiccup causes orchestrators to kill and reboot the entire stateless application fleet simultaneously.

```yaml
kubernetes_probe_taxonomy:
  startup_probe:
    purpose: "Determines if the container application has finished initialization (JVM warmup, schema check)"
    failure_action: "Kubelet kills container and restarts according to restartPolicy"
    isolation: "Must check ONLY local in-process initialization; never check external network dependencies"
  liveness_probe:
    purpose: "Determines if the process is in a deadlock, infinite loop, or unrecoverable fatal crash"
    failure_action: "Kubelet kills container and restarts"
    isolation: "STRICTLY LOCAL. Must NEVER ping databases, caches, or downstream microservices. If downstream DB dies, app is NOT dead; restarting app will worsen DB outage!"
  readiness_probe:
    purpose: "Determines if the container is currently ready to receive traffic from the Load Balancer / Ingress"
    failure_action: "Load balancer removes Pod IP from active EndpointSlice; container is NOT killed"
    mechanics: "Verify connection pool availability, local circuit breaker states, and warm cache status"
```
