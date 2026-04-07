// Cenový algoritmus pro firmy podle specu zajcon-firmy

export interface PricingFactors {
  stariRoky: number;
  zakladniKapital: number;
  platceDph: boolean;
  historieObratu: boolean;
  cistyStav?: boolean;
  premium?: boolean;
}

export interface PriceBreakdownItem {
  factor: string;
  adjustment: number;
}

export interface PriceResult {
  basePrice: number;
  finalPrice: number;
  breakdown: PriceBreakdownItem[];
  suggestedRange: {
    min: number;
    max: number;
  };
}

const BASE_PRICE = 25_000;

const AGE_BONUS: Array<[number, number]> = [
  [1, 5_000],
  [2, 10_000],
  [3, 15_000],
  [5, 30_000],
  [7, 50_000],
  [10, 80_000],
  [15, 120_000],
];

const ZK_BONUS: Array<[number, number]> = [
  [1_000, 0],
  [50_000, 5_000],
  [100_000, 10_000],
  [200_000, 20_000],
  [500_000, 40_000],
  [1_000_000, 70_000],
  [2_000_000, 100_000],
];

const PLATCE_DPH_BONUS = 15_000;
const HISTORIE_OBRATU_BONUS = 25_000;
const PREMIUM_MULTIPLIER = 1.2;

export function calculatePrice(factors: PricingFactors): PriceResult {
  let price = BASE_PRICE;
  const breakdown: PriceBreakdownItem[] = [];

  let ageBonus = 0;
  for (const [years, bonus] of AGE_BONUS) {
    if (factors.stariRoky >= years) ageBonus = bonus;
  }
  if (ageBonus > 0) {
    price += ageBonus;
    breakdown.push({
      factor: `Stáří ${factors.stariRoky} ${plural(factors.stariRoky, "rok", "roky", "let")}`,
      adjustment: ageBonus,
    });
  }

  let zkBonus = 0;
  for (const [zk, bonus] of ZK_BONUS) {
    if (factors.zakladniKapital >= zk) zkBonus = bonus;
  }
  if (zkBonus > 0) {
    price += zkBonus;
    breakdown.push({
      factor: `Základní kapitál ${formatCurrency(factors.zakladniKapital)}`,
      adjustment: zkBonus,
    });
  }

  if (factors.platceDph) {
    price += PLATCE_DPH_BONUS;
    breakdown.push({ factor: "Plátce DPH", adjustment: PLATCE_DPH_BONUS });
  }

  if (factors.historieObratu) {
    price += HISTORIE_OBRATU_BONUS;
    breakdown.push({
      factor: "Aktivní historie obratu",
      adjustment: HISTORIE_OBRATU_BONUS,
    });
  }

  if (factors.premium) {
    const premiumDiff = Math.round(price * (PREMIUM_MULTIPLIER - 1));
    price += premiumDiff;
    breakdown.push({ factor: "Premium listing", adjustment: premiumDiff });
  }

  price = Math.round(price / 1000) * 1000;

  return {
    basePrice: BASE_PRICE,
    finalPrice: price,
    breakdown,
    suggestedRange: {
      min: Math.round((price * 0.85) / 1000) * 1000,
      max: Math.round((price * 1.15) / 1000) * 1000,
    },
  };
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("cs-CZ").format(amount) + " Kč";
}

function plural(n: number, one: string, few: string, many: string): string {
  if (n === 1) return one;
  if (n >= 2 && n <= 4) return few;
  return many;
}
