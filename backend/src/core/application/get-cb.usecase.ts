import { ComplianceRepository } from "../ports/compliance.repository";

export class GetCBUseCase {
  constructor(private complianceRepo: ComplianceRepository) {}

  async execute(year: number) {
    const data = await this.complianceRepo.getCBByYear(year);

    return data.map((row) => ({
      shipId: row.ship_id,
      year: row.year,
      cb: Number(Number(row.cb_gco2eq).toFixed(2)),
    }));
  }
}
