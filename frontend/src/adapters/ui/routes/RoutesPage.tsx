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

type CreateRoutePayload = {
  routeId: string;
  vesselType: string;
  fuelType: string;
  year: number;
  ghgIntensity: number;
  fuelConsumption: number;
  distance: number;
  totalEmissions: number;
};

export default function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filters, setFilters] = useState({
    vesselType: "",
    fuelType: "",
    year: "",
  });
  const [loading, setLoading] = useState(true);

  const [newRoute, setNewRoute] = useState({
    routeId: "",
    vesselType: "",
    fuelType: "",
    year: "",
    ghgIntensity: "",
    fuelConsumption: "",
    distance: "",
    totalEmissions: "",
  });

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

  const handleCreateRoute = async () => {
    const payload: CreateRoutePayload = {
      routeId: newRoute.routeId,
      vesselType: newRoute.vesselType,
      fuelType: newRoute.fuelType,
      year: Number(newRoute.year),
      ghgIntensity: Number(newRoute.ghgIntensity),
      fuelConsumption: Number(newRoute.fuelConsumption),
      distance: Number(newRoute.distance),
      totalEmissions: Number(newRoute.totalEmissions),
    };

    await api.createRoute(payload);

    setNewRoute({
      routeId: "",
      vesselType: "",
      fuelType: "",
      year: "",
      ghgIntensity: "",
      fuelConsumption: "",
      distance: "",
      totalEmissions: "",
    });

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
        <table className="w-full border border-gray-700 text-sm rounded overflow-hidden">
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
              <tr key={r.routeId} className="border-t border-gray-700 hover:bg-gray-800">
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
                    <span className="text-green-400 font-semibold">Baseline</span>
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

      <div className="bg-gray-800 p-4 rounded mt-6 space-y-4">
        <h3 className="text-lg font-semibold">Create Route</h3>

        <div className="grid grid-cols-2 gap-4">
          <input className="p-2 text-black rounded" placeholder="Route ID (e.g. R008)" value={newRoute.routeId} onChange={(e) => setNewRoute({ ...newRoute, routeId: e.target.value })} />
          <input className="p-2 text-black rounded" placeholder="Vessel Type (e.g. Container)" value={newRoute.vesselType} onChange={(e) => setNewRoute({ ...newRoute, vesselType: e.target.value })} />
          <input className="p-2 text-black rounded" placeholder="Fuel Type (e.g. LNG)" value={newRoute.fuelType} onChange={(e) => setNewRoute({ ...newRoute, fuelType: e.target.value })} />
          <input type="number" className="p-2 text-black rounded" placeholder="Year (e.g. 2025)" value={newRoute.year} onChange={(e) => setNewRoute({ ...newRoute, year: e.target.value })} />
          <input type="number" className="p-2 text-black rounded" placeholder="GHG Intensity (e.g. 90.5)" value={newRoute.ghgIntensity} onChange={(e) => setNewRoute({ ...newRoute, ghgIntensity: e.target.value })} />
          <input type="number" className="p-2 text-black rounded" placeholder="Fuel Consumption (e.g. 5000)" value={newRoute.fuelConsumption} onChange={(e) => setNewRoute({ ...newRoute, fuelConsumption: e.target.value })} />
          <input type="number" className="p-2 text-black rounded" placeholder="Distance (e.g. 10000)" value={newRoute.distance} onChange={(e) => setNewRoute({ ...newRoute, distance: e.target.value })} />
          <input type="number" className="p-2 text-black rounded" placeholder="Total Emissions (e.g. 2000)" value={newRoute.totalEmissions} onChange={(e) => setNewRoute({ ...newRoute, totalEmissions: e.target.value })} />
        </div>

        <button className="bg-green-500 px-4 py-2 rounded hover:bg-green-600" onClick={handleCreateRoute}>
          Add Route
        </button>
      </div>
    </div>
  );
}