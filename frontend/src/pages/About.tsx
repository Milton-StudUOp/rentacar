import { Briefcase, Building2, Eye, Target, MapPin, CheckCircle2, ShieldCheck, Gem } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div className="bg-slate-50 dark:bg-[#0a0d18] transition-colors duration-300 min-h-screen">

            {/* Extended Hero Header */}
            <div className="relative pt-32 pb-24 overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-[#060911] dark:via-[#0a1225] dark:to-[#060911] transition-colors duration-300">
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)]" style={{ backgroundSize: '40px 40px' }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-white/5 border border-teal-200 dark:border-white/10 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-[0.2em] mb-8 animate-fade-in-up transition-colors">
                        <Building2 className="w-4 h-4" />
                        Perfil Institucional
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight animate-fade-in-up transition-colors" style={{ animationDelay: '0.1s' }}>
                        Sobre a <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">NovaDrive</span>
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up transition-colors" style={{ animationDelay: '0.2s' }}>
                        Empresa moçambicana especializada em soluções de mobilidade empresarial.
                        Mais do que fornecer veículos, a NovaDrive posiciona-se como parceiro estratégico de mobilidade.
                    </p>
                </div>
            </div>

            {/* O Nosso Conceito */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-500" />
                        <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-200/50 dark:border-white/10 shadow-2xl">
                            <img
                                src="/CarTwo.webp"
                                alt="Frota NovaDrive"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 inline-block">
                                    <span className="text-white font-bold tracking-widest text-sm uppercase">Mobilidade que move negócios</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">O Nosso Conceito</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
                            A NovaDrive foi criada com uma ideia simples: as empresas devem focar-se no seu negócio, não na gestão de viaturas.
                        </p>
                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            Gestão de manutenção, seguros, controlo de utilização, substituição de veículos, assistência e logística exigem tempo e recursos. A NovaDrive assume essa responsabilidade, garantindo que os clientes tenham sempre viaturas disponíveis, operacionais e bem geridas.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "Assumimos a responsabilidade",
                                "Garantimos disponibilidade",
                                "Reduzimos custos operacionais",
                                "Foco no seu crescimento"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-teal-50 dark:bg-teal-500/10 flex items-center justify-center shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                    </div>
                                    <span className="text-slate-700 dark:text-slate-300 font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Missão e Visão - Cards Premium */}
            <section className="py-24 bg-white dark:bg-[#0c0f1a] border-y border-slate-200/50 dark:border-white/5 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Missão */}
                        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-10 hover:shadow-2xl hover:shadow-teal-500/5 transition-all duration-300 group">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-8 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
                                <Target className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">A Nossa Missão</h3>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                Simplificar a mobilidade empresarial através de soluções profissionais de aluguer e gestão de frotas, permitindo que os clientes concentrem os seus recursos no desenvolvimento dos seus negócios.
                            </p>
                        </div>

                        {/* Visão */}
                        <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-3xl p-10 hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-300 group">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-8 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
                                <Eye className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4">A Nossa Visão</h3>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                Tornar-se uma referência em soluções de mobilidade empresarial em Moçambique, oferecendo serviços confiáveis, eficientes e adaptados às necessidades do mercado.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Diferencial Estratégico */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-teal-50 dark:bg-teal-500/10 border border-teal-100 dark:border-teal-500/20 text-teal-600 dark:text-teal-400 mb-8 shadow-sm">
                    <ShieldCheck className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-6">O Diferencial NovaDrive</h2>
                <div className="max-w-4xl mx-auto bg-gradient-to-r from-slate-100 to-slate-50 dark:from-white/5 dark:to-transparent border border-slate-200 dark:border-white/10 rounded-3xl p-10 backdrop-blur-xl">
                    <p className="text-xl sm:text-2xl text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                        "O grande diferencial da NovaDrive é a abordagem de parceria de mobilidade. Em vez de apenas alugar veículos, oferecemos uma solução integrada que permite aos clientes eliminar a complexidade da gestão de viaturas, mantendo sempre a mobilidade eficiente para as suas operações."
                    </p>
                </div>
            </section>

            {/* CTA Final */}
            <section className="pb-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-3xl p-12 text-center shadow-2xl shadow-teal-500/30 border border-teal-400/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <h2 className="relative z-10 text-3xl font-black text-white mb-6">Pronto para otimizar a sua mobilidade?</h2>
                        <p className="relative z-10 text-teal-100 text-lg mb-8 max-w-2xl mx-auto">
                            Consulte a nossa frota ou fale connosco para uma solução desenhada à medida da sua organização.
                        </p>
                        <div className="relative z-10 flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/vehicles" className="px-8 py-4 bg-white text-teal-700 font-bold rounded-2xl hover:bg-slate-50 transition-colors shadow-lg">
                                Explorar Viaturas
                            </Link>
                            <a href="mailto:info@novadrive.co.mz" className="px-8 py-4 bg-teal-700/50 border border-teal-400 text-white font-bold rounded-2xl hover:bg-teal-700/80 transition-colors backdrop-blur-sm">
                                Falar com Consultor
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
