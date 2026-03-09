import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { formatPrice } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
    DollarSign, Car, Users, CalendarCheck, ArrowLeftRight, TrendingUp,
    Clock, AlertCircle, CheckCircle, XCircle, ArrowUpRight, ArrowRight,
    Banknote, BarChart3, PieChart, CalendarDays
} from 'lucide-react';
import Flatpickr from 'react-flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
import 'flatpickr/dist/flatpickr.css';
import { format } from 'date-fns';

function getMonthRange() {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start: first.toISOString().slice(0, 10), end: last.toISOString().slice(0, 10) };
}

function getLastMonthRange() {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const last = new Date(now.getFullYear(), now.getMonth(), 0);
    return { start: first.toISOString().slice(0, 10), end: last.toISOString().slice(0, 10) };
}

function getYearRange() {
    const now = new Date();
    return { start: `${now.getFullYear()}-01-01`, end: `${now.getFullYear()}-12-31` };
}

type PeriodPreset = 'month' | 'lastMonth' | 'year' | 'all' | 'custom';

export default function AdminDashboard() {
    const [activePreset, setActivePreset] = useState<PeriodPreset>('month');
    const defaultRange = getMonthRange();
    const [startDate, setStartDate] = useState(defaultRange.start);
    const [endDate, setEndDate] = useState(defaultRange.end);

    const queryParams = activePreset === 'all' ? '' : `?startDate=${startDate}&endDate=${endDate}`;

    const { data: kpis, isLoading } = useQuery({
        queryKey: ['adminKpis', startDate, endDate, activePreset],
        queryFn: () => api.get(`/dashboard/kpis${queryParams}`).then(r => r.data),
    });

    const handlePreset = (preset: PeriodPreset) => {
        setActivePreset(preset);
        if (preset === 'month') { const r = getMonthRange(); setStartDate(r.start); setEndDate(r.end); }
        else if (preset === 'lastMonth') { const r = getLastMonthRange(); setStartDate(r.start); setEndDate(r.end); }
        else if (preset === 'year') { const r = getYearRange(); setStartDate(r.start); setEndDate(r.end); }
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="animate-pulse bg-slate-200 dark:bg-white/5 h-32 rounded-2xl transition-colors" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2].map(i => <div key={i} className="animate-pulse bg-slate-200 dark:bg-white/5 h-64 rounded-2xl transition-colors" />)}
                </div>
            </div>
        );
    }

    const totalRevenue = Number(kpis?.totalRevenue || 0);
    const pendingCount = kpis?.pendingBookings || 0;
    const confirmedCount = kpis?.confirmedBookings || 0;
    const cancelledCount = kpis?.cancelledBookings || 0;
    const totalBookings = kpis?.totalBookings || 0;

    // Additional booking counts
    const paidCount = kpis?.paidBookings || 0;
    const awaitingDeliveryCount = kpis?.awaitingDeliveryBookings || 0;
    const deliveredCount = kpis?.deliveredBookings || 0;

    // Total successful bookings can be seen as anything past PENDING and not CANCELLED
    const confirmRate = totalBookings > 0 ? Math.round(((confirmedCount + paidCount + awaitingDeliveryCount + deliveredCount + (kpis?.completedBookings || 0)) / totalBookings) * 100) : 0;

    const cards = [
        {
            label: 'Receita Total',
            value: `${formatPrice(kpis?.totalRevenue)} MT`,
            subtitle: 'Reservas confirmadas',
            icon: Banknote,
            gradient: 'from-emerald-500 to-green-600',
            bgGlow: 'shadow-emerald-500/20',
        },
        {
            label: 'Total Reservas',
            value: totalBookings,
            subtitle: `${confirmRate}% taxa de confirmação`,
            icon: CalendarCheck,
            gradient: 'from-teal-500 to-cyan-500',
            bgGlow: 'shadow-teal-500/20',
        },
        {
            label: 'Viaturas Activas',
            value: kpis?.totalVehicles || 0,
            subtitle: 'Frota disponível',
            icon: Car,
            gradient: 'from-blue-500 to-indigo-500',
            bgGlow: 'shadow-blue-500/20',
        },
        {
            label: 'Clientes Registados',
            value: kpis?.totalClients || 0,
            subtitle: 'Utilizadores activos',
            icon: Users,
            gradient: 'from-violet-500 to-purple-500',
            bgGlow: 'shadow-violet-500/20',
        },
    ];

    return (
        <div className="space-y-8 transition-colors duration-300">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 transition-colors">
                <div className="animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-500/10 border border-teal-200 dark:border-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-medium mb-3 transition-colors">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500 dark:bg-teal-400"></span>
                        </span>
                        Sistema Online
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 text-slate-900 dark:text-white transition-colors">
                        {new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite'}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 tracking-tight">Administrador</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg transition-colors">Aqui está o resumo do seu negócio hoje, {new Date().toLocaleDateString('pt-MZ', { weekday: 'long', day: 'numeric', month: 'long' })}.</p>
                </div>
                <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <Link to="/admin/bookings" className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all w-full md:w-auto">
                        <CalendarCheck className="w-5 h-5" /> Ver Reservas
                    </Link>
                </div>
            </div>

            {/* Period Filter */}
            <div className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-4 transition-colors relative z-50">
                <div className="flex flex-wrap md:flex-row flex-col items-start md:items-center gap-3">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 transition-colors" />
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium shrink-0 transition-colors">Período:</span>
                    </div>
                    <div className="flex flex-wrap gap-2 flex-1 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
                        {([
                            { key: 'month', label: 'Este Mês' },
                            { key: 'lastMonth', label: 'Mês Anterior' },
                            { key: 'year', label: 'Este Ano' },
                            { key: 'all', label: 'Tudo' },
                        ] as { key: PeriodPreset; label: string }[]).map(p => (
                            <button
                                key={p.key}
                                onClick={() => handlePreset(p.key)}
                                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activePreset === p.key
                                    ? 'bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 shadow-sm shadow-teal-500/10'
                                    : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10'
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setActivePreset('custom')}
                            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activePreset === 'custom'
                                ? 'bg-teal-50 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/30 shadow-sm shadow-teal-500/10'
                                : 'bg-slate-50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/10'
                                }`}
                        >
                            Personalizado
                        </button>
                    </div>
                    {activePreset === 'custom' && (
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto mt-2 md:mt-0">
                            <Flatpickr
                                value={startDate}
                                onChange={([date]) => setStartDate(date ? format(date, 'yyyy-MM-dd') : '')}
                                options={{
                                    locale: Portuguese,
                                    dateFormat: 'd/m/Y',
                                }}
                                className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-500 transition-all hover:bg-slate-100 dark:hover:bg-slate-900 w-[110px] sm:w-28"
                                placeholder="Início"
                            />
                            <span className="text-xs text-slate-400 dark:text-slate-500 transition-colors">—</span>
                            <Flatpickr
                                value={endDate}
                                onChange={([date]) => setEndDate(date ? format(date, 'yyyy-MM-dd') : '')}
                                options={{
                                    locale: Portuguese,
                                    dateFormat: 'd/m/Y',
                                    minDate: startDate || undefined,
                                }}
                                className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white font-medium focus:outline-none focus:border-teal-500 transition-all hover:bg-slate-100 dark:hover:bg-slate-900 w-[110px] sm:w-28"
                                placeholder="Fim"
                            />
                        </div>
                    )}
                    {activePreset !== 'all' && activePreset !== 'custom' && (
                        <span className="text-[10px] text-slate-500 dark:text-slate-500 mt-2 md:mt-0 transition-colors">
                            {new Date(startDate).toLocaleDateString('pt-MZ')} — {new Date(endDate).toLocaleDateString('pt-MZ')}
                        </span>
                    )}
                </div>
            </div>

            {/* Pending Alert */}
            {pendingCount > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-500/10 dark:to-orange-500/10 border border-amber-200 dark:border-amber-500/20 animate-fade-in-up transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center shrink-0 transition-colors">
                        <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 transition-colors" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 transition-colors">
                            {pendingCount} reserva{pendingCount > 1 ? 's' : ''} pendente{pendingCount > 1 ? 's' : ''} de confirmação
                        </p>
                        <p className="text-xs text-amber-600/70 dark:text-amber-400/70 transition-colors">Aceda à secção de reservas para aprovar ou rejeitar</p>
                    </div>
                    <Link to="/admin/bookings?status=PENDING" className="px-4 py-2 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-sm font-medium hover:bg-amber-200 dark:hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-1">
                        Ver agora <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            )}

            {/* KPI Cards */}
            <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10 transition-colors overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar">
                {cards.map((c, i) => (
                    <div key={i} className="min-w-[85vw] sm:min-w-[calc(50%-12px)] md:min-w-0 snap-center bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-6 group hover:-translate-y-1 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 relative overflow-hidden animate-fade-in-up">
                        {/* Background glow */}
                        <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${c.gradient} opacity-10 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-40 blur-3xl transition-opacity duration-300`} />

                        <div className="relative flex items-start justify-between mb-6">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-lg ${c.bgGlow} group-hover:scale-110 transition-transform duration-300`}>
                                <c.icon className="w-7 h-7 text-white" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-white/10 transition-colors">
                                <ArrowUpRight className="w-4 h-4 text-slate-400 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-white transition-colors" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1 transition-colors">{c.label}</p>
                        <p className="text-3xl font-black tracking-tight mb-2 text-slate-900 dark:text-white transition-colors">{c.value}</p>
                        <p className="text-xs text-slate-500 font-medium transition-colors">{c.subtitle}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-colors">
                {/* Booking Status Breakdown */}
                <div className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-6 transition-colors">
                    <div className="flex items-center gap-2 mb-6 transition-colors">
                        <PieChart className="w-5 h-5 text-teal-600 dark:text-teal-400 transition-colors" />
                        <h3 className="font-semibold text-slate-900 dark:text-white transition-colors">Reservas por Status</h3>
                    </div>

                    <div className="space-y-4">
                        {[
                            { label: 'Pendentes', value: pendingCount, icon: Clock, color: 'amber', pct: totalBookings ? Math.round((pendingCount / totalBookings) * 100) : 0 },
                            { label: 'Por Pagar (Conf)', value: confirmedCount, icon: Clock, color: 'blue', pct: totalBookings ? Math.round((confirmedCount / totalBookings) * 100) : 0 },
                            { label: 'Pagas', value: paidCount, icon: DollarSign, color: 'emerald', pct: totalBookings ? Math.round((paidCount / totalBookings) * 100) : 0 },
                            { label: 'Aguard. Entrega', value: awaitingDeliveryCount, icon: Car, color: 'orange', pct: totalBookings ? Math.round((awaitingDeliveryCount / totalBookings) * 100) : 0 },
                            { label: 'Em Uso', value: deliveredCount, icon: Car, color: 'purple', pct: totalBookings ? Math.round((deliveredCount / totalBookings) * 100) : 0 },
                            { label: 'Concluídas', value: kpis?.completedBookings || 0, icon: CheckCircle, color: 'cyan', pct: totalBookings ? Math.round(((kpis?.completedBookings || 0) / totalBookings) * 100) : 0 },
                            { label: 'Canceladas', value: cancelledCount, icon: XCircle, color: 'red', pct: totalBookings ? Math.round((cancelledCount / totalBookings) * 100) : 0 },
                        ].map((item, i) => (
                            <div key={i}>
                                <div className="flex items-center justify-between mb-1.5 transition-colors">
                                    <span className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 transition-colors">
                                        <item.icon className={`w-4 h-4 text-${item.color}-500 dark:text-${item.color}-400 transition-colors`} />
                                        {item.label}
                                    </span>
                                    <span className="text-sm font-semibold text-slate-900 dark:text-white transition-colors">{item.value}</span>
                                </div>
                                <div className="w-full bg-slate-100 dark:bg-slate-800/50 rounded-full h-2.5 shadow-inner overflow-hidden transition-colors">
                                    <div
                                        className={`h-full rounded-full bg-gradient-to-r ${item.color === 'amber' ? 'from-amber-400 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                                            item.color === 'blue' ? 'from-blue-400 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                                                item.color === 'emerald' ? 'from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                                    item.color === 'orange' ? 'from-orange-400 to-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.5)]' :
                                                        item.color === 'purple' ? 'from-purple-400 to-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.5)]' :
                                                            item.color === 'cyan' ? 'from-cyan-400 to-cyan-600 shadow-[0_0_10px_rgba(34,211,238,0.5)]' :
                                                                item.color === 'green' ? 'from-emerald-400 to-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                                                                    'from-red-400 to-rose-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                            } relative transition-colors`}
                                        style={{ width: `${item.pct}%`, minWidth: item.value > 0 ? '8px' : '0' }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200 dark:border-white/5 text-center transition-colors">
                        <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">{confirmRate}%</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Taxa de confirmação</p>
                    </div>
                </div>

                {/* Booking by Type */}
                <div className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-6 transition-colors">
                    <div className="flex items-center gap-2 mb-6 transition-colors">
                        <BarChart3 className="w-5 h-5 text-teal-600 dark:text-teal-400 transition-colors" />
                        <h3 className="font-semibold text-slate-900 dark:text-white transition-colors">Reservas por Tipo</h3>
                    </div>

                    <div className="flex items-end gap-6 justify-center h-40 mb-4 transition-colors">
                        {[
                            { label: 'Viaturas', value: kpis?.bookingsByType?.vehicle || 0, icon: Car, color: 'from-teal-400 to-cyan-500' },
                            { label: 'Transfers', value: kpis?.bookingsByType?.transfer || 0, icon: ArrowLeftRight, color: 'from-violet-400 to-purple-500' },
                        ].map((item, i) => {
                            const max = Math.max(kpis?.bookingsByType?.vehicle || 1, kpis?.bookingsByType?.transfer || 1);
                            const height = max > 0 ? Math.max((item.value / max) * 100, 10) : 10;
                            return (
                                <div key={i} className="flex flex-col items-center gap-2 transition-colors">
                                    <span className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{item.value}</span>
                                    <div
                                        className={`w-12 sm:w-16 rounded-t-xl bg-gradient-to-t ${item.color} transition-all duration-500 shadow-sm`}
                                        style={{ height: `${height}%` }}
                                    />
                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 transition-colors">
                                        <item.icon className="w-3 h-3" />
                                        {item.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-6 transition-colors">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-teal-600 dark:text-teal-400 transition-colors" />
                        <h3 className="font-semibold text-slate-900 dark:text-white transition-colors">Resumo Rápido</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center transition-colors">
                                    <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400 transition-colors" />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-300 transition-colors">Ticket médio</span>
                            </div>
                            <span className="font-semibold text-emerald-600 dark:text-emerald-400 transition-colors">
                                {totalBookings > 0 ? formatPrice(totalRevenue / totalBookings) : 0} MT
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-500/20 flex items-center justify-center transition-colors">
                                    <Car className="w-4 h-4 text-teal-600 dark:text-teal-400 transition-colors" />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-300 transition-colors">Viaturas / cliente</span>
                            </div>
                            <span className="font-semibold text-teal-600 dark:text-teal-400 transition-colors">
                                {(kpis?.totalClients || 0) > 0 ? ((kpis?.totalVehicles || 0) / (kpis?.totalClients || 1)).toFixed(1) : '—'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center transition-colors">
                                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 transition-colors" />
                                </div>
                                <span className="text-sm text-slate-600 dark:text-slate-300 transition-colors">Aguardam resposta</span>
                            </div>
                            <span className="font-semibold text-amber-600 dark:text-amber-400 transition-colors">{pendingCount}</span>
                        </div>
                    </div>

                    <Link to="/admin/vehicles" className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                        <Car className="w-4 h-4" /> Gerir Frota
                    </Link>
                </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl overflow-hidden transition-colors">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-white/5 flex items-center justify-between transition-colors">
                    <h3 className="font-semibold flex items-center gap-2 text-slate-900 dark:text-white transition-colors">
                        <CalendarCheck className="w-5 h-5 text-teal-600 dark:text-teal-400 transition-colors" />
                        Reservas Recentes
                    </h3>
                    <Link to="/admin/bookings" className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium flex items-center gap-1 transition-colors">
                        Ver todas <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                {/* Horizontal scroll native for tables on mobile */}
                <div className="overflow-x-auto w-full pb-2 hide-scrollbar">
                    <table className="w-full text-sm min-w-[800px] whitespace-nowrap">
                        <thead>
                            <tr className="text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-white/5 text-xs uppercase tracking-wider transition-colors">
                                <th className="text-left py-3 px-6">ID</th>
                                <th className="text-left py-3 px-4">Cliente</th>
                                <th className="text-left py-3 px-4">Tipo</th>
                                <th className="text-left py-3 px-4">Detalhe</th>
                                <th className="text-right py-3 px-4">Valor</th>
                                <th className="text-center py-3 px-6">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {kpis?.recentBookings?.map((b: {
                                id: number;
                                user: { name: string; email: string };
                                totalPrice: number;
                                status: string;
                                type: string;
                                vehicleBooking?: { vehicle: { brand: string; model: string; images?: { url: string }[] } };
                                transferBooking?: { route: { origin: string; destination: string } };
                            }) => (
                                <tr key={b.id} className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all group">
                                    <td className="py-4 px-6 relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <span className="text-xs text-slate-500 font-mono group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">#{b.id}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-gradient-to-br dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-xs font-bold text-slate-700 dark:text-white border border-slate-200 dark:border-white/10 group-hover:border-slate-300 dark:group-hover:border-white/20 transition-colors">
                                                {b.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-slate-900 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">{b.user?.name}</p>
                                                <p className="text-xs text-slate-500">{b.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${b.type === 'VEHICLE' ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-100 dark:border-teal-500/20' : 'bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-100 dark:border-violet-500/20'
                                            } transition-colors`}>
                                            {b.type === 'VEHICLE' ? (
                                                b.vehicleBooking?.vehicle?.images?.[0]?.url ? (
                                                    <img src={b.vehicleBooking.vehicle.images[0].url} alt="" className="w-5 h-5 rounded object-cover" />
                                                ) : <Car className="w-3 h-3" />
                                            ) : <ArrowLeftRight className="w-3 h-3" />}
                                            {b.type === 'VEHICLE' ? 'Viatura' : 'Transfer'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-medium transition-colors max-w-[150px] truncate">
                                        {b.vehicleBooking
                                            ? `${b.vehicleBooking.vehicle?.brand} ${b.vehicleBooking.vehicle?.model}`
                                            : `${b.transferBooking?.route?.origin} → ${b.transferBooking?.route?.destination}`
                                        }
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="font-semibold text-slate-900 dark:text-white transition-colors">{formatPrice(b.totalPrice)}</span>
                                        <span className="text-xs text-slate-500 ml-1">MT</span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${b.status === 'CONFIRMED' ? 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-transparent' :
                                            b.status === 'PAID' ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-transparent' :
                                                b.status === 'AWAITING_DELIVERY' ? 'text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-transparent' :
                                                    b.status === 'DELIVERED' ? 'text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-transparent' :
                                                        b.status === 'CANCELLED' ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-transparent' :
                                                            b.status === 'COMPLETED' ? 'text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-transparent' :
                                                                'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-transparent'
                                            } transition-colors inline-block`}>
                                            {b.status === 'CONFIRMED' ? '● Por Pagar' :
                                                b.status === 'PAID' ? '✓ Paga' :
                                                    b.status === 'AWAITING_DELIVERY' ? '● Aguard. Entrega' :
                                                        b.status === 'DELIVERED' ? '● Em Uso' :
                                                            b.status === 'CANCELLED' ? '✗ Cancelada' :
                                                                b.status === 'COMPLETED' ? '✓ Concluída' :
                                                                    '● Pendente'}
                                        </span>
                                    </td>
                                </tr>
                            ))}

                            {(!kpis?.recentBookings || kpis.recentBookings.length === 0) && (
                                <tr>
                                    <td colSpan={6} className="py-12 text-center text-slate-500">
                                        <CalendarCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
                                        <p>Nenhuma reserva registada ainda</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
