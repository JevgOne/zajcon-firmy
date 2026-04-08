"use client";

import { useState } from "react";
import { FAQ_ITEMS } from "@/lib/faq-data";

export function Faq() {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, i) => (
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
