import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd, breadcrumbSchema } from "@/components/JsonLd";

export const metadata = {
  title: "Změna sídla s.r.o. - kompletní servis",
  description:
    "Změníme sídlo vaší s.r.o. na klíč. Notářský zápis, zápis do OR, oznámení FÚ - vše vyřídíme za 4 999 Kč. Hotovo do 5 pracovních dnů.",
  alternates: { canonical: "https://firmy.zajcon.cz/sluzby/prevod-sidla" },
  openGraph: {
    title: "Změna sídla s.r.o. | Zajcon Firmy",
    description: "Profesionální převod sídla společnosti na klíč. 4 999 Kč.",
    url: "https://firmy.zajcon.cz/sluzby/prevod-sidla",
  },
};

export default function PrevodSidlaPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Domů", url: "https://firmy.zajcon.cz/" },
          { name: "Služby", url: "https://firmy.zajcon.cz/sluzby" },
          {
            name: "Změna sídla",
            url: "https://firmy.zajcon.cz/sluzby/prevod-sidla",
          },
        ])}
      />
      <Navbar />

      <main className="pt-32 pb-24 min-h-screen">
        <div className="container-max max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* LEVÁ STRANA - obsah */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-10 h-px bg-accent"></span>
                <span className="text-xs font-medium uppercase tracking-widest text-accent">
                  Doplňková služba
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
                Změna sídla <span className="highlight">s.r.o.</span>
              </h1>
              <p className="text-lg text-slate leading-relaxed mb-10">
                Sídlo společnosti je její oficiální adresa v obchodním rejstříku.
                Pokud kupujete hotovou firmu a chcete ji přesunout do svého
                města (nebo prostě jen na jinou adresu), vyřídíme to za vás
                kompletně na klíč.
              </p>

              <div className="bg-cloud border border-pearl rounded-2xl p-8 mb-10">
                <h2 className="text-2xl font-black mb-6">Co je v ceně</h2>
                <ul className="space-y-4">
                  {[
                    {
                      title: "Notářský zápis o změně sídla",
                      desc: "Připravíme všechny dokumenty, vy pouze podepíšete u notáře.",
                    },
                    {
                      title: "Zápis změny do OR",
                      desc: "Podání návrhu na rejstříkový soud + sledování zápisu.",
                    },
                    {
                      title: "Oznámení FÚ a institucím",
                      desc: "Oznámíme změnu finančnímu úřadu, ČSSZ a zdravotním pojišťovnám.",
                    },
                    {
                      title: "Aktualizace všech registrů",
                      desc: "DPH registrace, datové schránky, dalších evidencí.",
                    },
                  ].map((item) => (
                    <li key={item.title} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center mt-0.5">
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
                        <div className="font-bold text-black">{item.title}</div>
                        <div className="text-sm text-slate">{item.desc}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <h2 className="text-2xl font-black mb-6">Jak to probíhá</h2>
              <ol className="space-y-4 mb-10">
                {[
                  "Sdělíte nám novou adresu sídla (vaše nebo virtuální).",
                  "Připravíme všechny dokumenty k podpisu u notáře.",
                  "Vy podepíšete u notáře (cca 30 minut).",
                  "Zařídíme zápis do OR a oznámení institucím.",
                  "Hotovo – nové sídlo je oficiálně zapsané.",
                ].map((step, i) => (
                  <li key={i} className="flex gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent text-white font-bold flex items-center justify-center text-sm">
                      {i + 1}
                    </span>
                    <span className="text-graphite pt-1">{step}</span>
                  </li>
                ))}
              </ol>

              <div className="bg-black text-white rounded-2xl p-8">
                <h3 className="text-xl font-bold mb-2">Nemáte vlastní adresu pro sídlo?</h3>
                <p className="text-silver text-sm mb-4">
                  Můžeme zajistit i virtuální sídlo na prestižní adrese v Praze
                  nebo Brně od 1 888 Kč/rok.
                </p>
                <a href="tel:+420733179199" className="btn btn-accent">
                  +420 733 179 199
                </a>
              </div>
            </div>

            {/* PRAVÁ STRANA - cena */}
            <aside className="lg:sticky lg:top-32 lg:self-start">
              <div className="bg-cloud border border-pearl rounded-2xl p-8">
                <div className="text-xs uppercase tracking-wider text-slate mb-2">
                  Kompletní cena
                </div>
                <div className="text-4xl font-black mb-1">4 999 Kč</div>
                <div className="text-xs text-slate mb-6">
                  Vč. notářských poplatků a kolků
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate">Notářský zápis</span>
                    <span className="text-graphite">v ceně</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate">Zápis do OR</span>
                    <span className="text-graphite">v ceně</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate">Kolky a poplatky</span>
                    <span className="text-graphite">v ceně</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate">Oznámení institucím</span>
                    <span className="text-graphite">v ceně</span>
                  </div>
                </div>

                <div className="border-t border-pearl mt-6 pt-6">
                  <a href="tel:+420733179199" className="btn btn-primary w-full mb-2">
                    Zavolat: 733 179 199
                  </a>
                  <Link href="/firmy" className="btn btn-secondary w-full">
                    Vybrat si firmu
                  </Link>
                </div>

                <div className="mt-6 pt-6 border-t border-pearl text-xs text-slate">
                  <strong className="text-graphite">Doba vyřízení:</strong> 3–5
                  pracovních dnů od podpisu u notáře.
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
