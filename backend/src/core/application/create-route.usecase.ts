import { RouteRepository } from "../ports/route.repository";

export class CreateRouteUseCase {
  constructor(private routeRepo: RouteRepository) {}

  async execute(data: any) {
    if (!data.routeId) {
      throw new Error("routeId is required");
    }

    await this.routeRepo.addRoute(data);

    return { message: "Route created successfully" };
  }
}