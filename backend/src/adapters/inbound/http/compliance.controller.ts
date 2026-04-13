import express from "express";
import { ComputeCBUseCase } from "../../../core/application/compute-cb.usecase";
import { RouteRepositoryImpl } from "../../outbound/postgres/route.repository";
import { ComplianceRepositoryImpl } from "../../outbound/postgres/compliance.repository";
import { GetCBUseCase } from "../../../core/application/get-cb.usecase";
import { GetAdjustedCBUseCase } from "../../../core/application/get-adjusted-cb.usecase";
import { BankingRepositoryImpl } from "../../outbound/postgres/banking.repository";

const router = express.Router();

const routeRepo = new RouteRepositoryImpl();
const complianceRepo = new ComplianceRepositoryImpl();

const computeCBUseCase = new ComputeCBUseCase(routeRepo, complianceRepo);
const getCBUseCase = new GetCBUseCase(complianceRepo);
const bankingRepo = new BankingRepositoryImpl();
const getAdjustedCBUseCase = new GetAdjustedCBUseCase(
  complianceRepo,
  bankingRepo
);

router.get("/compliance/cb/:routeId", async (req, res) => {
  try {
    const data = await computeCBUseCase.execute(req.params.routeId);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/compliance/cb", async (req, res) => {
  try {
    const year = Number(req.query.year);
    const data = await getCBUseCase.execute(year);
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
router.get("/compliance/adjusted-cb", async (req, res) => {
  try {
    const { year, shipId } = req.query;

    if (!year) {
      return res.status(400).json({ error: "year is required" });
    }

    const data = await getAdjustedCBUseCase.execute(Number(year));

    if (shipId) {
      return res.json(data.filter((d) => d.shipId === String(shipId)));
    }

    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
router.get("/compliance/cb", async (req, res) => {
  try {
    const { year, shipId } = req.query;

    if (!year) {
      return res.status(400).json({ error: "year is required" });
    }

    const data = await getCBUseCase.execute(Number(year));

    if (shipId) {
      return res.json(data.filter((d) => d.shipId === String(shipId)));
    }

    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});
export default router;
