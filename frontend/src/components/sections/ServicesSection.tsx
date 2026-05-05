import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { CalendarDays, Building2, Sparkles, ChevronRight, Briefcase, ArrowRight } from 'lucide-react';

const services = [
    {
        icon: CalendarDays,
        title: 'Aluguer Mensal',
        subtitle: 'Médio Prazo · Flexível',
        color: 'from-brand-500 to-rose-600',
        glow: 'rgba(200,16,46,0.25)',
        items: [
            'Solução flexível e renovável',
            'Relatório mensal de utilização incluído',
            'Substituição de viatura garantida',
            'Revisão periódica das condições',
        ],
    },
    {
        icon: Building2,
        title: 'Contratos Corporativos',
        subtitle: 'Longo Prazo · Estratégico',
        color: 'from-slate-600 to-slate-800',
        glow: 'rgba(100,116,139,0.25)',
        items: [
            'Acordos anuais ou plurianuais negociados',
            'Gestão total: manutenção, seguros, docs',
            'Gestor de conta dedicado 24/7',
            'SLA contratual garantido por escrito',
        ],
    },
    {
        icon: Sparkles,
        title: 'Frota Dedicada 0 km',
        subtitle: 'Exclusividade Total · Premium',
        color: 'from-amber-500 to-orange-600',
        glow: 'rgba(245,158,11,0.25)',
        items: [
            'Viaturas novas adquiridas por cliente',
            'Máxima fiabilidade desde o primeiro dia',
            'Reforço da imagem corporativa',
            'Condições ajustadas a cada projecto',
        ],
    },
];

/* ── 3D Tilt + Shine Card ─────────────────────────────── */
function ServiceCard({ s, index }: { s: typeof services[0]; index: number }) {
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 180, damping: 16 });
    const sy = useSpring(my, { stiffness: 180, damping: 16 });
    const rotX = useTransform(sy, [-0.5, 0.5], ['10deg', '-10deg']);
    const rotY = useTransform(sx, [-0.5, 0.5], ['-10deg', '10deg']);
    const shine = useTransform(sx, [-0.5, 0.5], ['-100%', '200%']);

    return (
        <motion.div
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.7, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d', perspective: '1000px' }}
            onMouseMove={e => {
                const r = e.currentTarget.getBoundingClientRect();
                mx.set((e.clientX - r.left) / r.width - 0.5);
                my.set((e.clientY - r.top) / r.height - 0.5);
            }}
            onMouseLeave={() => { mx.set(0); my.set(0); }}
            className="relative group h-full"
        >
            {/* Glow halo */}
            <div className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"
                style={{ background: `radial-gradient(circle at center, ${s.glow}, transparent 70%)` }} />

            <div className="relative h-full bg-white dark:bg-charcoal-900 border border-charcoal-100 dark:border-white/8 rounded-3xl p-8 overflow-hidden transition-all duration-500 group-hover:border-brand-500/20 shadow-sm group-hover:shadow-2xl"
                style={{ transform: 'translateZ(0)' }}>

                {/* Shine sweep */}
                <motion.div
                    style={{ left: shine }}
                    className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                {/* Icon */}
                <div style={{ transform: 'translateZ(30px)' }}>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                        style={{ boxShadow: `0 8px 24px ${s.glow}` }}>
                        <s.icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-1">{s.title}</h3>
                    <p className="text-xs font-semibold text-brand-500 uppercase tracking-widest mb-6">{s.subtitle}</p>

                    <ul className="space-y-3">
                        {s.items.map((item, j) => (
                            <li key={j} className="flex items-start gap-3 text-sm text-charcoal-600 dark:text-charcoal-400">
                                <ChevronRight className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                                <span>{item}</span>
                            </li>
                        ))}
                    </ul>

                    <motion.button
                        whileHover={{ x: 4 }}
                        className="inline-flex items-center gap-2 mt-8 text-sm font-semibold text-brand-500 hover:text-brand-400 transition-colors"
                    >
                        Saber mais <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

export default function ServicesSection() {
    return (
        <section className="py-32 bg-[#f8f8f9] dark:bg-[#050507] transition-colors relative overflow-hidden">

            {/* Background geometry */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/10 to-transparent" />
                <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.05) 0%, transparent 70%)' }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-2xl mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                        <Briefcase className="w-3.5 h-3.5" />
                        Nossos Serviços
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-heading font-black text-charcoal-900 dark:text-white leading-tight mb-4">
                        Soluções desenhadas para{' '}
                        <span className="text-brand-500">crescer consigo</span>
                    </h2>
                    <p className="text-charcoal-500 dark:text-charcoal-400 text-lg font-light">
                        Do aluguer pontual ao contrato corporativo plurianual, adaptamos cada proposta à realidade da sua organização.
                    </p>
                </motion.div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {services.map((s, i) => <ServiceCard key={i} s={s} index={i} />)}
                </div>
            </div>
        </section>
    );
}
