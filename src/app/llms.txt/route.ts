// llms.txt - krátký přehled webu pro AI vyhledávače (Perplexity, ChatGPT, Claude)
// Spec: https://llmstxt.org/

export const dynamic = "force-dynamic";

export async function GET() {
  const content = `# Zajcon Firmy

> Český marketplace pro prodej a výkup hotových společností s.r.o. Nabízíme prověřené firmy s čistou historií k okamžitému převzetí pro bankovní úvěry, veřejné zakázky a rychlý start podnikání. Vykupujeme i firmy se závazky do 24 hodin.

Provozovatel: Zajíček Consulting s.r.o., IČO 07343957, Nové sady 988/2, 602 00 Brno, Česká republika
Kontakt: +420 733 179 199, firmy@zajcon.cz

## Co děláme

- **Prodej hotových firem (s.r.o.)** — prověřené společnosti s čistou historií, ready-made i firmy s historií, vhodné pro úvěry a tendry
- **Výkup s.r.o.** — vykupujeme firmy od majitelů, i se závazky, nezávazná nabídka do 24 hodin
- **Kompletní servis** — právní servis, notář, převod podílů, zápis do OR, vše za vás

## Klíčové stránky

- [Nabídka firem](https://firmy.zajcon.cz/firmy): Aktuální katalog volných s.r.o. k převzetí
- [Prodat firmu](https://firmy.zajcon.cz/prodat): Formulář pro výkup vaší společnosti
- [Pro úvěry](https://firmy.zajcon.cz/pro-uvery): Firmy vhodné pro bankovní financování
- [Pro tendry](https://firmy.zajcon.cz/pro-tendry): Společnosti pro veřejné zakázky
- [Ready-made](https://firmy.zajcon.cz/ready-made): Nově založené prázdné firmy

## Časté otázky

- **Garantujete čistotu firmy?** Ano, písemně. Každou společnost prověřujeme v insolvenčním rejstříku, u FÚ, ČSSZ a ZP. Pokud by se objevil závazek, neseme jej my.
- **Jak dlouho trvá převod?** 3–5 pracovních dnů od rezervace po zápis do OR. Podpis u notáře cca 1 hodina.
- **Co je v ceně?** Kompletní právní servis, příprava dokumentů, notářské poplatky, zápis do OR. Žádné skryté náklady.
- **Lze změnit název a sídlo?** Ano, současně s převodem nebo kdykoliv později.
- **Proč hotová firma místo nové?** Hotová firma s historií umožňuje okamžitě čerpat úvěry, účastnit se tendrů a budí důvěru u partnerů.

## Cenová orientace

- Ready-made (nově založená): od 25 000 Kč
- 2–3 roky stará: 35 000 – 45 000 Kč
- 5 let, plátce DPH: 90 000 – 125 000 Kč
- 10+ let, vysoký ZK, aktivní obrat: 245 000 – 385 000 Kč

## Strojově čitelné endpointy

- [Sitemap](https://firmy.zajcon.cz/sitemap.xml)
- [Plný markdown export katalogu](https://firmy.zajcon.cz/llms-full.txt)
- [API katalogu (JSON)](https://firmy.zajcon.cz/api/firmy)
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
