import { motion } from 'framer-motion';
import { FileText, UserCog, Wrench, FileCheck, ShieldAlert, CalendarCheck, CheckCircle2, ArrowRight } from 'lucide-react';

const features = [
    { icon: FileText, title: 'Relatório Mensal de Operação', desc: 'Pontualidade, quilometragem, viagens e ocorrências por rota e viatura em dashboard exclusivo' },
    { icon: UserCog, title: 'Gestor de Conta Dedicado', desc: 'Ponto de contacto único para todas as questões operacionais, disponível 24/7' },
    { icon: Wrench, title: 'Gestão de Manutenção', desc: 'Manutenção preventiva e corretiva sem custo adicional, com zero interrupções' },
    { icon: FileCheck, title: 'Gestão Documental e Legal', desc: 'Licenças, seguros e vistorias renovados dentro dos prazos legais sem preocupação' },
    { icon: ShieldAlert, title: 'Gestão de Sinistros', desc: 'Processo completo com seguradoras sem perturbar a operação do cliente' },
    { icon: CalendarCheck, title: 'Revisão Trimestral de Desempenho', desc: 'Análise aprofundada de dados, revisão de rotas e ajuste de capacidade contratual' },
];

const resilience = [
    'Viaturas com menos de 5 anos, inspeção técnica semestral',
    'Manutenção preventiva segundo calendário do fabricante',
    'Seguros de passageiros e terceiros incluídos em contrato',
    'Ar condicionado, cintos e kit de primeiros socorros em todos os veículos',
    'Viatura de substituição garantida em máximo 2 horas',
];

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const cardAnim: any = {
    hidden: { opacity: 0, y: 30, scale: 0.97 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function ManagementSection() {
    return (
        <section id="contacto" className="py-32 bg-[#f8f8f9] dark:bg-[#060608] transition-colors relative overflow-hidden">

            {/* Decorative top line */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/20 to-transparent" />

            {/* Ambient */}
            <div className="absolute top-1/2 right-0 w-96 h-96 -translate-y-1/2 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.04) 0%, transparent 70%)' }} />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                        <FileText className="w-3.5 h-3.5" />
                        Gestão &amp; Transparência
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-heading font-black text-charcoal-900 dark:text-white mb-4">
                        Gestão{' '}
                        <span className="text-brand-500">Completa</span>{' '}
                        da Operação
                    </h2>
                    <p className="text-charcoal-500 dark:text-charcoal-400 max-w-xl mx-auto text-lg font-light">
                        O cliente recebe informação clara, em tempo útil, para decisões baseadas em dados reais da operação
                    </p>
                </motion.div>

                {/* Feature Cards */}
                <motion.div
                    initial="hidden" whileInView="visible"
                    viewport={{ once: true, margin: '-60px' }}
                    variants={stagger}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
                >
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            variants={cardAnim}
                            whileHover={{ y: -6, scale: 1.01 }}
                            className="group bg-white dark:bg-charcoal-900 border border-charcoal-100 dark:border-white/6 rounded-3xl p-7 hover:border-brand-500/25 hover:shadow-xl hover:shadow-brand-500/8 transition-all duration-400 cursor-default"
                        >
                            <div className="w-11 h-11 rounded-2xl bg-brand-500/10 flex items-center justify-center mb-5 group-hover:bg-brand-500/20 group-hover:scale-110 transition-all duration-300">
                                <f.icon className="w-5 h-5 text-brand-500" />
                            </div>
                            <h3 className="text-base font-bold text-charcoal-900 dark:text-white mb-2 leading-snug">{f.title}</h3>
                            <p className="text-sm text-charcoal-500 dark:text-charcoal-400 leading-relaxed">{f.desc}</p>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Resilience Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="relative overflow-hidden rounded-3xl border border-brand-500/20"
                    style={{ background: 'linear-gradient(135deg, rgba(200,16,46,0.07) 0%, rgba(200,16,46,0.02) 100%)' }}
                >
                    {/* Glow */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(ellipse at top left, rgba(200,16,46,0.1) 0%, transparent 60%)' }} />

                    <div className="relative p-10 sm:p-12">
                        <div className="flex flex-col lg:flex-row lg:items-center gap-10">
                            <div className="lg:w-1/3">
                                <h3 className="text-2xl font-black text-charcoal-900 dark:text-white mb-3">
                                    Continuidade e Resiliência do Serviço
                                </h3>
                                <p className="text-charcoal-500 dark:text-charcoal-400 text-sm leading-relaxed">
                                    Garantias contratuais que asseguram zero interrupção na operação dos nossos clientes.
                                </p>
                            </div>
                            <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {resilience.map((r, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.07, duration: 0.4 }}
                                        className="flex items-start gap-3 text-sm text-charcoal-600 dark:text-charcoal-300"
                                    >
                                        <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
                                        <span>{r}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Final CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-center mt-20"
                >
                    <p className="text-charcoal-500 dark:text-charcoal-400 text-sm mb-5 uppercase tracking-widest font-semibold">
                        Pronto para dar o próximo passo?
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-heading font-black text-charcoal-900 dark:text-white mb-8">
                        Solicite a sua proposta{' '}
                        <span className="text-brand-500">sem compromisso</span>
                    </h2>
                    <div className="flex flex-wrap justify-center gap-4">
                        <motion.a
                            href="mailto:info@novadrive.co.mz"
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-brand-500 text-white font-bold text-lg glow-red hover:bg-brand-600 transition-colors"
                        >
                            Falar com um Consultor <ArrowRight className="w-5 h-5" />
                        </motion.a>
                        <motion.a
                            href="/vehicles"
                            whileHover={{ scale: 1.04 }}
                            className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-white dark:bg-white/5 border border-charcoal-200 dark:border-white/10 text-charcoal-700 dark:text-white font-semibold text-lg hover:border-brand-500/30 transition-all"
                        >
                            Explorar Frota
                        </motion.a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
