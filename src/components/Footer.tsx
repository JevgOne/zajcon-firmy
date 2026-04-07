import Link from "next/link";

export function Footer() {
  return (
    <footer
      id="kontakt"
      className="bg-black text-white mt-auto"
    >
      <div className="container-max py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div>
            <Link href="/" className="flex items-baseline gap-1.5 no-underline mb-4">
              <span className="text-2xl font-bold text-white">Zajcon</span>
              <span className="text-xs font-medium uppercase tracking-widest text-silver">
                Firmy
              </span>
            </Link>
            <p className="text-sm text-silver leading-relaxed">
              Profesionální prodej a výkup společností s.r.o. Působíme na českém
              trhu od roku 2020.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Navigace
            </h4>
            <ul className="space-y-3 text-sm text-silver">
              <li>
                <Link href="/firmy" className="hover:text-accent transition-colors">
                  Nabídka firem
                </Link>
              </li>
              <li>
                <Link href="/#prodat" className="hover:text-accent transition-colors">
                  Prodat firmu
                </Link>
              </li>
              <li>
                <Link href="/#proces" className="hover:text-accent transition-colors">
                  Jak to funguje
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-accent transition-colors">
                  Časté dotazy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Právní
            </h4>
            <ul className="space-y-3 text-sm text-silver">
              <li>
                <Link href="/podminky" className="hover:text-accent transition-colors">
                  Obchodní podmínky
                </Link>
              </li>
              <li>
                <Link href="/soukromi" className="hover:text-accent transition-colors">
                  Ochrana soukromí
                </Link>
              </li>
              <li>
                <Link href="/gdpr" className="hover:text-accent transition-colors">
                  GDPR
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">
              Kontakt
            </h4>
            <ul className="space-y-3 text-sm text-silver">
              <li>
                <a href="tel:+420123456789" className="hover:text-accent transition-colors">
                  +420 123 456 789
                </a>
              </li>
              <li>
                <a href="mailto:firmy@zajcon.cz" className="hover:text-accent transition-colors">
                  firmy@zajcon.cz
                </a>
              </li>
              <li>Praha, Česká republika</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-graphite mt-16 pt-8 flex flex-col md:flex-row justify-between text-xs text-silver">
          <span>© {new Date().getFullYear()} Zajcon s.r.o. Všechna práva vyhrazena.</span>
          <span>firmy.zajcon.cz</span>
        </div>
      </div>
    </footer>
  );
}
