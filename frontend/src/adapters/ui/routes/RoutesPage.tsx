import { useEffect, useMemo, useState } from "react";
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
  const [filters, setFilters] = useState({
    vesselType: "",
    fuelType: "",
    year: "",
  });
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

  const vesselOptions = useMemo(
    () => [...new Set(routes.map((r) => r.vesselType))],
    [routes]
  );

  const fuelOptions = useMemo(
    () => [...new Set(routes.map((r) => r.fuelType))],
    [routes]
  );

  const yearOptions = useMemo(
    () => [...new Set(routes.map((r) => r.year.toString()))],
    [routes]
  );

  const filteredRoutes = routes.filter((r) => {
    return (
      (!filters.vesselType || r.vesselType === filters.vesselType) &&
      (!filters.fuelType || r.fuelType === filters.fuelType) &&
      (!filters.year || r.year.toString() === filters.year)
    );
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Routes</h2>

      <div className="flex gap-4 mb-6 flex-wrap">
        <select
          className="p-2 text-black rounded"
          value={filters.vesselType}
          onChange={(e) =>
            setFilters({ ...filters, vesselType: e.target.value })
          }
        >
          <option value="">All Vessels</option>
          {vesselOptions.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>

        <select
          className="p-2 text-black rounded"
          value={filters.fuelType}
          onChange={(e) =>
            setFilters({ ...filters, fuelType: e.target.value })
          }
        >
          <option value="">All Fuels</option>
          {fuelOptions.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        <select
          className="p-2 text-black rounded"
          value={filters.year}
          onChange={(e) =>
            setFilters({ ...filters, year: e.target.value })
          }
        >
          <option value="">All Years</option>
          {yearOptions.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

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
            {filteredRoutes.map((r) => (
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

        {filteredRoutes.length === 0 && (
          <div className="text-center text-gray-400 mt-4">
            No routes found
          </div>
        )}
      </div>
    </div>
  );
}