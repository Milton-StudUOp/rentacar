import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Car, LogIn, UserPlus, Loader2, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import Flatpickr from 'react-flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
import 'flatpickr/dist/flatpickr.css';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const inputCls = "w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/20 transition-all";
const labelCls = "block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider";

export default function Checkout() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, login, register } = useAuth();

    const [authTab, setAuthTab] = useState<'login' | 'register'>('register');
    const [loginForm, setLoginForm] = useState({ login: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ name: '', phone: '', email: '', password: '' });
    const [authLoading, setAuthLoading] = useState(false);

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [notes, setNotes] = useState('');

    const { data: vehicle } = useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => api.get(`/vehicles/${id}`).then(r => r.data),
        enabled: !!id && id !== '0',
    });

    const bookVehicle = useMutation({
        mutationFn: (data: { vehicleId: number; startDate: string; endDate: string; notes?: string }) => api.post('/bookings/vehicle', data),
        onSuccess: () => { toast.success('Pedido de proposta enviado com sucesso!'); navigate('/my-bookings'); },
        onError: (err: { response?: { data?: { message?: string } } }) => { toast.error(err.response?.data?.message || 'Erro ao enviar pedido'); },
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault(); setAuthLoading(true);
        try {
            await login(loginForm.login.replace(/\s+/g, ''), loginForm.password);
            toast.success('Login efectuado!');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Credenciais inválidas');
        } finally { setAuthLoading(false); }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault(); setAuthLoading(true);
        try {
            await register({ ...registerForm, phone: registerForm.phone.replace(/\s+/g, '') });
            toast.success('Conta criada com sucesso!');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Erro no cadastro');
        } finally { setAuthLoading(false); }
    };

    const handleBooking = () => {
        if (!startDate || !endDate) { toast.error('Selecione as datas do contrato'); return; }
        bookVehicle.mutate({ vehicleId: Number(id), startDate, endDate, notes });
    };

    const days = startDate && endDate ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) : 0;
    const totalPrice = vehicle ? days * Number(vehicle.pricePerDay) : 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300 pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold uppercase tracking-widest mb-4">
                        {isAuthenticated ? 'Solicitação B2B' : 'Identificação'}
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white">
                        {isAuthenticated ? 'Solicitar Proposta B2B' : 'Identificação Corporativa'}
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* ── Auth + Form ──────────────────── */}
                    <div className="lg:col-span-3 space-y-5">
                        {!isAuthenticated && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-6 shadow-sm dark:shadow-none">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Identifique-se para continuar</h2>
                                <p className="text-sm text-gray-500 dark:text-zinc-400 mb-6">Para finalizar a sua solicitação, faça login ou crie uma conta rápida.</p>

                                {/* Tabs */}
                                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl mb-6">
                                    {[{ id: 'login' as const, icon: LogIn, label: 'Já tenho conta' }, { id: 'register' as const, icon: UserPlus, label: 'Cadastro rápido' }].map(tab => (
                                        <button key={tab.id} onClick={() => setAuthTab(tab.id)} id={`auth-${tab.id}-tab`}
                                            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${authTab === tab.id ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-zinc-400'}`}>
                                            <tab.icon className="w-4 h-4" /> {tab.label}
                                        </button>
                                    ))}
                                </div>

                                {authTab === 'login' ? (
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div><label className={labelCls}>Email ou Telefone</label>
                                            <input type="text" value={loginForm.login} onChange={e => setLoginForm({ ...loginForm, login: e.target.value })} className={inputCls} placeholder="email@exemplo.com ou +258..." required id="login-email" /></div>
                                        <div>
                                            <label className={labelCls}>Senha</label>
                                            <input type="password" value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} className={inputCls} required id="login-password" />
                                            <div className="flex justify-end mt-1.5">
                                                <Link to="/forgot-password" className="text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors">Esqueceu a senha?</Link>
                                            </div>
                                        </div>
                                        <button type="submit" disabled={authLoading} id="login-submit-btn"
                                            className="w-full py-3.5 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
                                            {authLoading && <Loader2 className="w-4 h-4 animate-spin" />} Entrar
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        {[
                                            { label: 'Nome completo *', type: 'text', key: 'name', placeholder: 'Seu nome completo', id: 'register-name' },
                                            { label: 'Telefone (Moçambique) *', type: 'tel', key: 'phone', placeholder: '+258 84 000 0000', id: 'register-phone' },
                                            { label: 'Email (recomendado)', type: 'email', key: 'email', placeholder: 'exemplo@empresa.com', id: 'register-email' },
                                            { label: 'Criar senha *', type: 'password', key: 'password', placeholder: 'Mínimo 6 caracteres', id: 'register-password' },
                                        ].map(f => (
                                            <div key={f.key}>
                                                <label className={labelCls}>{f.label}</label>
                                                <input type={f.type} value={registerForm[f.key as keyof typeof registerForm]}
                                                    onChange={e => setRegisterForm({ ...registerForm, [f.key]: e.target.value })}
                                                    className={inputCls} placeholder={f.placeholder} required={f.label.includes('*')} id={f.id} />
                                            </div>
                                        ))}
                                        <button type="submit" disabled={authLoading} id="register-submit-btn"
                                            className="w-full py-3.5 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
                                            {authLoading && <Loader2 className="w-4 h-4 animate-spin" />} Criar conta e continuar
                                        </button>
                                    </form>
                                )}
                            </motion.div>
                        )}

                        {isAuthenticated && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-6 shadow-sm dark:shadow-none">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Detalhes do Contrato</h2>
                                <div className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className={labelCls}>Início do Contrato *</label>
                                            <Flatpickr value={startDate} onChange={([date]) => setStartDate(date ? format(date, 'yyyy-MM-dd') : '')}
                                                options={{ locale: Portuguese, dateFormat: 'd/m/Y', minDate: 'today' }} className={inputCls} placeholder="dd/mm/aaaa" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Fim do Contrato *</label>
                                            <Flatpickr value={endDate} onChange={([date]) => setEndDate(date ? format(date, 'yyyy-MM-dd') : '')}
                                                options={{ locale: Portuguese, dateFormat: 'd/m/Y', minDate: startDate || 'today' }} className={inputCls} placeholder="dd/mm/aaaa" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelCls}>Observações / Requisitos Especiais</label>
                                        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
                                            className={`${inputCls} resize-none`} placeholder="Ex: Cadeira de bebé, muita bagagem extra..." id="booking-notes" />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* ── Summary Card ──────────────────── */}
                    <div className="lg:col-span-2">
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
                            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-6 md:sticky md:top-24 shadow-sm dark:shadow-none">
                            <h3 className="font-bold text-gray-900 dark:text-white mb-5">Resumo da Proposta</h3>

                            {vehicle && (
                                <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100 dark:border-white/5">
                                    {vehicle.images?.[0]?.url
                                        ? <div className="w-16 h-12 rounded-xl overflow-hidden border border-gray-200 dark:border-white/8 shrink-0">
                                            <img src={vehicle.images[0].url} alt={vehicle.model} className="w-full h-full object-cover" />
                                        </div>
                                        : <div className="w-16 h-12 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center shrink-0">
                                            <Car className="w-6 h-6 text-gray-400 dark:text-zinc-600" />
                                        </div>
                                    }
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{vehicle.brand} {vehicle.model}</p>
                                        <p className="text-xs text-gray-500 dark:text-zinc-400">{vehicle.category} · {vehicle.year}</p>
                                    </div>
                                </div>
                            )}

                            {days > 0 && (
                                <div className="text-sm text-gray-500 dark:text-zinc-400 mb-3">
                                    {days} dia{days > 1 ? 's' : ''} × {formatPrice(vehicle?.pricePerDay)} MT
                                </div>
                            )}

                            <div className="flex justify-between items-center py-4 border-t border-gray-100 dark:border-white/5">
                                <span className="font-bold text-gray-900 dark:text-white">Estimativa B2B</span>
                                <span className="text-2xl font-black text-brand-500">{formatPrice(totalPrice)} MT</span>
                            </div>

                            {isAuthenticated && (
                                <button onClick={handleBooking} disabled={bookVehicle.isPending}
                                    className="w-full mt-4 py-4 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                                    id="confirm-booking-btn">
                                    {bookVehicle.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    Solicitar Proposta Comercial
                                </button>
                            )}

                            {!isAuthenticated && (
                                <div className="mt-4 p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-white/6 text-center">
                                    <CheckCircle2 className="w-5 h-5 text-gray-400 dark:text-zinc-500 mx-auto mb-1" />
                                    <p className="text-sm text-gray-500 dark:text-zinc-400">Complete a identificação para finalizar</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
