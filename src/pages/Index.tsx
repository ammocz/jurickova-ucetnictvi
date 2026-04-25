import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { z } from "zod";
import {
  Menu, X, Phone, Mail, MapPin, ArrowRight, Check,
  BookOpen, Users, Award, FileText, Calculator, Receipt, Building2, FileCheck, MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import hero from "@/assets/hero.jpg";
import ilona from "@/assets/ilona.jpg";

const nav = [
  { label: "O nás", href: "#o-nas" },
  { label: "Služby", href: "#sluzby" },
  { label: "Reference", href: "#reference" },
  { label: "Kontakt", href: "#kontakt" },
];

const benefits = [
  {
    icon: BookOpen,
    title: "Účetní programy",
    body: "Účtujeme v programu Altus Vario. V případě zájmu Vám nabízíme rovněž možnost externího vedení účetnictví ve Vašem účetním programu (Helios, Pohoda, PF, MRP aj.)",
  },
  {
    icon: Users,
    title: "Flexibilita a individuální přístup",
    body: "Každý klient má své specifické požadavky, umíme se jim přizpůsobit a udělat vše pro Vaši spokojenost.",
  },
  {
    icon: Award,
    title: "Kvalita a dlouhodobé zkušenosti",
    body: "Veškeré naše služby poskytujeme v nejvyšší možné kvalitě díky výborné profesní znalosti a dlouhodobým zkušenostem v oboru. Neustále sledujeme legislativní změny a dále se vzděláváme.",
  },
];

const services = [
  {
    icon: BookOpen,
    title: "Vedení účetnictví",
    body: "Kompletní vedení účetnictví včetně zpracování přiznání k dani z příjmů právnických osob, rozvahy, výkazu zisku a ztráty, přílohy v účetní závěrce. Zastupování na finančním úřadu.",
  },
  {
    icon: Calculator,
    title: "Daňová evidence",
    body: "Zpracování daňové evidence (včetně zhotovení přiznání k dani z příjmů fyzických osob, přehledu na OSSZ a zdravotní pojišťovnu). Zastupování na finančním úřadu.",
  },
  {
    icon: Receipt,
    title: "Mzdová agenda",
    body: "Kompletní zpracování mezd (přihlášky a odhlášky zaměstnanců, měsíční přehledy na OSSZ a ZP, roční zúčtování daně ze závislé činnosti, evidenční listy důchodového pojištění), zastupování na úřadech.",
  },
  {
    icon: Building2,
    title: "Vedení účetnictví SVJ",
    body: "Kompletní vedení účetnictví SVJ včetně ročního vyúčtování záloh na provozní služby za bytové jednotky, tvorba předpisů plateb, kontrola čerpání fondu oprav.",
  },
  {
    icon: FileCheck,
    title: "Zpracování všech typů daňových přiznání",
    body: "Daň z přidané hodnoty, kontrolní hlášení, souhrnné hlášení, silniční daň, spotřební daně, daň z nabytí nemovitých věcí, daň z převodu nemovitých věcí.",
  },
  {
    icon: MessageCircle,
    title: "Konzultace",
    body: "Poskytuji účetní poradenství při založení firmy, při žádosti o živnostenské oprávnění, při jednání s finančním úřadem, zdravotními pojišťovnami i správou sociálního zabezpečení aj.",
  },
];

const clientLogos = [
  "logo_KDP", "logo_stoneses", "logo_rgkameny", "logo_josef_matusik",
  "logo_iskerka", "cbdking_logo", "logo_elip", "logo_sscr",
  "k_k_logo", "logo_zahorane", "STOARE_logo",
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Zadejte prosím své jméno").max(100),
  email: z.string().trim().email("Zadejte platný e-mail").max(255),
  message: z.string().trim().min(10, "Napište prosím více informací (min. 10 znaků)").max(1000),
});

