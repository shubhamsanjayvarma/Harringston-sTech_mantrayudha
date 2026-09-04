# Layer 3: Low-Level Design (LLD), Object-Oriented Architecture & Concurrency

> **Scope & Authority:** This document establishes the code-level architecture, object-oriented patterns, concurrency bounds, and tactical domain models for all software developed in this project. Autonomous AI coding agents and developers must strictly follow these structural blueprints to produce maintainable, thread-safe, and scalable codebases.

---

## 1. Domain-Driven Design (DDD) Tactical Patterns

```
┌────────────────────────────────────────────────────────────────────────┐
│                      TACTICAL DDD ARCHITECTURE MAP                     │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                      BOUNDED CONTEXT                           │   │
│   │                                                                │   │
│   │   ┌─────────────────────── AGGREGATE ──────────────────────┐   │   │
│   │   │                                                        │   │   │
│   │   │   [ AGGREGATE ROOT ] (Enforces Invariants)             │   │   │
│   │   │        │                                               │   │   │
│   │   │        ├── [ Internal Entities ] (Local ID Only)       │   │   │
│   │   │        └── [ Value Objects ] (Immutable, Self-valid)   │   │   │
│   │   │                                                        │   │   │
│   │   │   Reference external aggregates by ID ONLY ────────┐   │   │   │
│   │   └───────────────────────┬────────────────────────────┼───┘   │   │
│   │                           │ Records                    │       │   │
│   │                           ▼                            ▼       │   │
│   │                   [ Domain Events ]             [ Other AR ID ]│   │
│   │                           │                                    │   │
│   │   ┌───────────────────────┴────────────────────────────────┐   │   │
│   │   │ Unit of Work: Commits AR + Outbox in 1 Local ACID TX   │   │   │
│   │   └────────────────────────────────────────────────────────┘   │   │
│   │                                                                │   │
│   │   [ WRITE SIDE: Repositories for Aggregate Roots ONLY ]        │   │   │
│   │   [ READ SIDE:  CQRS Bypass -> Query Projections / DTOs ]      │   │   │
│   └────────────────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────────────────┘
```

### 1.1 Value Objects (VO) vs. Entities

```yaml
ddd_object_classification:
  entity:
    identity: "Unique, explicit lifecycle ID (UUIDv7, Natural Key)"
    equality: "Identity equality (a.id === b.id)"
    mutability: "Mutable over continuous lifecycle via domain methods"
    invariant_enforcement: "Enforced at method boundaries"
  value_object:
    identity: "Zero identity; defined entirely by its structural attributes"
    equality: "Structural equality (all attributes must match)"
    mutability: "Strictly immutable; modifications return a new instance"
    invariant_enforcement: "Self-validating in constructor; cannot exist in invalid state"
```

#### Value Object Production Implementation
```typescript
// Production Value Object: Money with Integer Minor Units & Invariant Self-Validation
export class Money {
  public readonly amountInCents: bigint; // Integer minor units eliminate IEEE 754 precision drift
  public readonly currency: string;

  constructor(amountInCents: bigint, currency: string) {
    if (amountInCents < 0n) {
      throw new DomainRuleViolationError("Money amount must be non-negative.");
    }
    if (!currency || currency.length !== 3) {
      throw new DomainRuleViolationError("Currency must be a valid 3-letter ISO-4217 code.");
    }
    this.amountInCents = amountInCents;
    this.currency = currency.toUpperCase();
    Object.freeze(this); // Guarantees runtime immutability
  }

  public static fromMajorUnits(amount: number, currency: string): Money {
    if (!Number.isFinite(amount) || amount < 0) {
      throw new DomainRuleViolationError("Money amount must be a finite, non-negative number.");
    }
    const cents = BigInt(Math.round(amount * 100));
    return new Money(cents, currency);
  }

  public equals(other: Money): boolean {
    return this.amountInCents === other.amountInCents && this.currency === other.currency;
  }

  public add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new DomainRuleViolationError(`Cannot add currency ${other.currency} to ${this.currency}.`);
    }
    return new Money(this.amountInCents + other.amountInCents, this.currency);
  }

  public multiply(factor: number): Money {
    if (factor < 0) throw new DomainRuleViolationError("Factor cannot be negative.");
    const scaledCents = BigInt(Math.round(Number(this.amountInCents) * factor));
    return new Money(scaledCents, this.currency);
  }
}
```

---

