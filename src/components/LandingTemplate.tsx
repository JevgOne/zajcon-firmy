import Link from "next/link";
import type { Firma } from "@prisma/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FirmaCard } from "@/components/FirmaCard";
import { Faq } from "@/components/Faq";

export interface LandingProps {
  eyebrow: string;
  title: React.ReactNode;
  lead: string;
  benefits: Array<{ title: string; desc: string }>;
  firmy: Firma[];
  emptyText: string;
  ctaTitle: string;
  ctaDesc: string;
}

export function LandingTemplate({
  eyebrow,
  title,
  lead,
  benefits,
  firmy,
  emptyText,
  ctaTitle,
  ctaDesc,
}: LandingProps) {
  return (
    <>
      <Navbar />

      {/* HERO */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 hero-grid opacity-50"></div>
          <div
            className="absolute -top-1/4 -right-1/4 w-[60%] h-[70%] rounded-full opacity-50 blur-3xl"
            style={{
              background:
                "radial-gradient(ellipse, rgba(184,150,90,0.18) 0%, transparent 60%)",
            }}
          />
        </div>

        <div className="container-max max-w-4xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-10 h-px bg-accent"></span>
            <span className="text-xs font-medium uppercase tracking-widest text-accent">
              {eyebrow}
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black leading-[1.05] mb-6">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-slate max-w-2xl leading-relaxed mb-10">
            {lead}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="#nabidka" className="btn btn-primary">
              Prohlédnout nabídku
            </Link>
            <Link href="/prodat" className="btn btn-secondary">
              Chci prodat firmu
            </Link>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-16 bg-cloud border-y border-pearl">
        <div className="container-max">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b) => (
              <div key={b.title}>
                <div className="w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center mb-4">
                  <svg
                    className="w-5 h-5 text-accent"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="font-bold mb-2">{b.title}</h3>
                <p className="text-sm text-slate leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FIRMY */}
      <section id="nabidka" className="py-24">
        <div className="container-max">
          <h2 className="text-4xl md:text-5xl font-black mb-3">
            Aktuální nabídka
          </h2>
          <p className="text-slate mb-12">
            {firmy.length === 0
              ? emptyText
              : `${firmy.length} ${firmy.length === 1 ? "firma" : "firem"} v této kategorii`}
          </p>

          {firmy.length > 0 && (
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

      {/* FAQ */}
      <section className="py-24 bg-cloud">
        <div className="container-max max-w-3xl">
          <h2 className="text-4xl md:text-5xl font-black mb-12 text-center">
            Časté dotazy
          </h2>
          <Faq />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-black text-white">
        <div className="container-max max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-4 text-white">
            {ctaTitle}
          </h2>
          <p className="text-silver text-lg mb-8 max-w-xl mx-auto">{ctaDesc}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/firmy" className="btn btn-secondary !text-white !border-graphite hover:!border-accent">
              Všechny firmy
            </Link>
            <Link href="/prodat" className="btn btn-accent">
              Prodat firmu
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
