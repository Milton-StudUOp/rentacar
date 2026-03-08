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
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
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
                    {[1, 2, 3, 4].map(i => <div key={i} className="skeleton h-32 rounded-2xl" />)}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2].map(i => <div key={i} className="skeleton h-64 rounded-2xl" />)}
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
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
                <div className="animate-fade-in-up">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-medium mb-3">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                        </span>
                        Sistema Online
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                        {new Date().getHours() < 12 ? 'Bom dia' : new Date().getHours() < 18 ? 'Boa tarde' : 'Boa noite'}, <span className="gradient-text">Administrador</span>
                    </h1>
                    <p className="text-slate-400 text-lg">Aqui está o resumo do seu negócio hoje, {new Date().toLocaleDateString('pt-MZ', { weekday: 'long', day: 'numeric', month: 'long' })}.</p>
                </div>
                <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <Link to="/admin/bookings" className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all">
                        <CalendarCheck className="w-5 h-5" /> Ver Reservas
                    </Link>
                </div>
            </div>

            {/* Period Filter */}
            <div className="glass rounded-2xl p-4">
                <div className="flex flex-wrap items-center gap-3">
                    <CalendarDays className="w-4 h-4 text-teal-400 shrink-0" />
                    <span className="text-xs text-slate-400 font-medium shrink-0">Período:</span>
                    <div className="flex flex-wrap gap-2">
                        {([
                            { key: 'month', label: 'Este Mês' },
                            { key: 'lastMonth', label: 'Mês Anterior' },
                            { key: 'year', label: 'Este Ano' },
                            { key: 'all', label: 'Tudo' },
                        ] as { key: PeriodPreset; label: string }[]).map(p => (
                            <button
                                key={p.key}
                                onClick={() => handlePreset(p.key)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activePreset === p.key
                                    ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-sm shadow-teal-500/10'
                                    : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                                    }`}
                            >
                                {p.label}
                            </button>
                        ))}
                        <button
                            onClick={() => setActivePreset('custom')}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activePreset === 'custom'
                                ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-sm shadow-teal-500/10'
                                : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                                }`}
                        >
                            Personalizado
                        </button>
                    </div>
                    {activePreset === 'custom' && (
                        <div className="flex items-center gap-2 ml-auto">
                            <DatePicker
                                selected={startDate ? new Date(startDate) : null}
                                onChange={(date: Date | null) => setStartDate(date ? format(date, 'yyyy-MM-dd') : '')}
                                selectsStart
                                startDate={startDate ? new Date(startDate) : undefined}
                                endDate={endDate ? new Date(endDate) : undefined}
                                locale={ptBR}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Início"
                                className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white focus:outline-none focus:border-teal-500/50 w-28"
                                portalId="root"
                            />
                            <span className="text-xs text-slate-500">—</span>
                            <DatePicker
                                selected={endDate ? new Date(endDate) : null}
                                onChange={(date: Date | null) => setEndDate(date ? format(date, 'yyyy-MM-dd') : '')}
                                selectsEnd
                                startDate={startDate ? new Date(startDate) : undefined}
                                endDate={endDate ? new Date(endDate) : undefined}
                                minDate={startDate ? new Date(startDate) : undefined}
                                locale={ptBR}
                                dateFormat="dd/MM/yyyy"
                                placeholderText="Fim"
                                className="px-3 py-1.5 rounded-lg text-xs bg-white/5 border border-white/10 text-white focus:outline-none focus:border-teal-500/50 w-28"
                                portalId="root"
                            />
                        </div>
                    )}
                    {activePreset !== 'all' && activePreset !== 'custom' && (
                        <span className="text-[10px] text-slate-500 ml-auto">
                            {new Date(startDate).toLocaleDateString('pt-MZ')} — {new Date(endDate).toLocaleDateString('pt-MZ')}
                        </span>
                    )}
                </div>
            </div>

            {/* Pending Alert */}
            {pendingCount > 0 && (
                <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 animate-fade-in-up">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-300">
                            {pendingCount} reserva{pendingCount > 1 ? 's' : ''} pendente{pendingCount > 1 ? 's' : ''} de confirmação
                        </p>
                        <p className="text-xs text-amber-400/70">Aceda à secção de reservas para aprovar ou rejeitar</p>
                    </div>
                    <Link to="/admin/bookings?status=PENDING" className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 text-sm font-medium hover:bg-amber-500/30 transition-colors flex items-center gap-1">
                        Ver agora <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {cards.map((c, i) => (
                    <div key={i} className="glass rounded-2xl p-6 group hover:-translate-y-1 hover:bg-white/10 transition-all duration-300 relative overflow-hidden animate-fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                        {/* Background glow */}
                        <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${c.gradient} opacity-20 group-hover:opacity-40 blur-3xl transition-opacity duration-300`} />

                        <div className="relative flex items-start justify-between mb-6">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.gradient} flex items-center justify-center shadow-lg ${c.bgGlow} group-hover:scale-110 transition-transform duration-300`}>
                                <c.icon className="w-7 h-7 text-white" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-400 mb-1">{c.label}</p>
                        <p className="text-3xl font-black tracking-tight mb-2 text-white">{c.value}</p>
                        <p className="text-xs text-slate-500 font-medium">{c.subtitle}</p>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Booking Status Breakdown */}
                <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChart className="w-5 h-5 text-teal-400" />
                        <h3 className="font-semibold">Reservas por Status</h3>
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
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="flex items-center gap-2 text-sm text-slate-300">
                                        <item.icon className={`w-4 h-4 text-${item.color}-400`} />
                                        {item.label}
                                    </span>
                                    <span className="text-sm font-semibold">{item.value}</span>
                                </div>
                                <div className="w-full bg-slate-800/50 rounded-full h-2.5 shadow-inner overflow-hidden">
                                    <div
                                        className={`h-full rounded-full bg-gradient-to-r ${item.color === 'amber' ? 'from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' :
                                            item.color === 'blue' ? 'from-blue-500 to-indigo-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' :
                                                item.color === 'emerald' ? 'from-emerald-400 to-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.5)]' :
                                                    item.color === 'orange' ? 'from-orange-400 to-orange-600 shadow-[0_0_10px_rgba(249,115,22,0.5)]' :
                                                        item.color === 'purple' ? 'from-purple-500 to-purple-600 shadow-[0_0_10px_rgba(168,85,247,0.5)]' :
                                                            item.color === 'cyan' ? 'from-cyan-400 to-cyan-600 shadow-[0_0_10px_rgba(34,211,238,0.5)]' :
                                                                item.color === 'green' ? 'from-emerald-500 to-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' :
                                                                    'from-red-500 to-rose-600 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                                            } relative`}
                                        style={{ width: `${item.pct}%`, minWidth: item.value > 0 ? '8px' : '0' }}
                                    >
                                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-4 border-t border-white/5 text-center">
                        <p className="text-2xl font-bold gradient-text">{confirmRate}%</p>
                        <p className="text-xs text-slate-400">Taxa de confirmação</p>
                    </div>
                </div>

                {/* Booking by Type */}
                <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="w-5 h-5 text-teal-400" />
                        <h3 className="font-semibold">Reservas por Tipo</h3>
                    </div>

                    <div className="flex items-end gap-6 justify-center h-40 mb-4">
                        {[
                            { label: 'Viaturas', value: kpis?.bookingsByType?.vehicle || 0, icon: Car, color: 'from-teal-500 to-cyan-500' },
                            { label: 'Transfers', value: kpis?.bookingsByType?.transfer || 0, icon: ArrowLeftRight, color: 'from-violet-500 to-purple-500' },
                        ].map((item, i) => {
                            const max = Math.max(kpis?.bookingsByType?.vehicle || 1, kpis?.bookingsByType?.transfer || 1);
                            const height = max > 0 ? Math.max((item.value / max) * 100, 10) : 10;
                            return (
                                <div key={i} className="flex flex-col items-center gap-2">
                                    <span className="text-2xl font-bold">{item.value}</span>
                                    <div
                                        className={`w-16 rounded-t-xl bg-gradient-to-t ${item.color} transition-all duration-500`}
                                        style={{ height: `${height}%` }}
                                    />
                                    <div className="flex items-center gap-1 text-xs text-slate-400">
                                        <item.icon className="w-3 h-3" />
                                        {item.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="glass rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-teal-400" />
                        <h3 className="font-semibold">Resumo Rápido</h3>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                    <DollarSign className="w-4 h-4 text-emerald-400" />
                                </div>
                                <span className="text-sm text-slate-300">Ticket médio</span>
                            </div>
                            <span className="font-semibold text-emerald-400">
                                {totalBookings > 0 ? formatPrice(totalRevenue / totalBookings) : 0} MT
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                                    <Car className="w-4 h-4 text-teal-400" />
                                </div>
                                <span className="text-sm text-slate-300">Viaturas / cliente</span>
                            </div>
                            <span className="font-semibold text-teal-400">
                                {(kpis?.totalClients || 0) > 0 ? ((kpis?.totalVehicles || 0) / (kpis?.totalClients || 1)).toFixed(1) : '—'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-amber-400" />
                                </div>
                                <span className="text-sm text-slate-300">Aguardam resposta</span>
                            </div>
                            <span className="font-semibold text-amber-400">{pendingCount}</span>
                        </div>
                    </div>

                    <Link to="/admin/vehicles" className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-slate-300 hover:bg-white/5 transition-colors">
                        <Car className="w-4 h-4" /> Gerir Frota
                    </Link>
                </div>
            </div>

            {/* Recent Bookings Table */}
            <div className="glass rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                        <CalendarCheck className="w-5 h-5 text-teal-400" />
                        Reservas Recentes
                    </h3>
                    <Link to="/admin/bookings" className="text-sm text-teal-400 hover:text-teal-300 flex items-center gap-1">
                        Ver todas <ArrowRight className="w-3 h-3" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-slate-400 border-b border-white/5 text-xs uppercase tracking-wider">
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
                                <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-all group">
                                    <td className="py-4 px-6 relative">
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <span className="text-xs text-slate-500 font-mono group-hover:text-teal-400 transition-colors">#{b.id}</span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-xs font-bold text-white border border-white/10 group-hover:border-white/20 transition-colors">
                                                {b.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm group-hover:text-white transition-colors">{b.user?.name}</p>
                                                <p className="text-xs text-slate-500">{b.user?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${b.type === 'VEHICLE' ? 'bg-teal-500/10 text-teal-400' : 'bg-violet-500/10 text-violet-400'
                                            }`}>
                                            {b.type === 'VEHICLE' ? (
                                                b.vehicleBooking?.vehicle?.images?.[0]?.url ? (
                                                    <img src={b.vehicleBooking.vehicle.images[0].url} alt="" className="w-5 h-5 rounded object-cover" />
                                                ) : <Car className="w-3 h-3" />
                                            ) : <ArrowLeftRight className="w-3 h-3" />}
                                            {b.type === 'VEHICLE' ? 'Viatura' : 'Transfer'}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-slate-300">
                                        {b.vehicleBooking
                                            ? `${b.vehicleBooking.vehicle?.brand} ${b.vehicleBooking.vehicle?.model}`
                                            : `${b.transferBooking?.route?.origin} → ${b.transferBooking?.route?.destination}`
                                        }
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className="font-semibold text-white">{formatPrice(b.totalPrice)}</span>
                                        <span className="text-xs text-slate-500 ml-1">MT</span>
                                    </td>
                                    <td className="py-4 px-6 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${b.status === 'CONFIRMED' ? 'text-blue-400 bg-blue-500/10' :
                                            b.status === 'PAID' ? 'text-emerald-400 bg-emerald-500/10' :
                                                b.status === 'AWAITING_DELIVERY' ? 'text-orange-400 bg-orange-500/10' :
                                                    b.status === 'DELIVERED' ? 'text-purple-400 bg-purple-500/10' :
                                                        b.status === 'CANCELLED' ? 'text-red-400 bg-red-500/10' :
                                                            b.status === 'COMPLETED' ? 'text-cyan-400 bg-cyan-500/10' :
                                                                'text-amber-400 bg-amber-500/10'
                                            }`}>
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
