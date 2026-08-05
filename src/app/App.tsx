import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { submitEnquiry } from "../lib/firebase";
import {
  Phone, MapPin, Clock, Star, ChevronDown,
  Menu, X, ArrowRight, MessageCircle,
  BookOpen, Shield, Smile, Monitor, Activity, Baby, Leaf, Bus,
  Music, Sun, Utensils, Moon, Palette,
  Heart, Users, GraduationCap, CheckCircle2, Loader2,
} from "lucide-react";
import * as Accordion from "@radix-ui/react-accordion";

// ─── Animation helpers ───────────────────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } };
const vp = { once: true };

// ─── Data ─────────────────────────────────────────────────────────────────────
const WHY_ITEMS = [
  { icon: Users,    label: "Experienced Teachers", color: "#F4B400", bg: "#FFF8E1" },
  { icon: Shield,   label: "Safe Campus",           color: "#1D3557", bg: "#E8EEF5" },
  { icon: Smile,    label: "Play-Based Learning",   color: "#FF6B6B", bg: "#FFF0F0" },
  { icon: Monitor,  label: "Smart Classrooms",      color: "#2ECC71", bg: "#E8F8F0" },
  { icon: Activity, label: "Activity Education",    color: "#F4B400", bg: "#FFF8E1" },
  { icon: Baby,     label: "Daycare Available",     color: "#FF6B6B", bg: "#FFF0F0" },
  { icon: Leaf,     label: "Healthy Environment",   color: "#2ECC71", bg: "#E8F8F0" },
  { icon: Bus,      label: "Transportation",        color: "#1D3557", bg: "#E8EEF5" },
];

const PROGRAMS = [
  {
    name: "Playgroup",   age: "1.5 – 2.5 yrs",
    desc: "Nurturing first social experiences through sensory play, music, and joyful creative exploration.",
    img: "photo-1777056481869-feac70afe522", color: "#F4B400",
  },
  {
    name: "Nursery",     age: "2.5 – 3.5 yrs",
    desc: "Building language, creativity, and early cognitive skills in a warm, loving environment.",
    img: "photo-1567746455504-cb3213f8f5b8", color: "#FF6B6B",
  },
  {
    name: "LKG",         age: "3.5 – 4.5 yrs",
    desc: "Introducing pre-literacy and pre-numeracy through fun, hands-on activities children adore.",
    img: "photo-1761604478724-13fe879468cf", color: "#2ECC71",
  },
  {
    name: "UKG",         age: "4.5 – 5.5 yrs",
    desc: "Preparing children for primary school with confidence, curiosity, and a love for learning.",
    img: "photo-1777056491418-d4ff81a4ad92", color: "#1D3557",
  },
  {
    name: "Daycare",     age: "6 months – 5 yrs",
    desc: "Safe, stimulating full-day care for working parents — your child in the best of hands.",
    img: "photo-1630139026564-4a2bf5670879", color: "#F4B400",
  },
  {
    name: "Summer Camp", age: "All ages",
    desc: "Weeks packed with outdoor adventures, arts, water play, and unforgettable memories.",
    img: "photo-1599376672737-bd66af54c8f5", color: "#FF6B6B",
  },
];

const GALLERY = [
  { id: "photo-1761208663763-c4d30657c910", label: "Activities", tall: true  },
  { id: "photo-1777056481869-feac70afe522", label: "Classroom",  tall: false },
  { id: "photo-1761604478724-13fe879468cf", label: "Activities", tall: false },
  { id: "photo-1567746455504-cb3213f8f5b8", label: "Classroom",  tall: true  },
  { id: "photo-1599376672737-bd66af54c8f5", label: "Outdoor",    tall: false },
  { id: "photo-1630139026564-4a2bf5670879", label: "Outdoor",    tall: true  },
  { id: "photo-1560421683-6856ea585c78",    label: "Activities", tall: false },
  { id: "photo-1770096679916-2cd9c720d400", label: "Activities", tall: false },
  { id: "photo-1753958509932-9242283bcb45", label: "Outdoor",    tall: false },
  { id: "photo-1775119204432-575769100fac", label: "Events",     tall: true  },
];

const SCHEDULE = [
  { time: "8:30 AM",  label: "Circle Time",      icon: Users,    color: "#F4B400" },
  { time: "9:00 AM",  label: "Story & Language",  icon: BookOpen, color: "#1D3557" },
  { time: "9:30 AM",  label: "Music & Movement",  icon: Music,    color: "#FF6B6B" },
  { time: "10:00 AM", label: "Outdoor Play",      icon: Sun,      color: "#2ECC71" },
  { time: "11:00 AM", label: "Creative Learning", icon: Palette,  color: "#F4B400" },
  { time: "12:00 PM", label: "Healthy Lunch",     icon: Utensils, color: "#FF6B6B" },
  { time: "1:00 PM",  label: "Rest Time",         icon: Moon,     color: "#1D3557" },
  { time: "2:00 PM",  label: "Activity Time",     icon: Activity, color: "#2ECC71" },
];