### 1.2 The Three Inviolate Laws of Aggregate Roots (AR)

1. **Law 1: Reference External Aggregates by Identity (ID) ONLY:**
   - Aggregates must **NEVER** hold direct object references or ORM relationship mappings (`@OneToMany`, `@ManyToOne`) to other Aggregate Roots.
   - An `Order` aggregate must store `customerId: CustomerId`, **NOT** `customer: Customer`. Direct object references destroy transactional boundaries, cause cascading object hydration, and trigger deadlocks.
2. **Law 2: One Aggregate Per Transaction Rule:**
   - A single local database transaction must mutate at most **ONE** Aggregate Root.
   - If a business process requires mutating multiple aggregates, execute the first mutation in Transaction 1, emit a Domain Event, and mutate the second aggregate asynchronously via an Event Handler / Saga. Mutating multiple aggregates in one transaction is an architectural boundary violation.
3. **Law 3: Immediate vs. Eventual Consistency Sizing:**
   - Aggregates must be sized strictly to encapsulate **immediate, zero-delay transactional invariants**.
   - If a business rule can tolerate even $100\text{ms}$ of latency before consistency is achieved, it belongs across distinct aggregates coordinated via events.

---

### 1.3 CQRS at the Code Level: Repositories vs. Query Handlers

```yaml
cqrs_code_contracts:
  write_side:
    target: "Aggregate Roots ONLY"
    abstraction: "interface OrderRepository { save(order: Order): Promise<void>; findById(id: OrderId): Promise<Order | null>; }"
    prohibitions: "Zero partial hydration; zero DTO projections; zero UI joins"
  read_side:
    target: "Direct Read Projections / DTOs"
    abstraction: "interface OrderQueries { getDashboardMetrics(filter: Filter): Promise<DashboardDTO>; }"
    mechanics: "Bypasses domain models and repositories; queries database views via raw SQL/Jooq/Dapper"
```

#### Concrete DDD Aggregate Root with Outbox Event Collection
```typescript
export class Order { // Aggregate Root
  private readonly _items: OrderItem[] = [];
  private _status: OrderStatus = OrderStatus.DRAFT;
  private _version: number;
  private readonly _uncommittedEvents: DomainEvent[] = [];

  constructor(
    public readonly id: OrderId,
    public readonly customerId: CustomerId, // Referenced by ID ONLY
    version = 0
  ) {
    this._version = version;
  }

  public addItem(productId: ProductId, unitPrice: Money, quantity: number): void {
    if (this._status !== OrderStatus.DRAFT) {
      throw new DomainRuleViolationError("Cannot mutate items on a non-draft order.");
    }
    if (quantity <= 0) throw new DomainRuleViolationError("Quantity must be positive.");

    const existing = this._items.find(i => i.productId.equals(productId));
    if (existing) {
      existing.incrementQuantity(quantity);
    } else {
      this._items.push(new OrderItem(new OrderItemId(crypto.randomUUID()), productId, unitPrice, quantity));
    }
  }

  public place(): void {
    if (this._items.length === 0) throw new DomainRuleViolationError("Cannot place an empty order.");
    this._status = OrderStatus.PLACED;

    // Collect Domain Event with calculated total
    this._uncommittedEvents.push(new OrderPlacedEvent(this.id, this.customerId, this.calculateTotal()));
  }

  private calculateTotal(): Money {
    if (this._items.length === 0) {
      return new Money(0n, "USD");
    }
    const currency = this._items[0].unitPrice.currency;
    let totalCents = 0n;
    for (const item of this._items) {
      if (item.unitPrice.currency !== currency) {
        throw new DomainRuleViolationError("Mixed currencies within order are not supported.");
      }
      totalCents += item.unitPrice.amountInCents * BigInt(item.quantity);
    }
    return new Money(totalCents, currency);
  }

  public pullUncommittedEvents(): DomainEvent[] {
    const events = [...this._uncommittedEvents];
    this._uncommittedEvents.length = 0;
    return events;
  }

  public get version(): number { return this._version; }
}
```

---

## 2. Gang of Four (GoF) Patterns: Enterprise Taxonomy

