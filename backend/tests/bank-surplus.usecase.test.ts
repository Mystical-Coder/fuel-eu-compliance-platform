import { BankSurplusUseCase } from "../src/core/application/bank-surplus.usecase";

describe("BankSurplusUseCase", () => {
  const mockRouteRepo = {
    findAll: jest.fn(),
  };

  const mockBankingRepo = {
    saveBank: jest.fn(),
  };

  const useCase = new BankSurplusUseCase(
    mockRouteRepo as any,
    mockBankingRepo as any
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should bank surplus when CB is positive", async () => {
    mockRouteRepo.findAll.mockResolvedValue([
      {
        routeId: "R002",
        year: 2024,
        fuelConsumption: 10000,
        ghgIntensity: 80,
      },
    ]);

    const result = await useCase.execute("R002");

    expect(result.banked).toBeGreaterThan(0);
    expect(mockBankingRepo.saveBank).toHaveBeenCalled();
  });

  test("should throw error when no surplus", async () => {
    mockRouteRepo.findAll.mockResolvedValue([
      {
        routeId: "R001",
        year: 2024,
        fuelConsumption: 10000,
        ghgIntensity: 95,
      },
    ]);

    await expect(useCase.execute("R001")).rejects.toThrow(
      "Cannot bank deficit"
    );
  });
});