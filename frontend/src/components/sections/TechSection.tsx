import { motion } from 'framer-motion';
import { Radar, FileBarChart, Plug, ShieldCheck, Route, AlertTriangle, Eye, Lock } from 'lucide-react';

const techItems = [
    { icon: Radar, title: 'Rastreamento GPS', desc: 'Monitorização em tempo real de toda a frota' },
    { icon: FileBarChart, title: 'Relatórios Automáticos', desc: 'Consumo, quilometragem e alertas de manutenção' },
    { icon: Plug, title: 'Integração ERP', desc: 'Contabilidade e sistemas do cliente sob acordo' },
    { icon: ShieldCheck, title: 'Controlo de Qualidade', desc: 'Inspeção técnica completa antes de cada entrega' },
];

const hseItems = [
    { icon: Route, title: 'Planeamento de Rotas', desc: 'Foco em segurança e eficiência operacional' },
    { icon: AlertTriangle, title: 'Gestão de Risco', desc: 'Identificação antecipada de cenários críticos' },
    { icon: Eye, title: 'Revisão Contínua', desc: 'Baseada em dados operacionais em tempo real' },
    { icon: Lock, title: 'Tolerância Zero', desc: 'A comportamentos e condutas de risco' },
];

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};
const item: any = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function TechCard({ icon: Icon, title, desc, accent }: { icon: React.ElementType; title: string; desc: string; accent: string }) {
    return (
        <motion.div
            variants={item}
            whileHover={{ y: -4, scale: 1.02 }}
            className="group relative bg-white/5 border border-white/8 rounded-2xl p-5 hover:bg-white/10 hover:border-brand-500/30 transition-all duration-400 overflow-hidden cursor-default"
        >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl`}
                style={{ background: `radial-gradient(circle at 30% 30%, ${accent}, transparent 70%)` }} />
            <Icon className="w-6 h-6 text-brand-400 mb-3 group-hover:text-brand-300 transition-colors relative z-10" />
            <h4 className="text-sm font-bold text-white mb-1 relative z-10">{title}</h4>
            <p className="text-xs text-charcoal-400 leading-relaxed relative z-10">{desc}</p>
        </motion.div>
    );
}

// Make it importable in JSX
import React from 'react';
import { getPublicUrl } from '../../utils/assetUrl';

export default function TechSection() {
    return (
        <section className="relative py-32 overflow-hidden">
            {/* Background image */}
<<<<<<< HEAD
            <div 
                style={{ backgroundImage: `url(${getPublicUrl('/tech-gps.png')})` }}
                className="absolute inset-0 bg-cover bg-center opacity-[0.15] mix-blend-luminosity" 
=======
            <div className="absolute inset-0 bg-cover bg-center opacity-[0.15] mix-blend-luminosity" 
                style={{ backgroundImage: `url(${import.meta.env.BASE_URL}tech-gps.png)` }}
>>>>>>> b60c606cc6b6be6dbceba21104d2650bce2badfd
            />

            {/* Deep dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#060608]/90 via-[#0d060a]/80 to-[#060608]/90" />

            {/* Glow orbs */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.06) 0%, transparent 60%)' }}
                animate={{ scale: [1, 1.08, 1], rotate: [0, 5, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Horizontal scanline */}
            <motion.div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/30 to-transparent"
                animate={{ top: ['10%', '90%'] }}
                transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
            />

            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-[0.025]"
                style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }}
            />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-brand-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                        <Radar className="w-3.5 h-3.5" />
                        Tecnologia &amp; Segurança
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-heading font-black text-white mb-4">
                        Infraestrutura{' '}
                        <span className="text-brand-500" style={{ textShadow: '0 0 50px rgba(200,16,46,0.5)' }}>
                            Tecnológica
                        </span>
                    </h2>
                    <p className="text-charcoal-400 max-w-xl mx-auto text-lg font-light">
                        Investimento contínuo nas ferramentas que garantem gestão eficiente, transparente e segura da operação
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

                    {/* — Technology — */}
                    <div>
                        <motion.h3
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-lg font-bold text-white mb-8 flex items-center gap-3"
                        >
                            <span className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                                <Radar className="w-4 h-4 text-brand-400" />
                            </span>
                            Tecnologia e Monitorização
                        </motion.h3>
                        <motion.div
                            initial="hidden" whileInView="visible"
                            viewport={{ once: true }}
                            variants={stagger}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {techItems.map((t, i) => (
                                <TechCard key={i} icon={t.icon} title={t.title} desc={t.desc} accent="rgba(200,16,46,0.12)" />
                            ))}
                        </motion.div>
                    </div>

                    {/* — HSE — */}
                    <div>
                        <motion.h3
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-lg font-bold text-white mb-8 flex items-center gap-3"
                        >
                            <span className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                                <ShieldCheck className="w-4 h-4 text-brand-400" />
                            </span>
                            HSE — Saúde, Segurança e Ambiente
                        </motion.h3>
                        <motion.div
                            initial="hidden" whileInView="visible"
                            viewport={{ once: true }}
                            variants={stagger}
                            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                            {hseItems.map((h, i) => (
                                <TechCard key={i} icon={h.icon} title={h.title} desc={h.desc} accent="rgba(200,16,46,0.08)" />
                            ))}
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
