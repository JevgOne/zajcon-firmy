import { z } from "zod";

export const firmaSchema = z.object({
  ico: z.string().regex(/^\d{8}$/, "IČO musí mít 8 číslic"),
  nazev: z.string().min(1, "Název je povinný"),
  datumZalozeni: z.coerce.date(),
  sidloUlice: z.string().min(1),
  sidloMesto: z.string().min(1),
  sidloPsc: z.string().min(1),
  zakladniKapital: z.coerce.number().int().nonnegative().default(1000),
  predmetPodnikani: z.array(z.string()).default([]),
  platceDph: z.coerce.boolean().default(false),
  datovaSchranka: z.coerce.boolean().default(true),
  historieObratu: z.coerce.boolean().default(false),
  financniProblemy: z.enum(["ZADNE", "LEHKE", "TEZKE"]).default("ZADNE"),
  cena: z.coerce.number().int().nonnegative(),
  puvodniCena: z.coerce.number().int().nonnegative().optional().nullable(),
  cenaDohodnout: z.coerce.boolean().default(false),
  status: z.enum(["VOLNA", "REZERVOVANA", "PRODANA", "STAZENA"]).default("VOLNA"),
  featured: z.coerce.boolean().default(false),
  tags: z.array(z.string()).default([]),
  popis: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  poznamkyInterni: z.string().optional().nullable(),
  published: z.coerce.boolean().default(false),
});

export type FirmaInput = z.infer<typeof firmaSchema>;

export const poptavkaVykupSchema = z.object({
  typ: z.literal("VYKUP"),
  email: z.email("Neplatný email"),
  telefon: z.string().optional().nullable(),
  jmeno: z.string().optional().nullable(),
  icoVykup: z.string().regex(/^\d{8}$/, "IČO musí mít 8 číslic"),
  poznamkaVykup: z.string().optional().nullable(),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
});

export const poptavkaNakupSchema = z.object({
  typ: z.literal("NAKUP"),
  email: z.email("Neplatný email"),
  telefon: z.string().optional().nullable(),
  jmeno: z.string().optional().nullable(),
  firmaId: z.string().min(1),
  zpravaNakup: z.string().optional().nullable(),
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
});

export const poptavkaDotazSchema = z.object({
  typ: z.literal("DOTAZ"),
  email: z.email("Neplatný email"),
  telefon: z.string().optional().nullable(),
  jmeno: z.string().optional().nullable(),
  zpravaNakup: z.string().min(1, "Zpráva je povinná"),
});

export const poptavkaSchema = z.discriminatedUnion("typ", [
  poptavkaVykupSchema,
  poptavkaNakupSchema,
  poptavkaDotazSchema,
]);

export type PoptavkaInput = z.infer<typeof poptavkaSchema>;

export const calculatePriceSchema = z.object({
  stariRoky: z.coerce.number().int().min(0),
  zakladniKapital: z.coerce.number().int().min(0),
  platceDph: z.coerce.boolean(),
  historieObratu: z.coerce.boolean(),
  cistyStav: z.coerce.boolean().optional(),
  premium: z.coerce.boolean().optional(),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
});
