import express from "express";
import { BankSurplusUseCase } from "../../../core/application/bank-surplus.usecase";
import { RouteRepositoryImpl } from "../../outbound/postgres/route.repository";
import { BankingRepositoryImpl } from "../../outbound/postgres/banking.repository";
import { ApplyBankedUseCase } from "../../../core/application/apply-banked.usecase";
import { pool } from "../../../infrastructure/db/connection";

const router = express.Router();

const routeRepo = new RouteRepositoryImpl();
const bankingRepo = new BankingRepositoryImpl();

const bankSurplusUseCase = new BankSurplusUseCase(routeRepo, bankingRepo);
const applyBankedUseCase = new ApplyBankedUseCase(routeRepo, bankingRepo);

router.post("/banking/bank", async (req, res) => {
  try {
    const { routeId } = req.body;
    if (!routeId || typeof routeId !== "string") {
      return res.status(400).json({
        error: "Valid routeId is required",
      });
    }

    const data = await bankSurplusUseCase.execute(routeId);

    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.post("/banking/apply", async (req, res) => {
  try {
    const { routeId, amount } = req.body;

    const data = await applyBankedUseCase.execute(routeId, amount);

    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/banking/records", async (req, res) => {
  try {
    const { shipId, year } = req.query;

    const result = await pool.query(
      `SELECT ship_id, year, amount_gco2eq
       FROM bank_entries
       WHERE ship_id = $1 AND year = $2`,
      [shipId, year]
    );

    res.json(
      result.rows.map((row) => ({
        shipId: row.ship_id,
        year: row.year,
        amount: Number(row.amount_gco2eq.toFixed(2)),
      }))
    );
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
export default router;
