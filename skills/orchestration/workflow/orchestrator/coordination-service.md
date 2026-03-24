# Coordination Service — Smart Orchestration with Loops & Handoffs

## Overview

The Coordination Service is the **execution engine** for TaskPilot that orchestrates 55+ skills across 5 domains (PM, UX, SDE, QAE, PE) into intelligent workflows. It enables:

- **Intra-domain loops** — skills within the same domain can loop back on failures (code review fails → refactor → re-review)
- **Inter-domain handoffs** — automatic routing between domains (PRD → UX design → SDE architecture → QAE testing)
- **Feedback loops** — quality gate failures trigger remedial workflows (defects in testing → debug → refactor → re-test)
- **Phase gates** — decision checkpoints that prevent progression with unresolved issues

---

## Architecture

### 1. Intra-Domain Coordination (Within Role)

**Dependency Manifests** — Each skill declares required inputs, outputs, and quality gates:

```yaml
# Example: sde:code-review
skill: "sde:code-review"
required_inputs: 
  - "project code"
  - ".sde/reviews/*"
outputs: 
  - ".sde/reviews/[pr].md"
quality_gates:
  - metric: "severity"
    condition: ">= HIGH"
    loop_to: "sde:code-craftsman"
  - metric: "test-coverage"
    condition: "< 80%"
    loop_to: "sde:tdd"
next_skills_if_pass: ["qae:test-strategy"]
next_skills_if_fail: ["sde:code-craftsman"]
```

**Conditional Routing** — Domain orchestrators apply rules based on quality gate results:

```json
{
  "sde_routing": [
    { "from": "code-review", "fails": "severity >= HIGH", "loop_to": "code-craftsman" },
    { "from": "code-review", "fails": "coverage < 80%", "loop_to": "tdd" },
    { "from": "tdd", "passes": true, "next": "code-review" }
  ]
}
```

---

### 2. Inter-Domain Coordination (Cross-Role)

**Event-Based Handoffs** — On skill completion, emit structured JSON:

```json
{
  "skill": "pm:prd-generator",
  "phase": 3,
  "status": "PASS",
  "outputs": [".pm/prds/feature.md"],
  "quality_gates": { "scope_locked": true, "feasibility_confirmed": true },
  "recommended_next": "ux:design-system",
  "phase_transition": "3→4"
}
```

**Auto-Queuing** — Master orchestrator listens for events and routes to next domain:

```
PRD complete (PASS) → auto-queue ux:design-system
Design system complete (PASS) → auto-queue sde:system-design
Code review (FAIL, severity HIGH) → auto-queue sde:code-craftsman (loop)
Defect found (HIGH severity) → auto-queue sde:debugging (feedback loop)
```

---

### 3. Loop-Based Execution

**Phase-Level Quality Gates** — `.project/phase-[N]-gates.md` defines pass/fail criteria:

```markdown
# Phase 3 (Planning) Gates

| Gate | Check | Pass Criteria | Fail Action |
|------|-------|---------------|-------------|
| Scope Locked | PRD has all acceptance criteria | 100% criteria | Ask for clarification |
| Feasibility | SDE estimates < capacity | estimate ≤ available capacity | Descope or extend timeline |
| Stakeholders Aligned | PM has sign-off | stakeholder approval >= 80% | Facilitate alignment |
| Effort Realistic | Estimation has margin | risk buffer >= 30% | Revise estimates |
```

**Loop Prevention** — `.project/loops.md` tracks all loops:

```markdown
| Phase | From | To | Reason | Count | Resolved | Duration |
|-------|------|-----|--------|-------|----------|----------|
| 6 | Code Review | Refactor | SEVERITY=HIGH | 2 | YES | 1d |
| 7 | Testing | Debug | Defect: LOGIC_BUG | 3 | YES | 2d |
| 3 | Planning | Validation | Effort > capacity | 1 | YES | 4h |

## Loop Limits
- Max 5 loops per phase (prevents infinite recursion)
- Loop count is cumulative (loop 1/5, loop 2/5, etc.)
- User can override limit with confirmation
- All loops must be resolved before phase progression
```

---

## Routing Rules

### Intra-Domain Routes (Within Domain Orchestrators)

