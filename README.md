# 🚢 Fuel EU Compliance Dashboard

A full-stack application to analyze, monitor, and manage maritime fuel emissions compliance under FuelEU regulations. The system enables route comparison, compliance tracking, surplus banking, and pooling strategies.

---

# 📌 Features

### Routes Management

* View all routes with vessel, fuel, and emission data
* Set baseline route for comparison
* Create new routes dynamically

### Compliance Comparison

* Compare routes against baseline
* Calculate percentage deviation
* Identify compliance status using target threshold

### Banking System

* View compliance balance per ship and year
* Bank surplus credits
* Apply credits to deficit routes
* Track global banking records

### Pooling System

* Combine multiple ships into a compliance pool
* Redistribute surplus to cover deficits
* Ensure pool level compliance constraints

---

# 🏗️ Architecture

## Backend (Hexagonal Architecture)

The backend follows a clean separation of concerns:

* **Core**

  * Application (use cases)
  * Domain (business logic)
  * Ports (interfaces)

* **Adapters**

  * Inbound (HTTP controllers)
  * Outbound (PostgreSQL repositories)

* **Infrastructure**

  * Database connection
  * Server setup
---

## Frontend (Modular React Architecture)

The frontend is structured with clear separation:

* **Adapters**

  * API layer (centralized data fetching)
  * UI components (pages)

Key principles:

* Centralized API handling
* Controlled state management
* Derived state optimization using memoization

---

# 🛠️ Tech Stack

### Backend

* Node.js
* Express.js
* TypeScript
* PostgreSQL

### Frontend

* React
* TypeScript
* Tailwind CSS

### Tools

* Git
* Postman
* pgAdmin

---

# ⚙️ Setup Instructions

## 1. Clone Repository

```bash
git clone <your-repo-url>
cd project
```

---

## 2. Backend Setup

```bash
cd backend
npm install
```

### Load Seed Data

Run the following command to populate initial data:

psql -U postgres -d your_database -f src/infrastructure/db/seed.sql

### Configure Environment

Create `.env` file:

```env
DATABASE_URL=your_postgres_connection
PORT=3000
```

### Run Backend

```bash
npm run dev
```

---

## 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```id="url1"
http://localhost:5173
```

---

# 🔌 API Endpoints

### Routes

* `GET /routes`
* `POST /routes`
* `POST /routes/:id/baseline`

### Comparison

* `GET /routes/comparison`

### Compliance

* `GET /compliance/cb?year=YYYY`
* `GET /compliance/cb/:routeId`
* `GET /compliance/adjusted-cb?year=YYYY`

### Banking

* `POST /banking/bank`
* `POST /banking/apply`
* `GET /banking/records?year=YYYY`

### Pooling

* `POST /pools`

---

# 📊 Key Logic

### Compliance Balance (CB)

```text
CB = (Target - GHG Intensity) × Energy
```

### Percentage Difference

```text
((comparison / baseline) - 1) × 100
```

### Pooling Rules

* Pool sum must be ≥ 0
* Deficit ships must not worsen
* Surplus ships must remain non negative
* All ships must belong to same year

---

# 🧪 Testing

* Backend APIs tested using Postman  
* Database verified via pgAdmin  
* UI validated through real-time interaction  
* Unit tests added for core use cases to ensure correctness of business logic  
---

# 🤖 AI Agent Usage

AI tools were used primarily for:

* Debugging complex logic
* Validating architecture decisions
* Improving development speed

---

# 📄 Documentation

* `agent_workflow.md` → AI usage and debugging logs
* `reflection.md` → Development reflection

---