import { motion, useScroll, useTransform, useMotionValue, useSpring, animate } from 'framer-motion';
import { Bus, ArrowRight, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

/* ── Animated counter ─────────────────────────────────── */
function Counter({ target, suffix = '', prefix = '' }: { target: number; suffix?: string; prefix?: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLDivElement>(null);
    const started = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !started.current) {
                started.current = true;
                const ctrl = animate(0, target, {
                    duration: 2.2,
                    ease: [0.16, 1, 0.3, 1] as any,
                    onUpdate: v => setCount(Math.round(v)),
                });
                return () => ctrl.stop();
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target]);

    return <div ref={ref}><span>{prefix}{count}{suffix}</span></div>;
}

/* ── Floating particle ────────────────────────────────── */
function Particle({ x, y, size, delay }: { x: number; y: number; size: number; delay: number }) {
    return (
        <motion.div
            className="absolute rounded-full bg-brand-500/30 pointer-events-none"
            style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
            transition={{ duration: 4 + Math.random() * 3, delay, repeat: Infinity, ease: 'easeInOut' }}
        />
    );
}

/* ── Word-by-word reveal ──────────────────────────────── */
function AnimatedTitle({ children }: { children: string }) {
    const words = children.split(' ');
    return (
        <span>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    className="inline-block mr-[0.25em]"
                    initial={{ opacity: 0, y: 60, rotateX: -45 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: [0.16, 1, 0.3, 1] as any }}
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
}

/* ── Magnetic button ──────────────────────────────────── */
function MagneticButton({ children, href, className = "" }: { children: React.ReactNode; href?: string; className?: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 200, damping: 15 });
    const sy = useSpring(y, { stiffness: 200, damping: 15 });

    const handleMove = useCallback((e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
        y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
    }, [x, y]);

    const content = (
        <motion.div
            ref={ref}
            style={{ x: sx, y: sy }}
            onMouseMove={handleMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className={`inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-brand-500 text-white font-bold text-lg glow-red cursor-pointer select-none ${className}`}
        >
            {children}
        </motion.div>
    );

    if (href) {
        return <Link to={href}>{content}</Link>;
    }
    return content;
}

/* ── Vehicle Carousel (CSS transitions, like original) ── */
const heroVehicles = ['/CarOne.webp', '/CarTwo.webp', '/CarThree.webp', '/CarFour.webp'];

function VehicleCarousel() {
    const [currentIdx, setCurrentIdx] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIdx(prev => (prev + 1) % heroVehicles.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="relative w-full aspect-video overflow-visible">
            {/* Subtle glow behind vehicle */}
            <div className="absolute w-[120%] h-[120%] -left-[10%] -top-[10%] bg-gradient-to-tr from-brand-500/10 to-transparent rounded-full blur-3xl -z-10" />
            <div className="absolute right-0 top-1/4 w-64 h-64 bg-brand-500/8 rounded-full blur-3xl -z-10" />

            {heroVehicles.map((img, idx) => {
                let position = 0;
                if (idx === currentIdx) position = 0;
                else if (idx === (currentIdx + 1) % heroVehicles.length) position = 1;
                else if (idx === (currentIdx - 1 + heroVehicles.length) % heroVehicles.length) position = -1;
                else position = 2;

                return (
                    <div
                        key={idx}
                        className="absolute inset-0 w-full transition-all duration-1000 ease-in-out flex items-center justify-center"
                        style={{
                            transform: `translateX(${position * 120}%) scale(${position === 0 ? 1.05 : 0.8})`,
                            opacity: position === 0 ? 1 : 0,
                            zIndex: position === 0 ? 10 : 0,
                        }}
                    >
                        <img
                            src={img}
                            alt="NovaDrive vehicle"
                            className={`w-[110%] max-w-none object-contain transition-transform duration-[4000ms] ease-linear ${position === 0 ? 'scale-105' : 'scale-100'}`}
                            style={{
                                filter: 'drop-shadow(0 25px 30px rgba(0,0,0,0.5)) brightness(1.1) saturate(1.1)',
                            }}
                        />
                    </div>
                );
            })}
        </div>
    );
}

/* ── Main HeroSection ─────────────────────────────────── */
export default function HeroSection() {
    const { scrollY } = useScroll();
    const yBg = useTransform(scrollY, [0, 1000], [0, 160]);
    const scaleBg = useTransform(scrollY, [0, 1000], [1, 1.12]);
    // Slow fade: content stays fully visible until 500px, then fades by 900px
    const opacityContent = useTransform(scrollY, [0, 500, 900], [1, 1, 0]);

    const particles = Array.from({ length: 18 }, (_, i) => ({
        x: Math.random() * 100, y: Math.random() * 100,
        size: 3 + Math.random() * 6, delay: i * 0.3,
    }));

    const kpis = [
        { target: 35, prefix: '+', suffix: '', label: 'Viaturas na Frota' },
        { target: 98, suffix: '%', label: 'Taxa de Disponibilidade' },
        { target: 24, suffix: 'h', label: 'Suporte Operacional' },
        { target: 80, prefix: '+', suffix: '', label: 'Colaboradores' },
    ];

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

            {/* — Background layers — */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0c] via-[#0f0a0e] to-[#0a0a0c]" />
            <motion.div
                style={{ y: yBg, scale: scaleBg }}
                className="absolute inset-0 bg-[url('/hero-fleet.png')] bg-cover bg-center opacity-25 mix-blend-luminosity transform-gpu will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/50 to-transparent" />

            {/* — Animated radial glows — */}
            <motion.div
                className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.12) 0%, transparent 70%)' }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.07) 0%, transparent 70%)' }}
                animate={{ scale: [1.1, 1, 1.1], opacity: [0.4, 0.8, 0.4] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />

            {/* — Floating particles — */}
            {particles.map((p, i) => <Particle key={i} {...p} />)}

            {/* — Grid noise texture — */}
            <div className="absolute inset-0 opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            {/* — Content: two-column layout — */}
            <motion.div
                style={{ opacity: opacityContent }}
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 min-h-[80vh] flex items-center transform-gpu"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end w-full">

                    {/* Left column: text content */}
                    <div className="max-w-2xl">
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as any }}
                            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-brand-400 text-sm font-semibold mb-10 backdrop-blur-md"
                        >
                            <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                            <Bus className="w-4 h-4" />
                            Moçambique · Mobilidade Corporativa de Elite
                        </motion.div>

                        {/* Headline */}
                        <h1 className="text-5xl sm:text-5xl lg:text-5xl xl:text-6xl font-heading font-black leading-[1.0] text-white mb-8 perspective-[1200px]">
                            <AnimatedTitle>Soluções de</AnimatedTitle>{' '}
                            <motion.span
                                className="inline-block text-brand-500"
                                initial={{ opacity: 0, y: 60 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, delay: 0.65, ease: [0.16, 1, 0.3, 1] as any }}
                                style={{ textShadow: '0 0 60px rgba(200,16,46,0.5)' }}
                            >
                                Mobilidade
                            </motion.span>
                            <br />
                            <AnimatedTitle>Empresarial</AnimatedTitle>
                        </h1>

                        {/* Subtext */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.9 }}
                            className="text-xl sm:text-2xl text-charcoal-300 mb-12 max-w-xl leading-relaxed font-light"
                        >
                            Não fornecemos apenas viaturas. Estruturamos, operamos e controlamos um sistema completo de transporte para a sua organização.
                        </motion.p>

                        {/* CTA Row */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 1.1 }}
                            className="flex flex-wrap gap-4"
                        >
                            <MagneticButton href="/vehicles" className="group">
                                Pedir Proposta Comercial
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                            </MagneticButton>

                            <Link
                                to="/vehicles"
                                className="inline-flex items-center gap-3 px-9 py-4 rounded-2xl bg-white/5 border border-white/15 text-white font-semibold text-lg backdrop-blur-sm cursor-pointer hover:scale-[1.03] hover:bg-white/10 transition-all"
                            >
                                Ver Frota
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right column: vehicle carousel */}
                    <motion.div
                        initial={{ opacity: 0, x: 60 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.8, ease: [0.16, 1, 0.3, 1] as any }}
                        className="hidden lg:block relative w-full mb-4"
                    >
                        <VehicleCarousel />
                    </motion.div>
                </div>
            </motion.div>

            {/* — KPIs — */}
            <motion.div
                style={{ opacity: opacityContent }}
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20 transform-gpu"
            >
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 1.8 }}
                    className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/8 rounded-2xl overflow-hidden border border-white/10 mt-4"
                >
                    {kpis.map((kpi, i) => (
                        <div key={i} className="bg-white/[0.04] backdrop-blur-sm px-6 py-7 hover:bg-white/[0.08] transition-colors duration-300 text-center">
                            <div className="text-4xl sm:text-5xl font-heading font-black text-white mb-1.5 tabular-nums">
                                <Counter target={kpi.target} prefix={kpi.prefix} suffix={kpi.suffix} />
                            </div>
                            <p className="text-xs sm:text-sm text-charcoal-400 font-semibold tracking-wide uppercase">{kpi.label}</p>
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            {/* — Scroll cue — */}
            <motion.div
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-charcoal-500"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
                <ChevronDown className="w-4 h-4" />
            </motion.div>
        </section>
    );
}
