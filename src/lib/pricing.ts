// Cenový algoritmus pro firmy s.r.o.
//
// CALIBRACE PODLE REÁLNÉHO CZ TRHU (research 2025-04):
// Profispolečnosti.cz, Firmin.cz, Ceska-ready-made.cz, Profisídla.cz,
// Incorporated.cz, Easysupport.cz, Readymadesdph.cz, SmartCompanies.cz
//
// Reálné mediánové ceny CZ trhu (verify):
//   Nová RM (ZK 1k, neplátce):    12 900 Kč
//   ZK 200k, neplátce:            14 900 Kč
//   ZK 500k, neplátce:            19 900 Kč
//   ZK 1M, neplátce:              24 900 Kč
//   ZK 2M+, neplátce:             34 900 Kč
//   2-3 roky, ZK 200k:            25 000 Kč
//   5+ let, neplátce:             31 900 Kč
//   5+ let, plátce DPH:           85 000 Kč  ← skok kvůli DPH
//   10+ let, ZK 200k+, DPH:      120 000 Kč
//   15+ let premium s historií:  150-250 000 Kč

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

// Mediánová cena nové ready-made s.r.o. na CZ trhu (2025)
const BASE_PRICE = 12_900;

// Příplatky za stáří firmy (kumulativní, drží se nejvyššímu odpovídajícímu)
const AGE_BONUS: Array<[number, number]> = [
  [1, 2_000],
  [2, 5_000],
  [3, 10_000],
  [5, 20_000],
  [7, 30_000],
  [10, 50_000],
  [15, 100_000],
  [20, 150_000],
];

// Příplatky za základní kapitál
// (CZ trh nepřipočítává ZK 1:1 — jde o právní stav, ne reálný kapitál)
const ZK_BONUS: Array<[number, number]> = [
  [1_000, 0],
  [50_000, 1_000],
  [100_000, 1_500],
  [200_000, 2_000],
  [500_000, 7_000],
  [1_000_000, 12_000],
  [2_000_000, 22_000],
  [5_000_000, 40_000],
  [10_000_000, 60_000],
];

// DPH plátcovství je největší cenový skok na trhu (cca +55k)
const PLATCE_DPH_BONUS = 55_000;

// Aktivní historie obratu (firma už něco fakturovala)
const HISTORIE_OBRATU_BONUS = 30_000;

// Premium listing (značka, reference, top sídlo) — multiplikátor
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

  // Zaokrouhlení na 100 Kč (drobnější, aby šlo trefit cenu jako 12 900, 14 900...)
  price = Math.round(price / 100) * 100;

  return {
    basePrice: BASE_PRICE,
    finalPrice: price,
    breakdown,
    suggestedRange: {
      min: Math.round((price * 0.9) / 100) * 100,
      max: Math.round((price * 1.15) / 100) * 100,
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
