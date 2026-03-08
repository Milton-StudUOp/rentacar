import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { ArrowLeftRight, Users, ArrowRight, Search, Car, Calendar, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Flatpickr from 'react-flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
import 'flatpickr/dist/themes/dark.css';

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
    const [passengers, setPassengers] = useState(1);
    const [hasSearched, setHasSearched] = useState(false);

    const { data: services } = useQuery({
        queryKey: ['transferServices'],
        queryFn: () => api.get('/transfers/services').then(r => r.data),
    });

    const { data: searchResults, refetch, isFetching } = useQuery({
        queryKey: ['transferSearch', passengers],
        queryFn: () => api.get('/transfers/search', { params: { passengers } }).then(r => r.data),
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
            passengers: passengers.toString(),
            isRoundTrip: isRoundTrip.toString(),
        };
        if (isRoundTrip) {
            payload.returnDate = returnDate;
            payload.returnTime = returnTime;
        }
        const queryParams = new URLSearchParams(payload).toString();
        // Uses the dynamic checkout path
        navigate(`/checkout/transfer/${serviceId}?${queryParams}`);
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/10 text-teal-400 text-sm mb-4">
                        <ArrowLeftRight className="w-4 h-4" />
                        Serviço de Transfer
                    </div>
                    <h1 className="text-4xl font-bold mb-3">Transfers Dinâmicos em Moçambique</h1>
                    <p className="text-slate-400 max-w-xl mx-auto">
                        Personalize a sua viagem. Escolha a origem, o destino e o número de passageiros. Nós cuidamos do resto.
                    </p>
                </div>

                {/* Search */}
                <form onSubmit={handleSearch} className="glass rounded-2xl p-6 md:p-8 max-w-5xl mx-auto mb-12 relative z-20 shadow-2xl">
                    <div className="flex justify-center mb-8">
                        <div className="bg-slate-900/50 p-1.5 rounded-2xl inline-flex relative border border-white/5">
                            <button
                                type="button"
                                onClick={() => setIsRoundTrip(false)}
                                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all relative z-10 ${!isRoundTrip ? 'text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                Só Ida
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsRoundTrip(true)}
                                className={`px-8 py-2.5 rounded-xl text-sm font-bold transition-all relative z-10 flex items-center gap-2 ${isRoundTrip ? 'text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
                            >
                                <ArrowLeftRight className="w-4 h-4" /> Ida e Volta
                            </button>
                            {/* Sliding Active Background */}
                            <div className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl transition-all duration-300 ease-out shadow-lg shadow-teal-500/25 ${isRoundTrip ? 'left-[50%] ml-[3px]' : 'left-1.5'}`}></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-11 gap-6 mb-8 group">
                        <div className="md:col-span-5">
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-teal-400" /> Origem</label>
                            <input
                                type="text"
                                required
                                placeholder="ex: Aeroporto de Maputo"
                                value={origin}
                                onChange={(e) => setOrigin(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all hover:bg-slate-900"
                            />
                        </div>
                        <div className="hidden md:flex items-center justify-center mt-6 md:col-span-1">
                            <ArrowRight className="w-6 h-6 text-slate-600" />
                        </div>
                        <div className="md:col-span-5">
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-cyan-400" /> Destino</label>
                            <input
                                type="text"
                                required
                                placeholder="ex: Resort Ponta do Ouro"
                                value={destination}
                                onChange={(e) => setDestination(e.target.value)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all hover:bg-slate-900"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center gap-2"><Users className="w-4 h-4 text-slate-300" /> Pessoas</label>
                            <input
                                type="number"
                                required
                                min="1"
                                placeholder="Passageiros"
                                value={passengers}
                                onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-slate-500 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4 text-teal-400" /> Ida</label>
                            <div className="flex gap-2">
                                <Flatpickr
                                    value={travelDate ? [new Date(travelDate)] : []}
                                    onChange={([date]) => {
                                        setTravelDate(date ? date.toISOString().split('T')[0] : '');
                                        // Optional convenience logic: Auto-seed return date if missing
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
                                    className="w-[60%] bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-all"
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
                                    className="w-[40%] bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-teal-500 transition-all"
                                    placeholder="Hora"
                                />
                            </div>
                        </div>

                        {/* Return Date Fields */}
                        <div className={`transition-all duration-300 ease-in-out origin-left ${isRoundTrip ? 'opacity-100 scale-100' : 'opacity-50 scale-95 pointer-events-none'}`}>
                            <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2 flex items-center gap-2"><Calendar className="w-4 h-4 text-cyan-400" /> Regresso</label>
                            <div className="flex gap-2">
                                <Flatpickr
                                    value={returnDate ? [new Date(returnDate)] : []}
                                    onChange={([date]) => setReturnDate(date ? date.toISOString().split('T')[0] : '')}
                                    options={{
                                        locale: Portuguese,
                                        dateFormat: 'Y-m-d',
                                        minDate: travelDate || 'today',
                                    }}
                                    className="w-[60%] bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
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
                                    className="w-[40%] bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all"
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
                        className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/20"
                    >
                        <Search className="w-4 h-4" />
                        {isFetching ? 'A procurar viaturas adequadas...' : 'Pesquisar Viaturas Adequadas'}
                    </button>
                </form>

                {/* Search Results */}
                {hasSearched && searchResults && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span>Viaturas adequadas para a sua viagem</span>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-400">{searchResults.length} encontradas</span>
                        </h2>

                        {searchResults.length === 0 ? (
                            <div className="glass rounded-2xl p-8 text-center border-dashed border-2 border-white/10">
                                <Car className="w-12 h-12 text-slate-500 mx-auto mb-4 opacity-50" />
                                <h3 className="text-lg font-medium text-white mb-2">Sem viaturas adequadas</h3>
                                <p className="text-slate-400">Não foi possível encontrar viaturas com a capacidade necessária ({passengers} lugares). Tente reduzir o número de passageiros ou contacte-nos directamente.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {searchResults.map((s: TransferService) => (
                                    <div key={s.id} className="glass rounded-2xl overflow-hidden group hover:border-teal-500/30 transition-all relative flex flex-col">
                                        {s.imageUrl && (
                                            <div className="h-48 relative overflow-hidden">
                                                <img src={api.defaults.baseURL?.replace('/api', '') + s.imageUrl} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] to-transparent" />
                                            </div>
                                        )}
                                        <div className="flex-1 p-6 relative z-10 flex flex-col">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-1">{s.name}</h3>
                                                    <div className="text-sm font-medium text-teal-400">{s.vehicleType}</div>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                                                    <Users className="w-4 h-4 text-slate-300" />
                                                    <span className="text-sm font-semibold text-white">Até {s.capacity}</span>
                                                </div>
                                            </div>
                                            <p className="text-sm text-slate-300 mb-6 flex-1">{s.description}</p>

                                            <button
                                                onClick={() => handleBook(s.id)}
                                                className="w-full px-6 py-3 rounded-xl bg-white/10 text-white font-semibold flex items-center justify-center gap-2 hover:bg-teal-500 hover:text-white transition-all group/btn border border-white/5 hover:border-teal-500"
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
                    <div className="mb-12 opacity-80">
                        <h2 className="text-xl font-bold mb-6 text-center text-slate-400">Nossa Frota de Transfers</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {services.map((s: TransferService) => (
                                <div key={s.id} className="glass rounded-xl p-4 flex items-center gap-4 w-full sm:w-[calc(50%-1rem)] md:w-[calc(25%-1rem)] min-w-[280px]">
                                    <div className="w-12 h-12 rounded-lg bg-white/5 flex shrink-0 items-center justify-center border border-white/10 overflow-hidden">
                                        {s.imageUrl ? <img src={api.defaults.baseURL?.replace('/api', '') + s.imageUrl} className="w-full h-full object-cover" /> : <Car className="w-5 h-5 text-slate-400" />}
                                    </div>
                                    <div>
                                        <h3 className="text-sm font-bold text-white mb-0.5">{s.name}</h3>
                                        <p className="text-xs text-slate-400 flex items-center gap-1"><Users className="w-3 h-3" /> Até {s.capacity} passageiros</p>
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
