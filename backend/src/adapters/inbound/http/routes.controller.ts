import express from "express";
import { GetRoutesUseCase } from "../../../core/application/get-routes.usecase";
import { RouteRepositoryImpl } from "../../outbound/postgres/route.repository";
import { SetBaselineUseCase } from "../../../core/application/set-baseline.usecase";
import { GetComparisonUseCase } from "../../../core/application/get-comparison.usecase";


const router = express.Router();

const routeRepo = new RouteRepositoryImpl();
const getRoutesUseCase = new GetRoutesUseCase(routeRepo);
const setBaselineUseCase = new SetBaselineUseCase(routeRepo);
const getComparisonUseCase = new GetComparisonUseCase(routeRepo);


router.get("/routes", async (req, res) => {
  const data = await getRoutesUseCase.execute();
  res.json(data);
});

router.post("/routes/:id/baseline", async (req, res) => {
  const routeId = req.params.id;

  await setBaselineUseCase.execute(routeId);

  res.json({ message: "Baseline set successfully" });
});

router.get("/routes/comparison", async (req, res) => {
  try {
    const data = await getComparisonUseCase.execute();
    res.json(data);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;