**PM Domain:**
- `prioritization-engine` fails on conflicts → loop to `gap-analyst`
- `prd-generator` needs clarification → loop to `discovery-validator`

**SDE Domain:**
- `code-review` severity HIGH → loop to `code-craftsman`
- `code-review` coverage < 80% → loop to `tdd`
- `system-design` violates SOLID → loop to `architecture`

**QAE Domain:**
- `test-strategy` coverage < baseline → loop to revisit plan
- `automation` coverage < target → loop to expand test suite
- `security` finding severity HIGH → loop to expand threat model

**UX Domain:**
- `accessibility` audit fails → loop to `component-design`
- `design-review` score < 8 → loop to revise

**PE Domain:**
- `architecture-review` issues found → loop to `tech-strategy`
- `technical-quality` tier low → loop to quality improvement plan

### Inter-Domain Routes (Across Domain Orchestrators)

**Forward Handoffs (Domain A → Domain B):**
```
Phase 3: pm:prd-generator (PASS) → Phase 4: ux:design-system
Phase 4: ux:design-system (PASS) → Phase 5: sde:system-design
Phase 5: sde:system-design (PASS) → Phase 6: sde:code-craftsman (build starts)
Phase 6: sde:code-review (PASS) → Phase 7: qae:test-strategy
Phase 8: qae:quality-metrics (PASS) → Phase 9: pm:stakeholder-communicator (launch)
```

**Feedback Loops (Quality Gate Failure → Earlier Phase):**
```
Phase 7 defect severity HIGH → Phase 6: sde:debugging
Phase 6 architecture issue → Phase 5: sde:system-design re-review
Phase 4 design accessibility fail → Phase 4: ux:component-design
Phase 3 effort > capacity → Phase 2: discovery-validator
```

---

## Parallel Agent Coordination: Contract-First Rule

### Problem Statement
When Phase 6 (Build) splits work across parallel agents (e.g., Agent 6c builds SubscriptionService, Agent 6d builds PaywallView), each agent operates independently. Without a shared contract, Agent 6d may call methods that Agent 6c never created, or use incompatible types. This caused the HeartCoach PaywallView crash: `purchase(tier:isAnnual:)` called but only `purchase(_ product:)` existed.

### The Contract-First Rule

**MANDATORY:** Before any parallel agents begin implementation, the orchestrator MUST:

1. **Identify producer-consumer pairs** — Which agents produce interfaces/services that other agents consume?
2. **Generate shared protocols/interfaces FIRST** — Create a contracts file containing:
   - Protocol/interface definitions for all cross-agent boundaries
   - Shared type definitions (enums, structs, data classes)
   - Method signatures with parameter and return types
   - Published property declarations (for reactive frameworks)
3. **All agents receive the contracts file** as a required input
4. **No agent may deviate from the contract** without regenerating it for all consumers

### Contract File Location

```
.project/contracts/phase-6-contracts.swift   (or .ts, .py, etc.)
```

### Example Contract (HeartCoach Scenario)

Agent 6c (Services) and Agent 6d (Views) must interoperate:

```swift
// .project/contracts/phase-6-contracts.swift
// GENERATED BEFORE parallel execution begins
// ALL agents MUST conform to these interfaces

protocol SubscriptionServiceProtocol: ObservableObject {
    var currentTier: SubscriptionTier { get }
    var availableProducts: [Product] { get }
    var purchaseInProgress: Bool { get }

    func purchase(tier: SubscriptionTier, isAnnual: Bool) async throws
    func restorePurchases() async throws
}

// Agent 6c MUST implement SubscriptionServiceProtocol
// Agent 6d MUST consume SubscriptionServiceProtocol, not concrete class
```

### Execution Flow

```
Phase 6 Analysis:
  Feature requires N parallel agents

  Step 1: IDENTIFY cross-agent dependencies
    Agent 6c produces: SubscriptionService, NotificationService
    Agent 6d consumes: SubscriptionService (via @EnvironmentObject)
    Agent 6e consumes: NotificationService (via initialization)

  Step 2: GENERATE contracts (.project/contracts/phase-6-contracts.swift)
    → SubscriptionServiceProtocol
    → NotificationServiceProtocol
    → All shared model types

  Step 3: DISTRIBUTE contracts to all agents
    Each agent's prompt includes: "You MUST conform to .project/contracts/"

  Step 4: EXECUTE agents in parallel
    Each agent implements against the contracts

  Step 5: VERIFY contracts (Gate 6D)
    Compile all agents' output together
    If violations found → identify which agent deviated → re-run that agent
```

