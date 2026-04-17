import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Search, ArrowRight, Shield, Clock, MapPin, Star, Car, ArrowLeftRight, Briefcase, Wrench, HeadphonesIcon, Eye, Target, Gem, Users, Building2, Truck, Globe, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import 'flatpickr/dist/flatpickr.css';


// Auto-sliding carousel logic
const heroVehicles = ['/CarOne.webp', '/CarTwo.webp', '/CarThree.webp', '/CarFour.webp'];

export default function Home() {


    const { data: vehicles } = useQuery({
        queryKey: ['featuredVehicles'],
        queryFn: () => api.get('/vehicles?limit=6').then((r) => r.data),
    });



    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
    };

    const [currentVehicleIdx, setCurrentVehicleIdx] = useState(0);
    const [activeService, setActiveService] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentVehicleIdx((prev) => (prev + 1) % heroVehicles.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    const carouselContent = (
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-[120%] h-[120%] bg-gradient-to-tr from-teal-500/20 dark:from-teal-500/10 to-transparent rounded-full blur-3xl -z-10 animate-pulse-slow transition-colors"></div>
            <div className="absolute right-0 w-64 h-64 bg-cyan-500/30 dark:bg-cyan-500/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen transition-colors"></div>
            <div className="relative w-full aspect-video overflow-visible">
                {heroVehicles.map((img, idx) => {
                    let position = 0;
                    if (idx === currentVehicleIdx) position = 0;
                    else if (idx === (currentVehicleIdx + 1) % heroVehicles.length) position = 1;
                    else if (idx === (currentVehicleIdx - 1 + heroVehicles.length) % heroVehicles.length) position = -1;
                    else position = 2;
                    return (
                        <div
                            key={idx}
                            className={`absolute inset-0 w-full transition-all duration-1000 ease-in-out flex items-center justify-center`}
                            style={{
                                transform: `translateX(${position * 120}%) scale(${position === 0 ? 1.05 : 0.8})`,
                                opacity: position === 0 ? 1 : 0,
                                zIndex: position === 0 ? 10 : 0,
                            }}
                        >
                            <img
                                src={img}
                                alt="Luxury Vehicle"
                                className={`w-[110%] max-w-none object-contain drop-shadow-2xl filter saturate-[1.1] transition-transform duration-[4000ms] ease-linear ${position === 0 ? 'scale-105' : 'scale-100'}`}
                                style={{
                                    filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.4))'
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );

    const features = [
        { icon: Shield, title: 'Gestão Completa', desc: 'Manutenção, seguros e assistência técnica totalmente integrada na sua operação' },
        { icon: Clock, title: 'Reserva Rápida', desc: 'Processo simplificado de reserva em menos de 2 minutos para a sua empresa' },
        { icon: MapPin, title: 'Todo Moçambique', desc: 'Presença operacional em todas as províncias do país' },
        { icon: Star, title: 'Frota Premium', desc: 'Viaturas modernas, operacionais e rigorosamente conservadas' },
    ];

    const services = [
        {
            icon: Car,
            title: 'Aluguer de Viaturas',
            subtitle: 'Flexibilidade total',
            items: ['Aluguer diário e mensal', 'Contratos corporativos de longo prazo', 'Viaturas ligeiras, SUVs e carrinhas', 'Veículos operacionais especializados'],
            color: 'from-teal-500 to-cyan-500',
            shadowColor: 'shadow-teal-500/20',
        },
        {
            icon: Wrench,
            title: 'Gestão de Frotas',
            subtitle: 'Controlo absoluto',
            items: ['Planeamento e controlo de manutenção', 'Gestão de seguros completa', 'Monitorização da utilização', 'Relatórios de desempenho da frota'],
            color: 'from-amber-500 to-orange-500',
            shadowColor: 'shadow-amber-500/20',
        },
        {
            icon: HeadphonesIcon,
            title: 'Assistência & Suporte',
            subtitle: 'Disponibilidade 24/7',
            items: ['Assistência técnica dedicada', 'Manutenção preventiva programada', 'Substituição imediata de viaturas', 'Apoio logístico empresarial'],
            color: 'from-violet-500 to-purple-500',
            shadowColor: 'shadow-violet-500/20',
        },
    ];

    const targetAudience = [
        { icon: Building2, label: 'Empresas Privadas' },
        { icon: Globe, label: 'Organizações Internacionais' },
        { icon: Users, label: "ONG's" },
        { icon: Wrench, label: 'Construção & Mineração' },
        { icon: Truck, label: 'Logística' },
        { icon: Briefcase, label: 'Executivos & Profissionais' },
    ];

    return (
        <div className="transition-colors duration-300">
            {/* Hero */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-[#0c0f1a] dark:via-[#0f1628] dark:to-[#0c0f1a] transition-colors duration-300" />
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl transition-colors" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl transition-colors" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 min-h-[90vh] flex items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

                        {/* Left Side: Content & Search */}
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-teal-700 dark:text-teal-400 text-sm mb-6 animate-fade-in-up transition-colors">
                                <Car className="w-4 h-4" />
                                Moçambique · Mobilidade Empresarial
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight text-slate-900 dark:text-white mb-6 animate-fade-in-up transition-colors" style={{ animationDelay: '0.1s' }}>
                                Mobilidade que
                                <br />
                                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">move negócios</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-xl animate-fade-in-up transition-colors" style={{ animationDelay: '0.2s' }}>
                                Soluções integradas de aluguer de viaturas e gestão profissional de frotas.
                                Nós cuidamos das viaturas, você cuida do negócio.
                            </p>

                            {/* Mobile Carousel (Shown only below lg) */}
                            <div className="lg:hidden relative h-56 sm:h-80 w-full mb-8 -mt-2 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                {carouselContent}
                            </div>

                            {/* Search Box */}
                            <form onSubmit={handleSearch} className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6 animate-fade-in-up transition-colors shadow-xl shadow-slate-200/50 dark:shadow-none" style={{ animationDelay: '0.3s' }}>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">



                                </div>
                                <button
                                    type="submit"
                                    id="search-vehicles-btn"
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 dark:hover:from-teal-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/25"
                                >
                                    <Search className="w-4 h-4" />
                                    Pesquisar Viaturas
                                </button>
                            </form>

                            {/* Quick Links */}
                            <div className="flex items-center gap-6 mt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                <Link
                                    to="/transfers"
                                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                >
                                    <ArrowLeftRight className="w-4 h-4" />
                                    Transfers
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                                <Link
                                    to="/about"
                                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                >
                                    <Building2 className="w-4 h-4" />
                                    Sobre Nós
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Desktop Animated Vehicle Carousel */}
                        <div className="hidden lg:block relative h-full min-h-[500px] w-full mt-8 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                            {carouselContent}
                        </div>

                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-[#0c0f1a] dark:to-[#0e1120] transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white transition-colors">Porquê a NovaDrive?</h2>
                        <p className="text-slate-600 dark:text-slate-400 transition-colors max-w-2xl mx-auto">O seu parceiro estratégico de mobilidade — para que possa concentrar-se no que realmente importa</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/5 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-white/10 transition-all group shadow-sm dark:shadow-none hover:-translate-y-1 hover:shadow-lg duration-300">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:from-teal-500/30 group-hover:to-cyan-500/30 transition-all">
                                    <f.icon className="w-6 h-6 text-teal-600 dark:text-teal-400 transition-colors" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white transition-colors">{f.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Services Section — Premium Interactive Cards */}
            <section className="py-24 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-5">
                            <Briefcase className="w-3.5 h-3.5" />
                            Serviços Principais
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 transition-colors">
                            Soluções completas de <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">mobilidade</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg transition-colors">
                            Mais do que fornecer veículos — somos o seu parceiro estratégico de mobilidade empresarial
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {services.map((service, i) => (
                            <div
                                key={i}
                                className={`relative bg-white dark:bg-[#1a1d2e] border rounded-3xl p-8 transition-all duration-500 cursor-pointer group overflow-hidden ${activeService === i
                                    ? 'border-teal-500/30 dark:border-teal-500/20 shadow-2xl shadow-teal-500/10 scale-[1.02]'
                                    : 'border-slate-200 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1'
                                    }`}
                                onClick={() => setActiveService(i)}
                            >
                                {/* Glow effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 rounded-3xl`} />

                                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 shadow-lg ${service.shadowColor} group-hover:scale-110 transition-transform duration-300`}>
                                    <service.icon className="w-7 h-7 text-white" />
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors">{service.title}</h3>
                                <p className="text-sm text-teal-600 dark:text-teal-400 font-medium mb-5 transition-colors">{service.subtitle}</p>

                                <ul className="space-y-3">
                                    {service.items.map((item, j) => (
                                        <li key={j} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 transition-colors">
                                            <ChevronRight className="w-4 h-4 text-teal-500 dark:text-teal-400 shrink-0 mt-0.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission / Vision / Differentials — Premium Glassmorphism */}
            <section className="relative py-24 overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-[#0a0d18] dark:to-[#0c0f1a] transition-colors duration-300">
                {/* Decorative */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-teal-500/5 to-cyan-500/5 dark:from-teal-500/10 dark:to-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-bold uppercase tracking-[0.2em] mb-5">
                            <Gem className="w-3.5 h-3.5" />
                            Quem Somos
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 transition-colors">
                            A <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">NovaDrive</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-3xl mx-auto text-lg leading-relaxed transition-colors">
                            Empresa moçambicana especializada em soluções de mobilidade empresarial.
                            Mais do que fornecer veículos, posicionamo-nos como parceiro estratégico de mobilidade — assumindo a responsabilidade pela gestão eficiente das viaturas para que os clientes possam concentrar-se no crescimento do seu negócio.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Visão */}
                        <div className="relative bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-3xl p-8 group hover:-translate-y-1 hover:shadow-2xl transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-teal-500/20">
                                    <Eye className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 transition-colors">Visão</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">
                                    Tornar-se uma referência em soluções de mobilidade empresarial em Moçambique, oferecendo serviços confiáveis, eficientes e adaptados às necessidades do mercado.
                                </p>
                            </div>
                        </div>

                        {/* Missão */}
                        <div className="relative bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-3xl p-8 group hover:-translate-y-1 hover:shadow-2xl transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/20">
                                    <Target className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 transition-colors">Missão</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">
                                    Simplificar a mobilidade empresarial através de soluções profissionais de aluguer e gestão de frotas, permitindo que os clientes concentrem os seus recursos no desenvolvimento dos seus negócios.
                                </p>
                            </div>
                        </div>

                        {/* Diferencial */}
                        <div className="relative bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-xl rounded-3xl p-8 group hover:-translate-y-1 hover:shadow-2xl transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
                                    <Gem className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3 transition-colors">Diferencial</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed transition-colors">
                                    A abordagem de parceria de mobilidade. Em vez de apenas alugar veículos, oferecemos uma solução integrada que elimina a complexidade da gestão de viaturas, mantendo mobilidade eficiente para as suas operações.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Target Audience — Horizontal Scroll */}
            <section className="py-20 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Ao serviço de quem faz acontecer</h2>
                        <p className="text-slate-600 dark:text-slate-400 transition-colors">Sectores e organizações que confiam na NovaDrive</p>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                        {targetAudience.map((ta, i) => (
                            <div key={i} className="flex flex-col items-center gap-3 py-6 px-4 rounded-2xl bg-white/60 dark:bg-white/5 border border-slate-200 dark:border-white/5 hover:border-teal-500/30 dark:hover:border-teal-500/20 hover:bg-teal-50/50 dark:hover:bg-teal-500/5 transition-all group cursor-default">
                                <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-teal-500/10 dark:group-hover:bg-teal-500/10 transition-colors">
                                    <ta.icon className="w-5 h-5 text-slate-500 dark:text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
                                </div>
                                <span className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 text-center transition-colors">{ta.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Vehicles */}
            <section className="py-20 flex-1 bg-gradient-to-b from-white to-slate-50 dark:from-[#0c0f1a] dark:to-[#0e1120] transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white transition-colors">Frota em Destaque</h2>
                            <p className="text-slate-600 dark:text-slate-400 transition-colors">Viaturas premium para a sua empresa</p>
                        </div>
                        <Link
                            to="/vehicles"
                            className="flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-sm font-medium transition-colors w-fit"
                        >
                            Ver toda a frota <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles?.data?.map((v: { id: number; brand: string; model: string; category: string; year: number; transmission: string; seats: number; pricePerDay: number | string; images: Array<{ url: string }> }) => (
                            <Link
                                key={v.id}
                                to={`/vehicles/${v.id}`}
                                className="bg-white dark:bg-[#1a1d2e] border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden group hover:border-teal-500/50 dark:hover:border-teal-500/20 transition-all shadow-md hover:shadow-xl dark:shadow-none"
                            >
                                <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden transition-colors">
                                    {v.images?.[0]?.url ? (
                                        <img src={v.images[0].url} alt={`${v.brand} ${v.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Car className="w-16 h-16 text-slate-300 dark:text-slate-700 transition-colors" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-medium backdrop-blur-sm border border-teal-200 dark:border-none transition-colors">
                                        {v.category}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-semibold text-lg text-slate-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                                        {v.brand} {v.model}
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 transition-colors">
                                        {v.year} · {v.transmission} · {v.seats} lugares
                                    </p>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-white/5 transition-colors">
                                        <div>
                                            <span className="text-2xl font-bold text-teal-600 dark:text-teal-400 transition-colors">{Number(v.pricePerDay).toLocaleString()}</span>
                                            <span className="text-sm text-slate-500 dark:text-slate-400 transition-colors"> MT/dia</span>
                                        </div>
                                        <span className="text-xs text-teal-600 dark:text-teal-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                            Ver detalhes <ArrowRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Extravagant VIP Transfer CTA */}
            <section className="relative py-24 sm:py-32 overflow-hidden transition-colors duration-500 bg-slate-50 dark:bg-[#0a0d18]">
                {/* Image Overlay */}
                <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
                    <img src="/van.png" alt="Transfer Service" className="w-[1000px] xl:w-[1200px] object-contain opacity-20 dark:opacity-30 mix-blend-luminosity filter saturate-50 drop-shadow-2xl scale-110 md:scale-100" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-slate-50 dark:from-[#0a0d18] dark:via-transparent dark:to-[#0a0d18] transition-colors duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-slate-50 dark:from-[#0a0d18] dark:via-transparent dark:to-[#0a0d18] transition-colors duration-500"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-500/5 dark:from-teal-500/10 via-transparent to-transparent transition-colors duration-500"></div>
                    <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen transition-colors duration-500"></div>
                    <div className="absolute bottom-1/4 -left-[200px] w-[600px] h-[600px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen transition-colors duration-500"></div>
                </div>

                <div className="max-w-4xl mx-auto px-4 text-center relative z-10 block">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md border border-white/50 dark:border-white/20 text-teal-800 dark:text-teal-300 font-bold text-sm mb-6 animate-fade-in-up transition-colors duration-500 shadow-sm">
                        <ArrowLeftRight className="w-4 h-4" />
                        Serviço VIP
                    </div>
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-6 text-slate-900 dark:text-white drop-shadow-sm transition-colors duration-500">
                        Precisa de um <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">transfer</span>?
                    </h2>
                    <p className="text-lg text-slate-700 dark:text-slate-300 font-medium mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-sm transition-colors duration-500">
                        Oferecemos serviços de transfer com motorista profissional em todo Moçambique.
                        Do aeroporto ao hotel, praia ou qualquer outro destino com luxo e exclusividade.
                    </p>
                    <Link
                        to="/transfers"
                        className="inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 w-full sm:w-auto rounded-2xl bg-white/40 dark:bg-white/10 backdrop-blur-md text-teal-800 dark:text-white font-bold text-lg hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-500 hover:text-white dark:hover:from-teal-500 dark:hover:to-cyan-500 transition-all group border border-white/50 dark:border-white/20 hover:border-transparent shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_0_rgba(20,184,166,0.2)]"
                    >
                        Ver Transfers Disponíveis
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

            {/* Corporate CTA — Full-width premium banner */}
            <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-50 dark:from-[#060911] dark:via-[#0a1225] dark:to-[#060911] transition-colors duration-300">
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px]" />
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px]" />
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)]" style={{ backgroundSize: '40px 40px' }} />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-white/5 border border-amber-200 dark:border-white/10 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-[0.2em] mb-8 transition-colors">
                        <Building2 className="w-3.5 h-3.5" />
                        Soluções Corporativas
                    </div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight transition-colors">
                        A sua empresa precisa de uma frota?
                        <br />
                        <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">Nós tratamos de tudo.</span>
                    </h2>

                    <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed transition-colors">
                        Contratos de longo prazo com gestão integral — manutenção, seguros, motoristas e monitorização.
                        Liberte a sua equipa da complexidade de gerir viaturas.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            to="/vehicles"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg hover:from-teal-600 hover:to-cyan-600 dark:hover:from-teal-400 dark:hover:to-cyan-400 transition-all shadow-xl shadow-teal-500/20 group w-full sm:w-auto"
                        >
                            Explorar a Frota
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            to="/about"
                            className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white font-bold text-lg hover:bg-slate-50 dark:hover:bg-white/10 transition-all w-full sm:w-auto shadow-sm dark:shadow-none"
                        >
                            Sobre a NovaDrive
                        </Link>
                    </div>

                    <p className="mt-8 text-sm text-slate-500 italic transition-colors">
                        "As empresas devem focar-se no seu negócio, não na gestão de viaturas."
                    </p>
                </div>
            </section>
        </div>
    );
}
