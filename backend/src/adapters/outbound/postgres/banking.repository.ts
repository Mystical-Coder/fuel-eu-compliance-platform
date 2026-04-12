import { pool } from "../../../infrastructure/db/connection";
import { BankingRepository } from "../../../core/ports/banking.repository";

export class BankingRepositoryImpl implements BankingRepository {
  async saveBank(shipId: string, year: number, amount: number) {
    await pool.query(
      `INSERT INTO bank_entries (ship_id, year, amount_gco2eq)
       VALUES ($1, $2, $3)`,
      [shipId, year, amount],
    );
  }

  async getTotalBankedAll(year: number): Promise<number> {
    const result = await pool.query(
      `SELECT COALESCE(SUM(amount_gco2eq), 0) AS total
     FROM bank_entries
     WHERE year = $1`,
      [year],
    );

    return Number(result.rows[0].total);
  }

  async deductBank(shipId: string, year: number, amount: number) {
    await pool.query(
      `INSERT INTO bank_entries (ship_id, year, amount_gco2eq)
     VALUES ($1, $2, $3)`,
      [shipId, year, -amount],
    );
  }
  async getBankedByYear(year: number) {
    const result = await pool.query(
      `SELECT ship_id, SUM(amount_gco2eq) AS total
     FROM bank_entries
     WHERE year = $1
     GROUP BY ship_id`,
      [year],
    );

    return result.rows;
  }
}
