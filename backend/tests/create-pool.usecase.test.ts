import { CreatePoolUseCase } from "../src/core/application/create-pool.usecase";

describe("CreatePoolUseCase", () => {
  const mockRouteRepo = {
    findAll: jest.fn(),
  };

  const mockPoolRepo = {
    createPool: jest.fn().mockResolvedValue(1),
    saveMember: jest.fn(),
  };

  const useCase = new CreatePoolUseCase(
    mockRouteRepo as any,
    mockPoolRepo as any
  );

  beforeEach(() => {
    jest.clearAllMocks();

    mockRouteRepo.findAll.mockResolvedValue([
      {
        routeId: "R002",
        year: 2024,
        fuelConsumption: 10000,
        ghgIntensity: 80,
      },
      {
        routeId: "R003",
        year: 2024,
        fuelConsumption: 10000,
        ghgIntensity: 95,
      },
    ]);
  });

  test("should create valid pool", async () => {
    const result = await useCase.execute(["R002", "R003"]);

    expect(result.poolId).toBe(1);
    expect(result.members.length).toBe(2);
  });

  test("should fail for duplicate routes", async () => {
    await expect(
      useCase.execute(["R002", "R002"])
    ).rejects.toThrow("Duplicate routeIds are not allowed");
  });

  test("should fail for empty input", async () => {
    await expect(useCase.execute([])).rejects.toThrow(
      "At least one routeId is required"
    );
  });
});