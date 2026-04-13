import { BankingRepository } from "../ports/banking.repository";
import { RouteRepository } from "../ports/route.repository";
import { round2 } from "../utils/number.util";

export class ApplyBankedUseCase {
  constructor(
    private routeRepo: RouteRepository,
    private bankingRepo: BankingRepository,
  ) {}

  async execute(routeId: string, amount: number) {
    if (amount <= 0) {
      throw new Error("Amount must be greater than 0");
    }

    const routes = await this.routeRepo.findAll();
    const route = routes.find((r) => r.routeId === routeId);

    if (!route) throw new Error("Route not found");

    const TARGET = 89.3368;
    const energy = route.fuelConsumption * 41000;
    const cbBefore = (TARGET - route.ghgIntensity) * energy;

    if (cbBefore >= 0) {
      throw new Error("No deficit to apply");
    }

    const deficit = -cbBefore;

    if (amount > deficit) {
      throw new Error("Amount exceeds required deficit");
    }

    const available = await this.bankingRepo.getTotalBankedAll(route.year);

    if (amount > available) {
      throw new Error("Not enough banked amount");
    }

    await this.bankingRepo.deductBank(route.year, amount);

    const cbAfter = cbBefore + amount;

    return {
      routeId: route.routeId,
      cb_before: round2(cbBefore),
      applied: amount,
      cb_after: round2(cbAfter),
    };
  }
}
