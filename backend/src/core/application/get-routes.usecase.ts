import { RouteRepository } from "../ports/route.repository";

export class GetRoutesUseCase {
  constructor(private routeRepo: RouteRepository) {}

  async execute() {
    return this.routeRepo.findAll();
  }
}