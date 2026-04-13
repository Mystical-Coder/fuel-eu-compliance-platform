const BASE_URL = "http://localhost:3000";

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
};
