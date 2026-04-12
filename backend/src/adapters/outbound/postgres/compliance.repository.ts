import { pool } from "../../../infrastructure/db/connection";
import { ComplianceRepository } from "../../../core/ports/compliance.repository";

export class ComplianceRepositoryImpl implements ComplianceRepository {
  async saveCB(shipId: string, year: number, cb: number): Promise<void> {
    await pool.query(
      `INSERT INTO ship_compliance (ship_id, year, cb_gco2eq)
   VALUES ($1, $2, $3)
   ON CONFLICT (ship_id, year)
   DO UPDATE SET cb_gco2eq = EXCLUDED.cb_gco2eq`,
      [shipId, year, cb],
    );
  }
  async getCBByYear(year: number) {
    const result = await pool.query(
      `SELECT ship_id, year, cb_gco2eq 
     FROM ship_compliance
     WHERE year = $1`,
      [year],
    );

    return result.rows;
  }
}
