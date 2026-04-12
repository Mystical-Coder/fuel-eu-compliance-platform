import { pool } from "../../../infrastructure/db/connection";
import { PoolRepository } from "../../../core/ports/pool.repository";

export class PoolRepositoryImpl implements PoolRepository {
  async createPool(year: number): Promise<number> {
    const result = await pool.query(
      `INSERT INTO pools (year) VALUES ($1) RETURNING id`,
      [year]
    );
    return result.rows[0].id;
  }

  async saveMember(poolId: number, shipId: string, cbBefore: number, cbAfter: number) {
    await pool.query(
      `INSERT INTO pool_members (pool_id, ship_id, cb_before, cb_after)
       VALUES ($1, $2, $3, $4)`,
      [poolId, shipId, cbBefore, cbAfter]
    );
  }
}