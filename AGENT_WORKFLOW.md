# AI Agent Workflow Log

---

# Backend Workflow

## Agents Used

* ChatGPT (debugging, architectural validation, complex logic refinement)
* GitHub Copilot (boilerplate code generation, inline suggestions, improving development speed)


---

## Prompts & Outputs

### Example 1: Banking Architecture Inconsistency

**Prompt:**
Banking and apply logic mismatch (global vs per ship). How to fix?

**Action Taken:**

* Refactored to global ledger model
* Ensured consistent banking and deduction
* Updated repository and use case

---

### Example 2: Lazy CB Computation Issue

**Prompt:**
CB API returns partial data unless computed earlier.

**Action Taken:**

* Refactored GetCBUseCase to compute for all routes
* Added persistence using UPSERT
* Ensured complete API response

---

### Example 3: Controller Breaking Architecture

**Prompt:**
Direct DB query in controller violates hexagonal architecture.

**Action Taken:**

* Moved logic to repository + use case
* Updated controller to delegate responsibility

---

## Validation / Corrections

* Tested all APIs using Postman
* Verified DB consistency via pgAdmin
* Fixed:

  * Banking inconsistency
  * Partial CB data
  * Architectural violations

---

## Observations

* AI helped identify hidden design issues
* Used mainly for debugging and validation
* Core system design implemented independently

---

---

# Frontend Workflow

## Agents Used

* ChatGPT (UI structuring, API integration guidance)

---

## Prompts & Outputs

### Example 1: API Integration Structure

**Prompt:**
How to structure API calls for routes, banking, and pooling?

**Action Taken:**

* Organized API calls by feature (routes, compliance, banking)
* Created reusable service layer

---

### Example 2: Data Presentation Logic

**Prompt:**
How to display compliance comparison and flags?

**Action Taken:**

* Structured table with:

  * ghgIntensity
  * percentDiff
  * compliant flag
* Added conditional rendering for status

---

## Validation / Corrections

* Verified API responses match backend
* Ensured UI reflects real time data
* Handled error states properly

---

## Observations

* AI helped with structuring UI logic
* Core frontend implementation done manually
* Used AI mainly for guidance, not generation

---

---

# Best Practices Followed

* Maintained separation of concerns
* Used clean architecture (backend)
* Ensured consistent API contracts
* Incrementally tested features
* Used AI for validation, not full implementation

---

# Summary

AI tools were used to:

* Debug complex issues
* Validate architecture
* Improve code quality

Most of the implementation, architecture, and logic were developed independently.
