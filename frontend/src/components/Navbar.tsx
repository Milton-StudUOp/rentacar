import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from './ThemeProvider';
import { Car, Menu, X, User, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout, isAdmin, isAuthenticated } = useAuth();
    const { setTheme, isDark } = useTheme();
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    const navLinks = [
        { to: '/', label: 'Início' },
        { to: '/vehicles', label: 'Viaturas' },
        { to: '/transfers', label: 'Transfers' },
    ];

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 dark:bg-[#0c0f1a]/80 backdrop-blur-md border-b border-slate-200 dark:border-white/5 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-teal-500/20 group-hover:shadow-teal-500/40 transition-shadow">
                            <Car className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent hidden sm:block transition-all">
                            RentaCar
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === link.to
                                    ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center gap-3">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 transition-colors"
                            title={isDark ? "Mudar para Claro" : "Mudar para Escuro"}
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>

                        {isAuthenticated ? (
                            <>
                                {isAdmin && (
                                    <Link
                                        to="/admin"
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Admin
                                    </Link>
                                )}
                                <Link
                                    to="/my-bookings"
                                    className="px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                >
                                    Minhas Reservas
                                </Link>
                                <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-white/10 transition-colors">
                                    <Link to="/profile" className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center">
                                            <User className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="hidden lg:block">{user?.name?.split(' ')[0]}</span>
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-500/10 transition-colors"
                                        title="Sair"
                                    >
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/checkout/vehicle/0"
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 dark:hover:from-teal-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/25"
                            >
                                Entrar
                            </Link>
                        )}
                    </div>

                    {/* Mobile Toggle */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5 transition-colors"
                        >
                            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                        >
                            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {menuOpen && (
                    <div className="md:hidden py-4 border-t border-slate-200 dark:border-white/5 animate-fade-in-up transition-colors">
                        <div className="flex flex-col gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMenuOpen(false)}
                                    className={`px-4 py-3 rounded-lg text-sm font-medium ${location.pathname === link.to
                                        ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            {isAuthenticated ? (
                                <>
                                    <Link to="/my-bookings" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">
                                        Minhas Reservas
                                    </Link>
                                    <Link to="/profile" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5">
                                        Perfil
                                    </Link>
                                    {isAdmin && (
                                        <Link to="/admin" onClick={() => setMenuOpen(false)} className="px-4 py-3 text-sm text-amber-600 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-white/5">
                                            Painel Admin
                                        </Link>
                                    )}
                                    <button onClick={() => { logout(); setMenuOpen(false); }} className="px-4 py-3 text-sm text-red-500 dark:text-red-400 text-left hover:bg-slate-50 dark:hover:bg-white/5">
                                        Sair
                                    </button>
                                </>
                            ) : (
                                <div className="p-4 mt-2 border-t border-slate-200 dark:border-white/5 transition-colors">
                                    <Link
                                        to="/checkout/vehicle/0"
                                        onClick={() => setMenuOpen(false)}
                                        className="block w-full text-center px-4 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 dark:hover:from-teal-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/25"
                                    >
                                        Entrar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
