import express from "express";
import { CreatePoolUseCase } from "../../../core/application/create-pool.usecase";
import { RouteRepositoryImpl } from "../../outbound/postgres/route.repository";
import { PoolRepositoryImpl } from "../../outbound/postgres/pool.repository";
import { ComplianceRepositoryImpl } from "../../outbound/postgres/compliance.repository";

const router = express.Router();

const routeRepo = new RouteRepositoryImpl();
const poolRepo = new PoolRepositoryImpl();
const complianceRepo = new ComplianceRepositoryImpl();

const createPoolUseCase = new CreatePoolUseCase(
  routeRepo,
  poolRepo,
  complianceRepo
);

router.post("/pools", async (req, res) => {
  try {
    const { routeIds } = req.body;
    const data = await createPoolUseCase.execute(routeIds);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;