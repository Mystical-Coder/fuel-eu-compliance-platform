import { RouteRepository } from "../ports/route.repository";

export class SetBaselineUseCase {
  constructor(private routeRepo: RouteRepository) {}

  async execute(routeId: string) {
    await this.routeRepo.setBaseline(routeId);
  }
}