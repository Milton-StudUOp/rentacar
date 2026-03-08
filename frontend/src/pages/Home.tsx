import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Search, ArrowRight, Shield, Clock, MapPin, Star, Car, ArrowLeftRight } from 'lucide-react';
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

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentVehicleIdx((prev) => (prev + 1) % heroVehicles.length);
        }, 4000); // Slide every 4 seconds
        return () => clearInterval(timer);
    }, []);

    const carouselContent = (
        <div className="absolute inset-0 flex items-center justify-center">
            {/* Decorative elements */}
            <div className="absolute w-[120%] h-[120%] bg-gradient-to-tr from-teal-500/20 dark:from-teal-500/10 to-transparent rounded-full blur-3xl -z-10 animate-pulse-slow transition-colors"></div>
            <div className="absolute right-0 w-64 h-64 bg-cyan-500/30 dark:bg-cyan-500/20 rounded-full blur-3xl -z-10 mix-blend-multiply dark:mix-blend-screen transition-colors"></div>

            {/* Carousel Container */}
            <div className="relative w-full aspect-video overflow-visible">
                {heroVehicles.map((img, idx) => {
                    let position = 0; // Center
                    if (idx === currentVehicleIdx) position = 0;
                    else if (idx === (currentVehicleIdx + 1) % heroVehicles.length) position = 1; // Right/Next
                    else if (idx === (currentVehicleIdx - 1 + heroVehicles.length) % heroVehicles.length) position = -1; // Left/Prev
                    else position = 2; // Hidden

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
        { icon: Shield, title: 'Segurança Total', desc: 'Viaturas com seguro completo e assistência 24h' },
        { icon: Clock, title: 'Reserva Rápida', desc: 'Processo simples de reserva em menos de 2 minutos' },
        { icon: MapPin, title: 'Todo Moçambique', desc: 'Presença em todas as províncias do país' },
        { icon: Star, title: 'Qualidade Premium', desc: 'Frota moderna e bem conservada' },
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
                                Moçambique · Aluguer & Transfers
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight text-slate-900 dark:text-white mb-6 animate-fade-in-up transition-colors" style={{ animationDelay: '0.1s' }}>
                                Explore Moçambique
                                <br />
                                <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">com liberdade</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-xl animate-fade-in-up transition-colors" style={{ animationDelay: '0.2s' }}>
                                Alugue viaturas premium ou reserve transfers com motorista.
                                De Maputo a Pemba, estamos em todo o país.
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
                            <div className="flex items-center gap-4 mt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                <Link
                                    to="/transfers"
                                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
                                >
                                    <ArrowLeftRight className="w-4 h-4" />
                                    Procurar Transfers
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
                        <h2 className="text-3xl font-bold mb-3 text-slate-900 dark:text-white transition-colors">Porquê escolher-nos?</h2>
                        <p className="text-slate-600 dark:text-slate-400 transition-colors">Serviço de excelência para a sua viagem</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="bg-white/80 dark:bg-white/5 border border-slate-200 dark:border-white/5 backdrop-blur-md rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-white/10 transition-all group shadow-sm dark:shadow-none">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:from-teal-500/30 group-hover:to-cyan-500/30 transition-all">
                                    <f.icon className="w-6 h-6 text-teal-600 dark:text-teal-400 transition-colors" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2 text-slate-900 dark:text-white transition-colors">{f.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 transition-colors">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Vehicles */}
            <section className="py-20 flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white transition-colors">Viaturas em Destaque</h2>
                            <p className="text-slate-600 dark:text-slate-400 transition-colors">As melhores opções para si</p>
                        </div>
                        <Link
                            to="/vehicles"
                            className="flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 text-sm font-medium transition-colors w-fit"
                        >
                            Ver todas <ArrowRight className="w-4 h-4" />
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

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 transition-colors duration-300">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900 dark:text-white transition-colors">
                        Precisa de um <span className="bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent">transfer</span>?
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-xl mx-auto transition-colors">
                        Oferecemos serviços de transfer com motorista profissional em todo Moçambique.
                        Do aeroporto ao hotel, praia ou qualquer destino.
                    </p>
                    <Link
                        to="/transfers"
                        className="inline-flex items-center justify-center gap-2 px-8 py-4 w-full sm:w-auto rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 dark:hover:from-teal-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/25"
                    >
                        <ArrowLeftRight className="w-5 h-5" />
                        Ver Transfers Disponíveis
                    </Link>
                </div>
            </section>
        </div>
    );
}