```yaml
gof_enterprise_matrix:
  creational:
    - pattern: "Factory Method"
      use_case: "Pluggable driver instantiation (PostgreSQL vs SQLite)"
    - pattern: "Step-Builder"
      use_case: "Compile-time enforcement of parameter ordering for complex requests"
    - pattern: "Thread-Safe Singleton"
      use_case: "IoC/DI container-managed singleton scope (never manual static state)"
  structural:
    - pattern: "Adapter"
      use_case: "Wrapping third-party SDKs into clean domain Port interfaces"
    - pattern: "Decorator"
      use_case: "Transparent caching, rate limiting, and telemetry wrappers"
    - pattern: "Facade"
      use_case: "Providing unified simplified API over complex multi-step subsystems"
    - pattern: "Proxy"
      use_case: "Lazy loading, RBAC authorization, and latency tracking"
  behavioral:
    - pattern: "Strategy"
      use_case: "Polymorphic business rule execution replacing switch statements"
    - pattern: "Command"
      use_case: "Encapsulating requests for task queuing, undo, and transactional pipelines"
    - pattern: "State"
      use_case: "Finite state machine (FSM) transitions for lifecycle entities"
    - pattern: "Chain of Responsibility"
      use_case: "Middleware pipelines and security request filtering"
```

### 2.1 Step-Builder Pattern: Compile-Time Ordering Enforcement
Telescoping constructors with 10 optional arguments cause runtime bugs. The **Step-Builder** uses interface staging to enforce required fields sequentially at compile time:

```typescript
// Type-safe Step Builder Interfaces
interface WithUrl { setUrl(url: string): WithMethod; }
interface WithMethod { setMethod(method: "GET" | "POST"): OptionalSteps; }
interface OptionalSteps {
  setHeader(key: string, value: string): OptionalSteps;
  setTimeoutMs(timeout: number): OptionalSteps;
  build(): HttpRequest;
}

export class HttpRequestBuilder implements WithUrl, WithMethod, OptionalSteps {
  private url!: string;
  private method!: "GET" | "POST";
  private headers: Record<string, string> = {};
  private timeoutMs = 5000;

  public static create(): WithUrl { return new HttpRequestBuilder(); }

  public setUrl(url: string): WithMethod { this.url = url; return this; }
  public setMethod(method: "GET" | "POST"): OptionalSteps { this.method = method; return this; }
  public setHeader(key: string, value: string): OptionalSteps { this.headers[key] = value; return this; }
  public setTimeoutMs(timeout: number): OptionalSteps { this.timeoutMs = timeout; return this; }

  public build(): HttpRequest {
    return new HttpRequest(this.url, this.method, Object.freeze(this.headers), this.timeoutMs);
  }
}

// Enforces valid sequence at compile time:
HttpRequestBuilder.create()
  .setUrl("https://api.domain.com/v1/orders")
  .setMethod("POST")
  .setHeader("Authorization", "Bearer token")
  .build();
```

---

### 2.2 Decorator Pattern: Transparent Caching & Telemetry Wrapper
Decorators dynamically wrap core functionality while maintaining identical interfaces, satisfying OCP and SRP:

```typescript
export interface QueryHandler<TQuery, TResult> {
  handle(query: TQuery): Promise<TResult>;
}

// 1. Core Domain Handler
export class GetUserProfileHandler implements QueryHandler<GetUserQuery, UserProfile> {
  constructor(private readonly userRepo: UserRepository) {}
  public async handle(query: GetUserQuery): Promise<UserProfile> {
    return this.userRepo.getById(query.userId);
  }
}

// 2. Transparent Caching Decorator
export class CachingQueryDecorator<TQuery extends { cacheKey: string }, TResult> 
  implements QueryHandler<TQuery, TResult> {
  constructor(
    private readonly inner: QueryHandler<TQuery, TResult>,
    private readonly cache: CacheStore
  ) {}

  public async handle(query: TQuery): Promise<TResult> {
    const cached = await this.cache.get<TResult>(query.cacheKey);
    if (cached) return cached;

    const fresh = await this.inner.handle(query);
    await this.cache.set(query.cacheKey, fresh, 60); // 60s TTL
    return fresh;
  }
}
```

---

## 3. Concurrency, Thread Safety & Resource Sizing

### 3.1 Synchronization Primitives & Concurrency Control

