// ARES integrace - veřejné API českého rejstříku ekonomických subjektů
//
// Dva endpointy:
//   1. /ekonomicke-subjekty/{ico}    - základní info (název, sídlo, NACE, datum vzniku)
//   2. /ekonomicke-subjekty-vr/{ico} - Veřejný rejstřík (obsahuje základní kapitál + historii)
//
// Voláme oba a slučujeme. ZK je dostupný JEN ve VR endpointu.

export interface ParsedCompanyData {
  ico: string;
  nazev: string;
  datumZalozeni: Date;
  sidlo: {
    ulice: string;
    mesto: string;
    psc: string;
  };
  pravniForma: string;
  predmetPodnikani: string[];
  zakladniKapital: number; // Z VR endpointu, fallback 1000 (minimum CZ)
  aktivni: boolean;
}

interface AresAdresa {
  textovaAdresa?: string;
  nazevObce?: string;
  psc?: string | number;
  nazevUlice?: string;
  cisloDomovni?: number;
  cisloOrientacni?: number;
}

interface AresResponse {
  ico: string;
  obchodniJmeno: string;
  sidlo?: AresAdresa;
  pravniForma?: string;
  datumVzniku?: string;
  datumZaniku?: string;
  czNace?: string[];
}

interface VrZakladniKapital {
  datumZapisu?: string;
  datumVymazu?: string;
  typJmeni?: string;
  vklad?: {
    typObnos?: string;
    hodnota?: string;
  };
}

interface VrZaznam {
  rejstrik?: string;
  primarniZaznam?: boolean;
  zakladniKapital?: VrZakladniKapital[];
}

interface VrResponse {
  icoId?: string;
  zaznamy?: VrZaznam[];
}

/**
 * Načte základní kapitál z ARES Veřejného rejstříku.
 * Vrací 1000 (minimum CZ s.r.o.) pokud VR endpoint neexistuje nebo nemá ZK.
 */
async function fetchZakladniKapitalFromVr(ico: string): Promise<number> {
  try {
    const res = await fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty-vr/${ico}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 86400 },
      }
    );
    if (!res.ok) return 1000;

    const data = (await res.json()) as VrResponse;
    const primarni = data.zaznamy?.find((z) => z.primarniZaznam) ?? data.zaznamy?.[0];
    if (!primarni?.zakladniKapital) return 1000;

    // Vezmeme aktuální záznam (bez datumVymazu)
    const aktualni =
      primarni.zakladniKapital.find((zk) => !zk.datumVymazu) ??
      primarni.zakladniKapital[primarni.zakladniKapital.length - 1];

    if (!aktualni?.vklad?.hodnota) return 1000;

    // Hodnota přichází jako "200000;00" nebo "20000" - parsujeme integer část
    const hodnotaStr = aktualni.vklad.hodnota.split(";")[0].split(",")[0].split(".")[0];
    const parsed = parseInt(hodnotaStr, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 1000;
  } catch {
    return 1000;
  }
}

const PRAVNI_FORMA_SRO = "112";

export async function fetchFromAres(
  ico: string
): Promise<ParsedCompanyData | null> {
  const cleanIco = ico.replace(/\s/g, "");
  if (!/^\d{8}$/.test(cleanIco)) {
    throw new Error("IČO musí obsahovat přesně 8 číslic");
  }

  // Paralelně načteme oba endpointy - základní info + Veřejný rejstřík (pro ZK)
  const [response, zakladniKapital] = await Promise.all([
    fetch(
      `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${cleanIco}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 86400 },
      }
    ),
    fetchZakladniKapitalFromVr(cleanIco),
  ]);

  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`ARES API chyba: ${response.status}`);
  }

  const data = (await response.json()) as AresResponse;

  if (data.pravniForma !== PRAVNI_FORMA_SRO) {
    throw new Error("Společnost není s.r.o.");
  }

  if (data.datumZaniku) {
    throw new Error("Společnost byla zrušena");
  }

  if (!data.datumVzniku) {
    throw new Error("Datum vzniku není k dispozici");
  }

  const sidlo = data.sidlo ?? {};
  const ulice = sidlo.nazevUlice
    ? `${sidlo.nazevUlice} ${sidlo.cisloDomovni ?? ""}${sidlo.cisloOrientacni ? `/${sidlo.cisloOrientacni}` : ""}`.trim()
    : sidlo.textovaAdresa ?? "";

  return {
    ico: data.ico,
    nazev: data.obchodniJmeno,
    datumZalozeni: new Date(data.datumVzniku),
    sidlo: {
      ulice,
      mesto: sidlo.nazevObce ?? "",
      psc: String(sidlo.psc ?? "").replace(/\s/g, ""),
    },
    pravniForma: "s.r.o.",
    predmetPodnikani: data.czNace ?? [],
    zakladniKapital,
    aktivni: true,
  };
}

export function calculateAge(datumZalozeni: Date | string): number {
  const date =
    typeof datumZalozeni === "string" ? new Date(datumZalozeni) : datumZalozeni;
  const now = new Date();
  let years = now.getFullYear() - date.getFullYear();
  const m = now.getMonth() - date.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < date.getDate())) {
    years--;
  }
  return Math.max(0, years);
}
