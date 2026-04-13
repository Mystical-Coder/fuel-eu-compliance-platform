import { useEffect, useState } from "react";
import { api } from "../../api/api";

type BankingResult = {
  routeId: string;
  banked?: number;
  cb_before?: number;
  applied?: number;
  cb_after?: number;
  error?: string;
};

type CB = {
  shipId: string;
  year: number;
  cb: number;
};

export default function BankingPage() {
  const [routeId, setRouteId] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [result, setResult] = useState<BankingResult | null>(null);
  const [cbList, setCbList] = useState<CB[]>([]);
  const [year, setYear] = useState(2024);

  useEffect(() => {
    api.getCB(year).then(setCbList);
  }, [year]);

  const selectedCB = cbList.find((c) => c.shipId === routeId);

  const handleBank = async () => {
    if (!routeId) return alert("Enter route ID");

    const res = await api.bank(routeId);
    setResult(res);
  };

  const handleApply = async () => {
    if (!routeId || !amount) return alert("Enter route ID and amount");

    const res = await api.apply(routeId, Number(amount));
    setResult(res);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Banking</h2>

      {/* 🔹 CB TABLE */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3>Current Compliance Balance ({year})</h3>

          <select
            className="p-2 text-black rounded"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            <option value={2024}>2024</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        <table className="w-full border border-gray-700 text-sm">
          <thead className="bg-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Ship</th>
              <th className="px-4 py-2 text-left">CB</th>
            </tr>
          </thead>

          <tbody>
            {cbList.map((c) => (
              <tr key={c.shipId} className="border-t border-gray-700">
                <td className="px-4 py-2">{c.shipId}</td>
                <td
                  className={`px-4 py-2 ${
                    c.cb >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {c.cb}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🔹 INPUT SECTION */}
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
            className="bg-green-500 px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-500"
            onClick={handleBank}
            disabled={!selectedCB || selectedCB.cb <= 0} // ✅ disable
          >
            Bank Surplus
          </button>

          <button
            className="bg-yellow-500 px-4 py-2 rounded hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleApply}
            disabled={!selectedCB || selectedCB.cb >= 0}
          >
            Apply Banking
          </button>
        </div>
      </div>

      {/* 🔹 ERROR */}
      {result?.error && <div className="text-red-400 mb-4">{result.error}</div>}

      {/* 🔹 KPI DISPLAY */}
      {result && !result.error && (
        <div className="bg-gray-800 p-4 rounded space-y-2">
          <h3 className="mb-2">Result</h3>

          {result.banked !== undefined && <p>Banked: {result.banked}</p>}

          {result.cb_before !== undefined && (
            <>
              <p>CB Before: {result.cb_before}</p>
              <p>Applied: {result.applied}</p>
              <p>CB After: {result.cb_after}</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