```
┌─────────────────┬───────────────────────────────┬───────────────────────────────┐
│ Primitive       │ Mechanism                     │ Primary Use Case              │
├─────────────────┼───────────────────────────────┼───────────────────────────────┤
│ Mutex           │ Mutual exclusion (1 thread)   │ Protecting critical sections  │
│ Semaphore       │ N-resource permit counter     │ Concurrency throttling & pools│
│ Read-Write Lock │ N readers OR 1 writer         │ High-read, low-write caching  │
│ Compare-And-Swap│ Lock-free atomic hardware op  │ Atomic counters, OCC in-memory│
└─────────────────┴───────────────────────────────┴───────────────────────────────┘
```

#### Optimistic Concurrency Control (OCC) vs. Pessimistic Concurrency Control (PCC)
* **OCC (Version Checking):**
  - **Mechanism:** Updates verify `WHERE id = :id AND version = :expectedVersion`.
  - **Best For:** Low-to-moderate contention (reads dominate writes).
  - **Failure Mode:** Retries required on `OptimisticLockException`.
* **PCC (Locking Reads):**
  - **Mechanism:** `SELECT ... FOR UPDATE`.
  - **Best For:** High-contention, low-latency financial balances and limited-quantity inventory reservations.
  - **Deadlock Warning:** Locks must **ALWAYS** be acquired in a globally consistent ordering (e.g., sorting primary IDs ascending before locking).

---

### 3.2 Thread Pool Sizing: Formulas & Mathematical Constraints

#### A. CPU-Bound Tasks (Hashing, Crypto, Compression, JSON Parsing)
$$N_{\text{threads}} = N_{\text{CPU}} + 1$$
*(Any additional threads cause kernel context switching and CPU cache thrashing without increasing throughput).*

#### B. I/O-Bound Tasks (Database queries, HTTP calls, Disk I/O)
Using the **Brian Goetz Formula** (*Java Concurrency in Practice*):
$$N_{\text{threads}} = N_{\text{CPU}} \times U_{\text{target}} \times \left(1 + \frac{W}{C}\right)$$
where $W$ is average wait time, $C$ is compute time, and $U_{\text{target}}$ is target CPU utilization ($0.7\text{--}0.85$).

```
                     BOUNDED THREAD POOL & TRANSITION LAW
  Calculated
  Threads
     ▲
     │  Synchronous OS Thread Pool Regime
     │   (Goetz Formula Valid)
     │       ▲
     │       │
     │       └────► Architectural Transition Point (W/C > 10)
     │              - Synchronous thread pools STRICTLY BANNED
     │              - Transition to Non-Blocking Event Loops / Virtual Threads
     └─────────────────────────────────────────────────────────────►
                                 W/C Ratio
```

#### The Bounded Thread Pool & Architecture Transition Law
1. **Memory Ceiling Constraint:** Thread allocation must be bounded by available stack memory:
   $$N_{\text{threads}} \le \frac{\text{Available Memory Budget}}{\text{Thread Stack Size} \times 1.25}$$
   *(Allocating 2,000 OS threads with $1\text{MB}$ stack consumes $2\text{GB}$ of RAM purely in thread stack overhead).*
2. **The Architectural Transition Law:**
   $$\text{If } \frac{W}{C} > 10 \implies \text{Synchronous OS thread pools are PROHIBITED.}$$
   When waiting exceeds computation by more than $10\times$, the system must transition to **Non-Blocking Asynchronous Event Loops** (Node.js, Netty, Rust Tokio) or **Virtual Threads** (Project Loom).

---

### 3.3 Database Connection Pool Physics (HikariCP Formula)
AI agents frequently misconfigure database pools to 100+ connections, degrading database throughput via context-switch storms. Pools must be sized according to disk spindle and core physics:
$$\text{Max DB Pool Size} = (N_{\text{DB\_cores}} \times 2) + \text{Effective Spindle Count}$$
- *Example:* A 16-core PostgreSQL server with SSD storage: $\text{Pool Size} = (16 \times 2) + 1 = 33 \text{ connections}$.
- **Worker Semaphore Guardrail:** Application worker pools querying the database must be constrained by an async semaphore matching the DB pool size to prevent thread starvation.

---

### 3.4 Deadlock Prevention: The 4 Coffman Conditions
Deadlock occurs **if and only if** all four conditions hold simultaneously:
1. **Mutual Exclusion:** Exclusive resource holding.
2. **Hold and Wait:** Holding a resource while requesting another.
3. **No Preemption:** Resources cannot be confiscated.
4. **Circular Wait:** Closed chain of dependencies ($T_1 \to R_2 \to T_2 \to R_1$).

