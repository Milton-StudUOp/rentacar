import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeftRight, Users, ArrowRight, Search, Car, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
import 'flatpickr/dist/flatpickr.css';

interface TransferService {
    id: number;
    name: string;
    description: string | null;
    vehicleType: string;
    capacity: number;
    imageUrl: string | null;
}

export default function Transfers() {
    const navigate = useNavigate();
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [travelDate, setTravelDate] = useState('');
    const [travelTime, setTravelTime] = useState('');
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [returnDate, setReturnDate] = useState('');
    const [returnTime, setReturnTime] = useState('');
    const [passengers, setPassengers] = useState<number | ''>(1);
    const [hasSearched, setHasSearched] = useState(false);

    const { data: services } = useQuery({
        queryKey: ['transferServices'],
        queryFn: () => api.get('/transfers/services').then(r => r.data),
    });

    const { data: searchResults, refetch, isFetching } = useQuery({
        queryKey: ['transferSearch', passengers || 1],
        queryFn: () => api.get('/transfers/search', { params: { passengers: passengers || 1 } }).then(r => r.data),
        enabled: false,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!origin || !destination || !travelDate || !travelTime || !passengers) {
            toast.error('Por favor, preencha todos os campos obrigatórios da viagem de ida.');
            return;
        }
        if (isRoundTrip && (!returnDate || !returnTime)) {
            toast.error('Por favor, preencha a data e hora de regresso para opções de Ida e Volta.');
            return;
        }
        setHasSearched(true);
        refetch();
    };

    const handleBook = (serviceId: number) => {
        const payload: Record<string, string> = {
            origin,
            destination,
            date: travelDate,
            time: travelTime,
            passengers: (passengers || 1).toString(),
            isRoundTrip: isRoundTrip.toString(),
        };
        if (isRoundTrip) {
            payload.returnDate = returnDate;
            payload.returnTime = returnTime;
        }
        const queryParams = new URLSearchParams(payload).toString();
        navigate(`/checkout/transfer/${serviceId}?${queryParams}`);
    };

    return (
        <div className="min-h-screen py-8 transition-colors duration-300 relative overflow-hidden bg-slate-50 dark:bg-[#0a0d18]">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center overflow-hidden">
                <img src="/van.png" alt="Transfers Background" className="w-[800px] lg:w-[1000px] opacity-[0.15] dark:opacity-20 object-contain drop-shadow-2xl mix-blend-luminosity filter saturate-50" />
                {/* Gradients to fade the edges seamlessly */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-slate-50 dark:from-[#0a0d18] dark:via-transparent dark:to-[#0a0d18] transition-colors duration-300"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-slate-50 via-transparent to-slate-50 dark:from-[#0a0d18] dark:via-transparent dark:to-[#0a0d18] transition-colors duration-300"></div>
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-500/5 dark:from-teal-500/5 via-transparent to-transparent transition-colors duration-300"></div>

                {/* Glows */}
                <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-teal-500/5 dark:bg-teal-500/10 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"></div>
                <div className="absolute bottom-1/4 -left-[200px] w-[600px] h-[600px] bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen"></div>

                {/* Premium Texture Overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')] [mask-image:linear-gradient(to_bottom,white,transparent)] opacity-40 dark:opacity-10"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 text-sm mb-4 transition-colors border border-teal-200 dark:border-teal-500/20">
                        <ArrowLeftRight className="w-4 h-4" />
                        Serviço de Transfer
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-3 transition-colors">Transfers Dinâmicos em Moçambique</h1>
                    <p className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto transition-colors">
                        Personalize a sua viagem. Escolha a origem, o destino e o número de passageiros. Nós cuidamos do resto.
                    </p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="bg-white/20 dark:bg-[#0a0d18]/30 border border-white/40 dark:border-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 max-w-5xl mx-auto mb-12 relative z-20 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] transition-colors">
                    <div className="flex justify-center mb-8">
                        <div className="bg-white/40 dark:bg-slate-900/50 p-1.5 rounded-2xl inline-flex relative border border-white/50 dark:border-white/5 transition-colors backdrop-blur-md">
                            <button
                                type="button"
                                onClick={() => setIsRoundTrip(false)}
                                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all relative z-10 ${!isRoundTrip ? 'text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                            >
                                Só Ida
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsRoundTrip(true)}
                                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all relative z-10 flex items-center gap-2 ${isRoundTrip ? 'text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
                            >
                                <ArrowLeftRight className="w-4 h-4" /> Ida e Volta
                            </button>
                            {/* Sliding Active Background */}
                            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl transition-all duration-300 ease-out shadow-lg shadow-teal-500/25 ${isRoundTrip ? 'left-[50%] ml-[3px]' : 'left-1.5'}`}></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-11 gap-6 mb-8 group">
                        <div className="md:col-span-5">
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2 transition-colors"><MapPin className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" /> Origem</label>
                            <input
                                type="text"
                                required
                                placeholder="ex: Aeroporto de Maputo"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                className="w-full bg-white/30 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white/50 dark:focus:bg-black/40 transition-all hover:bg-white/50 dark:hover:bg-black/30 backdrop-blur-md shadow-inner"
                            />
                        </div>
                        <div className="hidden md:flex items-center justify-center mt-6 md:col-span-1">
                            <ArrowRight className="w-6 h-6 text-slate-400 dark:text-slate-600 transition-colors" />
                        </div>
                        <div className="md:col-span-5">
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2 transition-colors"><MapPin className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" /> Destino</label>
                            <input
                                type="text"
                                required
                                placeholder="ex: Resort Ponta do Ouro"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full bg-white/30 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white/50 dark:focus:bg-black/40 transition-all hover:bg-white/50 dark:hover:bg-black/30 backdrop-blur-md shadow-inner"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2 transition-colors"><Users className="w-4 h-4 text-slate-600 dark:text-slate-300" /> Pessoas</label>
                            <input
                                type="number"
                                required
                                min="1"
                                placeholder="Passageiros"
                                value={passengers}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value);
                                    setPassengers(isNaN(val) ? '' : val);
                                }}
                                className="w-full bg-white/30 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-slate-500 focus:bg-white/50 dark:focus:bg-black/40 transition-all hover:bg-white/50 dark:hover:bg-black/30 backdrop-blur-md shadow-inner"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2 transition-colors"><Calendar className="w-4 h-4 text-teal-500 dark:text-teal-400" /> Ida</label>
                            <div className="flex gap-2">
                                <Flatpickr
                                    value={travelDate ? [new Date(travelDate)] : []}
                                    onChange={([date]) => {
                                        setTravelDate(date ? date.toISOString().split('T')[0] : '');
                                        if (isRoundTrip && !returnDate && date) {
                                            const rDate = new Date(date);
                                            rDate.setDate(rDate.getDate() + 1);
                                            setReturnDate(rDate.toISOString().split('T')[0]);
                                        }
                                    }}
                                    options={{
                                        locale: Portuguese,
                                        dateFormat: 'Y-m-d',
                                        minDate: 'today',
                                    }}
                                    className="w-[60%] bg-white/30 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white/50 dark:focus:bg-black/40 transition-all hover:bg-white/50 dark:hover:bg-black/30 backdrop-blur-md shadow-inner"
                                    placeholder="Data"
                                />
                                <Flatpickr
                                    value={travelTime}
                                    onChange={([date]) => setTravelTime(date ? date.toTimeString().slice(0, 5) : '')}
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: 'H:i',
                                        time_24hr: true,
                                    }}
                                    className="w-[40%] bg-white/30 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:bg-white/50 dark:focus:bg-black/40 transition-all hover:bg-white/50 dark:hover:bg-black/30 backdrop-blur-md shadow-inner"
                                    placeholder="Hora"
                                />
                            </div>
                        </div>

                        {/* Return Date Fields */}
                        <div className={`transition-all duration-300 ease-in-out origin-left ${isRoundTrip ? 'opacity-100 scale-100' : 'opacity-50 scale-95 pointer-events-none'}`}>
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-2 transition-colors"><Calendar className="w-4 h-4 text-cyan-500 dark:text-cyan-400" /> Regresso</label>
                            <div className="flex gap-2">
                                <Flatpickr
                                    value={returnDate ? [new Date(returnDate)] : []}
                                    onChange={([date]) => setReturnDate(date ? date.toISOString().split('T')[0] : '')}
                                    options={{
                                        locale: Portuguese,
                                        dateFormat: 'Y-m-d',
                                        minDate: travelDate || 'today',
                                    }}
                                    className="w-[60%] bg-white/30 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white/50 dark:focus:bg-black/40 transition-all hover:bg-white/50 dark:hover:bg-black/30 backdrop-blur-md shadow-inner"
                                    placeholder="Data"
                                    disabled={!isRoundTrip}
                                    required={isRoundTrip}
                                />
                                <Flatpickr
                                    value={returnTime}
                                    onChange={([date]) => setReturnTime(date ? date.toTimeString().slice(0, 5) : '')}
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: 'H:i',
                                        time_24hr: true,
                                    }}
                                    className="w-[40%] bg-white/30 dark:bg-black/20 border border-white/50 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:bg-white/50 dark:focus:bg-black/40 transition-all hover:bg-white/50 dark:hover:bg-black/30 backdrop-blur-md shadow-inner"
                                    placeholder="Hora"
                                    disabled={!isRoundTrip}
                                    required={isRoundTrip}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isFetching}
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 dark:hover:from-teal-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/20"
                    >
                        <Search className="w-4 h-4" />
                        {isFetching ? 'A procurar viaturas adequadas...' : 'Pesquisar Viaturas Adequadas'}
                    </button>
                </form>

                {/* Search Results */}
                {hasSearched && searchResults && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 transition-colors drop-shadow-sm">
                            <span>Viaturas adequadas para a sua viagem</span>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/40 dark:bg-white/10 backdrop-blur-md text-teal-800 dark:text-teal-300 border border-white/50 dark:border-white/20 shadow-sm transition-colors">{searchResults.length} encontradas</span>
                        </h2>

                        {searchResults.length === 0 ? (
                            <div className="bg-white/20 dark:bg-[#0a0d18]/30 border border-white/40 dark:border-white/20 backdrop-blur-xl rounded-2xl p-8 text-center border-dashed dark:border-dashed border-2 transition-colors shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]">
                                <Car className="w-12 h-12 text-slate-500 dark:text-slate-400 mx-auto mb-4 opacity-70 transition-colors" />
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 transition-colors drop-shadow-sm">Sem viaturas adequadas</h3>
                                <p className="text-slate-700 dark:text-slate-300 transition-colors font-medium drop-shadow-sm">Não foi possível encontrar viaturas com a capacidade necessária ({passengers || 1} lugares). Tente reduzir o número de passageiros ou contacte-nos directamente.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {searchResults.map((s: TransferService) => (
                                    <div key={s.id} className="bg-white/20 dark:bg-[#0a0d18]/40 border border-white/40 dark:border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden group hover:border-white/60 dark:hover:border-white/30 transition-all relative flex flex-col shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
                                        {s.imageUrl && (
                                            <div className="h-48 relative overflow-hidden bg-white/30 dark:bg-black/20 transition-colors">
                                                <img src={api.defaults.baseURL?.replace('/api', '') + s.imageUrl} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent dark:from-[#0f172a] dark:to-transparent" />
                                            </div>
                                        )}
                                        <div className="flex-1 p-6 relative z-10 flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors drop-shadow-sm">{s.name}</h3>
                                                    <div className="text-sm font-bold text-teal-800 dark:text-teal-300 transition-colors drop-shadow-sm">{s.vehicleType}</div>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-white/40 dark:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/50 dark:border-white/20 transition-colors shadow-sm">
                                                    <Users className="w-4 h-4 text-slate-700 dark:text-slate-200 transition-colors" />
                                                    <span className="text-sm font-bold text-slate-900 dark:text-white transition-colors">Até {s.capacity}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-700 dark:text-slate-200 font-medium mb-6 flex-1 transition-colors drop-shadow-sm">{s.description}</p>

                                            <button
                                                onClick={() => handleBook(s.id)}
                                                className="w-full px-6 py-3 rounded-xl bg-white/40 dark:bg-white/10 backdrop-blur-md text-teal-800 dark:text-white font-bold flex items-center justify-center gap-2 hover:bg-gradient-to-r hover:from-teal-500 hover:to-cyan-500 hover:text-white dark:hover:from-teal-500 dark:hover:to-cyan-500 transition-all group/btn border border-white/50 dark:border-white/20 hover:border-transparent shadow-sm"
                                            >
                                                Solicitar Cotação para '{origin}' <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Services Overview (before search) */}
                {!hasSearched && services && (
                    <div className="mb-12">
                        <h2 className="text-xl font-bold mb-6 text-center text-slate-900 dark:text-white transition-colors drop-shadow-sm">Nossa Frota de Transfers</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {services.map((s: TransferService) => (
                                <div key={s.id} className="bg-white/20 dark:bg-[#0a0d18]/40 border border-white/40 dark:border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden group hover:border-white/60 dark:hover:border-white/30 transition-all relative flex flex-col shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)] hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.15)]">
                                    <div className="h-48 relative overflow-hidden bg-white/30 dark:bg-black/20 transition-colors flex items-center justify-center">
                                        {s.imageUrl ? (
                                            <>
                                                <img src={api.defaults.baseURL?.replace('/api', '') + s.imageUrl} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent dark:from-[#0f172a] dark:to-transparent" />
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 opacity-60">
                                                <Car className="w-12 h-12 mb-2" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Sem Imagem</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 p-6 relative z-10 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1 transition-colors drop-shadow-sm">{s.name}</h3>
                                                <div className="text-sm font-bold text-teal-800 dark:text-teal-300 transition-colors drop-shadow-sm">{s.vehicleType}</div>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-white/40 dark:bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/50 dark:border-white/20 transition-colors shadow-sm">
                                                <Users className="w-4 h-4 text-slate-700 dark:text-slate-200 transition-colors" />
                                                <span className="text-sm font-bold text-slate-900 dark:text-white transition-colors">Até {s.capacity}</span>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-700 dark:text-slate-200 font-medium line-clamp-2 transition-colors drop-shadow-sm">{s.description || 'Veículo de transfer moderno e confortável preparado para viagens.'}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
