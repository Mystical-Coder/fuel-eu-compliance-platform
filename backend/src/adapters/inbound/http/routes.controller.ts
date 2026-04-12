import express from "express";
import { GetRoutesUseCase } from "../../../core/application/get-routes.usecase";
import { RouteRepositoryImpl } from "../../outbound/postgres/route.repository";
import { SetBaselineUseCase } from "../../../core/application/set-baseline.usecase";

const router = express.Router();

const routeRepo = new RouteRepositoryImpl();
const getRoutesUseCase = new GetRoutesUseCase(routeRepo);
const setBaselineUseCase = new SetBaselineUseCase(routeRepo);

router.get("/routes", async (req, res) => {
  const data = await getRoutesUseCase.execute();
  res.json(data);
});

router.post("/routes/:id/baseline", async (req, res) => {
  const routeId = req.params.id;

  await setBaselineUseCase.execute(routeId);

  res.json({ message: "Baseline set successfully" });
});

export default router;