#### Mandatory Prevention Tactics
- **Global Resource Ordering:** Eliminate Circular Wait. Always acquire locks in ascending lexicographical or numeric order:
  ```typescript
  // Prevent deadlock when transferring money between two accounts
  const [firstId, secondId] = idA < idB ? [idA, idB] : [idB, idA];
  await lock(firstId);
  await lock(secondId);
  ```
- **Lock Acquisition Timeouts:** Eliminate unbounded Hold-and-Wait using explicit timeouts (`tryLock(timeout)`). If timeout expires, release all currently held locks, apply exponential backoff with jitter, and retry.

---

## 4. Safe Context Propagation & Deserialization Standards

### 4.1 Safe Context Lifecycle: Preventing Cross-Tenant Context Bleed
When thread pools or event loops are reused across multiple requests, storing user/tenant identity in `ThreadLocal` or global context without cleanup leads to **cross-tenant data contamination** (OWASP A01).

```typescript
// Mandatory Scoped Context Pattern (Node.js / TypeScript)
export class SecurityContextHolder {
  private static storage = new AsyncLocalStorage<SecurityContext>();

  public static async runWithContext<T>(context: SecurityContext, fn: () => Promise<T>): Promise<T> {
    return this.storage.run(context, async () => {
      try {
        return await fn();
      } finally {
        // Guaranteed cleanup prevents context bleeding across asynchronous continuations
      }
    });
  }

  public static getContext(): SecurityContext {
    const ctx = this.storage.getStore();
    if (!ctx) throw new UnauthorizedError("No active security context found.");
    return ctx;
  }
}
```

```java
// Mandatory Scoped Context Pattern (Java / JVM / Netty / Servlet Engines)
public final class TenantContextHolder {
    private static final ThreadLocal<TenantContext> CONTEXT = new ThreadLocal<>();

    private TenantContextHolder() {}

    public static void set(TenantContext context) {
        CONTEXT.set(Objects.requireNonNull(context, "TenantContext cannot be null"));
    }

    public static TenantContext get() {
        TenantContext ctx = CONTEXT.get();
        if (ctx == null) throw new UnauthorizedException("Missing TenantContext");
        return ctx;
    }

    public static void clear() {
        CONTEXT.remove(); // MANDATORY: remove() must be called (not set(null)) to purge ThreadLocalMap entry in pooled threads
    }

    // Standard Filter / Interceptor wrapper enforcing try-finally cleanup
    public static <R> R executeWithContext(TenantContext context, Supplier<R> action) {
        set(context);
        try {
            return action.get();
        } finally {
            clear(); // Guarantees thread sanitization before returning thread to web server pool
        }
    }
}
```

---

### 4.2 Safe Deserialization & Payload Streaming Standards
1. **Ban on Polymorphic Reflection Gadgets:**
   - Deserialization of incoming JSON/Protobuf payloads using dynamic type reflection (`@JsonTypeInfo`, `pickle`, raw `eval`) is strictly prohibited.
   - All input parsing must map to immutable, concrete schemas with strict prototype-pollution defenses (`Object.freeze`, explicit validation against `__proto__` and `constructor`).
2. **Zero-Copy Streaming I/O for Large Payloads:**
   - Ingress request bodies exceeding $64\text{KB}$ must **NEVER** be buffered entirely into heap memory.
   - Payloads must be processed via non-blocking streams directly to disk or object storage, bounding heap allocation to $O(1)$ chunk size ($64\text{KB}$) per connection.

---

## 5. Code Smells & Anti-Patterns Playbook

```yaml
code_smells_playbook:
  the_blob_god_object:
    symptom: "A class with >500 lines holding dozens of responsibilities across actors."
    fix: "Apply SRP. Carve out domain entities and use-case interactors."
  feature_envy:
    symptom: "Method in Class A repeatedly queries getters of Class B to perform a computation."
    fix: "Move method to Class B ('Tell, Don't Ask')."
  primitive_obsession:
    symptom: "Using string/number for IDs, money, emails, zip codes."
    fix: "Introduce Value Objects and branded types (e.g. type UserId = string & { readonly __brand: unique symbol })."
  shotgun_surgery:
    symptom: "One business change requires touching 15 different files."
    fix: "Unify scattered logic into an Aggregate Root consistency boundary."
  leaky_abstraction:
    symptom: "Repository leaking ORM queries or database exceptions to application layers."
    fix: "Define clean domain exceptions and translate low-level errors in adapters."
```
