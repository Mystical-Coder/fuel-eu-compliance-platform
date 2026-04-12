import { pool } from "../../../infrastructure/db/connection";
import { ComplianceRepository } from "../../../core/ports/compliance.repository";

export class ComplianceRepositoryImpl implements ComplianceRepository {
  async saveCB(shipId: string, year: number, cb: number): Promise<void> {
    await pool.query(
      `INSERT INTO ship_compliance (ship_id, year, cb_gco2eq)
       VALUES ($1, $2, $3)`,
      [shipId, year, cb]
    );
  }
}