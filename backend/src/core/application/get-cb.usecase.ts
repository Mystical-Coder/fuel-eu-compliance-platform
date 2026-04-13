import { ComplianceRepository } from "../ports/compliance.repository";
import { RouteRepository } from "../ports/route.repository";

export class GetCBUseCase {
  constructor(
    private complianceRepo: ComplianceRepository,
    private routeRepo: RouteRepository
  ) {}

  async execute(year: number) {
    const TARGET = 89.3368;

    const routes = await this.routeRepo.findAll();

    const filteredRoutes = routes.filter((r) => r.year === year);

    const result = [];

    for (const route of filteredRoutes) {
      const energy = route.fuelConsumption * 41000;
      const cb = (TARGET - route.ghgIntensity) * energy;

      await this.complianceRepo.saveCB(route.routeId, route.year, cb);

      result.push({
        shipId: route.routeId,
        year: route.year,
        cb: Number(cb.toFixed(2)),
      });
    }

    return result.sort((a, b) => b.cb - a.cb);
  }
}