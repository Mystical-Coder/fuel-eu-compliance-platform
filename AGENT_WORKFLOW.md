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

