import express from "express";
import { ComputeCBUseCase } from "../../../core/application/compute-cb.usecase";
import { RouteRepositoryImpl } from "../../outbound/postgres/route.repository";
import { ComplianceRepositoryImpl } from "../../outbound/postgres/compliance.repository";

const router = express.Router();

const routeRepo = new RouteRepositoryImpl();
const complianceRepo = new ComplianceRepositoryImpl();

const computeCBUseCase = new ComputeCBUseCase(routeRepo, complianceRepo);

router.get("/compliance/cb/:routeId", async (req, res) => {
  try {
    const data = await computeCBUseCase.execute(req.params.routeId);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;