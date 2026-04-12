import { RouteRepository } from "../ports/route.repository";
import { ComplianceRepository } from "../ports/compliance.repository";

export class ComputeCBUseCase {
  constructor(
    private routeRepo: RouteRepository,
    private complianceRepo: ComplianceRepository,
  ) {}

  async execute(routeId: string) {
    const routes = await this.routeRepo.findAll();
    const route = routes.find((r) => r.routeId === routeId);

    if (!route) {
      throw new Error("Route not found");
    }

    const TARGET = 89.3368;

    const energy = route.fuelConsumption * 41000;

    const cb = (TARGET - route.ghgIntensity) * energy;

    await this.complianceRepo.saveCB(route.routeId, route.year, cb);

    return {
      routeId: route.routeId,
      year: route.year,
      target: TARGET,
      cb: Number(cb.toFixed(2)),
      status: cb >= 0 ? "Surplus" : "Deficit",
    };
  }
}
