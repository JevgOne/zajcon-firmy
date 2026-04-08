import { redirect } from "next/navigation";

export const metadata = {
  title: "Koupit s.r.o.",
  description: "Hotové s.r.o. společnosti k prodeji.",
  alternates: { canonical: "https://firmy.zajcon.cz/firmy" },
};

// Alias /koupit-sro → /firmy (SEO keyword variant)
export default function KoupitSroPage() {
  redirect("/firmy");
}
