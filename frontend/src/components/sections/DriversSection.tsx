import { motion } from 'framer-motion';
import { UserCheck, Award, BookOpen, ShieldCheck, IdCard, Clock, Siren, Star, CheckCircle2 } from 'lucide-react';
import { getPublicUrl } from '../../utils/assetUrl';

const selection = [
    { icon: IdCard, text: 'Carta de condução profissional válida (categoria D ou superior)' },
    { icon: ShieldCheck, text: 'Registo criminal limpo e verificação de antecedentes completa' },
    { icon: Clock, text: 'Mínimo de 5 anos de experiência em transporte de passageiros' },
    { icon: Siren, text: 'Avaliação de condução defensiva e testes físicos de aptidão' },
];

const training = [
    { icon: Award, text: 'Formação em segurança rodoviária e condução defensiva avançada' },
    { icon: Star, text: 'Treino em primeiros socorros e resposta rápida a emergências' },
    { icon: BookOpen, text: 'Reciclagem anual obrigatória com avaliação certificada' },
    { icon: UserCheck, text: 'Avaliação de desempenho trimestral com feedback documentado' },
];

const stats = [
    { value: '5+', label: 'Anos mínimos de exp.' },
    { value: '100%', label: 'Com formação HSE' },
    { value: '0', label: 'Tolerância a risco' },
];

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const fadeUp: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function DriversSection() {
    return (
        <section className="py-32 bg-white dark:bg-[#050507] transition-colors relative overflow-hidden">

            {/* Background accent */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.04) 0%, transparent 70%)' }} />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/10 to-transparent" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

                    {/* — Left: Content — */}
                    <motion.div
                        initial="hidden" whileInView="visible"
                        viewport={{ once: true, margin: '-80px' }}
                        variants={stagger}
                    >
                        <motion.div
                            variants={fadeUp}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-[0.2em] mb-8"
                        >
                            <UserCheck className="w-3.5 h-3.5" />
                            Nossos Motoristas
                        </motion.div>

                        <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl font-heading font-black text-charcoal-900 dark:text-white mb-5 leading-tight">
                            Excelência na{' '}
                            <span className="text-brand-500">Seleção</span>{' '}
                            e Formação
                        </motion.h2>

                        <motion.p variants={fadeUp} className="text-charcoal-500 dark:text-charcoal-400 text-lg leading-relaxed mb-10 font-light">
                            Cada motorista NovaDrive é mais do que um condutor — é um embaixador da segurança, do profissionalismo e da imagem da sua organização.
                        </motion.p>

                        {/* Stats row */}
                        <motion.div variants={fadeUp} className="flex gap-6 mb-12">
                            {stats.map((s, i) => (
                                <div key={i} className="text-center">
                                    <div className="text-2xl font-black text-charcoal-900 dark:text-white">{s.value}</div>
                                    <div className="text-xs text-charcoal-500 dark:text-charcoal-400 mt-0.5 leading-tight">{s.label}</div>
                                </div>
                            ))}
                        </motion.div>

                        <div className="space-y-8">
                            {/* Selection */}
                            <motion.div variants={fadeUp}>
                                <h3 className="text-sm font-bold text-charcoal-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 rounded-full bg-brand-500 inline-block" />
                                    Seleção e Habilitações
                                </h3>
                                <div className="space-y-2.5">
                                    {selection.map((s, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.08, duration: 0.4 }}
                                            className="flex items-start gap-3 text-sm text-charcoal-600 dark:text-charcoal-400 group"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                            <span>{s.text}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Training */}
                            <motion.div variants={fadeUp}>
                                <h3 className="text-sm font-bold text-charcoal-900 dark:text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                                    <span className="w-1 h-4 rounded-full bg-amber-500 inline-block" />
                                    Formação Contínua
                                </h3>
                                <div className="space-y-2.5">
                                    {training.map((t, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.08 + 0.15, duration: 0.4 }}
                                            className="flex items-start gap-3 text-sm text-charcoal-600 dark:text-charcoal-400 group"
                                        >
                                            <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                                            <span>{t.text}</span>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* — Right: Image — */}
                    <motion.div
                        initial={{ opacity: 0, x: 60, scale: 0.97 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative"
                    >
                        <div className="absolute -inset-4 bg-gradient-to-tr from-brand-500/10 via-transparent to-transparent rounded-3xl blur-2xl" />
                        <div className="relative rounded-3xl overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.15)] border border-charcoal-100/50 dark:border-white/5">
                            <img
                                src={getPublicUrl('/drivers-team.png')}
                                alt="Equipa de motoristas NovaDrive"
                                className="w-full h-[520px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                            {/* Floating cert badge */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center gap-4"
                            >
                                <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center shrink-0 shadow-lg shadow-brand-500/40">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-white font-bold text-sm">Certificação HSE</div>
                                    <div className="text-white/60 text-xs">Todos os motoristas certificados anualmente</div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
