import { useState } from "react";
import RoutesPage from "./adapters/ui/routes/RoutesPage";

export default function App() {
  const [tab, setTab] = useState("routes");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold mb-6 text-center">
        Fuel EU Compliance Dashboard
      </h1>

      {/* Tabs */}
      <div className="flex gap-4 justify-center mb-8">
        {["routes", "compare", "banking", "pooling"].map((t) => (
          <button
            key={t}
            className={`px-4 py-2 rounded font-medium ${
              tab === t
                ? "bg-blue-500"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
            onClick={() => setTab(t)}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto mt-6">
        {tab === "routes" && <RoutesPage />}
        {tab !== "routes" && (
          <div className="text-center text-gray-400">
            Coming soon...
          </div>
        )}
      </div>
    </div>
  );
}