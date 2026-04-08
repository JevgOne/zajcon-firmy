import Link from "next/link";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/85 border-b border-pearl">
      <div className="container-max flex items-center justify-between py-4">
        <Link href="/" className="flex items-baseline gap-1.5 no-underline">
          <span className="text-2xl font-bold tracking-tight text-black">
            Zajcon
          </span>
          <span className="text-xs font-medium uppercase tracking-widest text-slate">
            Firmy
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-10 list-none">
          <li>
            <Link
              href="/firmy"
              className="text-sm font-medium text-graphite hover:text-black transition-colors"
            >
              Nabídka firem
            </Link>
          </li>
          <li>
            <Link
              href="/#proces"
              className="text-sm font-medium text-graphite hover:text-black transition-colors"
            >
              Jak to funguje
            </Link>
          </li>
          <li>
            <Link
              href="/#faq"
              className="text-sm font-medium text-graphite hover:text-black transition-colors"
            >
              Časté dotazy
            </Link>
          </li>
          <li>
            <Link
              href="/prodat"
              className="px-5 py-2.5 rounded-md bg-accent text-white text-sm font-medium hover:bg-accent-dark transition-all hover:-translate-y-px"
            >
              Chci prodat firmu
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
