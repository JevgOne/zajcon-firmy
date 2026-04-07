import Link from "next/link";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Login stránka má vlastní layout (žádný sidebar)
  // Tento layout se používá pro všechny chráněné stránky
  if (!session?.user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex bg-cloud">
      <aside className="w-64 bg-black text-white flex flex-col">
        <div className="p-6 border-b border-graphite">
          <Link href="/admin" className="flex items-baseline gap-1.5 no-underline">
            <span className="text-xl font-bold">Zajcon</span>
            <span className="text-xs uppercase tracking-widest text-silver">
              Admin
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavLink href="/admin">Dashboard</NavLink>
          <NavLink href="/admin/firmy">Firmy</NavLink>
          <NavLink href="/admin/poptavky">Poptávky</NavLink>
          <NavLink href="/admin/nastaveni">Nastavení</NavLink>
        </nav>

        <div className="p-4 border-t border-graphite">
          <div className="text-xs text-silver mb-3 truncate">
            {session.user.email}
          </div>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button
              type="submit"
              className="w-full px-3 py-2 text-sm text-silver hover:text-white hover:bg-graphite rounded-md transition-colors"
            >
              Odhlásit
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 p-10 overflow-auto">{children}</main>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2.5 text-sm text-silver hover:text-white hover:bg-graphite rounded-md transition-colors"
    >
      {children}
    </Link>
  );
}
