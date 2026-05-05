import { Building2, Eye, Target, CheckCircle2, ShieldCheck, ArrowRight, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const fadeUp: any = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } }
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

export default function About() {
    return (
        <div className="bg-gray-50 dark:bg-zinc-950 transition-colors duration-300 min-h-screen">

            {/* ── Hero Header ─────────────────────────────────────── */}
            <div className="relative pt-32 pb-28 overflow-hidden bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-white/6 transition-colors">
                {/* Ambient glows */}
                <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.06) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none"
                    style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.04) 0%, transparent 60%)' }} />
                <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                    style={{ backgroundImage: 'radial-gradient(rgba(0,0,0,0.8) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-brand-500/8 border border-brand-500/20 text-brand-500 dark:text-brand-400 text-xs font-bold uppercase tracking-[0.2em] mb-8">
                        <Building2 className="w-3.5 h-3.5" />
                        Perfil Institucional
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, delay: 0.1 }}
                        className="text-5xl sm:text-7xl font-black text-gray-900 dark:text-white mb-6 tracking-tight leading-tight"
                    >
                        Sobre a{' '}
                        <span className="text-brand-500" style={{ textShadow: '0 0 50px rgba(200,16,46,0.3)' }}>
                            NovaDrive
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-xl text-gray-600 dark:text-zinc-300 max-w-2xl mx-auto leading-relaxed font-light"
                    >
                        Empresa moçambicana especializada em soluções de mobilidade empresarial.
                        Mais do que fornecer veículos — somos o seu parceiro estratégico de mobilidade.
                    </motion.p>
                </div>
            </div>

            {/* ── Conceito ──────────────────────────────────────────── */}
            <section className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }}
                    variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* Image */}
                    <motion.div variants={fadeUp} className="relative">
                        <div className="absolute -inset-4 bg-gradient-to-br from-brand-500/10 to-transparent rounded-3xl blur-2xl" />
                        <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-gray-200 dark:border-white/6">
                            <img src="/CarTwo.webp" alt="Frota NovaDrive" className="w-full aspect-video object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20">
                                <Quote className="w-4 h-4 text-brand-400 mb-1.5" />
                                <span className="text-white text-sm font-medium">Mobilidade que move negócios</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Text */}
                    <motion.div variants={stagger}>
                        <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 leading-tight">
                            O Nosso <span className="text-brand-500">Conceito</span>
                        </motion.h2>
                        <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-zinc-400 mb-5 leading-relaxed">
                            A NovaDrive foi criada com uma ideia simples: as empresas devem focar-se no seu negócio, não na gestão de viaturas.
                        </motion.p>
                        <motion.p variants={fadeUp} className="text-lg text-gray-600 dark:text-zinc-400 mb-10 leading-relaxed">
                            Gestão de manutenção, seguros, controlo de utilização, substituição de veículos e logística exigem tempo e recursos. A NovaDrive assume essa responsabilidade inteiramente.
                        </motion.p>
                        <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {['Assumimos a responsabilidade', 'Garantimos disponibilidade', 'Reduzimos custos operacionais', 'Foco no seu crescimento'].map((item, i) => (
                                <motion.div key={i} variants={fadeUp}
                                    className="flex items-center gap-3 p-3.5 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 shadow-sm">
                                    <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                                    <span className="text-sm font-medium text-gray-800 dark:text-zinc-200">{item}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── Missão & Visão ─────────────────────────────────────── */}
            <section className="py-28 bg-white dark:bg-zinc-900/50 border-y border-gray-200 dark:border-white/5 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
                        variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {[
                            {
                                icon: Target,
                                title: 'A Nossa Missão',
                                text: 'Simplificar a mobilidade empresarial através de soluções profissionais de aluguer e gestão de frotas, permitindo que os clientes concentrem os seus recursos no desenvolvimento dos seus negócios.',
                                color: 'from-brand-500 to-rose-600',
                                glow: 'rgba(200,16,46,0.15)',
                            },
                            {
                                icon: Eye,
                                title: 'A Nossa Visão',
                                text: 'Tornar-se a referência absoluta em soluções de mobilidade empresarial em Moçambique, com excelência operacional, confiabilidade e padrões internacionais.',
                                color: 'from-amber-500 to-orange-600',
                                glow: 'rgba(245,158,11,0.15)',
                            },
                        ].map((card, i) => (
                            <motion.div key={i} variants={fadeUp}
                                whileHover={{ y: -6 }}
                                className="group relative bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-white/8 rounded-3xl p-10 overflow-hidden transition-all duration-400 hover:border-brand-500/20 hover:shadow-2xl hover:shadow-brand-500/8">
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ background: `radial-gradient(circle at 30% 30%, ${card.glow}, transparent 70%)` }} />
                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-8 shadow-xl transition-transform group-hover:scale-110`}>
                                    <card.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-4 relative z-10">{card.title}</h3>
                                <p className="text-gray-600 dark:text-zinc-400 leading-relaxed text-lg font-light relative z-10">{card.text}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Diferencial ─────────────────────────────────────── */}
            <section className="py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
                    <motion.div variants={fadeUp}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-brand-500/10 border border-brand-500/20 mb-8">
                        <ShieldCheck className="w-10 h-10 text-brand-500" />
                    </motion.div>
                    <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-10">
                        O Diferencial <span className="text-brand-500">NovaDrive</span>
                    </motion.h2>
                    <motion.div variants={fadeUp}
                        className="max-w-3xl mx-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/8 rounded-3xl p-10 shadow-xl shadow-gray-100 dark:shadow-none relative overflow-hidden">
                        <div className="absolute inset-0 pointer-events-none"
                            style={{ background: 'radial-gradient(ellipse at top, rgba(200,16,46,0.04) 0%, transparent 60%)' }} />
                        <Quote className="w-8 h-8 text-brand-500/40 mx-auto mb-6" />
                        <p className="text-xl sm:text-2xl text-gray-700 dark:text-zinc-200 font-medium leading-relaxed italic">
                            "O grande diferencial da NovaDrive é a abordagem de parceria de mobilidade. Em vez de apenas alugar veículos, oferecemos uma solução integrada que permite aos clientes eliminar a complexidade da gestão de viaturas."
                        </p>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── CTA Final ───────────────────────────────────────── */}
            <section className="pb-28 px-4 sm:px-6 lg:px-8">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                    className="max-w-4xl mx-auto relative overflow-hidden rounded-3xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-500 to-rose-700" />
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at top right, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
                    <div className="relative p-12 sm:p-16 text-center">
                        <h2 className="text-3xl sm:text-4xl font-black text-white mb-5">Pronto para otimizar a sua mobilidade?</h2>
                        <p className="text-rose-100 text-lg mb-10 max-w-xl mx-auto font-light">
                            Consulte a nossa frota ou fale connosco para uma solução desenhada à medida da sua organização.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/vehicles"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-brand-600 font-bold rounded-2xl hover:bg-gray-50 transition-colors shadow-xl">
                                Explorar Viaturas <ArrowRight className="w-4 h-4" />
                            </Link>
                            <a href="mailto:info@novadrive.co.mz"
                                className="inline-flex items-center justify-center px-8 py-4 bg-white/15 border border-white/30 text-white font-bold rounded-2xl hover:bg-white/25 transition-colors backdrop-blur-sm">
                                Falar com Consultor
                            </a>
                        </div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
