"use client";

import { useState } from "react";

const ITEMS = [
  {
    q: "Jak je zaručeno, že firma nemá dluhy?",
    a: "Každou společnost prověřujeme v insolvenčním rejstříku, u finančního úřadu, ČSSZ a zdravotních pojišťoven. Poskytujeme písemnou garanci čistoty – pokud by se objevil jakýkoliv závazek, neseme jej my.",
  },
  {
    q: "Jak dlouho trvá převod společnosti?",
    a: "Od rezervace po zápis do obchodního rejstříku standardně 3-5 pracovních dnů. Samotný podpis u notáře zabere přibližně hodinu.",
  },
  {
    q: "Co je zahrnuto v ceně?",
    a: "Cena zahrnuje kompletní právní servis, přípravu všech dokumentů, notářské poplatky a zápis změn do obchodního rejstříku. Žádné skryté náklady.",
  },
  {
    q: "Lze změnit název a sídlo společnosti?",
    a: "Ano, změnu názvu i sídla lze provést současně s převodem nebo kdykoliv později. Rádi vám s tím pomůžeme.",
  },
  {
    q: "Proč koupit hotovou firmu místo založení nové?",
    a: "Hotová firma s historií vám umožní okamžitě čerpat bankovní úvěry, účastnit se veřejných zakázek a budí větší důvěru u obchodních partnerů. Nově založená společnost tyto výhody nemá.",
  },
];

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {ITEMS.map((item, i) => (
        <div
          key={i}
          className="bg-white border border-pearl rounded-xl overflow-hidden"
        >
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex justify-between items-center text-left p-6 font-medium text-black hover:bg-cloud transition-colors"
          >
            {item.q}
            <span className="text-2xl text-accent flex-shrink-0 ml-4">
              {open === i ? "−" : "+"}
            </span>
          </button>
          {open === i && (
            <div className="px-6 pb-6 text-slate leading-relaxed">{item.a}</div>
          )}
        </div>
      ))}
    </div>
  );
}
