import { useEffect, useState } from "react";
import { api } from "@/adapters/api/api";

type Route = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
  isBaseline?: boolean;
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoutes = async () => {
    try {
      const data = await api.getRoutes();
      setRoutes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleBaseline = async (routeId: string) => {
    await api.setBaseline(routeId);
    fetchRoutes();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Routes</h2>

      <div className="overflow-x-auto mt-4">
        <table className="w-full border border-gray-700 text-sm">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="px-4 py-2 text-left">Route</th>
              <th className="px-4 py-2 text-left">Vessel</th>
              <th className="px-4 py-2 text-left">Fuel</th>
              <th className="px-4 py-2 text-left">Year</th>
              <th className="px-4 py-2 text-left">GHG</th>
              <th className="px-4 py-2 text-left">Fuel Cons.</th>
              <th className="px-4 py-2 text-left">Distance</th>
              <th className="px-4 py-2 text-left">Emissions</th>
              <th className="px-4 py-2 text-left">Baseline</th>
            </tr>
          </thead>

          <tbody>
            {routes.map((r) => (
              <tr
                key={r.routeId}
                className="border-t border-gray-700 hover:bg-gray-800"
              >
                <td className="px-4 py-2">{r.routeId}</td>
                <td className="px-4 py-2">{r.vesselType}</td>
                <td className="px-4 py-2">{r.fuelType}</td>
                <td className="px-4 py-2">{r.year}</td>
                <td className="px-4 py-2">{r.ghgIntensity}</td>
                <td className="px-4 py-2">{r.fuelConsumption}</td>
                <td className="px-4 py-2">{r.distance}</td>
                <td className="px-4 py-2">{r.totalEmissions}</td>
                <td className="px-4 py-2">
                  {r.isBaseline ? (
                    <span className="text-green-400 font-semibold">
                      Baseline
                    </span>
                  ) : (
                    <button
                      className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleBaseline(r.routeId)}
                    >
                      Set
                    </button>
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