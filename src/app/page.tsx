import Link from "next/link";
import prisma from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FirmaCard } from "@/components/FirmaCard";
import { ProdatForm } from "@/components/ProdatForm";
import { Faq } from "@/components/Faq";
import { FAQ_ITEMS } from "@/lib/faq-data";
import { JsonLd, faqSchema } from "@/components/JsonLd";

// ISR: cache na 5 minut, on-demand revalidace přes revalidatePath('/') v API
export const revalidate = 300;

export default async function HomePage() {
  const firmy = await prisma.firma
    .findMany({
      where: { published: true, status: { notIn: ["STAZENA"] } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 5,
    })
    .catch(() => []);

  const total = await prisma.firma
    .count({ where: { published: true, status: { notIn: ["STAZENA"] } } })
    .catch(() => 0);

  return (
    <>
      <JsonLd data={faqSchema(FAQ_ITEMS)} />
      <Navbar />

      {/* HERO */}
      <section className="relative min-h-screen flex flex-col justify-center pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 hero-grid opacity-60"></div>
          <div
            className="absolute -top-1/3 -right-1/4 w-[70%] h-[80%] rounded-full opacity-60 blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse, rgba(184,150,90,0.18) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="container-max">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-10 h-px bg-accent"></span>
            <span className="text-xs font-medium uppercase tracking-widest text-accent">
              Marketplace s.r.o.
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] mb-8 max-w-4xl">
            Hotové firmy
            <br />k <span className="highlight">okamžitému</span> převzetí
          </h1>
          <p className="text-lg md:text-xl text-slate max-w-2xl mb-10 leading-relaxed">
            Prověřené společnosti s čistou historií. Ideální pro bankovní úvěry,
            veřejné zakázky nebo rychlý start podnikání.
          </p>
          <div className="flex flex-wrap gap-4 mb-20">
            <Link href="/firmy" className="btn btn-primary">
              Prohlédnout nabídku
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="#prodat" className="btn btn-secondary">
              Chci prodat firmu
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl pt-10 border-t border-pearl">
            <Stat value="60+" label="prodaných společností" />
            <Stat value="5 dní" label="průměrná doba převodu" />
            <Stat value="100%" label="garance čistoty" />
          </div>
        </div>
      </section>

      {/* COMPANIES */}
      <section id="firmy" className="py-24 bg-cloud">
        <div className="container-max">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-3">
                Firmy k převzetí
              </h2>
              <p className="text-slate">
                Vyberte si z prověřených společností s čistou historií
              </p>
            </div>
            {total > firmy.length && (
              <Link href="/firmy" className="btn btn-secondary">
                Zobrazit všech {total} firem
              </Link>
            )}
          </div>

          {firmy.length === 0 ? (
            <div className="text-center py-20 text-slate">
              Nabídka firem se právě připravuje. Zkontrolujte to prosím za chvíli.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {firmy.map((firma, i) => (
                <FirmaCard
                  key={firma.id}
                  firma={firma}
                  featured={i === 0 && firma.featured}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SELL CTA */}
      <section id="prodat" className="py-24 bg-black text-white">
        <div className="container-max grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">
              Chcete <span className="highlight">prodat</span>
              <br />
              svoji firmu?
            </h2>
            <p className="text-silver text-lg mb-8 leading-relaxed">
              Zbavte se společnosti rychle a bez starostí. Žádná likvidace, žádné
              měsíce čekání. Nabídku dostanete do 24 hodin.
            </p>
            <ul className="space-y-4">
              {[
                "Celý proces do 7 pracovních dnů",
                "Vykupujeme i firmy se závazky",
                "Diskrétní jednání, férové podmínky",
                "Vše vyřídíme za vás včetně notáře",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-pearl">
                  <span className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-accent/20">
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
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white text-black rounded-2xl p-8 md:p-10 shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Získejte nabídku</h3>
            <p className="text-sm text-slate mb-6">
              Nezávazná kalkulace do 24 hodin
            </p>
            <ProdatForm />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="proces" className="py-24">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-3">
              Jak nákup probíhá
            </h2>
            <p className="text-slate">
              Jednoduchý a transparentní proces převodu společnosti
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                n: 1,
                title: "Výběr firmy",
                desc: "Prohlédněte si nabídku a vyberte společnost, která vyhovuje vašim potřebám.",
              },
              {
                n: 2,
                title: "Rezervace",
                desc: "Firma bude rezervována pouze pro vás. Připravíme veškeré podklady k převodu.",
              },
              {
                n: 3,
                title: "Převod u notáře",
                desc: "Společný podpis smlouvy u notáře. Celý proces trvá přibližně hodinu.",
              },
              {
                n: 4,
                title: "Hotovo",
                desc: "Do 5 dnů proběhne zápis do OR. Firma je vaše a můžete podnikat.",
              },
            ].map((step) => (
              <div key={step.n} className="relative">
                <span className="block text-6xl font-black text-accent/15 mb-3">
                  {step.n}
                </span>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-slate text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PŘÍBĚH / O NÁS */}
      <section id="o-nas" className="py-24 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 -z-0">
          <div
            className="absolute -top-1/4 -left-1/4 w-[60%] h-[80%] rounded-full opacity-30 blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse, rgba(184,150,90,0.25) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="container-max relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            {/* LEVÁ – text příběhu */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-10 h-px bg-accent"></span>
                <span className="text-xs font-medium uppercase tracking-widest text-accent">
                  Náš příběh
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl font-black mb-8 text-white leading-tight">
                Sedm let na trhu,
                <br />
                <span className="highlight">desítky</span> spokojených klientů
              </h2>

              <div className="space-y-5 text-silver leading-relaxed text-lg max-w-2xl">
                <p>
                  <strong className="text-white">
                    Zajíček Consulting
                  </strong>{" "}
                  vznikla v roce 2018 s jedinou ambicí – zjednodušit a zlevnit
                  prodej hotových firem na českém trhu. Sami jsme totiž zažili,
                  jaká je to zkušenost stát na druhé straně: dlouhé čekání,
                  skryté poplatky, nejasné záruky.
                </p>
                <p>
                  Dnes jsme jeden z nejstabilnějších hráčů v oboru. Nemáme
                  reklamní agenturu ani drahé kanceláře – jen tým, který tomu
                  rozumí, právní servis na míru a férové ceny stavěné podle
                  reálných tržních benchmarků.
                </p>
                <p>
                  Každou firmu osobně prověřujeme v insolvenci, u finančního
                  úřadu, ČSSZ i zdravotních pojišťoven. <strong className="text-white">Garance čistoty je
                  smluvní</strong> – pokud se cokoli objeví, neseme to my.
                </p>
              </div>

              <div className="mt-10 inline-block">
                <a href="tel:+420733179199" className="btn btn-accent">
                  +420 733 179 199
                </a>
              </div>
            </div>

            {/* PRAVÁ – timeline / čísla */}
            <div className="lg:col-span-5">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <BigStat number="60+" label="úspěšných převodů" />
                  <BigStat number="7+" label="let na trhu" />
                  <BigStat number="100%" label="garance čistoty" />
                  <BigStat number="3–5" label="dní od smlouvy do zápisu" />
                </div>

                <div className="border border-graphite rounded-2xl p-7 mt-8">
                  <h3 className="text-xs font-medium uppercase tracking-widest text-accent mb-5">
                    Naše hodnoty
                  </h3>
                  <ul className="space-y-4">
                    {[
                      {
                        title: "Bez skrytých poplatků",
                        desc: "Cena, kterou vidíte, je cena, kterou platíte. Notář, OR, právní servis – vše součástí.",
                      },
                      {
                        title: "Diskrétnost",
                        desc: "NDA na vyžádání, vaše údaje nikam nepředáváme.",
                      },
                      {
                        title: "Individuální přístup",
                        desc: "Nejsme call centrum – mluvíte s konkrétním člověkem od první minuty.",
                      },
                    ].map((v) => (
                      <li key={v.title} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/15 flex items-center justify-center mt-0.5">
                          <svg
                            className="w-3.5 h-3.5 text-accent"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        </span>
                        <div>
                          <div className="font-bold text-white text-sm">
                            {v.title}
                          </div>
                          <div className="text-xs text-silver mt-0.5 leading-relaxed">
                            {v.desc}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-cloud">
        <div className="container-max max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Časté dotazy
          </h2>
          <Faq />
        </div>
      </section>

      <Footer />
    </>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-3xl md:text-4xl font-black text-black">{value}</div>
      <div className="text-sm text-slate mt-1">{label}</div>
    </div>
  );
}

function BigStat({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-graphite/40 border border-graphite rounded-xl p-5">
      <div className="text-3xl md:text-4xl font-black text-accent leading-none">
        {number}
      </div>
      <div className="text-xs text-silver mt-2 leading-tight">{label}</div>
    </div>
  );
}
