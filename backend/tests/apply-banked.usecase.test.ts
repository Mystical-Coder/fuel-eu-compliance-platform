import { ApplyBankedUseCase } from "../src/core/application/apply-banked.usecase";

describe("ApplyBankedUseCase", () => {
  const mockRouteRepo = {
    findAll: jest.fn(),
  };

  const mockBankingRepo = {
    getTotalBankedAll: jest.fn(),
    deductBank: jest.fn(),
  };

  const useCase = new ApplyBankedUseCase(
    mockRouteRepo as any,
    mockBankingRepo as any
  );

  beforeEach(() => {
    jest.clearAllMocks();

    mockRouteRepo.findAll.mockResolvedValue([
      {
        routeId: "R003",
        year: 2024,
        fuelConsumption: 10000,
        ghgIntensity: 95,
      },
    ]);
  });

  test("should apply valid amount", async () => {
    mockBankingRepo.getTotalBankedAll.mockResolvedValue(500000000);

    const result = await useCase.execute("R003", 100000000);

    expect(result.applied).toBe(100000000);
    expect(mockBankingRepo.deductBank).toHaveBeenCalled();
  });

  test("should fail when amount exceeds deficit", async () => {
    mockBankingRepo.getTotalBankedAll.mockResolvedValue(1000000000);

    await expect(
      useCase.execute("R003", 9999999999)
    ).rejects.toThrow("Amount exceeds required deficit");
  });

  test("should fail when not enough bank", async () => {
    mockBankingRepo.getTotalBankedAll.mockResolvedValue(50000000);

    await expect(
      useCase.execute("R003", 100000000)
    ).rejects.toThrow("Not enough banked amount");
  });

  test("should fail for negative amount", async () => {
    await expect(
      useCase.execute("R003", -100)
    ).rejects.toThrow("Amount must be greater than 0");
  });
});