import { useState } from "react";
import { api } from "../../api/api";

type PoolMember = {
  shipId: string;
  cbBefore: number;
  cbAfter: number;
};

type PoolResult = {
  poolId?: number;
  poolSum?: number;
  members?: PoolMember[];
  error?: string;
};

export default function PoolingPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<PoolResult | null>(null);

  const handleCreatePool = async () => {
    if (!input) return alert("Enter route IDs");

    const routeIds = input.split(",").map((id) => id.trim());

    const res = await api.createPool(routeIds);
    setResult(res);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Pooling</h2>

      {/* Input */}
      <div className="bg-gray-800 p-4 rounded mb-6 space-y-4">
        <input
          type="text"
          placeholder="Enter route IDs (e.g. R002,R003)"
          className="w-full p-2 text-black rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600"
          onClick={handleCreatePool}
        >
          Create Pool
        </button>
      </div>

      {/* Error */}
      {result?.error && (
        <div className="text-red-400 mb-4">{result.error}</div>
      )}

      {/* Result */}
      {result && result.members && (
        <div className="bg-gray-800 p-4 rounded">
          <h3 className="mb-2">Pool Result</h3>

          <p className="mb-4">
            Pool Sum:{" "}
            <span
              className={
                result.poolSum! >= 0
                  ? "text-green-400"
                  : "text-red-400"
              }
            >
              {result.poolSum}
            </span>
          </p>

          <table className="w-full border border-gray-700 text-sm">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left">Ship</th>
                <th className="px-4 py-2 text-left">CB Before</th>
                <th className="px-4 py-2 text-left">CB After</th>
              </tr>
            </thead>

            <tbody>
              {result.members.map((m) => (
                <tr key={m.shipId} className="border-t border-gray-700">
                  <td className="px-4 py-2">{m.shipId}</td>
                  <td className="px-4 py-2">{m.cbBefore}</td>
                  <td className="px-4 py-2">{m.cbAfter}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}