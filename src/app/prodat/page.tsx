import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProdatForm } from "@/components/ProdatForm";

export const metadata = {
  title: "Prodat firmu - výkup s.r.o.",
  description:
    "Vykupujeme hotové s.r.o. společnosti rychle, diskrétně a férově. Nezávazná nabídka do 24 hodin. Vyřídíme vše včetně notáře.",
};

export default function ProdatPage() {
  return (
    <>
      <Navbar />

      <main className="pt-32 pb-24 min-h-screen">
        <div className="container-max max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* LEVÁ STRANA – text */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-10 h-px bg-accent"></span>
                <span className="text-xs font-medium uppercase tracking-widest text-accent">
                  Výkup s.r.o.
                </span>
              </div>

              <h1 className="text-5xl md:text-6xl font-black leading-tight mb-6">
                Chcete <span className="highlight">prodat</span>
                <br />
                svoji firmu?
              </h1>

              <p className="text-lg text-slate leading-relaxed mb-10">
                Zbavte se společnosti rychle, diskrétně a bez starostí. Žádná
                likvidace, žádné měsíce čekání. Nezávaznou nabídku dostanete do
                24 hodin a celý proces vyřídíme za vás včetně notáře.
              </p>

              <ul className="space-y-4 mb-10">
                {[
                  {
                    title: "Celý proces do 7 pracovních dnů",
                    desc: "Od první komunikace po podpis u notáře.",
                  },
                  {
                    title: "Vykupujeme i firmy se závazky",
                    desc: "Pohledávky, dluhy, neplatné DIČ – vše dokážeme vyřešit.",
                  },
                  {
                    title: "Diskrétní jednání, férové podmínky",
                    desc: "NDA na požádání, transparentní oceňování.",
                  },
                  {
                    title: "Vše vyřídíme za vás",
                    desc: "Notář, převod podílů, zápis do OR – nic neřešíte.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-accent/15 mt-0.5">
                      <svg
                        className="w-4 h-4 text-accent"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <div>
                      <div className="font-semibold text-black">{item.title}</div>
                      <div className="text-sm text-slate">{item.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="bg-cloud rounded-2xl p-6 border border-pearl">
                <div className="text-xs uppercase tracking-wider text-slate mb-2">
                  Jak probíhá výkup
                </div>
                <ol className="space-y-3 text-sm text-graphite">
                  <li className="flex gap-3">
                    <span className="font-bold text-accent">1.</span>
                    <span>
                      Vyplníte formulář s IČO – my si firmu sami prověříme v
                      ARES, OR a insolvenčním rejstříku.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-accent">2.</span>
                    <span>
                      Do 24 hodin vám zavoláme s konkrétní nezávaznou nabídkou.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-accent">3.</span>
                    <span>
                      Pokud souhlasíte, do týdne podepíšeme smlouvu u notáře.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-accent">4.</span>
                    <span>
                      Peníze dostanete ihned, my zařídíme vše ostatní.
                    </span>
                  </li>
                </ol>
              </div>
            </div>

            {/* PRAVÁ STRANA – formulář */}
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