const TESTIMONIALS = [
  {
    name: "Priya Ramesh",     role: "Mother of Ananya, LKG",
    text: "Little Hawks has been an absolute blessing. My daughter started shy and now she's the most confident child in her class. The teachers are warm, patient, and genuinely care about every child.",
  },
  {
    name: "Karthik Sundaram", role: "Father of Arjun, UKG",
    text: "The smart classroom setup and activity-based curriculum is exactly what we were looking for. My son comes home excited every single day, eager to tell us what he learned.",
  },
  {
    name: "Deepa Krishnan",   role: "Mother of Kavya, Daycare",
    text: "As a working mother, the daycare facility gives me complete peace of mind. The campus is safe, the staff is attentive, and I can see my child growing and thriving every week.",
  },
  {
    name: "Arun Venkatesh",   role: "Father of Ishaan, Nursery",
    text: "The school's holistic approach — art, music, outdoor play alongside academics — is exactly what sets Little Hawks apart from every other preschool in Coimbatore.",
  },
];

const FAQS = [
  { q: "What age groups does Little Hawks accept?",
    a: "We accept children from 1.5 years through 5.5 years across Playgroup, Nursery, LKG, and UKG. Daycare is available from 6 months." },
  { q: "What are the school hours?",
    a: "School begins at 8:30 AM. Half-day programs end by 12:30 PM and full-day programs continue until 4:00 PM. Daycare is available until 6:30 PM for working parents." },
  { q: "Is transportation available?",
    a: "Yes, we offer safe school bus transportation with GPS tracking within Kovaipudur and select surrounding areas of Coimbatore." },
  { q: "What curriculum do you follow?",
    a: "We follow an activity-based, play-through-learning curriculum aligned with early childhood development standards — combining Montessori, play-based, and structured learning approaches." },
  { q: "How do I apply for admission?",
    a: "Book a school tour online or call us at 8903708010. After the tour, fill out the admission form and we will guide you through every step." },
  { q: "Do you offer healthy meals?",
    a: "Yes! We provide nutritious, freshly prepared meals and snacks. Our menu is planned to be wholesome, and we accommodate dietary preferences and allergies." },
];

const STEPS = [
  { num: 1, title: "Schedule a Visit", desc: "Book a free campus tour to experience Little Hawks in person.",          icon: MapPin         },
  { num: 2, title: "Meet Our Teachers", desc: "Speak with our educators and learn about our curriculum approach.",     icon: Users          },
  { num: 3, title: "Fill the Form",    desc: "Complete the admission form with your child's details.",                icon: BookOpen       },
  { num: 4, title: "Welcome Aboard!",  desc: "Your child joins our Little Hawks family. The journey begins!",         icon: Heart          },
];

// ─── Subcomponents ────────────────────────────────────────────────────────────
function FloatingEmoji({ e, cls, delay = 0 }: { e: string; cls: string; delay?: number }) {
  return (
    <motion.span
      aria-hidden="true"
      className={`absolute text-2xl pointer-events-none select-none ${cls}`}
      animate={{ y: [0, -18, 0], rotate: [-4, 4, -4] }}
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
    >
      {e}
    </motion.span>
  );
}

function Pill({ label }: { label: string }) {
  return (
    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary font-semibold text-sm rounded-full mb-4">
      {label}
    </span>
  );
}

