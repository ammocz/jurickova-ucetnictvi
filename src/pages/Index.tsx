import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { z } from "zod";
import { Menu, X, ArrowRight, ArrowUpRight, Check, Sparkles, Layers, Zap, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import hero from "@/assets/hero.jpg";
import g1 from "@/assets/g1.jpg";
import g2 from "@/assets/g2.jpg";
import g3 from "@/assets/g3.jpg";
import p1 from "@/assets/p1.jpg";
import p2 from "@/assets/p2.jpg";
import p3 from "@/assets/p3.jpg";

const nav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Voices", href: "#voices" },
  { label: "Contact", href: "#contact" },
];

const features = [
  { icon: Sparkles, title: "Brand systems", body: "Identity, voice, and visual language built to scale across every surface." },
  { icon: Layers, title: "Product design", body: "Interfaces that feel inevitable — clear, considered, and deeply usable." },
  { icon: Zap, title: "Engineering", body: "Performant front-ends with measurable impact on conversion and retention." },
];

const gallery = [
  { src: g1, title: "Atelier — workspace identity", tag: "Brand" },
  { src: g2, title: "Helio — motion language", tag: "Motion" },
  { src: g3, title: "Monolith — architecture site", tag: "Web" },
];

const voices = [
  { quote: "Lumen rebuilt our marketing site in six weeks. Conversion up 41%. They listen, then they ship.", name: "Maren Cole", role: "VP Marketing, Northwind", img: p1 },
  { quote: "The most considered design partner we've worked with. Every detail has a reason behind it.", name: "Daniel Reyes", role: "Founder, Helio", img: p2 },
  { quote: "They treated our brand like it was their own. The result feels honest, modern, and durable.", name: "Sasha Linde", role: "Head of Product, Atelier", img: p3 },
];

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  message: z.string().trim().min(10, "Tell us a bit more (10+ chars)").max(1000),
});

