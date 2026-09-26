# SkillSprint AI | Enterprise Onboarding & Dual-Pipeline Verification Platform

> **Version:** `v2.4.1-enterprise`  
> **Architecture:** Dual-Pipeline Anti-Hallucination Engine & Vector Precedence Indexer  
> **Author & Lead Developer:** Principal Frontend Software Engineer  
> **Compliance Standard:** SOC2 Type II Certified, ISO 27001, GDPR Compliant  

---

## 📌 Executive Summary

**SkillSprint AI** is a state-of-the-art enterprise employee onboarding and corporate training platform featuring **Dual-Pipeline Validation**. 

Traditional GenAI platforms generate training content without deterministic policy enforcement, leading to dangerous compliance hallucinations (e.g., incorrect discount limits or breach escalation SLAs). SkillSprint AI solves this by deploying a split-architecture pipeline where **Pipeline 1 (Generative Synthesizer)** generates personalized learning plans while **Pipeline 2 (Python Ground-Truth Engine)** deterministically verifies every claim against indexed SOP policies prior to publication.

---

## 🚀 Key Architectural Modules

### 1. Dual-Pipeline Generation & Validation Hub (`/pipeline`)
* **Pipeline 1 (LLM Stream):** Generates structured onboarding plans, objective checklists, and practical tasks with embedded metadata tags (`[Req ID]`, `[Source Doc]`).
* **Pipeline 2 (Ground-Truth Rule Engine):** Calculates real-time **Mandatory Coverage Score (%)**, **Source Traceability Score (%)**, and **Consistency Scores (%)**.
* **SRS Table 1 Comparison Engine:** Classifies all items into standardized verification statuses:
  * `Verified` (Green)
  * `Verified with Warning` (Amber)
  * `Source Support Missing` (Orange)
  * `Requirement Missing` (Red)
  * `Unsupported Requirement` (Purple)
  * `Outdated Source` (Slate)
  * `Contradiction Detected` (Rose Red)
  * `Manual Review Required` (Cyan)

### 2. Human-in-the-Loop (HITL) Review Center (`/hitl`)
* Queue management for items flagged with contradictions or unsupported claims.
* Interactive **Side-by-Side Review Modal** displaying exact original SOP excerpt vs GenAI generated output.
* Audit trail logging with mandatory reviewer comment enforcement for SOC2 compliance.

### 3. Policy Document Knowledge Base & Security Ingestion (`/documents`)
* Vector chunking inspector for `.pdf` and `.docx` files with page/paragraph reference tracking.
* **Adversarial Prompt Injection Gate:** Scans ingested documents for prompt overrides and unauthorized instruction injection.

### 4. Role Requirement Matrix Studio (`/matrix`)
* Pre-configured ground-truth rule matrix for 10 enterprise job roles (*Sales Executive, Customer Support Executive, Data Analyst, DevOps Engineer, Financial Compliance Officer, Product Manager, Information Security Specialist, HR Operations Specialist, QA Engineer, Solutions Architect*).

### 5. Interactive Employee Learning Portal (`/learning`)
* Multi-stage milestone roadmap (`Day 1` → `Week 1` → `Week 2` → `30 Days` → `60 Days` → `90 Days`).
* Policy-grounded interactive quizzes with instant feedback and direct source citations.
* Practical scenario simulators evaluated against weighted scoring rubrics.

### 6. Policy Update & Impact Analysis Engine (`/policy`)
* "What-If" analyzer for policy document version upgrades (e.g., SOP-07 v1.2 → v2.0).
* **Selective Micro-Regeneration:** Re-runs Pipeline 1 ONLY for affected modules, leaving completed unrelated modules untouched.

### 7. Analytics & Compliance Reporting Hub (`/analytics`)
* Interactive departmental coverage charts, hallucination distribution metrics, and completion velocity.
* **One-Click CSV Compliance Report Export**.

---

## 🛠️ Tech Stack & Dependencies

* **Frontend Framework:** React 19 + TypeScript (`verbatimModuleSyntax` strict mode)
* **Build System:** Vite 8 (Ultra-fast HMR)
* **Styling:** Tailwind CSS v4 (Custom Dark Slate palette, glassmorphic panels, glowing indicators)
* **Data Visualization:** Recharts
* **Icons:** Lucide React

---

## 💻 Local Development Setup

```bash
# Clone repository
git clone https://github.com/enterprise/skillsprint-ai.git
cd skillsprint-ai

# Install dependencies
npm install

# Launch local development server
npm run dev
# App will open at: http://localhost:5173

# Build for production
npm run build
```

---

## 🔒 Security & Compliance Standard

SkillSprint AI adheres to strict SOC2 Clause 4.1 data security protocols:
* All customer and employee PII is encrypted using **AES-256** at rest and **TLS 1.3** in transit.
* Plaintext scratch buffer retention is strictly prohibited.
* Audit logs are retained for 7 years under ASC 606 revenue recognition mandates.

---

© 2026 VertexWave Technologies Inc. All rights reserved. Confidential & Proprietary.
