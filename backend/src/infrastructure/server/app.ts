import express from "express";
import routesController from "../../adapters/inbound/http/routes.controller";

const app = express();

app.use(express.json());
app.use("/", routesController);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});