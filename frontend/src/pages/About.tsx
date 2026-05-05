import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { Building2, Eye, Target, ShieldCheck, ArrowRight, Quote, Car, Award, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef, useCallback } from 'react';
import { getPublicUrl } from '../utils/assetUrl';

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

const fadeUp: any = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
};

const stagger: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function About() {
    const { scrollY } = useScroll();
    const yBg = useTransform(scrollY, [0, 1000], [0, 200]);
    const opacityBg = useTransform(scrollY, [0, 600], [0.3, 0]);

    return (
        <div className="bg-slate-50 dark:bg-[#0a0a0c] min-h-screen text-slate-900 dark:text-white overflow-hidden selection:bg-brand-500/30 transition-colors duration-300">
            
            {/* ── Premium Hero Header ─────────────────────────────────────── */}
            <div className="relative min-h-[70vh] flex items-center justify-center pt-24 pb-20 overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
                {/* Background layers */}
                <motion.div 
                    style={{ y: yBg, opacity: opacityBg, backgroundImage: `url(${getPublicUrl('/hero-fleet.png')})` }}
                    className="absolute inset-0 bg-cover bg-center mix-blend-luminosity dark:mix-blend-luminosity opacity-10 dark:opacity-25 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-white/90 to-slate-50 dark:from-[#0a0a0c]/80 dark:via-[#0a0a0c]/90 dark:to-[#0a0a0c] pointer-events-none transition-colors duration-300" />
                
                {/* Glows */}
                <motion.div 
                    className="absolute top-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.1) 0%, transparent 60%)' }}
                    animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.03] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
                    <motion.div initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-brand-600 dark:text-brand-400 text-sm font-semibold mb-8 backdrop-blur-md transition-colors duration-300">
                        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
                        <Building2 className="w-4 h-4" />
                        Perfil Institucional
                    </motion.div>
                    
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-5xl sm:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-[1.1] perspective-[1200px] text-slate-900 dark:text-white transition-colors duration-300"
                    >
                        Sobre a{' '}
                        <span className="inline-block text-brand-500 drop-shadow-[0_0_30px_rgba(200,16,46,0.2)] dark:drop-shadow-[0_0_60px_rgba(200,16,46,0.5)]">
                            NovaDrive
                        </span>
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="text-xl sm:text-2xl text-slate-600 dark:text-charcoal-300 max-w-3xl mx-auto leading-relaxed font-light transition-colors duration-300"
                    >
                        Empresa moçambicana especializada em soluções de mobilidade corporativa de elite.
                        Elevamos o padrão do transporte empresarial com frota premium e gestão integral.
                    </motion.p>
                </div>
            </div>

            {/* ── Conceito com Viatura 3D ──────────────────────────────────────────── */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                {/* Background glow for the car */}
                <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-[100px] pointer-events-none hidden lg:block transition-colors duration-300" />

                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
                    variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">

                    {/* Image / 3D Car floating */}
                    <motion.div variants={fadeUp} className="relative h-[400px] lg:h-[500px] flex items-center justify-center">
                        <motion.img 
                            src={getPublicUrl('/CarThree.webp')} 
                            alt="Conceito NovaDrive" 
                            className="w-[120%] max-w-none object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.3)] dark:drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] relative z-10 transition-all duration-300"
                            animate={{ y: [-10, 10, -10] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                            style={{ filter: 'brightness(1.05) contrast(1.05)' }}
                        />
                        <div className="absolute -bottom-10 left-[20%] right-[20%] h-8 bg-black/20 dark:bg-black/60 rounded-full blur-2xl transition-colors duration-300" />
                        
                        {/* Floating glass card */}
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.6, duration: 0.8 }}
                            className="absolute bottom-4 -right-4 lg:-right-12 p-5 rounded-2xl bg-white/80 dark:bg-white/5 backdrop-blur-xl border border-slate-200 dark:border-white/10 shadow-2xl z-20 transition-colors duration-300"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-brand-50 dark:bg-brand-500/20 flex items-center justify-center transition-colors duration-300">
                                    <Award className="w-6 h-6 text-brand-500" />
                                </div>
                                <div>
                                    <p className="text-slate-900 dark:text-white font-bold text-lg transition-colors duration-300">Excelência</p>
                                    <p className="text-slate-500 dark:text-charcoal-400 text-sm transition-colors duration-300">Padrão Corporativo</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Text Content */}
                    <motion.div variants={stagger} className="lg:pl-8">
                        <motion.div variants={fadeUp} className="inline-flex items-center gap-2 text-brand-500 text-sm font-bold uppercase tracking-widest mb-4">
                            <Target className="w-4 h-4" /> O Nosso Foco
                        </motion.div>
                        <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] transition-colors duration-300">
                            O Nosso <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-brand-600 dark:from-brand-400 dark:to-brand-600">Conceito</span>
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-xl text-slate-600 dark:text-charcoal-300 mb-6 leading-relaxed font-light transition-colors duration-300">
                            A NovaDrive foi criada com uma ideia fundamental: <strong className="text-slate-900 dark:text-white font-medium transition-colors duration-300">as empresas devem focar-se no seu negócio, não na gestão de viaturas.</strong>
                        </motion.p>
                        <motion.p variants={fadeUp} className="text-lg text-slate-500 dark:text-charcoal-400 mb-10 leading-relaxed transition-colors duration-300">
                            Gestão de manutenção, seguros, controlo de utilização e logística exigem tempo valioso. Nós assumimos essa responsabilidade inteiramente, entregando uma frota sempre pronta a operar.
                        </motion.p>
                        
                        <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { icon: ShieldCheck, text: 'Segurança Total' },
                                { icon: Clock, text: 'Disponibilidade 24/7' },
                                { icon: Car, text: 'Renovação de Frota' },
                                { icon: Building2, text: 'Foco no Negócio' }
                            ].map((item, i) => (
                                <motion.div key={i} variants={fadeUp}
                                    className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.06] shadow-sm dark:shadow-none transition-colors duration-300">
                                    <item.icon className="w-5 h-5 text-brand-500 shrink-0" />
                                    <span className="text-sm font-medium text-slate-800 dark:text-white transition-colors duration-300">{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── Missão & Visão (Glassmorphism Cards) ─────────────────────────────────────── */}
            <section className="py-24 relative overflow-hidden bg-white dark:bg-transparent transition-colors duration-300">
                <div className="absolute inset-0 bg-slate-100/50 dark:bg-white/[0.02] border-y border-slate-200 dark:border-white/5 transition-colors duration-300" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}
                        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {[
                            {
                                icon: Target,
                                title: 'A Nossa Missão',
                                text: 'Simplificar a mobilidade empresarial através de soluções profissionais de aluguer e gestão de frotas, permitindo que os clientes concentrem os seus recursos no desenvolvimento dos seus negócios.',
                            },
                            {
                                icon: Eye,
                                title: 'A Nossa Visão',
                                text: 'Tornar-se a referência absoluta em soluções de mobilidade corporativa em Moçambique, pautando-se pela excelência operacional, segurança e inovação tecnológica.',
                            },
                        ].map((card, i) => (
                            <motion.div key={i} variants={fadeUp}
                                whileHover={{ y: -8, scale: 1.02 }}
                                className="group relative bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-none rounded-[2rem] p-10 sm:p-12 overflow-hidden transition-all duration-500 hover:border-brand-500/30 dark:hover:bg-white/[0.05]">
                                {/* Card Hover Glow */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                                    style={{ background: 'radial-gradient(circle at 50% 0%, rgba(200,16,46,0.08), transparent 70%)' }} />
                                
                                <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-500/10 border border-brand-100 dark:border-brand-500/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                                    <card.icon className="w-8 h-8 text-brand-500" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 transition-colors duration-300">{card.title}</h3>
                                <p className="text-slate-600 dark:text-charcoal-300 leading-relaxed text-lg font-light transition-colors duration-300">{card.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Diferencial ─────────────────────────────────────── */}
            <section className="py-32 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-brand-500/5 dark:bg-brand-500/10 rounded-[100%] blur-[120px] pointer-events-none transition-colors duration-300" />
                
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="relative z-10">
                    <motion.div variants={fadeUp} className="inline-block mb-8">
                        <Quote className="w-16 h-16 text-brand-500/20 dark:text-brand-500/30 transition-colors duration-300" />
                    </motion.div>
                    <motion.h2 variants={fadeUp} className="text-3xl sm:text-4xl md:text-5xl font-light text-slate-800 dark:text-white mb-10 leading-[1.4] transition-colors duration-300">
                        "O grande <span className="font-bold text-brand-500">diferencial da NovaDrive</span> é a abordagem de parceria de mobilidade. Em vez de apenas alugar veículos, oferecemos uma solução integrada que elimina a complexidade."
                    </motion.h2>
                    <motion.div variants={fadeUp} className="w-24 h-1 bg-brand-500 mx-auto rounded-full" />
                </motion.div>
            </section>

            {/* ── CTA Final ───────────────────────────────────────── */}
            <section className="pb-32 px-4 sm:px-6 lg:px-8">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                    className="max-w-6xl mx-auto relative overflow-hidden rounded-[3rem] border border-slate-200 dark:border-white/10 shadow-2xl dark:shadow-none transition-colors duration-300">
                    
                    {/* Background CTA */}
                    <div className="absolute inset-0 bg-white dark:bg-gradient-to-br dark:from-[#121215] dark:to-[#1a1214] transition-colors duration-300" />
                    <div className="absolute inset-0 bg-cover bg-center opacity-5 dark:opacity-10 mix-blend-luminosity" style={{ backgroundImage: `url(${getPublicUrl('/hero-fleet.png')})` }} />
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 dark:bg-brand-500/20 rounded-full blur-[100px] pointer-events-none transition-colors duration-300" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-[80px] pointer-events-none transition-colors duration-300" />
                    
                    <div className="relative p-12 sm:p-20 text-center z-10">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight transition-colors duration-300">Eleve a sua <span className="text-brand-500">Mobilidade</span></h2>
                        <p className="text-slate-600 dark:text-charcoal-300 text-xl mb-12 max-w-2xl mx-auto font-light leading-relaxed transition-colors duration-300">
                            Descubra como a NovaDrive pode transformar a operação da sua empresa com frota de excelência e gestão de ponta.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
                            <MagneticButton href="/vehicles">
                                Conhecer a Frota <ArrowRight className="w-5 h-5 ml-1" />
                            </MagneticButton>
                            <a href="mailto:info@novadrive.co.mz"
                                className="inline-flex items-center justify-center px-9 py-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-bold text-lg hover:bg-slate-200 dark:hover:bg-white/10 transition-colors backdrop-blur-sm shadow-sm dark:shadow-none">
                                Contactar Consultor
                            </a>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