### When Contract-First Applies

| Condition | Contract Required? |
|-----------|-------------------|
| Single agent builds everything | No |
| Multiple agents, no shared interfaces | No |
| Multiple agents, one produces what another consumes | **YES** |
| Multiple agents, shared data models | **YES** |
| Multiple agents, environment-injected services | **YES** |

---

## Phase-by-Phase Execution

### Phase 1-2: Discovery & Validation
- **Skills:** research-agent, gap-analyst, discovery-validator, customer-research, experiment-designer
- **Output:** Validated feature idea with hypothesis, success metrics
- **Gate:** Feasibility confirmed, market demand validated
- **Next:** Phase 3 (Planning)

### Phase 3: Planning
- **Skills:** prd-generator, requirements, estimation, prioritization-engine, metrics-advisor
- **Output:** PRD with acceptance criteria, SDE estimates, metrics defined
- **Gate:** Scope locked, effort ≤ capacity, stakeholders aligned
- **Next:** Phase 4 (Design)

### Phase 4: Design
- **Skills:** ux:design-system, color-system, typography, component-design, responsive, accessibility, interaction-design
- **Output:** Design system, component specs, accessibility audit
- **Gate:** Design system complete, a11y audit passing, all state matrices defined
- **Next:** Phase 5 (Architecture)

### Phase 5: Architecture
- **Skills:** sde:system-design, architecture, data-systems, ml-design, pe:architecture-reviewer
- **Output:** System design doc, architecture decision records (ADRs), data schema
- **Gate:** ADRs signed off, SOLID compliance, capacity planning done
- **Next:** Phase 6 (Build)

### Phase 6: Build
- **Skills:** sde:tdd, code-craftsman, code-review, requirements, systems-thinking
- **Output:** Implementation code, unit/integration tests, code review report
- **Gate:** Coverage ≥ 80%, all PRs approved, no HIGH severity findings
- **Next:** Phase 7 (Quality)

### Phase 7: Quality Assurance
- **Skills:** qae:test-strategy, test-plan, test-automation, api-testing, performance, security, exploratory, cicd-pipeline, quality-metrics, defect-management
- **Output:** Test automation, performance baseline, security audit, defect report
- **Gate:** Coverage ≥ baseline, defects triaged, perf < SLA, security issues remediated
- **Next:** Phase 8 (Launch) or Phase 6 (if defects found)

### Phase 8: Launch
- **Skills:** stakeholder-communicator, metrics-advisor, pe:decision-facilitator, qae:quality-metrics
- **Output:** Launch plan, stakeholder comms, monitoring setup, metrics dashboard
- **Gate:** Go/no-go decision, monitoring validated, team briefed
- **Next:** Phase 9 (Feedback)

### Phase 9: Feedback & Learning
- **Skills:** pivot-analyzer, metrics-advisor, customer-research, pe:incident-reliability, qae:defect-management
- **Output:** Launch retrospective, metrics report, customer feedback synthesis
- **Gate:** Metrics > baseline, customer satisfaction, learnings documented
- **Next:** Planning next iteration (Phase 3 again)

---

## Quality Gates (Hard Blocks & Soft Warnings)

### Hard Blocks (Cannot Proceed)
- Phase 3: Scope not locked, Effort > available capacity, No stakeholder sign-off
- Phase 5: Architecture not reviewed, SOLID violations, Data model not approved
- Phase 7: Security HIGH severity findings, Critical defects, No monitoring setup
- Phase 8: No launch plan, No go/no-go decision, Team not briefed

### Soft Warnings (Can Proceed With Confirmation)
- Phase 4: WCAG only, no assistive tech testing → can proceed, but will miss edge cases
- Phase 6: Coverage 75-80% → can proceed, but higher defect risk
- Phase 7: Performance testing limited scope → can proceed, but may miss scale issues
- Phase 8: Monitoring incomplete → can proceed, but risky launch

