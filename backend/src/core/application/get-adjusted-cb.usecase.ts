import { ComplianceRepository } from "../ports/compliance.repository";
import { BankingRepository } from "../ports/banking.repository";

export class GetAdjustedCBUseCase {
  constructor(
    private complianceRepo: ComplianceRepository,
    private bankingRepo: BankingRepository,
  ) {}

  async execute(year: number) {
    const cbList = await this.complianceRepo.getCBByYear(year);
    const bankList = await this.bankingRepo.getBankedByYear(year);

    return cbList.map((cb) => {
      const bank = bankList.find((b) => b.ship_id === cb.ship_id);

      let adjusted = cb.cb_gco2eq;

      if (cb.cb_gco2eq < 0 && bank) {
        adjusted = cb.cb_gco2eq + Number(bank.total);
      }

      return {
        shipId: cb.ship_id,
        cb: Number(cb.cb_gco2eq.toFixed(2)),
        adjustedCB: Number(adjusted.toFixed(2)),
      };
    });
  }
}
