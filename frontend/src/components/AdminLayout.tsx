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
    LogOut, Users, Bell, Settings, Menu, X, Sun, Moon
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useState, useEffect } from 'react';

export default function AdminLayout() {
    const { user, isAdmin, loading, logout } = useAuth();
    const { setTheme, isDark } = useTheme();
    const location = useLocation();

    // Auto-close sidebar on mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
    const [notifOpen, setNotifOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            setSidebarOpen(!mobile);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0c0f1a] transition-colors duration-300">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center animate-pulse shadow-lg shadow-amber-500/20">
                    <LayoutDashboard className="w-6 h-6 text-white" />
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">A carregar painel...</p>
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
        <div className="min-h-screen flex bg-slate-50 dark:bg-[#0a0d18] transition-colors duration-300">
            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-30 transition-opacity" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0 md:w-20'} 
                bg-white/90 dark:bg-[#0c0f1a]/95 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 
                flex flex-col fixed h-full z-40 transition-all duration-300 shadow-xl dark:shadow-none`}>

                {/* Logo */}
                <div className="p-4 border-b border-slate-200 dark:border-white/5 h-20 flex items-center transition-colors">
                    <div className="flex items-center justify-between w-full">
                        <Link to="/admin" className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                                <LayoutDashboard className="w-5 h-5 text-white" />
                            </div>
                            {(sidebarOpen || isMobile) && (
                                <div className="overflow-hidden md:whitespace-nowrap">
                                    <span className="text-lg font-bold text-slate-900 dark:text-white block transition-colors">Admin</span>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 transition-colors">RentaCar Moçambique</p>
                                </div>
                            )}
                        </Link>
                        {isMobile && (
                            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto">
                    {(sidebarOpen || isMobile) && <p className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-2 mt-2 transition-colors">Menu Principal</p>}
                    {sidebarLinks.map((link) => {
                        const isActive = link.exact
                            ? location.pathname === link.to
                            : location.pathname.startsWith(link.to) && link.to !== '/admin';
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={() => isMobile && setSidebarOpen(false)}
                                title={(!sidebarOpen && !isMobile) ? link.label : undefined}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all relative ${isActive
                                    ? 'bg-amber-50 dark:bg-gradient-to-r dark:from-amber-500/10 dark:to-orange-500/5 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-200 dark:border-amber-500/10'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                                    }`}
                            >
                                <link.icon className="w-5 h-5 shrink-0" />
                                {(sidebarOpen || isMobile) && <span className="truncate">{link.label}</span>}
                                {link.badge && link.badge > 0 && (
                                    <span className={`${(sidebarOpen || isMobile) ? 'ml-auto' : 'absolute top-1 right-1'} min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shadow-md animate-pulse`}>
                                        {link.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom */}
                <div className="p-3 border-t border-slate-200 dark:border-white/5 space-y-1 transition-colors">
                    <Link
                        to="/"
                        className="flex items-center gap-3 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 shrink-0" />
                        {(sidebarOpen || isMobile) && <span className="truncate">Voltar ao site</span>}
                    </Link>
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 px-3 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        {(sidebarOpen || isMobile) && <span className="truncate">Sair</span>}
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-20'}`}>
                {/* Top Bar */}
                <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0c0f1a]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/5 h-20 shadow-sm dark:shadow-none transition-colors">
                    <div className="flex items-center justify-between px-4 sm:px-8 h-full">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <Menu className="w-5 h-5" />
                            </button>
                            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium hidden sm:block transition-colors">
                                {new Date().toLocaleDateString('pt-MZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                                className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 transition-colors"
                                title={isDark ? "Mudar para Claro" : "Mudar para Escuro"}
                            >
                                {isDark ? <Sun className="w-5 h-5 sm:w-5 sm:h-5" /> : <Moon className="w-5 h-5 sm:w-5 sm:h-5" />}
                            </button>

                            {/* Notification Bell */}
                            <div className="relative">
                                <button
                                    onClick={() => setNotifOpen(!notifOpen)}
                                    className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                                >
                                    <Bell className="w-5 h-5" />
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0a0d18] transition-colors" />
                                    )}
                                </button>

                                {/* Notifications Dropdown */}
                                {notifOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                                        <div className="absolute right-0 top-full mt-2 w-screen sm:w-[380px] max-w-[calc(100vw-2rem)] bg-white dark:bg-[#0c0f1a] rounded-2xl shadow-xl dark:shadow-2xl dark:shadow-black/50 overflow-hidden z-50 border border-slate-200 dark:border-white/10 transition-colors">
                                            <div className="px-4 py-3 border-b border-slate-200 dark:border-white/5 flex items-center justify-between transition-colors">
                                                <h4 className="font-semibold text-sm text-slate-900 dark:text-white transition-colors">Notificações</h4>
                                                {unreadCount > 0 && (
                                                    <span className="px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-semibold transition-colors">
                                                        {unreadCount} nova{unreadCount !== 1 && 's'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                                                        {notifications.map((n: Notification) => (
                                                            <div
                                                                key={n.id}
                                                                onClick={() => {
                                                                    if (!n.isRead) markAsReadMutation.mutate(n.id);
                                                                }}
                                                                className={`block px-4 py-4 cursor-pointer transition-colors ${n.isRead ? 'hover:bg-slate-50 dark:hover:bg-white/5 opacity-70' : 'bg-amber-50/50 dark:bg-white/5 border-l-2 border-l-amber-500 hover:bg-amber-50 dark:hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                <div className="flex justify-between items-start gap-2 mb-1">
                                                                    <p className={`text-sm ${n.isRead ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white font-medium'} transition-colors`}>
                                                                        {n.title}
                                                                    </p>
                                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 mt-0.5 font-medium transition-colors">
                                                                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true, locale: ptBR })}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">
                                                                    {n.message}
                                                                </p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="px-4 py-10 text-center">
                                                        <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-white/5 flex items-center justify-center mx-auto mb-3 transition-colors">
                                                            <Bell className="w-6 h-6 text-slate-400 dark:text-slate-600 transition-colors" />
                                                        </div>
                                                        <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">Tudo em dia!</p>
                                                        <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Nenhuma notificação</p>
                                                    </div>
                                                )}
                                            </div>
                                            {unreadCount > 0 && (
                                                <button
                                                    onClick={() => markAllAsReadMutation.mutate()}
                                                    className="w-full text-center px-4 py-3 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-transparent hover:bg-slate-100 dark:hover:bg-white/5 border-t border-slate-200 dark:border-white/5 font-medium hover:text-slate-900 dark:hover:text-white transition-colors"
                                                >
                                                    Marcar todas como lidas
                                                </button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* User Menu */}
                            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-white/10 transition-colors">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-amber-500/20 shrink-0">
                                    {user?.name?.charAt(0)}
                                </div>
                                <div className="hidden sm:block overflow-hidden max-w-[120px]">
                                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate transition-colors">{user?.name}</p>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate transition-colors">{user?.email}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-4 sm:p-6 lg:p-8 flex-1">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
