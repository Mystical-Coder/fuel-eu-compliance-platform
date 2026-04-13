import { CreatePoolUseCase } from "../src/core/application/create-pool.usecase";

describe("CreatePoolUseCase", () => {
  const mockRouteRepo = {
    findAll: jest.fn(),
  };

  const mockPoolRepo = {
    createPool: jest.fn(),
    saveMember: jest.fn(),
  };

  const mockComplianceRepo = {
    getCBByYear: jest.fn(),
  };

  const useCase = new CreatePoolUseCase(
    mockRouteRepo as any,
    mockPoolRepo as any,
    mockComplianceRepo as any
  );

  beforeEach(() => {
    jest.clearAllMocks();

    mockRouteRepo.findAll.mockResolvedValue([
      { routeId: "R002", year: 2024 },
      { routeId: "R006", year: 2024 },
      { routeId: "R001", year: 2024 },
    ]);

    mockComplianceRepo.getCBByYear.mockResolvedValue([
      { ship_id: "R002", cb_gco2eq: 263082240 },
      { ship_id: "R006", cb_gco2eq: 1066852800 },
      { ship_id: "R001", cb_gco2eq: -340956000 },
    ]);

    mockPoolRepo.createPool.mockResolvedValue(1);
    mockPoolRepo.saveMember.mockResolvedValue(undefined);
  });

  it("should create pool and redistribute CB correctly", async () => {
    const result = await useCase.execute(["R002", "R006", "R001"]);

    expect(result.poolId).toBeDefined();
    expect(result.poolSum).toBeGreaterThanOrEqual(0);
    expect(result.members.length).toBe(3);
  });

  it("should throw error if duplicate routeIds", async () => {
    await expect(
      useCase.execute(["R002", "R002"])
    ).rejects.toThrow("Duplicate routeIds are not allowed");
  });

  it("should throw error if pool sum is negative", async () => {
    mockComplianceRepo.getCBByYear.mockResolvedValue([
      { ship_id: "R002", cb_gco2eq: -100 },
      { ship_id: "R006", cb_gco2eq: -200 },
    ]);

    await expect(
      useCase.execute(["R002", "R006"])
    ).rejects.toThrow("Pool sum must be >= 0");
  });

  it("should throw error if routes belong to different years", async () => {
    mockRouteRepo.findAll.mockResolvedValue([
      { routeId: "R002", year: 2024 },
      { routeId: "R004", year: 2025 },
    ]);

    mockComplianceRepo.getCBByYear.mockImplementation((year: number) => {
      if (year === 2024) {
        return Promise.resolve([
          { ship_id: "R002", cb_gco2eq: 100 },
        ]);
      }
      if (year === 2025) {
        return Promise.resolve([
          { ship_id: "R004", cb_gco2eq: 200 },
        ]);
      }
      return Promise.resolve([]);
    });

    await expect(
      useCase.execute(["R002", "R004"])
    ).rejects.toThrow("All routes must belong to same year");
  });
});