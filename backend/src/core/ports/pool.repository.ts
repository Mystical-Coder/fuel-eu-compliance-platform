export interface PoolRepository {
  createPool(year: number): Promise<number>;
  saveMember(
    poolId: number,
    shipId: string,
    cbBefore: number,
    cbAfter: number
  ): Promise<void>;
}