export interface BankingRepository {
  saveBank(shipId: string, year: number, amount: number): Promise<void>;
  getTotalBanked(shipId: string, year: number): Promise<number>;
}