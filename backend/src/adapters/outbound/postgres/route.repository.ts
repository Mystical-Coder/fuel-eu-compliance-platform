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
      [routeId],
    );
  }
  async findBaseline() {
    const result = await pool.query(
      `SELECT * FROM routes WHERE is_baseline = true LIMIT 1`,
    );

    if (result.rows.length === 0) return null;

    const row = result.rows[0];

    return {
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
    };
  }
  async addRoute(route: any) {
    await pool.query(
      `INSERT INTO routes 
    (route_id, vessel_type, fuel_type, year, ghg_intensity, fuel_consumption, distance, total_emissions, is_baseline)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,false)`,
      [
        route.routeId,
        route.vesselType,
        route.fuelType,
        route.year,
        route.ghgIntensity,
        route.fuelConsumption,
        route.distance,
        route.totalEmissions,
      ],
    );
  }
}