const Index = () => {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState<number | null>(null);
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setModal(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
    toast.success("Message received — we'll be in touch within 24h.");
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <nav className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between" aria-label="Primary">
          <a href="#" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
            <span className="w-7 h-7 rounded-full bg-accent-gradient inline-block" aria-hidden />
            Lumen
          </a>
          <ul className="hidden md:flex items-center gap-10 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="text-muted-foreground hover:text-foreground transition-smooth">{n.label}</a>
              </li>
            ))}
          </ul>
          <div className="hidden md:block">
            <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90 rounded-full">
              <a href="#contact">Start a project <ArrowRight className="ml-1 h-4 w-4" /></a>
            </Button>
          </div>
          <button
            onClick={() => setOpen((v) => !v)}
            className="md:hidden p-2 -mr-2"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
        {open && (
          <div className="md:hidden border-t border-border bg-background">
            <ul className="px-6 py-6 space-y-4">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} onClick={() => setOpen(false)} className="block text-lg font-display">{n.label}</a>
                </li>
              ))}
              <li>
                <Button asChild className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90">
                  <a href="#contact" onClick={() => setOpen(false)}>Start a project</a>
                </Button>
              </li>
            </ul>
          </div>
        )}
      </header>

      <main>
        {/* Hero */}
        <section ref={heroRef} className="relative min-h-[100svh] flex items-end overflow-hidden bg-hero text-primary-foreground pt-24">
          <motion.img
            src={hero}
            alt="Architectural detail with warm light"
            width={1920}
            height={1280}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
            style={{ y: heroY, opacity: heroOpacity }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(220_35%_6%)] via-[hsl(220_35%_6%/0.5)] to-transparent" aria-hidden />
          <div className="relative max-w-7xl mx-auto px-6 lg:px-10 pb-16 md:pb-24 w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-4xl"
            >
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary-foreground/70 mb-6">
                <span className="w-8 h-px bg-accent" /> A design studio for ambitious teams
              </span>
              <h1 className="font-display font-semibold text-5xl sm:text-6xl md:text-8xl leading-[0.95] tracking-tight">
                Crafting digital experiences with <em className="not-italic text-accent">intention</em>.
              </h1>
              <p className="mt-8 max-w-xl text-lg text-primary-foreground/75 leading-relaxed">
                We help product teams ship interfaces that feel inevitable — measured in clarity, polish, and performance.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-glow">
                  <a href="#contact">Start a project <ArrowRight className="ml-2 h-4 w-4" /></a>
                </Button>
                <Button asChild size="lg" variant="ghost" className="rounded-full text-primary-foreground hover:bg-primary-foreground/10">
                  <a href="#work">See selected work</a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="services" className="py-24 md:py-36 max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-12 gap-10 mb-16">
            <h2 className="md:col-span-5 font-display text-4xl md:text-5xl font-semibold tracking-tight">
              Three disciplines.<br />One team.
            </h2>
            <p className="md:col-span-6 md:col-start-7 text-lg text-muted-foreground self-end">
              We work end-to-end across brand, product, and engineering — so the work stays coherent from first sketch to shipped pixel.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.article
                key={f.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group relative p-8 rounded-2xl bg-card border border-border hover:border-accent/40 transition-smooth hover:shadow-elegant"
              >
                <f.icon className="h-7 w-7 text-accent mb-8" />
                <h3 className="font-display text-2xl font-semibold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.body}</p>
                <ArrowUpRight className="absolute top-8 right-8 h-5 w-5 text-muted-foreground/40 group-hover:text-accent group-hover:-translate-y-1 group-hover:translate-x-1 transition-smooth" />
              </motion.article>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section id="work" className="py-24 md:py-36 bg-secondary/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
              <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight">Selected work</h2>
              <p className="text-muted-foreground">A glimpse of recent projects.</p>
            </div>
            <div className="grid md:grid-cols-6 gap-4 md:gap-6">
              {gallery.map((g, i) => (
                <motion.button
                  key={g.title}
                  onClick={() => setModal(i)}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className={`group relative overflow-hidden rounded-2xl bg-muted text-left ${
                    i === 0 ? "md:col-span-4 md:row-span-2 aspect-[4/3] md:aspect-auto" : "md:col-span-2 aspect-[4/3]"
                  }`}
                  aria-label={`View ${g.title}`}
                >
                  <img
                    src={g.src}
                    alt={g.title}
                    loading="lazy"
                    width={1024}
                    height={1024}
                    className="absolute inset-0 w-full h-full object-cover transition-smooth group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-smooth" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-smooth">
                    <span className="text-xs uppercase tracking-widest text-accent">{g.tag}</span>
                    <h3 className="font-display text-xl mt-1">{g.title}</h3>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Stats / Manifesto */}
        <section className="py-24 md:py-36 max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-accent">Our practice</span>
              <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight mt-4">
                Quiet confidence over loud trends.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
                We're a small senior team. No account managers, no hand-offs — you work directly with the people doing the work.
              </p>
              <ul className="mt-8 space-y-3">
                {["Senior team, end to end", "Weekly demos, no surprises", "Built to outlast a redesign"].map((s) => (
                  <li key={s} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-accent/15 flex items-center justify-center">
                      <Check className="h-3 w-3 text-accent" />
                    </span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border rounded-2xl overflow-hidden">
              {[
                ["120+", "Shipped products"],
                ["41%", "Avg. lift in conversion"],
                ["12y", "Combined craft"],
                ["9.7", "NPS from clients"],
              ].map(([n, l]) => (
                <div key={l} className="bg-background p-8 md:p-10">
                  <div className="font-display text-4xl md:text-5xl font-semibold tracking-tight">{n}</div>
                  <div className="text-sm text-muted-foreground mt-2">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="voices" className="py-24 md:py-36 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight max-w-2xl">
              Voices from the people we've built with.
            </h2>
            <div className="mt-16 grid md:grid-cols-3 gap-6">
              {voices.map((v, i) => (
                <motion.figure
                  key={v.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="p-8 rounded-2xl bg-primary-foreground/5 border border-primary-foreground/10 backdrop-blur"
                >
                  <blockquote className="font-display text-xl leading-snug">"{v.quote}"</blockquote>
                  <figcaption className="mt-8 flex items-center gap-3">
                    <img src={v.img} alt={v.name} loading="lazy" width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <div className="font-medium">{v.name}</div>
                      <div className="text-sm text-primary-foreground/60">{v.role}</div>
                    </div>
                  </figcaption>
                </motion.figure>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="py-24 md:py-36 max-w-7xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <span className="text-xs uppercase tracking-[0.2em] text-accent">Contact</span>
              <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tight mt-4">
                Let's build something durable.
              </h2>
              <p className="mt-6 text-lg text-muted-foreground max-w-md">
                Tell us about your project. We'll reply within one business day.
              </p>
              <ul className="mt-12 space-y-5 text-sm">
                <li className="flex items-center gap-3"><Mail className="h-4 w-4 text-accent" /> hello@lumen.studio</li>
                <li className="flex items-center gap-3"><Phone className="h-4 w-4 text-accent" /> +1 (415) 555-0144</li>
                <li className="flex items-center gap-3"><MapPin className="h-4 w-4 text-accent" /> Lisbon · New York</li>
              </ul>
            </div>
            <form onSubmit={handleSubmit} noValidate className="space-y-6 bg-card p-8 md:p-10 rounded-2xl border border-border shadow-elegant">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <input
                  id="name" name="name" type="text" required maxLength={100} autoComplete="name"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input
                  id="email" name="email" type="email" required maxLength={255} autoComplete="email"
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Project brief</label>
                <textarea
                  id="message" name="message" required rows={5} maxLength={1000}
                  className="w-full px-4 py-3 rounded-lg bg-background border border-input focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-smooth"
                />
              </div>
              <Button type="submit" size="lg" className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90">
                Send message <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-wrap gap-4 items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-accent-gradient inline-block" aria-hidden />
            <span className="font-display text-foreground">Lumen Studio</span>
          </div>
          <p>© {new Date().getFullYear()} Lumen Studio. Built with intention.</p>
        </div>
      </footer>

      {/* Modal */}
      {modal !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={gallery[modal].title}
          onClick={() => setModal(null)}
          className="fixed inset-0 z-[60] bg-background/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10 animate-in fade-in"
        >
          <button
            onClick={() => setModal(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-card border border-border hover:bg-secondary transition-smooth"
            aria-label="Close preview"
          >
            <X className="h-5 w-5" />
          </button>
          <motion.figure
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-5xl w-full"
          >
            <img src={gallery[modal].src} alt={gallery[modal].title} className="w-full rounded-2xl shadow-elegant" />
            <figcaption className="mt-4 flex items-baseline justify-between gap-4">
              <h3 className="font-display text-xl">{gallery[modal].title}</h3>
              <span className="text-xs uppercase tracking-widest text-accent">{gallery[modal].tag}</span>
            </figcaption>
          </motion.figure>
        </div>
      )}
    </div>
  );
};

export default Index;
