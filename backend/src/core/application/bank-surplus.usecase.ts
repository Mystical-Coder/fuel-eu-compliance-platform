import { BankingRepository } from "../ports/banking.repository";
import { RouteRepository } from "../ports/route.repository";

export class BankSurplusUseCase {
  constructor(
    private routeRepo: RouteRepository,
    private bankingRepo: BankingRepository,
  ) {}

  async execute(routeId: string) {
    const routes = await this.routeRepo.findAll();
    const route = routes.find((r) => r.routeId === routeId);

    if (!route) throw new Error("Route not found");

    const TARGET = 89.3368;
    const energy = route.fuelConsumption * 41000;
    const cb = (TARGET - route.ghgIntensity) * energy;

    if (cb <= 0) {
      throw new Error("Cannot bank deficit");
    }

    await this.bankingRepo.saveBank(route.routeId, route.year, cb);

    return {
      routeId: route.routeId,
      banked: Number(cb.toFixed(2)),
    };
  }
}