---

## Loop Tracking & Prevention

### Loop Registry (`.project/loops.md`)

Every loop is recorded with:
- **Phase** — which phase the loop occurred in
- **From** — which skill/gate triggered the issue
- **To** — which skill is executed for remediation
- **Reason** — human-readable explanation of why loop happened
- **Count** — loop number (1/5, 2/5, etc.)
- **Resolved** — YES/NO status
- **Duration** — how long to resolve
- **User Notes** — any context from user

### Loop Limits
- **Max 5 loops per phase** — prevents infinite loops
- **Loop timeout** — if loop not resolved in 2x expected duration, escalate to user
- **User override** — user can confirm loop after 5th attempt

### Example Loop Lifecycle

```
Phase 6 Build:

[Loop 1/5] Code Review → FAIL (severity HIGH)
└─ Routed to: sde:code-craftsman
└─ Reason: DRY violation in auth token handler
└─ Duration: 4 hours
└─ Resolved: YES

[Loop 2/5] Code Review → FAIL (coverage 78% < 80%)
└─ Routed to: sde:tdd
└─ Reason: Missing edge case test for invalid token
└─ Duration: 6 hours
└─ Resolved: YES

[Loop 3/5] Code Review → PASS
└─ Transitioned to Phase 7 (Quality)
```

---

## Event Schema

### Skill Completion Event

```json
{
  "timestamp": "2026-03-04T10:30:00Z",
  "skill": "sde:code-review",
  "skill_id": "sde:code-review-pr-123",
  "phase": 6,
  "phase_name": "Build",
  "status": "FAIL",
  "severity": "HIGH",
  
  "inputs": {
    "pr_url": "...",
    "files_changed": 12,
    "lines_changed": 450
  },
  
  "outputs": [
    ".sde/reviews/pr-123.md",
    ".sde/reviews/findings.json"
  ],
  
  "quality_gates": {
    "severity": "HIGH",
    "violations": [
      {
        "type": "DRY_VIOLATION",
        "location": "auth/token-handler.ts:45-67",
        "suggestion": "Extract tokenRefresh() function"
      }
    ],
    "test_coverage": 78,
    "coverage_target": 80
  },
  
  "next_action": "LOOP",
  "loop_to": "sde:code-craftsman",
  "loop_reason": "severity >= HIGH",
  
  "metrics": {
    "duration_minutes": 45,
    "issues_found": 3,
    "severe_issues": 1
  }
}
```

---

## Data Flow

```
.project/
├── status.md                    # Current phase, next skill
├── phases/
│   ├── phase-1-gates.md        # Discovery gates
│   ├── phase-2-gates.md        # Validation gates
│   └── ... (phases 3-9)
├── loops.md                     # Loop tracking log
├── skill-manifest.json          # All 55+ skill dependencies
├── events.jsonl                 # Event log (1 per line)
└── orchestration-report.md      # Final report

.pm/
├── gaps/                        # Gap analysis reports
├── prds/                        # Product requirements docs
├── experiments/                 # Experiment briefs
└── ...

.pe/
├── decisions/                   # Architecture decisions
├── quality/                     # Quality assessments
└── ...

.sde/
├── designs/                     # System designs
├── code/                        # Code reviews
├── reviews/                     # PR reviews
└── ...

.qae/
├── strategies/                  # Test strategies
├── plans/                       # Test plans
├── defects/                     # Defect reports
└── ...

.ux/
├── design-systems/              # Design tokens
├── components/                  # Component specs
└── ...
```

---

## Orchestration Workflow

### Manual Orchestration (Current)
```
User: /pm:gap-analyst
[gap analysis complete]
User: (manually runs) /pm:prd-generator
[PRD complete]
User: (manually runs) /ux:design-system
...
```

