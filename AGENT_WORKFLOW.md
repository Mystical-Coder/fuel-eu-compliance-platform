# AI Agent Workflow Log

## Agents Used

- ChatGPT (debugging, architectural validation, complex logic refinement)
- GitHub Copilot (boilerplate code generation, inline suggestions, improving development speed)

---

# Backend Workflow

---

## Prompts & Outputs

### Banking Architecture Inconsistency

**Prompt:**
Banking and apply logic mismatch (global vs per ship). How to fix?

**Action Taken:**

- Refactored to global ledger model
- Ensured consistent banking and deduction
- Updated repository and use case

---

### Lazy CB Computation Issue

**Prompt:**
CB API returns partial data unless computed earlier.

**Action Taken:**

- Refactored GetCBUseCase to compute for all routes
- Added persistence using UPSERT
- Ensured complete API response

---

### Controller Breaking Architecture

**Prompt:**
Direct DB query in controller violates hexagonal architecture.

**Action Taken:**

- Moved logic to repository + use case
- Updated controller to delegate responsibility

---

## Validation / Corrections

- Tested all APIs using Postman
- Verified DB consistency via pgAdmin
- Fixed:
  - Banking inconsistency
  - Partial CB data
  - Architectural violations

---

## Observations

- AI helped identify hidden design issues
- Used mainly for debugging and validation
- Core system design implemented independently

---

# Frontend Workflow

## Derived State Optimization for Filtering

**Prompt:**
Filtering routes dynamically caused unnecessary re-renders and performance inefficiency.

**Action Taken:**

- Introduced memoization using `useMemo` for filter options and filtered dataset
- Ensured filtering logic runs only when dependencies change
- Reduced redundant computations during state updates

---

## Centralized API Layer for Consistent Data Handling

**Prompt:**
Direct fetch calls across components led to inconsistent error handling and duplication.

**Action Taken:**

- Designed a centralized API abstraction layer
- Standardized request/response handling across all modules
- Ensured separation between UI and data-fetching logic

---

## Controlled Form State with Type-Safe Transformation

**Prompt:**
Handling numeric inputs in forms caused type inconsistencies between UI state and API payload.

**Action Taken:**

- Maintained form state as strings to preserve input flexibility
- Performed explicit type conversion at submission boundary
- Ensured strict TypeScript typing for API payloads to avoid runtime errors

---
