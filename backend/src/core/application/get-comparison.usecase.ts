import { RouteRepository } from "../ports/route.repository";

export class GetComparisonUseCase {
  constructor(private routeRepo: RouteRepository) {}

  async execute() {
    const baseline = await this.routeRepo.findBaseline();

    if (!baseline) {
      throw new Error("Baseline not set");
    }

    const routes = await this.routeRepo.findAll();

    const TARGET = 89.3368;

    return routes
      .map((route) => {
        const percentDiff =
          (route.ghgIntensity / baseline.ghgIntensity - 1) * 100;

        return {
          routeId: route.routeId,
          ghgIntensity: route.ghgIntensity,
          percentDiff: Number(percentDiff.toFixed(2)),
          compliant: route.ghgIntensity <= TARGET,
          isBaseline: route.isBaseline,
        };
      })
      .sort((a, b) => Number(b.isBaseline) - Number(a.isBaseline));
  }
}