### Coordination Service Orchestration (Automated)
```
User: /taskpilot:master-orchestrator [Feature]: [Description]
│
├─ Phase 1: Discovery
│  └─ research-agent, gap-analyst → event emitted
│     └─ Coordination Service hears PASS → queues Phase 2
│
├─ Phase 2: Validation
│  └─ discovery-validator, experiment-designer → event emitted
│     └─ Coordination Service hears PASS → suggests Phase 3
│
├─ Phase 3: Planning
│  └─ prd-generator, estimation → event emitted
│     ├─ Status OK? → Continue to Phase 4
│     └─ Effort > capacity? → Loop back to Phase 2
│
├─ Phase 4: Design (auto-queued)
│  └─ design-system, components → event emitted
│     ├─ A11y pass? → Continue
│     └─ A11y fail? → Loop to component-design
│
├─ Phase 5-8: (sequential with auto-routing and loop handling)
│
└─ Phase 9: Feedback
   └─ Generate orchestration report with loop history, metrics, ROI
```

---

## Benefits

1. **Automation** — Reduces manual jumping between domains
2. **Error Prevention** — Manifests catch missing inputs before skill runs
3. **Loop Visibility** — Every loop tracked and visible to user
4. **Quality Gates** — Hard stops prevent bad work from propagating
5. **Scalability** — Event-driven architecture supports multi-agent future
6. **Debuggability** — Complete history for retrospectives and training

---

## Known Trade-offs

| Tradeoff | Decision | Reason |
|----------|----------|--------|
| Event storage | In-memory queue + `.project/events.jsonl` | Simple, queryable, version-controllable |
| Loop limits | Max 5 per phase | Prevents infinite loops, user can override |
| Routing rules | JSON config | Easy to edit, version control, human-readable |
| Skill dependencies | Metadata in `skill-manifest.json` | No new files, fits existing structure |
| Event emission | Via hooks or manual skill completion | Leverages existing infrastructure |

---

## Implementation Status

| Item | Status | Notes |
|------|--------|-------|
| routing-rules.json | ✅ IMPLEMENTED | Phase transitions, blocking gates, exit criteria, gate variables all defined |
| Contract-First Rule | ✅ IMPLEMENTED | Documented in this file with Swift example, execution flow, and enforcement criteria |
| Phase 6 Gates (6A-6D) | ✅ IMPLEMENTED | Defined in SKILL.md and routing-rules.json with blocking enforcement |
| Skill Loop Exit Criteria | ✅ IMPLEMENTED | All domains have exit criteria and max_loops in SKILL.md and routing-rules.json |
| Project Detection | ✅ IMPLEMENTED | Language/framework detection saves to .project/environment.json |
| User Gate Protocol | ✅ IMPLEMENTED | AskUserQuestion with Approve/Revise/Reject flow in SKILL.md |
| Skill Invocation Rules | ✅ IMPLEMENTED | taskpilot: prefix documented in SKILL.md and all domain agents |
| Event emission hooks | ❌ NOT IMPLEMENTED | hooks.json defines structure but not integrated with Claude Code |
| Routing rules engine | ⏭️ NOT NEEDED | Orchestrator reads SKILL.md directly — no separate engine binary required |
| Loop tracking automation | ❌ NOT IMPLEMENTED | .project/loops.md format defined but not auto-populated |
| Skill manifest dependencies | ❌ NOT IMPLEMENTED | skill-manifest.json exists but individual skills lack dependency metadata |
| End-to-end test | ⚠️ PARTIAL | HeartCoach build tested Phases 1-6; Phase 7+ not yet validated with fixes |

### Why "Routing Rules Engine" is Not Needed

The orchestrator is an AI agent that reads SKILL.md instructions and makes decisions. It does NOT need:
- A separate binary or process to evaluate routing conditions
- A programmatic event queue — the AI maintains state in context
- An automated loop counter — the AI tracks loops via .project/loops.md

The routing-rules.json serves as a **reference document** that the orchestrator consults, not a configuration file loaded by a software engine.

---

## Success Metrics

- **Interaction Density** — 2-3 interactions/day (optimal, no wasted time)
- **Handoff Quality** — ≥ 95% (99% with only necessary loops)
- **Loop Ratio** — ≤ 0.5 loops per phase (most phases 0-1 loops)
- **Time-to-Value** — 20% faster than manual orchestration
- **Defect Escape** — < 20% (good QA + prevention)
- **Phase Gate Compliance** — 100% gates passed or loop triggered
- **Team Satisfaction** — ≥ 8.5/10 (clear vision, automated grunt work)
