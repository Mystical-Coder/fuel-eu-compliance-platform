import express from "express";
import cors from "cors";

import routesController from "../../adapters/inbound/http/routes.controller";
import complianceController from "../../adapters/inbound/http/compliance.controller";
import bankingController from "../../adapters/inbound/http/banking.controller";
import poolsController from "../../adapters/inbound/http/pools.controller";

const app = express();
export default app;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

app.use("/", routesController);
app.use("/", complianceController);
app.use("/", bankingController);
app.use("/", poolsController);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});