import { RouteRepository } from "../ports/route.repository";
import { PoolRepository } from "../ports/pool.repository";

export class CreatePoolUseCase {
  constructor(
    private routeRepo: RouteRepository,
    private poolRepo: PoolRepository
  ) {}

  async execute(routeIds: string[]) {
    const routes = await this.routeRepo.findAll();
    const TARGET = 89.3368;

    // 1️⃣ Compute CB
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

    // 2️⃣ Validate total >= 0
    const total = members.reduce((sum, m) => sum + m.cbBefore, 0);
    if (total < 0) throw new Error("Pool sum must be >= 0");

    // 3️⃣ Split surplus & deficit
    const surplus = members.filter((m) => m.cbBefore > 0);
    const deficit = members.filter((m) => m.cbBefore < 0);

    // Sort
    surplus.sort((a, b) => b.cbBefore - a.cbBefore);
    deficit.sort((a, b) => a.cbBefore - b.cbBefore);

    // 4️⃣ Greedy allocation
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

      // ❗ Safety: deficit should not become worse
      if (d.cbAfter < d.cbBefore) {
        throw new Error("Deficit ship cannot exit worse");
      }
    }

    // ❗ Safety: surplus should not become negative
    for (const s of surplus) {
      if (s.cbAfter < 0) {
        throw new Error("Surplus ship cannot exit negative");
      }
    }

    // 5️⃣ Save pool
    const year = new Date().getFullYear();
    const poolId = await this.poolRepo.createPool(year);

    for (const m of members) {
      await this.poolRepo.saveMember(
        poolId,
        m.shipId,
        Number(m.cbBefore.toFixed(2)),
        Number(m.cbAfter.toFixed(2))
      );
    }

    // 6️⃣ Compute pool sum
    const poolSum = members.reduce((sum, m) => sum + m.cbAfter, 0);

    // 7️⃣ Clean response
    return {
      poolId,
      poolSum: Number(poolSum.toFixed(2)),
      members: members.map((m) => ({
        shipId: m.shipId,
        cbBefore: Number(m.cbBefore.toFixed(2)),
        cbAfter: Number(m.cbAfter.toFixed(2)),
      })),
    };
  }
}