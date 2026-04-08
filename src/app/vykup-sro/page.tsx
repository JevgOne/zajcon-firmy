import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProdatForm } from "@/components/ProdatForm";

export const metadata = {
  title: "Výkup s.r.o. - prodáme vaši firmu do 24 hodin",
  description:
    "Vykoupíme vaši s.r.o. společnost rychle, diskrétně a férově. Vykupujeme i firmy se závazky a finančními problémy. Nabídka do 24 hodin, vše vyřídíme za vás.",
  alternates: { canonical: "https://firmy.zajcon.cz/vykup-sro" },
  keywords: [
    "výkup s.r.o.",
    "prodat s.r.o.",
    "vykoupíme firmu",
    "prodej firmy se závazky",
    "likvidace s.r.o. alternativa",
    "rychlý prodej firmy",
  ],
  openGraph: {
    title: "Výkup s.r.o. | Zajcon Firmy",
    description: "Vykoupíme vaši s.r.o. do 24 hodin. I se závazky.",
    url: "https://firmy.zajcon.cz/vykup-sro",
  },
};

export default function VykupSroPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 min-h-screen">
        <div className="container-max max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-10 h-px bg-accent"></span>
                <span className="text-xs font-medium uppercase tracking-widest text-accent">
                  Výkup s.r.o.
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
                Prodejte firmu
                <br />
                <span className="highlight">bez likvidace</span>
              </h1>

              <p className="text-lg text-slate leading-relaxed mb-8">
                Likvidace s.r.o. trvá měsíce a stojí desítky tisíc. My vám firmu
                vykoupíme za pár dní – bez komplikací, bez papírování a často i s
                lepším výsledkem než likvidace.
              </p>

              <div className="bg-cloud border border-pearl rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold mb-4">Vykupujeme i firmy:</h2>
                <ul className="space-y-3">
                  {[
                    "Se závazky vůči FÚ, ČSSZ, ZP",
                    "S nezaplacenými fakturami / pohledávkami",
                    "S nečinnou činností (sleeping company)",
                    "S komplikovanou účetní historií",
                    "S problematickými jednateli (změna před prodejem)",
                    "S neplatným DIČ nebo zrušeným plátcovstvím DPH",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center mt-0.5">
                        <svg
                          className="w-3 h-3 text-accent"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <h2 className="text-2xl font-black mb-4">Proč prodat nám?</h2>
              <div className="space-y-4 mb-8">
                <Reason
                  title="Rychlost"
                  desc="Nabídka do 24 hodin, převod do 7 dnů. Likvidace trvá 6-12 měsíců."
                />
                <Reason
                  title="Cena"
                  desc="Často zaplatíme víc, než kolik byste získali likvidací po odpočtu nákladů."
                />
                <Reason
                  title="Diskrétnost"
                  desc="NDA na požádání, vaše údaje nikam nepředáváme. Nikdo se to nedozví."
                />
                <Reason
                  title="Bez starostí"
                  desc="Vyřešíme za vás úplně všechno – notář, právník, OR, FÚ. Vy podepíšete a my zařídíme zbytek."
                />
              </div>
            </div>

            <div className="lg:sticky lg:top-32">
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl border border-pearl">
                <h2 className="text-2xl font-bold mb-2">Získejte nabídku</h2>
                <p className="text-sm text-slate mb-6">
                  Nezávazná kalkulace do 24 hodin
                </p>
                <ProdatForm />
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

function Reason({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 w-1 bg-accent rounded-full"></div>
      <div>
        <h3 className="font-bold text-black mb-1">{title}</h3>
        <p className="text-sm text-slate leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
