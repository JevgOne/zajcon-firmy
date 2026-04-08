import Link from "next/link";

export function Footer() {
  return (
    <footer id="kontakt" className="bg-black text-white mt-auto">
      {/* TRUST STRIP — záruky a klíčové výhody */}
      <div className="border-b border-graphite">
        <div className="container-max py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <TrustItem
              title="100% garance"
              desc="Písemná garance čistoty firmy"
            />
            <TrustItem title="3–5 dní" desc="Průměrná doba převodu" />
            <TrustItem title="Bez skrytých poplatků" desc="Cena včetně notáře" />
            <TrustItem title="Od roku 2018" desc="Stovky spokojených klientů" />
          </div>
        </div>
      </div>

      {/* HLAVNÍ CTA STRIP */}
      <div className="border-b border-graphite">
        <div className="container-max py-14 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-black text-white leading-tight">
              Nenašli jste, co hledáte?
            </h3>
            <p className="text-silver mt-2">
              Najdeme vám firmu na míru – stačí se ozvat.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:+420733179199"
              className="btn btn-accent whitespace-nowrap"
            >
              +420 733 179 199
            </a>
            <Link href="/prodat" className="btn btn-secondary !text-white !border-graphite hover:!border-accent whitespace-nowrap">
              Prodat firmu
            </Link>
          </div>
        </div>
      </div>

      {/* HLAVNÍ MŘÍŽKA — sloupce */}
      <div className="container-max py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* BRAND */}
          <div className="md:col-span-4">
            <Link
              href="/"
              className="flex items-baseline gap-1.5 no-underline mb-5"
            >
              <span className="text-3xl font-black text-white">Zajcon</span>
              <span className="text-xs font-medium uppercase tracking-widest text-accent">
                Firmy
              </span>
            </Link>
            <p className="text-sm text-silver leading-relaxed mb-6 max-w-sm">
              Profesionální prodej a výkup českých s.r.o. společností. Prověřené
              firmy s čistou historií, působíme od roku 2018.
            </p>

            {/* Social / kontakt rychlé */}
            <div className="flex flex-col gap-2 text-sm">
              <a
                href="tel:+420733179199"
                className="flex items-center gap-2 text-silver hover:text-accent transition-colors group"
              >
                <span className="w-8 h-8 rounded-full bg-graphite group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </span>
                +420 733 179 199
              </a>
              <a
                href="mailto:firmy@zajcon.cz"
                className="flex items-center gap-2 text-silver hover:text-accent transition-colors group"
              >
                <span className="w-8 h-8 rounded-full bg-graphite group-hover:bg-accent/20 flex items-center justify-center transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
                firmy@zajcon.cz
              </a>
              <div className="flex items-center gap-2 text-silver">
                <span className="w-8 h-8 rounded-full bg-graphite flex items-center justify-center">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                Brno, Česká republika
              </div>
            </div>
          </div>

          {/* SLOUPCE LINKŮ */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Navigace
            </h4>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/firmy">Nabídka firem</FooterLink>
              <FooterLink href="/prodat">Prodat firmu</FooterLink>
              <FooterLink href="/#proces">Jak to funguje</FooterLink>
              <FooterLink href="/#faq">Časté dotazy</FooterLink>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Kategorie firem
            </h4>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/pro-uvery">Firmy pro bankovní úvěry</FooterLink>
              <FooterLink href="/pro-tendry">Firmy pro tendry</FooterLink>
              <FooterLink href="/ready-made">Ready-made firmy</FooterLink>
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-5">
              Právní
            </h4>
            <ul className="space-y-3 text-sm">
              <FooterLink href="/podminky">Obchodní podmínky</FooterLink>
              <FooterLink href="/soukromi">Ochrana soukromí</FooterLink>
              <FooterLink href="/gdpr">GDPR</FooterLink>
            </ul>
          </div>
        </div>
      </div>

      {/* SPODNÍ LIŠTA */}
      <div className="border-t border-graphite">
        <div className="container-max py-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center text-xs text-silver">
          <div>
            © {new Date().getFullYear()}{" "}
            <strong className="text-white">Zajíček Consulting s.r.o.</strong> ·
            IČO 07343957 · DIČ CZ07343957 · Nové sady 988/2, 602 00 Brno
          </div>
          <div className="text-silver">firmy.zajcon.cz</div>
        </div>
      </div>
    </footer>
  );
}

function TrustItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/15 flex items-center justify-center">
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
      <div>
        <div className="font-bold text-white text-sm">{title}</div>
        <div className="text-xs text-silver mt-0.5">{desc}</div>
      </div>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-silver hover:text-accent transition-colors inline-flex items-center gap-1.5 group"
      >
        <span className="w-0 h-px bg-accent group-hover:w-3 transition-all"></span>
        {children}
      </Link>
    </li>
  );
}
