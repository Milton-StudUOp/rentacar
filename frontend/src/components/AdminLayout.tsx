import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { notificationsService } from '../services/notifications.service';
import type { Notification } from '../services/notifications.service';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    LayoutDashboard, Car, ArrowLeftRight, CalendarCheck, ChevronLeft,
    LogOut, Users, Bell, Settings, Menu, X
} from 'lucide-react';
import { useState } from 'react';

export default function AdminLayout() {
    const { user, isAdmin, loading, logout } = useAuth();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [notifOpen, setNotifOpen] = useState(false);

    const queryClient = useQueryClient();

    const { data: kpis } = useQuery({
        queryKey: ['adminKpis'],
        queryFn: () => api.get('/dashboard/kpis').then(r => r.data),
        refetchInterval: 30000,
    });

    const { data: notifications = [] } = useQuery({
        queryKey: ['adminNotifications'],
        queryFn: notificationsService.getAll,
        refetchInterval: 30000,
    });

    const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

    const markAsReadMutation = useMutation({
        mutationFn: notificationsService.markAsRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminNotifications'] })
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: notificationsService.markAllAsRead,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminNotifications'] })
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0c0f1a]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center animate-pulse">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-400 text-sm">A carregar painel...</p>
            </div>
        </div>
    );
    if (!user || !isAdmin) return <Navigate to="/" replace />;

    const pendingCount = kpis?.globalPendingBookings || 0;

    const sidebarLinks = [
        { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { to: '/admin/vehicles', label: 'Viaturas', icon: Car },
        { to: '/admin/transfers', label: 'Transfers', icon: ArrowLeftRight },
        { to: '/admin/bookings', label: 'Reservas', icon: CalendarCheck, badge: pendingCount },
        { to: '/admin/clients', label: 'Clientes', icon: Users },
        { to: '/admin/settings', label: 'Definições', icon: Settings },
    ];

    return (
        <div className="min-h-screen flex bg-[#0a0d18]">
            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#0c0f1a]/95 backdrop-blur-xl border-r border-white/5 flex flex-col fixed h-full z-40 transition-all duration-300`}>
                {/* Logo */}
                <div className="p-4 border-b border-white/5">
                    <div className="flex items-center justify-between">
                        <Link to="/admin" className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            {sidebarOpen && (
                                <div className="overflow-hidden">
                                    <span className="text-lg font-bold text-white block">Admin</span>
                                    <p className="text-[10px] text-slate-500 -mt-1">RentaCar Moçambique</p>
                                </div>
                            )}
                        </Link>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 rounded-lg hover:bg-white/5 text-slate-500 hover:text-white">
                            {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
                    {sidebarOpen && <p className="text-[10px] uppercase tracking-widest text-slate-600 px-3 mb-2 mt-2">Menu Principal</p>}
                    {sidebarLinks.map((link) => {
                        const isActive = link.exact
                            ? location.pathname === link.to
                            : location.pathname.startsWith(link.to) && link.to !== '/admin';
                        const activeFinal = link.exact ? isActive : isActive;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                title={!sidebarOpen ? link.label : undefined}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${activeFinal
                                    ? 'bg-gradient-to-r from-amber-500/10 to-orange-500/5 text-amber-400 shadow-sm border border-amber-500/10'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <link.icon className="w-5 h-5 shrink-0" />
                                {sidebarOpen && <span>{link.label}</span>}
                                {link.badge && link.badge > 0 && (
                                    <span className={`${sidebarOpen ? 'ml-auto' : 'absolute -top-1 -right-1'} min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse`}>
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="p-3 border-t border-white/5 space-y-1">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 text-sm text-slate-400 hover:text-white px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors`}
                    >
                        <ChevronLeft className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span>Voltar ao site</span>}
                    </Link>
                    <button
                        onClick={logout}
                        className={`w-full flex items-center gap-3 text-sm text-red-400 hover:text-red-300 px-3 py-2.5 rounded-xl hover:bg-red-500/5 transition-colors`}
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {sidebarOpen && <span>Sair</span>}
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} min-h-screen transition-all duration-300`}>
                {/* Top Bar */}
                <header className="sticky top-0 z-30 glass border-b border-white/5">
                    <div className="flex items-center justify-between px-8 py-3">
                        <div>
                            <p className="text-xs text-slate-500">
                                {new Date().toLocaleDateString('pt-MZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Notification Bell */}
                            <div className="relative">
                                <button
                                    onClick={() => setNotifOpen(!notifOpen)}
                                    className="relative p-2.5 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-colors"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-[#0a0d18]" />
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {notifOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-[350px] glass rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50 border border-white/10">
                                            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                                                <h4 className="font-semibold text-sm">Notificações</h4>
                                                {unreadCount > 0 && (
                                                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 text-xs font-semibold">
                                                        {unreadCount} nova{unreadCount !== 1 && 's'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    <>
                                                        {notifications.map((n: Notification) => (
                                                            <div
                                                                key={n.id}
                                                                onClick={() => {
                                                                    if (!n.isRead) markAsReadMutation.mutate(n.id);
                                                                }}
                                                                className={`block px-4 py-3 border-b border-white/5 cursor-pointer transition-colors ${n.isRead ? 'hover:bg-white/5 opacity-70' : 'bg-white/5 border-l-2 border-l-amber-500 hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                <div className="flex justify-between items-start gap-2 mb-1">
                                                                    <p className={`text-sm ${n.isRead ? 'text-slate-300' : 'text-white font-medium'}`}>
                                                                        {n.title}
                                                                    </p>
                                                                    <span className="text-[10px] text-slate-500 shrink-0 mt-0.5">
                                                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ptBR })}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-slate-400 leading-relaxed">
                                                                    {n.message}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </>
                                                ) : (
                                                    <div className="px-4 py-8 text-center">
                                                        <Bell className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                                        <p className="text-sm text-slate-500">Tudo em dia!</p>
                                                        <p className="text-xs text-slate-600">Nenhuma notificação</p>
                                                    </div>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={() => markAllAsReadMutation.mutate()}
                                                    className="w-full text-center px-4 py-3 text-sm text-slate-400 hover:bg-white/5 border-t border-white/5 font-medium hover:text-white transition-colors"
                                                >
                                                    Marcar todas como lidas
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* User */}
                            <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">
                                    {user?.name?.charAt(0)}
                                </div>
                                {sidebarOpen && (
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-medium text-white">{user?.name}</p>
                                        <p className="text-[10px] text-slate-500">{user?.email}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
