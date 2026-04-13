import { useEffect, useState } from "react";
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

type AdjustedCB = {
  shipId: string;
  cb: number;
  adjustedCB: number;
};

export default function PoolingPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<PoolResult | null>(null);
  const [cbList, setCbList] = useState<AdjustedCB[]>([]);
  const [year, setYear] = useState(2024);

  const format = (num: number) =>
    new Intl.NumberFormat().format(num);

  useEffect(() => {
    api.getAdjustedCB(year).then(setCbList);
  }, [year]);

  const handleCreatePool = async () => {
    if (!input) return alert("Enter route IDs");

    const routeIds = input
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);

    const res = await api.createPool(routeIds);
    setResult(res);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Pooling</h2>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3>Adjusted Compliance Balance ({year})</h3>

          <select
            className="p-2 text-black rounded"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        <table className="w-full border border-gray-700 text-sm rounded overflow-hidden">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Ship</th>
              <th className="px-4 py-2 text-left">CB</th>
              <th className="px-4 py-2 text-left">Adjusted CB</th>
            </tr>
          </thead>

          <tbody>
            {cbList.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center p-4 text-gray-400">
                  No data available
                </td>
              </tr>
            ) : (
              cbList.map((c) => (
                <tr key={c.shipId} className="border-t border-gray-700">
                  <td className="px-4 py-2">{c.shipId}</td>

                  <td
                    className={`px-4 py-2 ${
                      c.cb >= 0 ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {format(c.cb)}
                  </td>

                  <td
                    className={`px-4 py-2 ${
                      c.adjustedCB >= 0
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {format(c.adjustedCB)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bg-gray-800 p-4 rounded mb-6 space-y-4">
        <input
          type="text"
          placeholder="Enter route IDs (e.g. R002,R006)"
          className="w-full p-2 text-black rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          disabled={!input}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          onClick={handleCreatePool}
        >
          Create Pool
        </button>
      </div>

      {result?.error && (
        <div className="bg-red-900 text-red-300 p-3 rounded mb-4">
          {result.error}
        </div>
      )}

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
              {format(result.poolSum!)}
            </span>
          </p>

          <table className="w-full border border-gray-700 text-sm rounded overflow-hidden">
            <thead className="bg-gray-700 text-gray-200">
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
                  <td className="px-4 py-2">
                    {format(m.cbBefore)}
                  </td>
                  <td className="px-4 py-2">
                    {format(m.cbAfter)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}