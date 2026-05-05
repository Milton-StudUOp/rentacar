import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Eye, Target, Gem, Quote, ArrowUpRight } from 'lucide-react';
import React from 'react';

/* ── Section label ────────────────────────────────────── */
function Label({ icon: Icon, text }: { icon: React.ElementType; text: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/25 text-brand-400 text-xs font-bold uppercase tracking-[0.2em] mb-8"
        >
            <Icon className="w-3.5 h-3.5" />
            {text}
        </motion.div>
    );
}

/* ── 3D hover card ────────────────────────────────────── */
function HoverCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const sx = useSpring(x, { stiffness: 200, damping: 18 });
    const sy = useSpring(y, { stiffness: 200, damping: 18 });
    const rotX = useTransform(sy, [-0.5, 0.5], ['8deg', '-8deg']);
    const rotY = useTransform(sx, [-0.5, 0.5], ['-8deg', '8deg']);

    return (
        <motion.div
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
            onMouseMove={e => {
                const r = e.currentTarget.getBoundingClientRect();
                x.set((e.clientX - r.left) / r.width - 0.5);
                y.set((e.clientY - r.top) / r.height - 0.5);
            }}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className={`card-corporate p-6 group cursor-default ${className}`}
        >
            <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
        </motion.div>
    );
}

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};
const fadeUp: any = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } };
const fadeLeft: any = { hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } } };

export default function AboutSection() {
    const cards = [
        {
            icon: Eye,
            title: 'Visão',
            text: 'Ser referência absoluta em Moçambique em transporte corporativo, com excelência e padrões internacionais.',
            gradient: 'from-brand-500/20 to-transparent',
        },
        {
            icon: Target,
            title: 'Missão',
            text: 'Garantir mobilidade empresarial segura, eficiente e confiável que sustenta e acelera a produtividade dos clientes.',
            gradient: 'from-amber-500/20 to-transparent',
        },
    ];

    return (
        <section className="relative py-32 overflow-hidden bg-[#FAFAFA] dark:bg-[#0a0a0c] transition-colors">
            {/* Ambient glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.04) 0%, transparent 70%)' }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* — Left: Image with floating badge — */}
                    <motion.div
                        initial="hidden" whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={fadeLeft}
                        className="relative"
                    >
                        {/* Image frame with glow */}
                        <div className="absolute -inset-4 bg-gradient-to-br from-brand-500/20 via-transparent to-transparent rounded-3xl blur-2xl" />
                        <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.2)] border border-white/10">
                            <img
                                src="/about-driver.png"
                                alt="Motorista NovaDrive"
                                className="w-full h-[520px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                            {/* Floating quote card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl border border-white/20 backdrop-blur-xl bg-white/10"
                            >
                                <Quote className="w-5 h-5 text-brand-400 mb-2" />
                                <p className="text-white text-sm leading-relaxed italic font-light">
                                    "Não fornecemos apenas viaturas. Estruturamos, operamos e controlamos um sistema completo de transporte."
                                </p>
                            </motion.div>
                        </div>

                        {/* Floating accent badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.7 }}
                            className="absolute -top-6 -right-6 w-24 h-24 rounded-2xl bg-brand-500 shadow-xl shadow-brand-500/40 flex flex-col items-center justify-center text-white font-bold border border-brand-400/30"
                        >
                            <span className="text-2xl font-black">10+</span>
                            <span className="text-xs text-center leading-tight px-1">Anos<br/>Exp.</span>
                        </motion.div>
                    </motion.div>

                    {/* — Right: Content — */}
                    <motion.div
                        initial="hidden" whileInView="visible"
                        viewport={{ once: true, margin: '-100px' }}
                        variants={stagger}
                    >
                        <Label icon={Gem} text="Quem Somos" />

                        <motion.h2
                            variants={fadeUp}
                            className="text-4xl sm:text-5xl font-heading font-black text-charcoal-900 dark:text-white leading-tight mb-6"
                        >
                            Parceiro Estratégico de{' '}
                            <span
                                className="text-brand-500"
                                style={{ textShadow: '0 0 40px rgba(200,16,46,0.3)' }}
                            >
                                Mobilidade
                            </span>
                            {' '}Corporativa
                        </motion.h2>

                        <motion.p
                            variants={fadeUp}
                            className="text-charcoal-600 dark:text-charcoal-300 text-lg leading-relaxed mb-10 font-light"
                        >
                            A NovaDrive é uma empresa moçambicana especializada em soluções de mobilidade empresarial,
                            com foco na transformação do transporte de pessoal no setor corporativo de alta exigência.
                        </motion.p>

                        {/* Vision/Mission cards */}
                        <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {cards.map((card, i) => (
                                <motion.div key={i} variants={fadeUp}>
                                    <HoverCard>
                                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                        <div className="w-11 h-11 rounded-xl bg-brand-500/10 flex items-center justify-center mb-4 group-hover:bg-brand-500/20 transition-colors">
                                            <card.icon className="w-5 h-5 text-brand-500" />
                                        </div>
                                        <h3 className="text-base font-bold text-charcoal-900 dark:text-white mb-2">{card.title}</h3>
                                        <p className="text-sm text-charcoal-600 dark:text-charcoal-400 leading-relaxed">{card.text}</p>
                                    </HoverCard>
                                </motion.div>
                            ))}
                        </motion.div>

                        {/* CTA link */}
                        <motion.a
                            variants={fadeUp}
                            href="/about"
                            whileHover={{ x: 4 }}
                            className="inline-flex items-center gap-2 text-brand-500 font-semibold text-sm hover:gap-3 transition-all duration-300"
                        >
                            Conhecer a nossa história completa
                            <ArrowUpRight className="w-4 h-4" />
                        </motion.a>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
