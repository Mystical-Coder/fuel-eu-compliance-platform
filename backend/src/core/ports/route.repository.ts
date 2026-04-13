import { Route } from "../domain/route";

export interface RouteRepository {
  findAll(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  findBaseline(): Promise<Route | null>;
  addRoute(route: {
    routeId: string;
    vesselType: string;
    fuelType: string;
    year: number;
    ghgIntensity: number;
    fuelConsumption: number;
    distance: number;
    totalEmissions: number;
  }): Promise<void>;
}
