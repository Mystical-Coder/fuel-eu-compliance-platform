import express from "express";
import { BankSurplusUseCase } from "../../../core/application/bank-surplus.usecase";
import { RouteRepositoryImpl } from "../../outbound/postgres/route.repository";
import { BankingRepositoryImpl } from "../../outbound/postgres/banking.repository";

const router = express.Router();

const routeRepo = new RouteRepositoryImpl();
const bankingRepo = new BankingRepositoryImpl();

const bankSurplusUseCase = new BankSurplusUseCase(routeRepo, bankingRepo);

router.post("/banking/bank/:routeId", async (req, res) => {
  try {
    const data = await bankSurplusUseCase.execute(req.params.routeId);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;