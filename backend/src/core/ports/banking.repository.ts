export interface BankingRepository {
  saveBank(shipId: string, year: number, amount: number): Promise<void>;
  //   getTotalBanked(shipId: string, year: number): Promise<number>;
  deductBank(year: number, amount: number): Promise<void>;
  getTotalBankedAll(year: number): Promise<number>;
  getBankedByYear(year: number): Promise<any[]>;
  getRecords(year: number, shipId?: string): Promise<any[]>;
}