function SectionTitle({
  tag, title, sub, dark = false,
}: { tag: string; title: string; sub?: string; dark?: boolean }) {
  return (
    <motion.div
      variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
      transition={{ duration: 0.6 }}
      className="text-center mb-14"
    >
      <span className={`inline-block px-4 py-1.5 font-semibold text-sm rounded-full mb-4 ${
        dark ? "bg-primary/20 text-primary" : "bg-primary/10 text-primary"
      }`}>
        {tag}
      </span>
      <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 ${dark ? "text-white" : "text-foreground"}`}>
        {title}
      </h2>
      {sub && (
        <p className={`max-w-2xl mx-auto text-lg leading-relaxed ${dark ? "text-white/60" : "text-muted-foreground"}`}>
          {sub}
        </p>
      )}
    </motion.div>
  );
}

function Wrap({ id, className = "", children }: { id?: string; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={`py-20 md:py-28 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">{children}</div>
    </section>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [
    { label: "About",      href: "#about"      },
    { label: "Programs",   href: "#programs"   },
    { label: "Campus",     href: "#campus"     },
    { label: "Activities", href: "#activities" },
    { label: "Admissions", href: "#admissions" },
    { label: "Contact",    href: "#contact"    },
  ];

  return (
    <nav
      role="navigation"
      aria-label="Main navigation"
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-sm shadow-sm border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" aria-label="Little Hawks Preschool — home" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <span className="text-lg leading-none" aria-hidden="true">🦅</span>
          </div>
          <div className="leading-tight">
            <div className={`font-extrabold text-sm ${scrolled ? "text-foreground" : "text-white"}`}>
              Little Hawks
            </div>
            <div className={`text-[11px] ${scrolled ? "text-muted-foreground" : "text-white/70"}`}>
              Preschool & Daycare
            </div>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-7">
          {links.map(l => (
            <a key={l.label} href={l.href}
               className={`text-sm font-medium transition-colors hover:text-primary ${
                 scrolled ? "text-foreground/70" : "text-white/80 hover:text-white"
               }`}>
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <a href="tel:8903708010"
             className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
               scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/80 hover:text-white"
             }`}>
            <Phone className="w-4 h-4" aria-hidden="true" />
            8903708010
          </a>
          <a href="#admissions"
             className="px-5 py-2.5 bg-primary text-primary-foreground font-bold text-sm rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
            Book a Tour
          </a>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open
            ? <X className={scrolled ? "text-foreground" : "text-white"} aria-hidden="true" />
            : <Menu className={scrolled ? "text-foreground" : "text-white"} aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-border px-6 py-5 space-y-1">
          {links.map(l => (
            <a key={l.label} href={l.href}
               className="block font-medium text-foreground py-2 hover:text-primary transition-colors"
               onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="pt-4 flex flex-col gap-3 border-t border-border mt-3">
            <a href="tel:8903708010" className="flex items-center gap-2 text-foreground font-medium">
              <Phone className="w-4 h-4 text-primary" aria-hidden="true" /> 8903708010
            </a>
            <a href="#admissions" onClick={() => setOpen(false)}
               className="block text-center py-3 bg-primary text-primary-foreground font-bold rounded-full">
              Book a Tour
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#1D3557]">
      <img
        src="https://images.unsplash.com/photo-1761208663763-c4d30657c910?w=1920&h=1080&fit=crop&auto=format"
        alt="Happy children playing at Little Hawks Preschool"
        className="absolute inset-0 w-full h-full object-cover opacity-35"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#1D3557]/70 via-[#1D3557]/40 to-[#1D3557]/85" />

      <FloatingEmoji e="📚" cls="top-[14%] left-[7%] opacity-80"  delay={0}   />
      <FloatingEmoji e="⭐" cls="top-[18%] right-[11%] opacity-80" delay={0.5} />
      <FloatingEmoji e="🌈" cls="top-[38%] left-[4%] opacity-70"  delay={1}   />
      <FloatingEmoji e="✏️" cls="bottom-[28%] right-[7%] opacity-80" delay={1.5} />
      <FloatingEmoji e="☁️" cls="top-[9%] left-[42%] opacity-60"  delay={2}   />
      <FloatingEmoji e="🎨" cls="bottom-[32%] left-[9%] opacity-70" delay={0.8} />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }} animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.04, y: -2 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="inline-flex items-center gap-2 px-5 py-2 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-primary font-bold text-sm mb-8 shadow-lg cursor-default"
        >
          <span className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse shadow-sm" aria-hidden="true" />
          Now Enrolling for 2026–2027
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight"
        >
          Where Little
          <span className="block text-primary drop-shadow-sm">Dreams Begin</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-white/90 text-lg md:text-2xl mb-3 font-medium tracking-wide"
        >
          Safe &bull; Fun &bull; Creative &bull; Learning Environment
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-white/60 text-sm mb-10"
        >
          Kovaipudur, Coimbatore &nbsp;·&nbsp; Est. 2015 &nbsp;·&nbsp; ⭐ Rated 5.0 by Parents
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <motion.a href="#admissions"
             whileHover={{ scale: 1.05, y: -3 }}
             whileTap={{ scale: 0.97 }}
             className="px-8 py-4 bg-primary text-primary-foreground font-bold text-base rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" aria-hidden="true" />
            Book a School Tour
          </motion.a>
          <motion.a href="tel:8903708010"
             whileHover={{ scale: 1.04, y: -2 }}
             whileTap={{ scale: 0.97 }}
             className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold text-base rounded-full hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
            <Phone className="w-5 h-5" aria-hidden="true" />
            Call Now
          </motion.a>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none" aria-hidden="true">
        <svg viewBox="0 0 1440 60" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" fill="#FFFDF8" />
        </svg>
      </div>
    </section>
  );
}

// ─── Why Little Hawks ─────────────────────────────────────────────────────────
function WhyUs() {
  return (
    <Wrap id="why" className="bg-background">
      <SectionTitle
        tag="Why Choose Us"
        title="Everything Your Child Deserves"
        sub="A carefully crafted environment where every child grows, learns, and truly shines."
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {WHY_ITEMS.map((item, i) => (
          <motion.div
            key={item.label}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
            whileHover={{ y: -6, scale: 1.03 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="group bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-xl transition-all duration-300 text-center cursor-default"
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm"
              style={{ backgroundColor: item.bg }}
            >
              <item.icon className="w-6 h-6" style={{ color: item.color }} aria-hidden="true" />
            </div>
            <p className="font-semibold text-foreground text-sm leading-snug">{item.label}</p>
          </motion.div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── About ────────────────────────────────────────────────────────────────────
function About() {
  const timeline = [
    { year: "2015", label: "Founded",        desc: "Little Hawks opened its doors in Kovaipudur with 30 children." },
    { year: "2018", label: "Expansion",      desc: "Added smart classrooms and our flourishing outdoor learning garden." },
    { year: "2021", label: "Daycare Launch", desc: "Extended hours daycare introduced for working families." },
    { year: "2024", label: "5★ Rating",      desc: "Achieved a perfect 5.0 Google rating — a gift from our parent community." },
  ];

  return (
    <Wrap id="about" className="bg-secondary">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ duration: 0.7 }}>
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full rounded-3xl bg-primary/20" aria-hidden="true" />
            <img
              src="https://images.unsplash.com/photo-1770096679916-2cd9c720d400?w=800&h=600&fit=crop&auto=format"
              alt="Teacher and child drawing together at Little Hawks Preschool"
              className="relative rounded-3xl w-full object-cover shadow-2xl"
              style={{ aspectRatio: "4/3" }}
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-6 bg-primary rounded-2xl px-6 py-4 shadow-xl">
              <div className="text-4xl font-extrabold text-primary-foreground">9+</div>
              <div className="text-sm font-semibold text-primary-foreground/70">Years of Excellence</div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ duration: 0.7, delay: 0.2 }}>
          <Pill label="Our Story" />
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground mb-5 leading-tight">
            Nurturing Curious Minds<br />
            <span className="text-primary">Since 2015</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8">
            Little Hawks Preschool & Daycare was founded on one belief: every child is gifted with potential.
            Our mission is to discover that potential early, nurture it with care, and launch each child
            into their school journey with confidence and joy.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {[
              { label: "Our Mission", val: "Spark curiosity and build confident, creative learners." },
              { label: "Our Vision",  val: "To be the most loved early learning centre in Coimbatore." },
              { label: "Core Values", val: "Love · Safety · Respect · Creativity · Growth." },
              { label: "Our Approach", val: "Play-based, child-led, and joyfully structured." },
            ].map(item => (
              <div key={item.label} className="bg-card rounded-xl p-4 border border-border">
                <div className="text-[11px] font-bold text-primary uppercase tracking-wider mb-1">{item.label}</div>
                <div className="text-sm text-foreground/80 leading-snug">{item.val}</div>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-14 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-extrabold text-primary">{item.year}</span>
                </div>
                <div>
                  <div className="font-bold text-foreground text-sm">{item.label}</div>
                  <div className="text-sm text-muted-foreground">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </Wrap>
  );
}

// ─── Programs ─────────────────────────────────────────────────────────────────
function Programs() {
  return (
    <Wrap id="programs" className="bg-background">
      <SectionTitle
        tag="Our Programs"
        title="A Program for Every Stage"
        sub="Thoughtfully designed programs that grow with your child, from first steps to first grade."
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
        {PROGRAMS.map((p, i) => (
          <motion.div
            key={p.name}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
            whileHover={{ y: -7, scale: 1.02 }}
            transition={{ duration: 0.4, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            className="group bg-card rounded-3xl overflow-hidden shadow-sm border border-border hover:shadow-2xl transition-all duration-300"
          >
            <div className="relative overflow-hidden h-48 bg-muted">
              <img
                src={`https://images.unsplash.com/${p.img}?w=600&h=400&fit=crop&auto=format`}
                alt={`${p.name} program at Little Hawks Preschool`}
                className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg"
                      style={{ backgroundColor: p.color }}>
                  {p.age}
                </span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-extrabold text-foreground mb-2">{p.name}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-5">{p.desc}</p>
              <a href="#admissions"
                 className="inline-flex items-center gap-1 text-sm font-semibold transition-all group-hover:gap-2.5 duration-200"
                 style={{ color: p.color }}>
                Learn More <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── Campus Gallery ───────────────────────────────────────────────────────────
function CampusGallery() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<string | null>(null);
  const cats = ["All", "Classroom", "Activities", "Outdoor", "Events"];

  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  const filtered = active === "All" ? GALLERY : GALLERY.filter(g => g.label === active);

  return (
    <Wrap id="campus" className="bg-secondary">
      <SectionTitle
        tag="Our Campus"
        title="Life at Little Hawks"
        sub="Peek into the joyful world our children inhabit every day."
      />

      <div className="flex flex-wrap gap-3 justify-center mb-10" role="tablist" aria-label="Gallery categories">
        {cats.map(cat => (
          <button
            key={cat} role="tab" aria-selected={active === cat}
            onClick={() => setActive(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              active === cat
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-card text-muted-foreground hover:text-foreground border border-border"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
        {filtered.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
            viewport={vp} transition={{ duration: 0.4, delay: i * 0.04 }}
            className="group relative overflow-hidden rounded-2xl cursor-zoom-in break-inside-avoid"
            onClick={() => setLightbox(img.id)}
          >
            <img
              src={`https://images.unsplash.com/${img.id}?w=400&fit=crop&auto=format`}
              alt={`${img.label} at Little Hawks Preschool`}
              className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
              style={{ aspectRatio: img.tall ? "3/4" : "4/3" }}
              loading="lazy"
            />
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/25 transition-all duration-300 rounded-2xl" />
            <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="px-2 py-1 bg-white/90 text-foreground text-xs font-semibold rounded-lg">{img.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog" aria-modal="true" aria-label="Image lightbox"
        >
          <button
            className="absolute top-5 right-5 p-2 text-white/70 hover:text-white transition-colors"
            onClick={() => setLightbox(null)} aria-label="Close lightbox"
          >
            <X className="w-8 h-8" aria-hidden="true" />
          </button>
          <img
            src={`https://images.unsplash.com/${lightbox}?w=1200&fit=crop&auto=format`}
            alt="Gallery image enlarged"
            className="max-w-full max-h-[88vh] rounded-2xl object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </Wrap>
  );
}

// ─── Daily Schedule ───────────────────────────────────────────────────────────
function DailySchedule() {
  return (
    <Wrap id="activities" className="bg-background">
      <SectionTitle
        tag="A Day at Little Hawks"
        title="Every Minute Counts"
        sub="A thoughtfully designed day balancing learning, play, nourishment, and rest."
      />
      <div className="max-w-2xl mx-auto">
        {SCHEDULE.map((item, i) => (
          <motion.div
            key={i}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            className="flex gap-5 items-center mb-4 group"
          >
            <div className="w-20 text-right shrink-0">
              <span className="text-xs font-bold text-muted-foreground tabular-nums">{item.time}</span>
            </div>
            <div className="flex flex-col items-center shrink-0">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center shadow group-hover:scale-110 transition-transform"
                style={{ backgroundColor: item.color + "1A" }}
              >
                <item.icon className="w-5 h-5" style={{ color: item.color }} aria-hidden="true" />
              </div>
              {i < SCHEDULE.length - 1 && <div className="w-px h-4 bg-border mt-1" aria-hidden="true" />}
            </div>
            <div className="bg-card rounded-2xl px-5 py-3 border border-border flex-1 group-hover:shadow-md group-hover:border-primary/20 transition-all duration-300">
              <span className="font-semibold text-foreground text-sm">{item.label}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </Wrap>
  );
}

// ─── Testimonials ─────────────────────────────────────────────────────────────
function Testimonials() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % TESTIMONIALS.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <Wrap id="testimonials" className="bg-[#1D3557] overflow-hidden">
      <SectionTitle
        dark tag="Parent Reviews"
        title="What Our Families Say"
        sub="Real words from the parents who trust us with their most precious ones."
      />
      <div className="max-w-3xl mx-auto">
        <div className="relative" style={{ minHeight: 260 }}>
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: i === idx ? 1 : 0, x: i === idx ? 0 : -50 }}
              transition={{ duration: 0.5 }}
              className={`absolute inset-0 ${i === idx ? "pointer-events-auto" : "pointer-events-none"}`}
              aria-hidden={i !== idx}
            >
              <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-3xl p-8 md:p-10">
                <div className="flex gap-1 mb-5" aria-label={`${t.name} gave 5 stars`}>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-5 h-5 fill-primary text-primary" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-white/90 text-lg md:text-xl leading-relaxed font-light mb-6">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <footer>
                  <div className="font-bold text-white">{t.name}</div>
                  <div className="text-white/55 text-sm">{t.role}</div>
                </footer>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center gap-2 mt-8" role="tablist" aria-label="Testimonial navigation">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i} role="tab" aria-selected={i === idx}
              onClick={() => setIdx(i)}
              className={`rounded-full transition-all duration-300 ${
                i === idx ? "w-7 h-3 bg-primary" : "w-3 h-3 bg-white/25 hover:bg-white/50"
              }`}
              aria-label={`View testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </Wrap>
  );
}

// ─── Admissions ───────────────────────────────────────────────────────────────
function Admissions() {
  return (
    <Wrap id="admissions" className="bg-background">
      <SectionTitle
        tag="Admissions"
        title="Start Your Journey"
        sub="Joining Little Hawks is simple. We are with you every step of the way."
      />
      <div className="grid md:grid-cols-4 gap-6">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="relative text-center group"
          >
            {i < STEPS.length - 1 && (
              <div className="hidden md:block absolute top-10 left-[62%] w-full h-px bg-primary/20" aria-hidden="true" />
            )}
            <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-1 group-hover:bg-primary group-hover:border-primary transition-all duration-300">
              <step.icon className="w-8 h-8 text-primary group-hover:text-primary-foreground transition-colors" aria-hidden="true" />
            </div>
            <div className="w-7 h-7 bg-primary text-primary-foreground font-extrabold text-xs rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
              {step.num}
            </div>
            <h3 className="font-extrabold text-foreground text-lg mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="mt-14 text-center"
      >
        <a href="#contact"
           className="inline-flex items-center gap-2 px-10 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-full shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
          <GraduationCap className="w-5 h-5" aria-hidden="true" /> Apply for Admission
        </a>
        <p className="mt-4 text-muted-foreground text-sm">
          Or call us at{" "}
          <a href="tel:8903708010" className="text-primary font-semibold hover:underline">8903708010</a>
        </p>
      </motion.div>
    </Wrap>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  return (
    <Wrap id="faq" className="bg-secondary">
      <SectionTitle
        tag="FAQs"
        title="Questions Parents Ask"
        sub="We understand you have questions. Here are the answers parents ask most."
      />
      <div className="max-w-2xl mx-auto">
        <Accordion.Root type="single" collapsible className="space-y-3">
          {FAQS.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <Accordion.Item
                value={`item-${i}`}
                className="bg-card rounded-2xl border border-border overflow-hidden"
              >
                <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-foreground hover:text-primary transition-colors [&[data-state=open]>svg]:rotate-180 group">
                  <span className="pr-4 text-sm md:text-base">{item.q}</span>
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0 transition-transform duration-300" aria-hidden="true" />
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-5 text-muted-foreground leading-relaxed text-sm overflow-hidden data-[state=open]:animate-[accordion-down_0.2s_ease-out] data-[state=closed]:animate-[accordion-up_0.2s_ease-out]">
                  {item.a}
                </Accordion.Content>
              </Accordion.Item>
            </motion.div>
          ))}
        </Accordion.Root>
      </div>
    </Wrap>
  );
}

// ─── Enquiry Form ─────────────────────────────────────────────────────────────
function EnquiryForm() {
  const [form, setForm] = useState({ name: "", phone: "", child: "", program: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim())              e.name    = "Parent name is required";
    if (!form.phone.match(/^\d{10}$/)) e.phone   = "Enter a valid 10-digit number";
    if (!form.child.trim())             e.child   = "Child's name is required";
    if (!form.program)                  e.program = "Please select a program";
    return e;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    
    setIsSubmitting(true);
    setSubmitError("");
    try {
      await submitEnquiry(form);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Failed to submit enquiry to Firebase:", err);
      if (err?.code === "permission-denied" || err?.message?.includes("PERMISSION_DENIED")) {
        setSubmitError("Firebase Permission Error: Please update Firestore Security Rules in Firebase Console to allow write access (allow create: if true;). Data saved locally in backup.");
      } else if (err?.code === "not-found" || err?.message?.includes("NOT_FOUND")) {
        setSubmitError("Firestore Database not created yet in Firebase Console. Click 'Create Database' under Firestore. Data saved locally in backup.");
      } else {
        setSubmitError(err?.message || "Failed to save enquiry to Firebase. Data saved locally in backup.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const field = (name: keyof typeof form) =>
    `w-full px-4 py-3 rounded-xl border text-sm bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
      errors[name]
        ? "border-accent focus:ring-accent/30"
        : "border-border focus:ring-primary/30 focus:border-primary"
    }`;

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-card rounded-3xl p-8 border border-border shadow-sm flex flex-col items-center justify-center text-center"
        style={{ minHeight: 400 }}
      >
        <motion.div
          initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
          className="w-20 h-20 rounded-full bg-[#2ECC71]/15 flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-10 h-10 text-[#2ECC71]" aria-hidden="true" />
        </motion.div>
        <h3 className="text-2xl font-extrabold text-foreground mb-3">Enquiry Submitted!</h3>
        <p className="text-muted-foreground mb-6 max-w-xs">
          Thank you! Our admissions team will call you within 24 hours.
        </p>
        <button
          onClick={() => { setSubmitted(false); setForm({ name: "", phone: "", child: "", program: "", message: "" }); setErrors({}); setSubmitError(""); }}
          className="px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-full hover:shadow-md transition-all"
        >
          Submit Another Enquiry
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="bg-card rounded-3xl p-8 border border-border shadow-sm"
    >
      <h3 className="text-2xl font-extrabold text-foreground mb-1">Send an Enquiry</h3>
      <p className="text-muted-foreground text-sm mb-7">Fill in the form and we will get back to you shortly.</p>

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="enq-name" className="block text-sm font-medium text-foreground mb-1.5">Parent Name *</label>
            <input id="enq-name" type="text" placeholder="Your full name"
              value={form.name}
              onChange={e => { setForm(f => ({ ...f, name: e.target.value })); setErrors(er => ({ ...er, name: "" })); }}
              className={field("name")} aria-describedby={errors.name ? "err-name" : undefined}
            />
            {errors.name && <p id="err-name" className="text-accent text-xs mt-1" role="alert">{errors.name}</p>}
          </div>
          <div>
            <label htmlFor="enq-phone" className="block text-sm font-medium text-foreground mb-1.5">Phone Number *</label>
            <input id="enq-phone" type="tel" placeholder="10-digit number"
              value={form.phone}
              onChange={e => { setForm(f => ({ ...f, phone: e.target.value })); setErrors(er => ({ ...er, phone: "" })); }}
              className={field("phone")} aria-describedby={errors.phone ? "err-phone" : undefined}
            />
            {errors.phone && <p id="err-phone" className="text-accent text-xs mt-1" role="alert">{errors.phone}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="enq-child" className="block text-sm font-medium text-foreground mb-1.5">Child's Name *</label>
          <input id="enq-child" type="text" placeholder="Child's full name"
            value={form.child}
            onChange={e => { setForm(f => ({ ...f, child: e.target.value })); setErrors(er => ({ ...er, child: "" })); }}
            className={field("child")} aria-describedby={errors.child ? "err-child" : undefined}
          />
          {errors.child && <p id="err-child" className="text-accent text-xs mt-1" role="alert">{errors.child}</p>}
        </div>
        <div>
          <label htmlFor="enq-program" className="block text-sm font-medium text-foreground mb-1.5">Program of Interest *</label>
          <select id="enq-program"
            value={form.program}
            onChange={e => { setForm(f => ({ ...f, program: e.target.value })); setErrors(er => ({ ...er, program: "" })); }}
            className={field("program")} aria-describedby={errors.program ? "err-program" : undefined}
          >
            <option value="">Select a program</option>
            {["Playgroup", "Nursery", "LKG", "UKG", "Daycare", "Summer Camp"].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          {errors.program && <p id="err-program" className="text-accent text-xs mt-1" role="alert">{errors.program}</p>}
        </div>
        <div>
          <label htmlFor="enq-msg" className="block text-sm font-medium text-foreground mb-1.5">Message (optional)</label>
          <textarea id="enq-msg" rows={3} placeholder="Any questions or special requirements..."
            value={form.message}
            onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            className={`${field("message")} resize-none`}
          />
        </div>
        {submitError && (
          <p className="text-accent text-sm font-medium text-center bg-accent/10 p-3 rounded-xl" role="alert">
            {submitError}
          </p>
        )}
        <button type="submit" disabled={isSubmitting}
          className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed">
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" /> Submitting...
            </>
          ) : (
            <>
              <ArrowRight className="w-5 h-5" aria-hidden="true" /> Submit Enquiry
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}

// ─── Contact ──────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <Wrap id="contact" className="bg-background">
      <SectionTitle
        tag="Get in Touch"
        title="We Would Love to Hear From You"
        sub="Whether you have questions or are ready to enroll — we are here for you."
      />
      <div className="grid lg:grid-cols-2 gap-10">
        <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={vp} transition={{ duration: 0.6 }}>
          <div className="bg-[#1D3557] rounded-3xl p-8 text-white h-full flex flex-col">
            <h3 className="text-2xl font-extrabold mb-8">Contact Information</h3>
            <div className="space-y-6 flex-1">
              {[
                { icon: MapPin,  label: "Address",      content: "X11, X Block, Kovaipudur,\nCoimbatore, Tamil Nadu" },
                { icon: Phone,   label: "Phone",        content: "+91 8903708010", href: "tel:8903708010" },
                { icon: Clock,   label: "Working Hours", content: "8:30 AM onwards\nMonday to Saturday" },
              ].map(item => (
                <div key={item.label} className="flex gap-4 items-start">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm mb-0.5">{item.label}</div>
                    {item.href
                      ? <a href={item.href} className="text-white/70 text-sm hover:text-primary transition-colors">{item.content}</a>
                      : <p className="text-white/70 text-sm whitespace-pre-line">{item.content}</p>}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-3 flex-wrap">
              <a href="https://wa.me/918903708010" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] text-white font-semibold text-sm rounded-full hover:opacity-90 transition-opacity">
                <MessageCircle className="w-4 h-4" aria-hidden="true" /> WhatsApp
              </a>
              <a href="tel:8903708010"
                 className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-semibold text-sm rounded-full hover:shadow-lg transition-all">
                <Phone className="w-4 h-4" aria-hidden="true" /> Call Now
              </a>
            </div>

            <div className="mt-8 rounded-2xl overflow-hidden bg-white/10 h-40 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-7 h-7 mx-auto mb-2 text-primary" aria-hidden="true" />
                <p className="text-white/60 text-sm">Kovaipudur, Coimbatore</p>
                <a href="https://maps.google.com/?q=Kovaipudur+Coimbatore" target="_blank" rel="noopener noreferrer"
                   className="text-primary text-xs font-semibold hover:underline mt-1 block">
                  Open in Google Maps →
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        <EnquiryForm />
      </div>
    </Wrap>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#1D3557] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <span className="text-xl" aria-hidden="true">🦅</span>
              </div>
              <div>
                <div className="font-extrabold">Little Hawks</div>
                <div className="text-white/55 text-xs">Preschool & Daycare</div>
              </div>
            </div>
            <p className="text-white/55 text-sm leading-relaxed max-w-xs mb-6">
              Nurturing curious minds and joyful hearts in Kovaipudur, Coimbatore since 2015.
              Rated 5.0 ⭐ by our parent community.
            </p>
            <div className="flex gap-3">
              {["f", "in", "yt"].map(s => (
                <button key={s} aria-label={`Follow us on ${s}`}
                        className="w-9 h-9 rounded-xl bg-white/10 hover:bg-primary hover:text-primary-foreground transition-all font-bold text-white/60 text-xs">
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <nav aria-label="Footer quick links">
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-primary">Quick Links</h4>
            <ul className="space-y-2.5">
              {["About Us", "Programs", "Campus Gallery", "Daily Activities", "Admissions", "Contact"].map(l => (
                <li key={l}>
                  <a href="#" className="text-white/55 text-sm hover:text-white transition-colors">{l}</a>
                </li>
              ))}
            </ul>
          </nav>

          <address className="not-italic">
            <h4 className="font-bold mb-4 text-xs uppercase tracking-widest text-primary">Contact</h4>
            <div className="space-y-3 text-sm text-white/55">
              <div className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                <span>X11, X Block, Kovaipudur,<br />Coimbatore, Tamil Nadu</span>
              </div>
              <div className="flex gap-2 items-center">
                <Phone className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <a href="tel:8903708010" className="hover:text-white transition-colors">8903708010</a>
              </div>
              <div className="flex gap-2 items-center">
                <Clock className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
                <span>8:30 AM onwards</span>
              </div>
            </div>
          </address>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-white/35 text-sm">
            &copy; {new Date().getFullYear()} Little Hawks Preschool & Daycare. All rights reserved.
          </p>
          <p className="text-white/35 text-xs">
            Designed with ❤️ for every little learner.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <style>{`
        @keyframes accordion-down {
          from { height: 0; opacity: 0; }
          to   { height: var(--radix-accordion-content-height); opacity: 1; }
        }
        @keyframes accordion-up {
          from { height: var(--radix-accordion-content-height); opacity: 1; }
          to   { height: 0; opacity: 0; }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(29,53,87,0.2); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(29,53,87,0.4); }
      `}</style>
      <div style={{ fontFamily: "var(--font-sans)" }}>
        <Navbar />
        <main>
          <Hero />
          <WhyUs />
          <About />
          <Programs />
          <CampusGallery />
          <DailySchedule />
          <Testimonials />
          <Admissions />
          <FAQ />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
