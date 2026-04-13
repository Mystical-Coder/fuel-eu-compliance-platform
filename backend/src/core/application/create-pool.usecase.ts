import { RouteRepository } from "../ports/route.repository";
import { PoolRepository } from "../ports/pool.repository";
import { round2 } from "../utils/number.util";

export class CreatePoolUseCase {
  constructor(
    private routeRepo: RouteRepository,
    private poolRepo: PoolRepository,
  ) {}

  async execute(routeIds: string[]) {
    if (!routeIds || routeIds.length === 0) {
      throw new Error("At least one routeId is required to create a pool");
    }

    const uniqueIds = new Set(routeIds);

    if (uniqueIds.size !== routeIds.length) {
      throw new Error("Duplicate routeIds are not allowed");
    }
    const routes = await this.routeRepo.findAll();
    const TARGET = 89.3368;

    const members = routeIds.map((id) => {
      const r = routes.find((x) => x.routeId === id);
      if (!r) throw new Error(`Route ${id} not found`);

      const energy = r.fuelConsumption * 41000;
      const cb = (TARGET - r.ghgIntensity) * energy;

      return {
        shipId: r.routeId,
        cbBefore: cb,
        cbAfter: cb,
      };
    });

    const total = members.reduce((sum, m) => sum + m.cbBefore, 0);
    if (total < 0) throw new Error("Pool sum must be >= 0");

    const surplus = members.filter((m) => m.cbBefore > 0);
    const deficit = members.filter((m) => m.cbBefore < 0);

    surplus.sort((a, b) => b.cbBefore - a.cbBefore);
    deficit.sort((a, b) => a.cbBefore - b.cbBefore);

    for (const d of deficit) {
      let needed = -d.cbAfter;

      for (const s of surplus) {
        if (needed <= 0) break;
        if (s.cbAfter <= 0) continue;

        const transfer = Math.min(s.cbAfter, needed);

        s.cbAfter -= transfer;
        d.cbAfter += transfer;

        needed -= transfer;
      }

      if (d.cbAfter < d.cbBefore) {
        throw new Error("Deficit ship cannot exit worse");
      }
    }

    for (const s of surplus) {
      if (s.cbAfter < 0) {
        throw new Error("Surplus ship cannot exit negative");
      }
    }

    const years = new Set<number>();

    for (const id of routeIds) {
      const route = routes.find((r) => r.routeId === id);

      if (!route || route.year === undefined) {
        throw new Error(`Invalid year for route ${id}`);
      }

      years.add(route.year);
    }

    if (years.size !== 1) {
      throw new Error("All routes must belong to same year");
    }

    const year = [...years][0];
    const poolId = await this.poolRepo.createPool(year);

    for (const m of members) {
      await this.poolRepo.saveMember(
        poolId,
        m.shipId,
        round2(m.cbBefore),
        round2(m.cbAfter),
      );
    }

    const poolSum = members.reduce((sum, m) => sum + m.cbAfter, 0);

    return {
      poolId,
      poolSum: round2(poolSum),
      members: members.map((m) => ({
        shipId: m.shipId,
        cbBefore: round2(m.cbBefore),
        cbAfter: round2(m.cbAfter),
      })),
    };
  }
}
