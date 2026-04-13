import { useState } from "react";
import { api } from "../../api/api";

type BankingResult = {
  routeId: string;
  banked?: number;
  cb_before?: number;
  applied?: number;
  cb_after?: number;
  error?: string;
};

export default function BankingPage() {
  const [routeId, setRouteId] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [result, setResult] = useState<BankingResult | null>(null);

  const handleBank = async () => {
    if (!routeId) {
      alert("Enter route ID");
      return;
    }

    const res = await api.bank(routeId);
    setResult(res);
  };

  const handleApply = async () => {
    if (!routeId || !amount) {
      alert("Enter route ID and amount");
      return;
    }

    const res = await api.apply(routeId, Number(amount));
    setResult(res);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Banking</h2>

      {/* Input Section */}
      <div className="bg-gray-800 p-4 rounded mb-6 space-y-4">
        <input
          type="text"
          placeholder="Route ID (e.g. R002)"
          className="w-full p-2 text-black rounded"
          value={routeId}
          onChange={(e) => setRouteId(e.target.value)}
        />

        <input
          type="number"
          placeholder="Amount (for apply)"
          className="w-full p-2 text-black rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="flex gap-4">
          <button
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600"
            onClick={handleBank}
          >
            Bank Surplus
          </button>

          <button
            className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600"
            onClick={handleApply}
          >
            Apply Banking
          </button>
        </div>
      </div>

      {/* Result Section */}
      {result && (
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="mb-2">Result</h3>

          <pre className="text-sm text-gray-300">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}