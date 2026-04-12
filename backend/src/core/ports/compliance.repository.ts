export interface ComplianceRepository {
  saveCB(shipId: string, year: number, cb: number): Promise<void>;
}