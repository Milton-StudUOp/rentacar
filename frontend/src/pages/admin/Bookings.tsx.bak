import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import toast from 'react-hot-toast';
import { useState, useRef, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import {
    Car, ArrowLeftRight, Calendar, Clock, CheckCircle, XCircle, Loader2,
    Eye, Phone, Mail, Users, Search,
    Star, Quote, FileText, ChevronDown, Filter, ArrowDownUp
} from 'lucide-react';
import { format } from 'date-fns';
import { formatPrice } from '../../lib/utils';

interface AdminBooking {
    id: number;
    status: string;
    type: 'VEHICLE' | 'TRANSFER';
    totalPrice: number;
    notes: string | null;
    rating: number | null;
    ratingComment: string | null;
    createdAt: string;
    user: {
        id: number;
        name: string;
        phone: string;
        email: string | null;
    };
    vehicleBooking?: {
        startDate: string;
        endDate: string;
        vehicle: {
            brand: string;
            model: string;
            year: number;
            category: string;
            images: Array<{ url: string }>;
        };
    };
    transferBooking?: {
        origin: string;
        destination: string;
        travelDate: string;
        travelTime: string;
        passengers: number;
        isRoundTrip: boolean;
        returnDate: string | null;
        returnTime: string | null;
        service: {
            name: string;
        };
    };
    payment?: {
        receiptUrl: string | null;
    };
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: 'Pendente', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
    CONFIRMED: { label: 'Aguard. Pagamento', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
    PAID: { label: 'Pago (por confirmar)', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/20' },
    AWAITING_DELIVERY: { label: 'Aguard. Entrega', color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
    DELIVERED: { label: 'Aguard. Devolução', color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
    CANCELLED: { label: 'Cancelada', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
    COMPLETED: { label: 'Concluída', color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
};

export default function AdminBookings() {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    // Parse statuses from URL (comma-separated list)
    const initialStatuses = searchParams.get('statuses') ? searchParams.get('statuses')!.split(',') : [];

    const [selectedStatuses, setSelectedStatuses] = useState<string[]>(initialStatuses);
    const filterType = searchParams.get('type') || '';
    const filterStartDate = searchParams.get('startDate') || '';
    const filterEndDate = searchParams.get('endDate') || '';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = Number(searchParams.get('page') || '1');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
    const [viewingReceipt, setViewingReceipt] = useState<string | null>(null);
    const [transferPriceInput, setTransferPriceInput] = useState<string>('');

    const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
    const statusMenuRef = useRef<HTMLDivElement>(null);

    // Sync state changes back to the URL
    const updateUrlParams = (updates: Record<string, string | null>) => {
        const newParams = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value) newParams.set(key, value);
            else newParams.delete(key);
        });
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    // Handle Status Multi-Select Toggle
    const toggleStatus = (statusKey: string) => {
        const updated = selectedStatuses.includes(statusKey)
            ? selectedStatuses.filter(s => s !== statusKey)
            : [...selectedStatuses, statusKey];

        setSelectedStatuses(updated);
        updateUrlParams({ statuses: updated.length > 0 ? updated.join(',') : null });
    };

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
                setIsStatusMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ['adminBookings', filterStartDate, filterEndDate, selectedStatuses.join(','), filterType, sortBy, page],
        queryFn: () => api.get('/bookings/admin', {
            params: {
                statuses: selectedStatuses.length > 0 ? selectedStatuses.join(',') : undefined,
                type: filterType || undefined,
                startDate: filterStartDate || undefined,
                endDate: filterEndDate || undefined,
                sortBy: sortBy || undefined,
                page,
                limit: 20
            },
        }).then(r => r.data),
    });

    const updateStatus = useMutation({
        mutationFn: ({ id, status }: { id: number; status: string }) => api.put(`/bookings/${id}/status`, { status }),
        onSuccess: () => {
            toast.success('Status actualizado com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
            queryClient.invalidateQueries({ queryKey: ['adminKpis'] });
            setSelectedBooking(null);
        },
        onError: (err: { response?: { data?: { message?: string } } }) => toast.error(err.response?.data?.message || 'Erro ao actualizar'),
    });

    const updatePrice = useMutation({
        mutationFn: ({ id, price }: { id: number; price: number }) => api.put(`/bookings/${id}/price`, { price }),
        onSuccess: () => {
            toast.success('Preço definido com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['adminBookings'] });
            setSelectedBooking(null);
        },
        onError: (err: { response?: { data?: { message?: string } } }) => toast.error(err.response?.data?.message || 'Erro ao definir preço'),
    });

    const filteredData = data?.data?.filter((b: AdminBooking) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return b.user?.name?.toLowerCase().includes(term) ||
            b.user?.phone?.includes(term) ||
            b.user?.email?.toLowerCase().includes(term) ||
            String(b.id).includes(term);
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
                <div className="animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                        Gestão de <span className="gradient-text">Reservas</span>
                    </h1>
                    <p className="text-slate-400 text-lg">{data?.meta?.total || 0} reservas registadas no sistema</p>
                </div>
            </div>

            {/* Advanced Filters Bar */}
            <div className="bg-slate-900/40 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/5 shadow-2xl flex flex-col md:flex-row gap-4 items-center z-20 relative animate-fade-in-up" style={{ animationDelay: '100ms' }}>

                {/* Left Side: Date Range */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto z-50">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10 pointer-events-none" />
                        <DatePicker
                            selected={filterStartDate ? new Date(filterStartDate) : null}
                            onChange={(date: Date | null) => updateUrlParams({ startDate: date ? format(date, 'yyyy-MM-dd') : null })}
                            selectsStart
                            startDate={filterStartDate ? new Date(filterStartDate) : undefined}
                            endDate={filterEndDate ? new Date(filterEndDate) : undefined}
                            locale={ptBR}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Data de Início"
                            className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-inner hover:bg-black/30 w-full sm:w-auto"
                            isClearable
                            portalId="root"
                        />
                    </div>
                    <span className="text-slate-500 text-sm hidden sm:block">até</span>
                    <div className="relative w-full sm:w-auto z-40">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 z-10 pointer-events-none" />
                        <DatePicker
                            selected={filterEndDate ? new Date(filterEndDate) : null}
                            onChange={(date: Date | null) => updateUrlParams({ endDate: date ? format(date, 'yyyy-MM-dd') : null })}
                            selectsEnd
                            startDate={filterStartDate ? new Date(filterStartDate) : undefined}
                            endDate={filterEndDate ? new Date(filterEndDate) : undefined}
                            minDate={filterStartDate ? new Date(filterStartDate) : undefined}
                            locale={ptBR}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="Data Fim"
                            className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-inner hover:bg-black/30 w-full sm:w-auto"
                            isClearable
                            portalId="root"
                        />
                    </div>
                </div>

                <div className="h-px w-full md:w-px md:h-10 bg-white/10 hidden md:block"></div>

                {/* Middle: Status & Type Dropdowns */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">

                    {/* Multi-Select Status Dropdown */}
                    <div className="relative flex-1 md:flex-none" ref={statusMenuRef}>
                        <button
                            onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                            className={`w-full md:w-auto flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border ${selectedStatuses.length > 0
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/50 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                : 'bg-black/20 text-slate-300 border-white/10 hover:bg-black/40'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                <span>{selectedStatuses.length === 0 ? 'Estados (Todos)' : `${selectedStatuses.length} Estados Sel.`}</span>
                            </div>
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isStatusMenuOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isStatusMenuOpen && (
                            <div className="absolute top-full left-0 mt-2 w-56 glass rounded-2xl border border-white/10 shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2">
                                {[
                                    { key: 'PENDING', label: '⏳ Pendentes' },
                                    { key: 'CONFIRMED', label: '💳 Aguard. Pgto' },
                                    { key: 'PAID', label: '✅ Pagas' },
                                    { key: 'AWAITING_DELIVERY', label: '📦 Aguard. Entrega' },
                                    { key: 'DELIVERED', label: '🚗 Aguard. Devol.' },
                                    { key: 'COMPLETED', label: '✓ Concluídas' },
                                    { key: 'CANCELLED', label: '✗ Canceladas' },
                                ].map(status => (
                                    <label key={status.key} className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 cursor-pointer transition-colors" onClick={(e) => { e.preventDefault(); toggleStatus(status.key); }}>
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedStatuses.includes(status.key) ? 'bg-cyan-500 border-cyan-500 text-slate-900' : 'border-slate-600 bg-slate-900/50'
                                            }`}>
                                            {selectedStatuses.includes(status.key) && <CheckCircle className="w-3.5 h-3.5" />}
                                        </div>
                                        <span className="text-sm font-medium text-slate-300">{status.label}</span>
                                    </label>
                                ))}
                                {selectedStatuses.length > 0 && (
                                    <div className="px-4 py-2 border-t border-white/5 mt-1">
                                        <button
                                            onClick={() => updateUrlParams({ statuses: null })}
                                            className="w-full py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                                        >
                                            Limpar selecção
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <select
                        value={filterType}
                        onChange={e => updateUrlParams({ type: e.target.value })}
                        className="bg-black/20 border border-white/10 rounded-xl px-4 py-2.5 text-sm md:text-md text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all flex-1 md:flex-none cursor-pointer appearance-none"
                        id="filter-type"
                        style={{ paddingRight: '2rem', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                    >
                        <option value="" className="bg-slate-900 text-slate-300">Todos Veículos</option>
                        <option value="VEHICLE" className="bg-slate-900 text-slate-300">Viaturas</option>
                        <option value="TRANSFER" className="bg-slate-900 text-slate-300">Transfers</option>
                    </select>
                </div>

                <div className="h-px w-full md:w-px md:h-10 bg-white/10 hidden md:block"></div>

                {/* Right Side: Search and Sort */}
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:flex-1 justify-end">
                    <div className="relative w-full sm:w-auto">
                        <ArrowDownUp className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <select
                            value={sortBy}
                            onChange={(e) => updateUrlParams({ sortBy: e.target.value })}
                            className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all cursor-pointer appearance-none w-full"
                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 0.25rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.25em 1.25em' }}
                        >
                            <option value="newest" className="bg-slate-900 text-slate-300">Mais Recentes</option>
                            <option value="oldest" className="bg-slate-900 text-slate-300">Mais Antigas</option>
                            <option value="highest_value" className="bg-slate-900 text-slate-300">Maior Valor</option>
                            <option value="lowest_value" className="bg-slate-900 text-slate-300">Menor Valor</option>
                        </select>
                    </div>

                    <div className="relative w-full sm:w-1/2 md:max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Pesquisar por nome ou ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-black/20 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all shadow-inner hover:bg-black/30"
                            id="search-bookings"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl overflow-hidden mt-6 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                {isLoading ? (
                    <div className="p-8 space-y-4">
                        {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton h-20 rounded-xl" />)}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-slate-500 border-b border-white/5 text-xs uppercase tracking-wider bg-slate-900/50">
                                    <th className="text-left py-4 px-6 font-semibold">Reserva</th>
                                    <th className="text-left py-4 px-4 font-semibold">Cliente</th>
                                    <th className="text-left py-4 px-4 font-semibold">Tipo</th>
                                    <th className="text-left py-4 px-4 font-semibold">Detalhe</th>
                                    <th className="text-left py-4 px-4 font-semibold">Período</th>
                                    <th className="text-right py-4 px-4 font-semibold">Valor</th>
                                    <th className="text-center py-4 px-4 font-semibold">Status</th>
                                    <th className="text-center py-4 px-6 font-semibold">Acções</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData?.map((b: AdminBooking) => {
                                    const st = statusConfig[b.status] || statusConfig.PENDING;
                                    const isVehicle = b.type === 'VEHICLE';
                                    return (
                                        <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-all group relative">
                                            <td className="py-4 px-6 relative">
                                                {/* Row left glow indicator */}
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <span className="text-xs text-slate-400 font-mono bg-white/5 px-2 py-1 rounded-md border border-white/5 group-hover:border-cyan-500/30 group-hover:text-cyan-400 transition-colors">#{b.id}</span>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-cyan-500/20 flex items-center justify-center text-sm font-bold text-cyan-400 shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                                        {b.user?.name?.charAt(0)?.toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="font-semibold text-sm truncate max-w-[140px] group-hover:text-cyan-400 transition-colors">{b.user?.name}</p>
                                                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{b.user?.phone}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${isVehicle ? 'bg-teal-500/10 text-teal-400 border-teal-500/20' : 'bg-violet-500/10 text-violet-400 border-violet-500/20'
                                                    }`}>
                                                    {isVehicle ? (
                                                        b.vehicleBooking?.vehicle?.images?.[0]?.url ? (
                                                            <img src={b.vehicleBooking.vehicle.images[0].url} alt="" className="w-4 h-4 rounded-full object-cover ring-1 ring-white/20 shadow-sm" />
                                                        ) : <Car className="w-3.5 h-3.5" />
                                                    ) : <ArrowLeftRight className="w-3.5 h-3.5" />}
                                                    {isVehicle ? 'Viatura' : 'Transfer'}
                                                </span>
                                            </td>
                                            <td className="py-4 px-4 text-slate-300 text-sm max-w-[160px] truncate font-medium">
                                                {isVehicle
                                                    ? `${b.vehicleBooking?.vehicle?.brand} ${b.vehicleBooking?.vehicle?.model}`
                                                    : `${b.transferBooking?.origin} → ${b.transferBooking?.destination}`
                                                }
                                            </td>
                                            <td className="py-4 px-4 text-xs">
                                                <div className="flex flex-col gap-1">
                                                    {isVehicle && b.vehicleBooking ? (
                                                        <>
                                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                                <Calendar className="w-3.5 h-3.5 text-teal-500" />
                                                                {new Date(b.vehicleBooking.startDate).toLocaleDateString('pt-MZ')}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                                <Clock className="w-3.5 h-3.5 text-cyan-500" />
                                                                {new Date(b.vehicleBooking.endDate).toLocaleDateString('pt-MZ')}
                                                            </div>
                                                        </>
                                                    ) : b.transferBooking ? (
                                                        <>
                                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                                <Calendar className="w-3.5 h-3.5 text-violet-500" />
                                                                {new Date(b.transferBooking.travelDate).toLocaleDateString('pt-MZ')}
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                                <Clock className="w-3.5 h-3.5 text-violet-400" />
                                                                {b.transferBooking.travelTime || '--:--'}
                                                            </div>
                                                        </>
                                                    ) : null}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <span className="font-bold text-teal-400 text-sm drop-shadow-sm">{formatPrice(b.totalPrice)}</span>
                                                <span className="text-[10px] text-slate-500 ml-1 font-medium">MT</span>
                                            </td>
                                            <td className="py-4 px-4 text-center">
                                                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border shadow-sm ${st.bg} ${st.color}`}>
                                                    {st.label}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center justify-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                                                    {/* View Detail */}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedBooking(b);
                                                            if (b.type === 'TRANSFER' && b.status === 'PENDING') {
                                                                setTransferPriceInput(b.totalPrice > 0 ? String(b.totalPrice) : '');
                                                            }
                                                        }}
                                                        className="p-2 rounded-xl bg-slate-800/50 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all border border-white/5 hover:border-cyan-500/30 shadow-sm"
                                                        title="Ver detalhes"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </button>
                                                    {b.status === 'PENDING' && (
                                                        <>
                                                            <button
                                                                onClick={() => updateStatus.mutate({ id: b.id, status: 'CONFIRMED' })}
                                                                className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs hover:bg-emerald-500 border border-emerald-500/20 hover:text-white transition-all shadow-sm font-semibold flex items-center gap-1.5"
                                                                title="Confirmar Reserva"
                                                            >
                                                                <CheckCircle className="w-3.5 h-3.5" />
                                                                Aprovar
                                                            </button>
                                                            <button
                                                                onClick={() => updateStatus.mutate({ id: b.id, status: 'CANCELLED' })}
                                                                className="p-2 rounded-xl bg-slate-800/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all border border-white/5 hover:border-red-500/30 shadow-sm"
                                                                title="Rejeitar/Cancelar"
                                                            >
                                                                <XCircle className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                    {b.status === 'CONFIRMED' && (
                                                        <span className="text-[10px] text-slate-500 font-medium italic bg-white/5 px-2 py-1 rounded-md border border-white/5">Espera Pgto.</span>
                                                    )}
                                                    {b.status === 'PAID' && (
                                                        <span className="text-[10px] text-yellow-400 font-semibold bg-yellow-500/10 px-2.5 py-1 rounded-md border border-yellow-500/20 cursor-pointer animate-pulse" onClick={() => setSelectedBooking(b)}>Ver Pgto →</span>
                                                    )}
                                                    {b.status === 'AWAITING_DELIVERY' && (
                                                        <button
                                                            onClick={() => updateStatus.mutate({ id: b.id, status: 'DELIVERED' })}
                                                            className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 text-xs hover:bg-purple-500 hover:text-white transition-all shadow-sm font-semibold border border-purple-500/30 flex items-center gap-1"
                                                        >
                                                            Entregar
                                                        </button>
                                                    )}
                                                    {b.status === 'DELIVERED' && (
                                                        <button
                                                            onClick={() => updateStatus.mutate({ id: b.id, status: 'COMPLETED' })}
                                                            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 text-xs hover:bg-cyan-500 hover:text-white transition-all shadow-sm font-semibold border border-cyan-500/30 flex items-center gap-1"
                                                        >
                                                            Devolução
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {filteredData?.length === 0 && (
                                    <tr>
                                        <td colSpan={8} className="py-20 text-center">
                                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10">
                                                <Calendar className="w-8 h-8 text-slate-500" />
                                            </div>
                                            <p className="text-slate-300 font-bold text-lg">Nenhuma reserva localizada</p>
                                            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">Tente ajustar os filtros de estado ou altere os seus termos de pesquisa para encontrar o que procura.</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {data?.meta?.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    {[...Array(data.meta.totalPages)].map((_: unknown, i: number) => (
                        <button
                            key={i}
                            onClick={() => {
                                const p = new URLSearchParams(searchParams);
                                p.set('page', String(i + 1));
                                setSearchParams(p);
                            }}
                            className={`w-9 h-9 rounded-xl text-sm font-medium transition-all ${page === i + 1
                                ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/25'
                                : 'glass text-slate-300 hover:bg-white/5'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}

            {/* Booking Detail Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setSelectedBooking(null)}>
                    <div className="glass rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        {/* Background glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none"></div>

                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between sticky top-0 bg-slate-900/80 backdrop-blur-xl z-20">
                            <h3 className="text-2xl font-black flex items-center gap-3">
                                <Eye className="w-6 h-6 text-cyan-400" />
                                Detalhes da Reserva <span className="text-slate-500 font-mono font-medium">#{selectedBooking.id}</span>
                            </h3>
                            <button onClick={() => setSelectedBooking(null)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors">
                                <XCircle className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8 relative z-10">
                            {/* Status Banner */}
                            <div className={`p-4 rounded-xl flex items-center justify-between border ${statusConfig[selectedBooking.status]?.bg} ${statusConfig[selectedBooking.status]?.color}`}>
                                <div>
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-80 mb-1">Estado Atual</p>
                                    <p className="text-lg font-bold flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-current animate-pulse"></div>
                                        {statusConfig[selectedBooking.status]?.label}
                                    </p>
                                </div>
                                <Clock className="w-8 h-8 opacity-50" />
                            </div>

                            {/* Client Info */}
                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-cyan-500" />
                                    Dados do Cliente
                                </h4>
                                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-4 hover:border-cyan-500/20 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white font-bold">
                                            {selectedBooking.user?.name?.charAt(0)?.toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold">{selectedBooking.user?.name}</p>
                                            <p className="text-xs text-slate-400">Cliente #{selectedBooking.user?.id}</p>
                                        </div>
                                    </div>
                                    {selectedBooking.user?.email && (
                                        <div className="flex items-center gap-2 text-sm text-slate-300">
                                            <Mail className="w-4 h-4 text-slate-500" />
                                            <a href={`mailto:${selectedBooking.user.email}`} className="hover:text-teal-400">{selectedBooking.user.email}</a>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-sm text-slate-300">
                                        <Phone className="w-4 h-4 text-slate-500" />
                                        <a href={`tel:${selectedBooking.user?.phone}`} className="hover:text-teal-400">{selectedBooking.user?.phone}</a>
                                    </div>
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div>
                                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                                    {selectedBooking.type === 'VEHICLE' ? <Car className="w-4 h-4 text-cyan-500" /> : <ArrowLeftRight className="w-4 h-4 text-cyan-500" />}
                                    {selectedBooking.type === 'VEHICLE' ? 'Detalhes da Viatura' : 'Detalhes do Transfer'}
                                </h4>
                                <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 space-y-4 hover:border-cyan-500/20 transition-colors">
                                    {selectedBooking.type === 'VEHICLE' ? (
                                        <>
                                            <div className="flex items-center gap-4">
                                                {selectedBooking.vehicleBooking?.vehicle?.images?.[0]?.url ? (
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden ring-2 ring-white/10 shrink-0 shadow-lg">
                                                        <img src={selectedBooking.vehicleBooking.vehicle.images[0].url} alt="" className="w-full h-full object-cover" />
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
                                                        <Car className="w-7 h-7 text-teal-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold">{selectedBooking.vehicleBooking?.vehicle?.brand} {selectedBooking.vehicleBooking?.vehicle?.model}</p>
                                                    <p className="text-xs text-slate-400">{selectedBooking.vehicleBooking?.vehicle?.category} · {selectedBooking.vehicleBooking?.vehicle?.year}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                <Calendar className="w-4 h-4 text-teal-400" />
                                                <span>{selectedBooking.vehicleBooking ? new Date(selectedBooking.vehicleBooking.startDate).toLocaleDateString('pt-MZ') : ''}</span>
                                            </div>
                                            <span className="text-slate-500">→</span>
                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                <Calendar className="w-4 h-4 text-cyan-400" />
                                                <span>{selectedBooking.vehicleBooking ? new Date(selectedBooking.vehicleBooking.endDate).toLocaleDateString('pt-MZ') : ''}</span>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex items-center gap-3 mb-2">
                                                <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                                                    <ArrowLeftRight className="w-5 h-5 text-violet-400" />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-semibold text-white">{selectedBooking.transferBooking?.origin} → {selectedBooking.transferBooking?.destination}</p>
                                                        {selectedBooking.transferBooking?.isRoundTrip && (
                                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 tracking-wider uppercase border border-cyan-500/30">Ida e Volta</span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-400">{selectedBooking.transferBooking?.service?.name}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2 mt-2">
                                                <div className="flex items-center gap-4 text-sm text-slate-300 bg-black/20 p-2.5 rounded-lg border border-white/5">
                                                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest w-12 text-center">Ida</span>
                                                    <div className="flex items-center gap-1.5">
                                                        <Calendar className="w-4 h-4 text-slate-400" />
                                                        {selectedBooking.transferBooking ? new Date(selectedBooking.transferBooking.travelDate).toLocaleDateString('pt-MZ') : ''}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                                                        <Clock className="w-4 h-4 text-slate-400" />
                                                        {selectedBooking.transferBooking?.travelTime}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                                                        <Users className="w-4 h-4 text-slate-400" />
                                                        {selectedBooking.transferBooking?.passengers} pass.
                                                    </div>
                                                </div>
                                                {selectedBooking.transferBooking?.isRoundTrip && selectedBooking.transferBooking?.returnDate && (
                                                    <div className="flex items-center gap-4 text-sm text-slate-300 bg-black/20 p-2.5 rounded-lg border border-white/5">
                                                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest w-12 text-center">Volta</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar className="w-4 h-4 text-slate-400" />
                                                            {new Date(selectedBooking.transferBooking.returnDate).toLocaleDateString('pt-MZ')}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
                                                            <Clock className="w-4 h-4 text-slate-400" />
                                                            {selectedBooking.transferBooking.returnTime}
                                                        </div>
                                                        <div className="flex items-center gap-1.5 border-l border-white/10 pl-4 opacity-0 pointer-events-none">
                                                            {/* Placeholder */}
                                                            <Users className="w-4 h-4" />
                                                            {selectedBooking.transferBooking?.passengers} pass.
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {selectedBooking.notes && (
                                        <div className="pt-3 border-t border-white/5">
                                            <p className="text-xs text-slate-500 mb-1">Observações do cliente:</p>
                                            <p className="text-sm text-slate-300 italic">"{selectedBooking.notes}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="glass rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Valor total {selectedBooking.type === 'TRANSFER' && selectedBooking.totalPrice === 0 ? '(A Definir)' : ''}</span>
                                {selectedBooking.type === 'TRANSFER' && selectedBooking.status === 'PENDING' ? (
                                    <div className="flex items-center gap-2">
                                        <div className="relative w-full max-w-[150px]">
                                            <input
                                                type="number"
                                                min={0}
                                                value={transferPriceInput}
                                                onChange={(e) => setTransferPriceInput(e.target.value)}
                                                placeholder="Cotar Ex: 5000"
                                                className="w-full bg-slate-900/50 border border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm font-bold text-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50 placeholder-teal-800 transition-all"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">MT</span>
                                        </div>
                                        <button
                                            onClick={() => updatePrice.mutate({ id: selectedBooking.id, price: Number(transferPriceInput) })}
                                            disabled={updatePrice.isPending || !transferPriceInput || Number(transferPriceInput) <= 0}
                                            className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-sm transition-all shadow-[0_0_15px_rgba(20,184,166,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {updatePrice.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Definir'}
                                        </button>
                                    </div>
                                ) : (
                                    <div className={selectedBooking.type === 'TRANSFER' && selectedBooking.totalPrice === 0 ? 'opacity-50' : ''}>
                                        <span className="text-2xl font-bold text-teal-400">{formatPrice(selectedBooking.totalPrice)}</span>
                                        <span className="text-sm text-slate-400 ml-1">MT</span>
                                    </div>
                                )}
                            </div>

                            {/* Client Rating */}
                            {selectedBooking.rating && (
                                <div>
                                    <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                                        <Star className="w-4 h-4 text-yellow-500" />
                                        Avaliação do Cliente
                                    </h4>
                                    <div className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border border-yellow-500/20 rounded-xl p-5 shadow-inner shadow-yellow-500/5 relative overflow-hidden">
                                        {/* Background decorative glow */}
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none"></div>

                                        <div className="flex items-center gap-2 mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-6 h-6 ${(selectedBooking.rating || 0) >= star ? 'text-yellow-400 fill-current drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' : 'text-slate-700/50'}`}
                                                />
                                            ))}
                                            <span className="ml-3 text-sm font-bold text-yellow-400">
                                                {selectedBooking.rating}.0 <span className="text-slate-500 text-xs font-normal">/ 5.0</span>
                                            </span>
                                        </div>

                                        {selectedBooking.ratingComment ? (
                                            <div className="relative z-10">
                                                <Quote className="absolute -top-1 -left-1 w-8 h-8 text-yellow-500/20 rotate-180" />
                                                <p className="pl-6 text-sm text-slate-300 italic leading-relaxed">
                                                    "{selectedBooking.ratingComment}"
                                                </p>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-500 italic">O cliente não deixou nenhum comentário escrito.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            {selectedBooking.status === 'PENDING' && (
                                <div className="flex gap-4 pt-4">
                                    <button
                                        onClick={() => updateStatus.mutate({ id: selectedBooking.id, status: 'CANCELLED' })}
                                        disabled={updateStatus.isPending}
                                        className="flex-1 px-4 py-4 rounded-xl border border-white/10 hover:border-red-500/50 bg-slate-900/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                                    >
                                        <XCircle className="w-5 h-5" /> Rejeitar Pedido
                                    </button>
                                    <button
                                        onClick={() => updateStatus.mutate({ id: selectedBooking.id, status: 'CONFIRMED' })}
                                        disabled={updateStatus.isPending}
                                        className="flex-[2] px-4 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                    >
                                        {updateStatus.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                        Aprovar Reserva
                                    </button>
                                </div>
                            )}

                            {/* Conditional Message & Action States */}

                            {selectedBooking.status === 'CONFIRMED' && (
                                <div className="p-5 rounded-2xl bg-slate-900/50 border border-blue-500/30 text-center flex flex-col items-center justify-center gap-3 shadow-lg">
                                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                                        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
                                    </div>
                                    <p className="text-slate-300 font-medium">Aguardando Pagamento do Cliente.</p>
                                </div>
                            )}

                            {selectedBooking.status === 'PAID' && (
                                <div className="flex flex-col gap-4 pt-4">
                                    {selectedBooking.payment?.receiptUrl && (
                                        <button
                                            onClick={() => setViewingReceipt(selectedBooking.payment?.receiptUrl || null)}
                                            className="w-full px-4 py-4 rounded-xl bg-slate-900/80 border border-cyan-500/30 text-cyan-400 text-sm font-bold hover:bg-cyan-500/10 hover:border-cyan-500/50 transition-all flex items-center justify-center gap-2 shadow-lg"
                                        >
                                            <FileText className="w-5 h-5" /> Inspecionar Comprovativo de Pagamento
                                        </button>
                                    )}
                                    <div className="flex gap-4">
                                        <button
                                            onClick={() => updateStatus.mutate({ id: selectedBooking.id, status: 'CONFIRMED' })}
                                            disabled={updateStatus.isPending}
                                            className="flex-1 px-4 py-4 rounded-xl border border-white/10 hover:border-red-500/50 bg-slate-900/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <XCircle className="w-5 h-5" /> Rejeitar Pgto.
                                        </button>
                                        <button
                                            onClick={() => updateStatus.mutate({ id: selectedBooking.id, status: 'AWAITING_DELIVERY' })}
                                            disabled={updateStatus.isPending}
                                            className="flex-[2] px-4 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                        >
                                            {updateStatus.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                            Aprovar Pagamento
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedBooking.status === 'AWAITING_DELIVERY' && (
                                <div className="pt-4">
                                    <button
                                        onClick={() => updateStatus.mutate({ id: selectedBooking.id, status: 'DELIVERED' })}
                                        disabled={updateStatus.isPending}
                                        className="w-full px-4 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                    >
                                        {updateStatus.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Car className="w-5 h-5" />}
                                        Efectuar Entrega
                                    </button>
                                </div>
                            )}

                            {selectedBooking.status === 'DELIVERED' && (
                                <div className="pt-4">
                                    <button
                                        onClick={() => updateStatus.mutate({ id: selectedBooking.id, status: 'COMPLETED' })}
                                        disabled={updateStatus.isPending}
                                        className="w-full px-4 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-900 text-sm font-black transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 flex items-center justify-center gap-2"
                                    >
                                        {updateStatus.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowLeftRight className="w-5 h-5" />}
                                        Finalizar / Confirmar Devolução
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Receipt Premium Lightbox */}
            {viewingReceipt && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200" onClick={() => setViewingReceipt(null)}>
                    <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setViewingReceipt(null)}
                            className="absolute -top-12 right-0 md:-right-12 p-2 rounded-full text-slate-400 hover:text-white transition-colors"
                        >
                            <XCircle className="w-8 h-8" />
                        </button>
                        {viewingReceipt.toLowerCase().endsWith('.pdf') ? (
                            <iframe src={viewingReceipt} className="w-full h-[80vh] rounded-2xl bg-white shadow-2xl" />
                        ) : (
                            <img src={viewingReceipt} className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl ring-1 ring-white/10" alt="Comprovativo de Pagamento" />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
