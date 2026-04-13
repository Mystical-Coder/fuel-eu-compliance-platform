import { BankingRepository } from "../ports/banking.repository";
import { round2 } from "../utils/number.util";

export class GetBankingRecordsUseCase {
  constructor(private bankingRepo: BankingRepository) {}

  async execute(year: number, shipId?: string) {
    const data = await this.bankingRepo.getRecords(year, shipId);

    return data.map((row) => ({
      shipId: row.ship_id,
      year: row.year,
      amount: round2(row.amount_gco2eq),
    }));
  }
}