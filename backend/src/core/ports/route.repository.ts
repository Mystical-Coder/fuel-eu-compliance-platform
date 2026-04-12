import { Route } from "../domain/route";

export interface RouteRepository {
  findAll(): Promise<Route[]>;
  setBaseline(routeId: string): Promise<void>;
  findBaseline(): Promise<Route | null>;
}