// ARES integrace - veřejné API českého rejstříku ekonomických subjektů

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

const PRAVNI_FORMA_SRO = "112";

export async function fetchFromAres(
  ico: string
): Promise<ParsedCompanyData | null> {
  const cleanIco = ico.replace(/\s/g, "");
  if (!/^\d{8}$/.test(cleanIco)) {
    throw new Error("IČO musí obsahovat přesně 8 číslic");
  }

  const response = await fetch(
    `https://ares.gov.cz/ekonomicke-subjekty-v-be/rest/ekonomicke-subjekty/${cleanIco}`,
    {
      headers: { Accept: "application/json" },
      next: { revalidate: 86400 },
    }
  );

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
