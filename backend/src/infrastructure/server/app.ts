import express from "express";
import routesController from "../../adapters/inbound/http/routes.controller";
import complianceController from "../../adapters/inbound/http/compliance.controller";
import bankingController from "../../adapters/inbound/http/banking.controller";

const app = express();

app.use(express.json());
app.use("/", routesController);
app.use("/", complianceController);
app.use("/", bankingController);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
