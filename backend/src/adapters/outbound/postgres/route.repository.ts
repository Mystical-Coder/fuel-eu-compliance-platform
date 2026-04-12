import { pool } from "../../../infrastructure/db/connection";
import { RouteRepository } from "../../../core/ports/route.repository";

export class RouteRepositoryImpl implements RouteRepository {
  async findAll() {
    const result = await pool.query("SELECT * FROM routes");

    return result.rows.map((row) => ({
      id: row.id,
      routeId: row.route_id,
      vesselType: row.vessel_type,
      fuelType: row.fuel_type,
      year: row.year,
      ghgIntensity: row.ghg_intensity,
      fuelConsumption: row.fuel_consumption,
      distance: row.distance,
      totalEmissions: row.total_emissions,
      isBaseline: row.is_baseline,
    }));
  }
  async setBaseline(routeId: string): Promise<void> {

    await pool.query(`UPDATE routes SET is_baseline = false`);


  await pool.query(
    `UPDATE routes SET is_baseline = true WHERE route_id = $1`,
    [routeId]
  );
}

}