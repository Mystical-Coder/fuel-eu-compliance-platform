import { useEffect, useState } from "react";
import { api } from "../../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

type Comparison = {
  routeId: string;
  ghgIntensity: number;
  percentDiff: number;
  compliant: boolean;
  isBaseline: boolean;
};

export default function ComparePage() {
  const [data, setData] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.getComparison();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Compare</h2>
      <div className="mb-8">
        <h3 className="text-lg mb-2">GHG Intensity Comparison</h3>

        <div className="w-full h-64 bg-gray-800 p-4 rounded">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="routeId" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />

              <Bar dataKey="ghgIntensity" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-700 text-sm">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Route</th>
              <th className="px-4 py-2 text-left">GHG Intensity</th>
              <th className="px-4 py-2 text-left">% Difference</th>
              <th className="px-4 py-2 text-left">Compliance</th>
            </tr>
          </thead>

          <tbody>
            {data.map((r) => (
              <tr
                key={r.routeId}
                className={`border-t border-gray-700 ${
                  r.isBaseline ? "bg-blue-900/40" : ""
                }`}
              >
                <td className="px-4 py-2">
                  {r.routeId} {r.isBaseline && "(Baseline)"}
                </td>

                <td className="px-4 py-2">{r.ghgIntensity}</td>

                <td className="px-4 py-2">{r.percentDiff.toFixed(2)}%</td>

                <td className="px-4 py-2">
                  {r.compliant ? (
                    <span className="text-green-400">✅</span>
                  ) : (
                    <span className="text-red-400">❌</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
