const BASE_URL = "http://localhost:3000";
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
export const api = {
  getRoutes: async () => {
    const res = await fetch(`${BASE_URL}/routes`);
    return res.json();
  },

  setBaseline: async (routeId: string) => {
    const res = await fetch(`${BASE_URL}/routes/${routeId}/baseline`, {
      method: "POST",
    });
    return res.json();
  },
  getComparison: async () => {
    const res = await fetch(`${BASE_URL}/routes/comparison`);
    return res.json();
  },

  bank: async (routeId: string) => {
    const res = await fetch(`${BASE_URL}/banking/bank`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ routeId }),
    });
    return res.json();
  },

  apply: async (routeId: string, amount: number) => {
    const res = await fetch(`${BASE_URL}/banking/apply`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ routeId, amount }),
    });
    return res.json();
  },
  getCB: async (year: number) => {
    const res = await fetch(`${BASE_URL}/compliance/cb?year=${year}`);
    return res.json();
  },
  createPool: async (routeIds: string[]) => {
    const res = await fetch(`${BASE_URL}/pools`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ routeIds }),
    });
    return res.json();
  },
  getAdjustedCB: async (year: number) => {
    const res = await fetch(`${BASE_URL}/compliance/adjusted-cb?year=${year}`);
    return res.json();
  },
  getBankingRecords: async (year: number) => {
    const res = await fetch(
      `${BASE_URL}/banking/records?year=${year}&shipId=GLOBAL`,
    );
    return res.json();
  },
  getCBByRoute: async (routeId: string) => {
    const res = await fetch(`${BASE_URL}/compliance/cb/${routeId}`);
    return res.json();
  },
  createRoute: async (payload: CreateRoutePayload) => {
    const res = await fetch(`${BASE_URL}/routes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    return res.json();
  },
};
