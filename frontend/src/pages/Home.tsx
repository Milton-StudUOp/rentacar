import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Search, ArrowRight, Shield, Clock, MapPin, Star, Car, ArrowLeftRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

// Auto-sliding carousel logic
const heroVehicles = ['/CarOne.webp', '/CarTwo.webp', '/CarThree.webp', '/CarFour.webp'];

export default function Home() {
    const navigate = useNavigate();
    const [searchRegion, setSearchRegion] = useState('');
    const [searchStart, setSearchStart] = useState('');
    const [searchEnd, setSearchEnd] = useState('');

    const { data: vehicles } = useQuery({
        queryKey: ['featuredVehicles'],
        queryFn: () => api.get('/vehicles?limit=6').then((r) => r.data),
    });

    const { data: regions } = useQuery({
        queryKey: ['regions'],
        queryFn: () => api.get('/regions').then((r) => r.data),
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchRegion) params.set('regionId', searchRegion);
        if (searchStart) params.set('startDate', searchStart);
        if (searchEnd) params.set('endDate', searchEnd);
        navigate(`/vehicles?${params.toString()}`);
    };

    const [currentVehicleIdx, setCurrentVehicleIdx] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentVehicleIdx((prev) => (prev + 1) % heroVehicles.length);
        }, 4000); // Slide every 4 seconds
        return () => clearInterval(timer);
    }, []);

    const features = [
        { icon: Shield, title: 'Segurança Total', desc: 'Viaturas com seguro completo e assistência 24h' },
        { icon: Clock, title: 'Reserva Rápida', desc: 'Processo simples de reserva em menos de 2 minutos' },
        { icon: MapPin, title: 'Todo Moçambique', desc: 'Presença em todas as províncias do país' },
        { icon: Star, title: 'Qualidade Premium', desc: 'Frota moderna e bem conservada' },
    ];

    return (
        <div>
            {/* Hero */}
            <section className="relative min-h-[90vh] flex items-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#0c0f1a] via-[#0f1628] to-[#0c0f1a]" />
                <div className="absolute top-1/4 -left-32 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20 min-h-[90vh] flex items-center">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">

                        {/* Left Side: Content & Search */}
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm mb-6 animate-fade-in-up">
                                <Car className="w-4 h-4" />
                                Moçambique · Aluguer & Transfers
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black leading-tight mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                Explore Moçambique
                                <br />
                                <span className="gradient-text">com liberdade</span>
                            </h1>
                            <p className="text-lg sm:text-xl text-slate-400 mb-8 max-w-xl animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                Alugue viaturas premium ou reserve transfers com motorista.
                                De Maputo a Pemba, estamos em todo o país.
                            </p>

                            {/* Search Box */}
                            <form onSubmit={handleSearch} className="glass rounded-2xl p-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Região</label>
                                        <select
                                            value={searchRegion}
                                            onChange={(e) => setSearchRegion(e.target.value)}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                            id="search-region"
                                        >
                                            <option value="">Todas as regiões</option>
                                            {regions?.map((r: { id: number; city: string; province: string }) => (
                                                <option key={r.id} value={r.id}>
                                                    {r.city}, {r.province}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Data início</label>
                                        <DatePicker
                                            selected={searchStart ? new Date(searchStart) : null}
                                            onChange={(date: Date | null) => setSearchStart(date ? format(date, 'yyyy-MM-dd') : '')}
                                            selectsStart
                                            startDate={searchStart ? new Date(searchStart) : undefined}
                                            endDate={searchEnd ? new Date(searchEnd) : undefined}
                                            locale={ptBR}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="dd/mm/aaaa"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                            id="search-start-date"
                                            isClearable
                                            portalId="root"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Data fim</label>
                                        <DatePicker
                                            selected={searchEnd ? new Date(searchEnd) : null}
                                            onChange={(date: Date | null) => setSearchEnd(date ? format(date, 'yyyy-MM-dd') : '')}
                                            selectsEnd
                                            startDate={searchStart ? new Date(searchStart) : undefined}
                                            endDate={searchEnd ? new Date(searchEnd) : undefined}
                                            minDate={searchStart ? new Date(searchStart) : undefined}
                                            locale={ptBR}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="dd/mm/aaaa"
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                            id="search-end-date"
                                            isClearable
                                            portalId="root"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    id="search-vehicles-btn"
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/25"
                                >
                                    <Search className="w-4 h-4" />
                                    Pesquisar Viaturas
                                </button>
                            </form>

                            {/* Quick Links */}
                            <div className="flex items-center gap-4 mt-6 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                                <Link
                                    to="/transfers"
                                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-teal-400 transition-colors"
                                >
                                    <ArrowLeftRight className="w-4 h-4" />
                                    Procurar Transfers
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>
                        </div>

                        {/* Right Side: Animated Vehicle Carousel */}
                        <div className="hidden lg:block relative h-full min-h-[500px] w-full mt-10 lg:mt-0 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
                            <div className="absolute inset-0 flex items-center justify-center">
                                {/* Decorative elements */}
                                <div className="absolute w-[120%] h-[120%] bg-gradient-to-tr from-teal-500/10 to-transparent rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
                                <div className="absolute right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl -z-10 mix-blend-screen"></div>

                                {/* Carousel Container */}
                                <div className="relative w-full aspect-video overflow-visible">
                                    {heroVehicles.map((img, idx) => {
                                        // Calculate relative position based on current index
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
                        </div>

                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-gradient-to-b from-[#0c0f1a] to-[#0e1120]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-3">Porquê escolher-nos?</h2>
                        <p className="text-slate-400">Serviço de excelência para a sua viagem</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((f, i) => (
                            <div key={i} className="glass rounded-2xl p-6 hover:bg-white/5 transition-all group">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center mb-4 group-hover:from-teal-500/30 group-hover:to-cyan-500/30 transition-all">
                                    <f.icon className="w-6 h-6 text-teal-400" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                                <p className="text-sm text-slate-400">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Vehicles */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Viaturas em Destaque</h2>
                            <p className="text-slate-400">As melhores opções para si</p>
                        </div>
                        <Link
                            to="/vehicles"
                            className="flex items-center gap-1 text-teal-400 hover:text-teal-300 text-sm font-medium"
                        >
                            Ver todas <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles?.data?.map((v: { id: number; brand: string; model: string; category: string; year: number; transmission: string; seats: number; pricePerDay: number | string; images: Array<{ url: string }> }) => (
                            <Link
                                key={v.id}
                                to={`/vehicles/${v.id}`}
                                className="glass rounded-2xl overflow-hidden group hover:border-teal-500/20 transition-all"
                            >
                                <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative overflow-hidden">
                                    {v.images?.[0]?.url ? (
                                        <img src={v.images[0].url} alt={`${v.brand} ${v.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <Car className="w-16 h-16 text-slate-700" />
                                        </div>
                                    )}
                                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-teal-500/20 text-teal-400 text-xs font-medium backdrop-blur-sm">
                                        {v.category}
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-semibold text-lg group-hover:text-teal-400 transition-colors">
                                        {v.brand} {v.model}
                                    </h3>
                                    <p className="text-sm text-slate-400 mt-1">
                                        {v.year} · {v.transmission} · {v.seats} lugares
                                    </p>
                                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                        <div>
                                            <span className="text-2xl font-bold text-teal-400">{Number(v.pricePerDay).toLocaleString()}</span>
                                            <span className="text-sm text-slate-400"> MT/dia</span>
                                        </div>
                                        <span className="text-xs text-teal-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
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
            <section className="py-20 bg-gradient-to-r from-teal-900/20 to-cyan-900/20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Precisa de um <span className="gradient-text">transfer</span>?
                    </h2>
                    <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                        Oferecemos serviços de transfer com motorista profissional em todo Moçambique.
                        Do aeroporto ao hotel, praia ou qualquer destino.
                    </p>
                    <Link
                        to="/transfers"
                        className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/25"
                    >
                        <ArrowLeftRight className="w-5 h-5" />
                        Ver Transfers Disponíveis
                    </Link>
                </div>
            </section>
        </div>
    );
}