const Index = () => {
  const [open, setOpen] = useState(false);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => {
    const onScroll = () => setOpen(false);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    const result = contactSchema.safeParse(data);
    if (!result.success) {
      toast.error(result.error.issues[0].message);
      return;
    }
    toast.success("Děkujeme, ozveme se Vám co nejdříve.");
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border/60">
        <nav className="max-w-7xl mx-auto px-5 lg:px-10 h-16 flex items-center justify-between" aria-label="Hlavní">
          <a href="#" className="flex items-center gap-2.5 group">
            <span className="w-8 h-8 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-semibold">J</span>
            <span className="font-display text-lg font-semibold tracking-tight">Juříčková<span className="text-accent">.</span></span>
          </a>
          <ul className="hidden md:flex items-center gap-9 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-muted-foreground hover:text-foreground transition-smooth">{n.label}</a>
              </li>
            ))}
          </ul>
          <div className="hidden md:flex items-center gap-3">
            <a href="tel:+420" className="text-sm text-muted-foreground hover:text-foreground transition-smooth flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> Volejte
            </a>
            <Button asChild size="sm" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <a href="#kontakt">Kontaktovat</a>
            </Button>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 -mr-2 rounded-lg hover:bg-secondary transition-smooth"
            aria-label={open ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
        {open && (
          <div className="md:hidden border-t border-border bg-background animate-in slide-in-from-top-2">
            <ul className="px-5 py-6 space-y-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 text-lg font-display border-b border-border/60"
                  >
                    {n.label}
                  </a>
                </li>
              ))}
              <li className="pt-4">
                <Button asChild className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                  <a href="#kontakt" onClick={() => setOpen(false)}>Kontaktovat</a>
                </Button>
              </li>
            </ul>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden bg-hero text-primary-foreground pt-16">
          <motion.img
            src={hero}
            alt=""
            width={1920}
            height={1280}
            className="absolute inset-0 w-full h-full object-cover opacity-25"
            style={{ y: heroY }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(162_50%_12%)] via-[hsl(162_50%_12%/0.85)] to-transparent" aria-hidden />
          <div className="relative max-w-7xl mx-auto px-5 lg:px-10 w-full py-20 md:py-28 grid lg:grid-cols-12 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-8"
            >
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-accent mb-7">
                <span className="w-8 h-px bg-accent" />
                Externí vedení účetnictví a daňové poradenství
              </span>
              <h1 className="font-display font-medium text-balance text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
                Chcete <em className="not-italic text-accent font-normal italic">klidně</em> spát?
              </h1>
              <p className="mt-8 max-w-xl text-lg md:text-xl text-primary-foreground/75 leading-relaxed font-light">
                Svěřte své účetnictví do správných rukou.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow h-12 px-7">
                  <a href="#kontakt">
                    <Phone className="mr-2 h-4 w-4" /> Volejte
                  </a>
                </Button>
                <Button asChild size="lg" variant="ghost" className="rounded-full text-primary-foreground hover:bg-primary-foreground/10 h-12 px-7">
                  <a href="#sluzby">Naše služby</a>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="hidden lg:block lg:col-span-4"
            >
              <div className="bg-primary-foreground/5 backdrop-blur-md border border-primary-foreground/15 rounded-2xl p-8">
                <h2 className="font-display text-2xl font-medium">Máte zájem o účetní služby?</h2>
                <p className="mt-3 text-primary-foreground/70 text-sm leading-relaxed">
                  Ozvěte se nám a domluvíme nezávaznou konzultaci.
                </p>
                <Button asChild className="mt-6 w-full rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  <a href="#kontakt">Kontaktovat <ArrowRight className="ml-2 h-4 w-4" /></a>
                </Button>
                <div className="mt-6 pt-6 border-t border-primary-foreground/10 grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="font-display text-3xl text-accent">21</div>
                    <div className="text-xs text-primary-foreground/60 mt-1">let zkušeností</div>
                  </div>
                  <div>
                    <div className="font-display text-3xl text-accent">100%</div>
                    <div className="text-xs text-primary-foreground/60 mt-1">spokojenost</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Mobile CTA card */}
        <section className="lg:hidden -mt-10 relative z-10 px-5">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-elegant">
            <h2 className="font-display text-xl font-medium">Máte zájem o účetní služby?</h2>
            <Button asChild className="mt-4 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <a href="#kontakt">Kontaktovat <ArrowRight className="ml-2 h-4 w-4" /></a>
            </Button>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-20 md:py-28 max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid md:grid-cols-3 gap-5 md:gap-6">
            {benefits.map((b, i) => (
              <motion.article
                key={b.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-card border border-border hover:border-accent/40 transition-smooth hover:shadow-card hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary text-primary grid place-items-center mb-6 group-hover:bg-accent group-hover:text-accent-foreground transition-smooth">
                  <b.icon className="h-5 w-5" />
                </div>
                <h3 className="font-display text-xl font-semibold tracking-tight mb-3">{b.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-[15px]">{b.body}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* Services */}
        <section id="sluzby" className="py-20 md:py-28 bg-secondary/40">
          <div className="max-w-7xl mx-auto px-5 lg:px-10">
            <div className="grid md:grid-cols-12 gap-8 mb-14">
              <div className="md:col-span-5">
                <span className="text-xs uppercase tracking-[0.22em] text-accent">Naše služby</span>
                <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight mt-4 text-balance">
                  Komplexní účetní služby pod jednou střechou.
                </h2>
              </div>
              <p className="md:col-span-6 md:col-start-7 text-lg text-muted-foreground self-end leading-relaxed">
                Od vedení účetnictví přes mzdovou agendu po daňová přiznání a konzultace — postaráme se o vše potřebné.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map((s, i) => (
                <motion.article
                  key={s.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
                  className="group relative p-7 rounded-2xl bg-card border border-border hover:border-primary/40 transition-smooth hover:shadow-card"
                >
                  <s.icon className="h-6 w-6 text-accent mb-5" />
                  <h3 className="font-display text-xl font-semibold tracking-tight mb-3">{s.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-[15px]">{s.body}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        {/* Quote + Founder */}
        <section id="o-nas" className="py-20 md:py-32 max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-secondary shadow-elegant">
                <img
                  src={ilona}
                  alt="Bc. Ilona Juříčková Balounová"
                  loading="lazy"
                  width={768}
                  height={960}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-primary/80 to-transparent text-primary-foreground">
                  <div className="font-display text-lg">Bc. Ilona Juříčková Balounová</div>
                  <div className="text-sm text-primary-foreground/80">Externí účetní a daňový poradce</div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <span className="text-xs uppercase tracking-[0.22em] text-accent">O nás</span>
              <blockquote className="mt-5 font-display text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-tight text-balance">
                <span className="text-accent">„</span>Věnujte se svému podnikání a&nbsp;účetnictví svěřte profesionálům<span className="text-accent">"</span>
              </blockquote>
              <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-xl">
                V oblasti vedení účetnictví, daňové evidence a zpracování mezd se pohybujeme již 21 let. Nasbírali jsme množství zkušeností, díky kterým jsou námi poskytované služby vyhledávány.
              </p>
              <ul className="mt-8 space-y-3">
                {[
                  "21 let zkušeností v oboru",
                  "Členství v Komoře daňových poradců",
                  "Průběžné sledování legislativních změn",
                ].map((s) => (
                  <li key={s} className="flex items-center gap-3 text-[15px]">
                    <span className="w-5 h-5 rounded-full bg-accent/15 grid place-items-center flex-shrink-0">
                      <Check className="h-3 w-3 text-accent" />
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Clients */}
        <section id="reference" className="py-20 md:py-24 border-y border-border bg-secondary/30">
          <div className="max-w-7xl mx-auto px-5 lg:px-10">
            <div className="text-center mb-12">
              <span className="text-xs uppercase tracking-[0.22em] text-accent">Reference</span>
              <h2 className="font-display text-3xl md:text-4xl font-medium tracking-tight mt-3">
                Důvěřují nám
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {clientLogos.map((logo) => (
                <div
                  key={logo}
                  className="aspect-[3/2] rounded-xl bg-card border border-border grid place-items-center text-muted-foreground text-xs font-medium hover:border-accent/40 hover:text-foreground transition-smooth p-4 text-center"
                >
                  {logo.replace(/_/g, " ").replace(/logo/i, "").trim() || "Klient"}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="kontakt" className="py-20 md:py-28 max-w-7xl mx-auto px-5 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            <div>
              <span className="text-xs uppercase tracking-[0.22em] text-accent">Kontakt</span>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mt-4 text-balance">
                Pojďme se domluvit.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-md leading-relaxed">
                Napište nám nebo zavolejte — rádi s Vámi probereme možnosti spolupráce.
              </p>
              <ul className="mt-12 space-y-5">
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary text-accent grid place-items-center flex-shrink-0">
                    <Mail className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">E-mail</div>
                    <div className="font-medium mt-0.5">info@ucetnictvi-jurickova.cz</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary text-accent grid place-items-center flex-shrink-0">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Telefon</div>
                    <div className="font-medium mt-0.5">Volejte pro nezávaznou konzultaci</div>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary text-accent grid place-items-center flex-shrink-0">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">Sídlo</div>
                    <div className="font-medium mt-0.5">Česká republika</div>
                  </div>
                </li>
              </ul>
            </div>
            <form onSubmit={handleSubmit} noValidate className="space-y-5 bg-card p-8 md:p-10 rounded-2xl border border-border shadow-card">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Jméno</label>
                <input
                  id="name" name="name" type="text" required maxLength={100} autoComplete="name"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-smooth"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">E-mail</label>
                <input
                  id="email" name="email" type="email" required maxLength={255} autoComplete="email"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-smooth"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Zpráva</label>
                <textarea
                  id="message" name="message" required rows={5} maxLength={1000}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring resize-none transition-smooth"
                />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12">
                Odeslat zprávu <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-10 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 flex flex-wrap gap-4 items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-semibold text-sm">J</span>
            <span className="font-display text-foreground">Bc. Ilona Juříčková Balounová</span>
          </div>
          <p>© {new Date().getFullYear()} Účetnictví Juříčková. Všechna práva vyhrazena.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
