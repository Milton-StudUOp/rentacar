import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { notificationsService } from '../services/notifications.service';
import type { Notification } from '../services/notifications.service';
import {
    LayoutDashboard, Car, ArrowLeftRight, CalendarCheck, ChevronLeft,
    LogOut, Users, Bell, Settings, Sun, Moon, Briefcase
} from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useState } from 'react';

export default function AdminLayout() {
    const { user, isAdmin, loading, logout } = useAuth();
    const { setTheme, isDark } = useTheme();
    const location = useLocation();

    const [notifOpen, setNotifOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);

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

    // const markAllAsReadMutation = useMutation({
    //     mutationFn: notificationsService.markAllAsRead,
    //     onSuccess: () => queryClient.invalidateQueries({ queryKey: ['adminNotifications'] })
    // });

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
        { to: '/admin/corporate', label: 'Empresas', icon: Briefcase },
        { to: '/admin/clients', label: 'Clientes', icon: Users },
        { to: '/admin/settings', label: 'Definições', icon: Settings },
    ];

    return (
        <div className="min-h-screen flex bg-slate-50 dark:bg-[#0a0d18] transition-colors duration-300">
            {/* Sidebar (Desktop Only) */}
            <aside className="hidden md:flex w-64 md:w-20 lg:w-64 bg-white/90 dark:bg-[#0c0f1a]/95 backdrop-blur-xl border-r border-slate-200 dark:border-white/5 flex-col fixed h-full z-40 shadow-xl dark:shadow-none transition-all duration-300">
                {/* Logo */}
                <div className="p-4 border-b border-slate-200 dark:border-white/5 h-20 flex items-center justify-center lg:justify-start transition-colors">
                    <Link to="/admin" className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                            <LayoutDashboard className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden lg:block overflow-hidden whitespace-nowrap">
                            <span className="text-lg font-bold text-slate-900 dark:text-white block transition-colors">Admin</span>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-1 transition-colors">RentaCar Moçambique</p>
                        </div>
                    </Link>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 p-3 flex flex-col gap-1 overflow-y-auto hide-scrollbar">
                    <p className="hidden lg:block text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 mb-2 mt-2 transition-colors">Menu</p>
                    {sidebarLinks.map((link) => {
                        const isActive = link.exact
                            ? location.pathname === link.to
                            : location.pathname.startsWith(link.to) && link.to !== '/admin';
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                title={link.label}
                                className={`flex items-center justify-center lg:justify-start gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all relative group ${isActive
                                    ? 'bg-amber-50 dark:bg-gradient-to-r dark:from-amber-500/10 dark:to-orange-500/5 text-amber-600 dark:text-amber-400 shadow-sm border border-amber-200 dark:border-amber-500/10'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                                    }`}
                            >
                                <link.icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-amber-500' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-amber-300'}`} />
                                <span className="hidden lg:block truncate">{link.label}</span>
                                {link.badge !== undefined && link.badge > 0 && (
                                    <span className="hidden lg:flex ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[10px] font-bold items-center justify-center shadow-md animate-pulse">
                                        {link.badge}
                                    </span>
                                )}
                                {/* Badge on collapsed state */}
                                {link.badge && link.badge > 0 && (
                                    <span className="lg:hidden absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border-2 border-white dark:border-[#0c0f1a]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom Actions */}
                <div className="p-3 border-t border-slate-200 dark:border-white/5 space-y-1 transition-colors">
                    <Link
                        to="/"
                        title="Ir ao site"
                        className="flex items-center justify-center lg:justify-start gap-3 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-3 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors group"
                    >
                        <ChevronLeft className="w-5 h-5 shrink-0" />
                        <span className="hidden lg:block truncate">Voltar ao site</span>
                    </Link>
                    <button
                        onClick={logout}
                        title="Sair"
                        className="w-full flex items-center justify-center lg:justify-start gap-3 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 px-3 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors group"
                    >
                        <LogOut className="w-5 h-5 shrink-0" />
                        <span className="hidden lg:block truncate">Sair</span>
                    </button>
                </div>
            </aside>

            {/* Content Area */}
            {/* Added pb-20 on mobile to account for the bottom nav bar */}
            <main className="flex-1 flex flex-col min-h-screen transition-all md:ml-20 lg:ml-64 w-full relative pb-20 md:pb-0">
                {/* Top Header */}
                <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0c0f1a]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/5 h-16 md:h-20 shadow-sm dark:shadow-none transition-colors">
                    <div className="flex items-center justify-between px-3 sm:px-8 h-full">
                        <div className="flex items-center gap-3">
                            {/* Mobile Logo for Header */}
                            <div className="md:hidden flex items-center gap-2">
                                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                                    <LayoutDashboard className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <span className="text-sm font-bold text-slate-900 dark:text-white block">Admin</span>
                                </div>
                            </div>
                            {/* Desktop Date */}
                            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium hidden md:block transition-colors">
                                {new Date().toLocaleDateString('pt-MZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* Theme Toggle */}
                            <button
                                onClick={() => setTheme(isDark ? 'light' : 'dark')}
                                className="p-2 sm:p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 transition-colors"
                                title={isDark ? "Modo Claro" : "Modo Escuro"}
                            >
                                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
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
                                        <div className="absolute -right-12 sm:right-0 top-full mt-3 w-[320px] sm:w-[380px] origin-top-right bg-white dark:bg-[#0c0f1a] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] dark:shadow-2xl dark:shadow-black/50 overflow-hidden z-50 border border-slate-200 dark:border-white/10 transition-all font-sans">
                                            {/* ... keeping the same notification internal logic ... */}
                                            <div className="px-4 py-3 border-b border-slate-200 dark:border-white/5 flex items-center justify-between">
                                                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">Notificações</h4>
                                                {unreadCount > 0 && <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold">{unreadCount}</span>}
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                                                        {notifications.map((n: Notification) => (
                                                            <div key={n.id} onClick={() => { if (!n.isRead) markAsReadMutation.mutate(n.id); }} className={`block px-4 py-3 cursor-pointer ${n.isRead ? 'opacity-70' : 'bg-amber-50/50 dark:bg-amber-500/5 border-l-2 border-l-amber-500'}`}>
                                                                <p className={`text-sm ${n.isRead ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white font-medium'} truncate`}>{n.title}</p>
                                                                <p className="text-xs text-slate-500 truncate">{n.message}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="p-6 text-center text-slate-500 text-sm">Tudo em dia!</div>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* User Menu */}
                            <div className="relative pl-1 sm:pl-4 border-l border-slate-200 dark:border-white/10">
                                <button
                                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                                    className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none hover:opacity-80 transition-opacity"
                                >
                                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs sm:text-sm font-bold shadow-sm shrink-0 ring-2 ring-white dark:ring-[#0c0f1a]">
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <div className="hidden sm:block overflow-hidden max-w-[120px]">
                                        <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.name}</p>
                                        <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                                    </div>
                                </button>

                                {userMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                        <div className="absolute right-0 top-full mt-3 w-56 origin-top-right bg-white dark:bg-[#0c0f1a] rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] dark:shadow-2xl dark:shadow-black/50 overflow-hidden z-50 border border-slate-200 dark:border-white/10 transition-all py-2 block lg:hidden">
                                            {/* Mobile User Info Info inside dropdown */}
                                            <div className="px-4 py-3 border-b border-slate-200 dark:border-white/5 mb-2 block sm:hidden">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                                            </div>

                                            <Link
                                                to="/admin/settings"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                                            >
                                                <Settings className="w-4 h-4" />
                                                Definições
                                            </Link>
                                            <Link
                                                to="/"
                                                onClick={() => setUserMenuOpen(false)}
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Ir ao site Web
                                            </Link>

                                            <div className="h-px bg-slate-200 dark:bg-white/5 my-2 mx-4" />

                                            <button
                                                onClick={() => { setUserMenuOpen(false); logout(); }}
                                                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Terminar Sessão
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main View Area */}
                <div className="p-4 sm:p-6 lg:p-8 flex-1 overflow-x-hidden">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Bottom App Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#0a0d18]/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-white/5 pb-safe px-2 transition-colors duration-300 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_-5px_30px_-15px_rgba(0,0,0,0.5)]">
                <div className="flex items-center justify-around h-16">
                    {sidebarLinks.slice(0, 5).map((link) => {
                        const isActive = link.exact
                            ? location.pathname === link.to
                            : location.pathname.startsWith(link.to) && link.to !== '/admin';
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`flex flex-col items-center justify-center w-full h-full relative z-10 gap-1 rounded-xl transition-all duration-300 ${isActive ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}
                            >
                                <div className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 ${isActive ? 'bg-amber-100 dark:bg-amber-500/20 shadow-sm shadow-amber-500/10 -translate-y-1' : 'bg-transparent'}`}>
                                    <link.icon className={`w-5 h-5 ${isActive ? 'scale-110 drop-shadow-md' : 'scale-100'} transition-transform`} />
                                    {link.badge !== undefined && link.badge > 0 && (
                                        <span className={`absolute top-0 right-0 w-3 h-3 rounded-full bg-red-500 border-2 ${isActive ? 'border-amber-100 dark:border-[#1d1f2b]' : 'border-white dark:border-[#0a0d18]'} transition-colors`} />
                                    )}
                                </div>
                                <span className={`text-[10px] font-medium transition-all ${isActive ? 'opacity-100 font-bold -translate-y-0.5' : 'opacity-80'}`}>
                                    {link.label}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
