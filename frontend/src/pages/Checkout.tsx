import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import api from '../lib/api';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Car, ArrowLeftRight, LogIn, UserPlus, Loader2, MapPin } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

export default function Checkout() {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { isAuthenticated, login, register } = useAuth();

    const [authTab, setAuthTab] = useState<'login' | 'register'>('register');
    const [loginForm, setLoginForm] = useState({ login: '', password: '' });
    const [registerForm, setRegisterForm] = useState({ name: '', phone: '', email: '', password: '' });
    const [authLoading, setAuthLoading] = useState(false);

    // Vehicle booking form
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [notes, setNotes] = useState('');

    // Transfer booking form (pre-filled from search params)
    const [travelDate, setTravelDate] = useState(searchParams.get('date') || '');
    const [travelTime, setTravelTime] = useState(searchParams.get('time') || '');
    const [isRoundTrip] = useState(searchParams.get('isRoundTrip') === 'true');
    const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') || '');
    const [returnTime, setReturnTime] = useState(searchParams.get('returnTime') || '');
    const [passengers, setPassengers] = useState(Number(searchParams.get('passengers')) || 1);
    const origin = searchParams.get('origin') || '';
    const destination = searchParams.get('destination') || '';

    const isVehicle = type === 'vehicle';

    const { data: vehicle } = useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => api.get(`/vehicles/${id}`).then(r => r.data),
        enabled: isVehicle && !!id && id !== '0',
    });

    const { data: service } = useQuery({
        queryKey: ['service', id],
        queryFn: () => api.get(`/transfers/services/${id}`).then(r => r.data),
        enabled: !isVehicle && !!id,
    });

    const bookVehicle = useMutation({
        mutationFn: (data: { vehicleId: number; startDate: string; endDate: string; notes?: string }) => api.post('/bookings/vehicle', data),
        onSuccess: () => {
            toast.success('Reserva de veículo criada com sucesso!');
            navigate('/my-bookings');
        },
        onError: (err: { response?: { data?: { message?: string } } }) => {
            toast.error(err.response?.data?.message || 'Erro ao criar reserva');
        },
    });

    const bookTransfer = useMutation({
        mutationFn: (data: { serviceId: number; origin: string; destination: string; travelDate: string; travelTime: string; passengers: number; isRoundTrip: boolean; returnDate?: string; returnTime?: string; notes?: string }) => api.post('/bookings/transfer', data),
        onSuccess: () => {
            toast.success('Pedido de cotação de Transfer enviado com sucesso!');
            navigate('/my-bookings');
        },
        onError: (err: { response?: { data?: { message?: string } } }) => {
            toast.error(err.response?.data?.message || 'Erro ao solicitar transfer');
        },
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        try {
            const normalizedLogin = loginForm.login.replace(/\s+/g, '');
            await login(normalizedLogin, loginForm.password);
            toast.success('Login efectuado!');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Credenciais inválidas');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setAuthLoading(true);
        try {
            const normalizedData = {
                ...registerForm,
                phone: registerForm.phone.replace(/\s+/g, ''),
            };
            await register(normalizedData);
            toast.success('Conta criada com sucesso!');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Erro no cadastro');
        } finally {
            setAuthLoading(false);
        }
    };

    const handleBooking = () => {
        if (isVehicle) {
            if (!startDate || !endDate) { toast.error('Selecione as datas'); return; }
            bookVehicle.mutate({ vehicleId: Number(id), startDate, endDate, notes });
        } else {
            if (!origin || !destination || !travelDate || !travelTime || !passengers) { toast.error('Preencha os dados do transfer'); return; }
            if (isRoundTrip && (!returnDate || !returnTime)) { toast.error('Preencha os dados de regresso'); return; }
            bookTransfer.mutate({ serviceId: Number(id), origin, destination, travelDate, travelTime, passengers, isRoundTrip, returnDate, returnTime, notes });
        }
    };

    const days = startDate && endDate ? Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / 86400000) : 0;
    const totalPrice = isVehicle && vehicle ? days * Number(vehicle.pricePerDay) : 0; // Transfer price is 0 (TBD)

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8">{isAuthenticated ? 'Finalizar Reserva' : 'Identificação'}</h1>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    {/* Left - Auth + Form */}
                    <div className="lg:col-span-3 space-y-6">
                        {/* Auth Section */}
                        {!isAuthenticated && (
                            <div className="glass rounded-2xl p-6">
                                <h2 className="text-xl font-semibold mb-4">Identifique-se para continuar</h2>
                                <p className="text-sm text-slate-400 mb-4">
                                    Para finalizar a sua solicitação, faça login ou crie uma conta rápida.
                                </p>

                                {/* Tabs */}
                                <div className="flex gap-2 mb-6">
                                    <button
                                        onClick={() => setAuthTab('login')}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${authTab === 'login' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 border border-white/5'
                                            }`}
                                        id="auth-login-tab"
                                    >
                                        <LogIn className="w-4 h-4" /> Já tenho conta
                                    </button>
                                    <button
                                        onClick={() => setAuthTab('register')}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${authTab === 'register' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-slate-400 border border-white/5'
                                            }`}
                                        id="auth-register-tab"
                                    >
                                        <UserPlus className="w-4 h-4" /> Cadastro rápido
                                    </button>
                                </div>

                                {authTab === 'login' ? (
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Email ou Telefone</label>
                                            <input
                                                type="text"
                                                value={loginForm.login}
                                                onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                                placeholder="email@exemplo.com ou +258..."
                                                required
                                                id="login-email"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Senha</label>
                                            <input
                                                type="password"
                                                value={loginForm.password}
                                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                                required
                                                id="login-password"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={authLoading}
                                            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                                            id="login-submit-btn"
                                        >
                                            {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                            Entrar
                                        </button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Nome completo *</label>
                                            <input
                                                type="text"
                                                value={registerForm.name}
                                                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                                required
                                                id="register-name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Telefone (Moçambique) *</label>
                                            <input
                                                type="tel"
                                                value={registerForm.phone}
                                                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                                                placeholder="+258 84 000 0000"
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                                required
                                                id="register-phone"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Email (recomendado)</label>
                                            <input
                                                type="email"
                                                value={registerForm.email}
                                                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                                id="register-email"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-400 mb-1">Criar senha *</label>
                                            <input
                                                type="password"
                                                value={registerForm.password}
                                                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                                required
                                                minLength={6}
                                                id="register-password"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={authLoading}
                                            className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                                            id="register-submit-btn"
                                        >
                                            {authLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                                            Criar conta e continuar
                                        </button>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* Booking Details Form */}
                        {isAuthenticated && (
                            <div className="glass rounded-2xl p-6">
                                <h2 className="text-xl font-semibold mb-4">
                                    {isVehicle ? 'Detalhes da Reserva' : 'Confirmar Pedido de Transfer'}
                                </h2>

                                <div className="space-y-4">
                                    {isVehicle ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-slate-400 mb-1">Data de levantamento *</label>
                                                    <DatePicker
                                                        selected={startDate ? new Date(startDate) : null}
                                                        onChange={(date: Date | null) => setStartDate(date ? format(date, 'yyyy-MM-dd') : '')}
                                                        selectsStart
                                                        startDate={startDate ? new Date(startDate) : undefined}
                                                        endDate={endDate ? new Date(endDate) : undefined}
                                                        locale={ptBR}
                                                        dateFormat="dd/MM/yyyy"
                                                        placeholderText="dd/mm/aaaa"
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                                        required
                                                        id="booking-start-date"
                                                        isClearable
                                                        portalId="root"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-slate-400 mb-1">Data de devolução *</label>
                                                    <DatePicker
                                                        selected={endDate ? new Date(endDate) : null}
                                                        onChange={(date: Date | null) => setEndDate(date ? format(date, 'yyyy-MM-dd') : '')}
                                                        selectsEnd
                                                        startDate={startDate ? new Date(startDate) : undefined}
                                                        endDate={endDate ? new Date(endDate) : undefined}
                                                        minDate={startDate ? new Date(startDate) : undefined}
                                                        locale={ptBR}
                                                        dateFormat="dd/MM/yyyy"
                                                        placeholderText="dd/mm/aaaa"
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                                        required
                                                        id="booking-end-date"
                                                        isClearable
                                                        portalId="root"
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="space-y-4 bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 text-teal-400 mt-1" />
                                                    <div>
                                                        <p className="text-xs text-slate-400">Origem da Viagem</p>
                                                        <p className="text-sm font-medium">{origin || '-'}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 text-cyan-400 mt-1" />
                                                    <div>
                                                        <p className="text-xs text-slate-400">Destino da Viagem</p>
                                                        <p className="text-sm font-medium">{destination || '-'}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-slate-400 mb-1">Data da viagem *</label>
                                                    <DatePicker
                                                        selected={travelDate ? new Date(travelDate) : null}
                                                        onChange={(date: Date | null) => setTravelDate(date ? format(date, 'yyyy-MM-dd') : '')}
                                                        locale={ptBR}
                                                        dateFormat="dd/MM/yyyy"
                                                        placeholderText="dd/mm/aaaa"
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                                        required
                                                        id="booking-travel-date"
                                                        isClearable
                                                        portalId="root"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-slate-400 mb-1">Hora da ida *</label>
                                                    <input
                                                        type="time"
                                                        value={travelTime}
                                                        onChange={(e) => setTravelTime(e.target.value)}
                                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                                        required
                                                        id="booking-travel-time"
                                                    />
                                                </div>
                                            </div>

                                            {isRoundTrip && (
                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                    <div>
                                                        <label className="block text-xs text-slate-400 mb-1">Data de regresso *</label>
                                                        <DatePicker
                                                            selected={returnDate ? new Date(returnDate) : null}
                                                            onChange={(date: Date | null) => setReturnDate(date ? format(date, 'yyyy-MM-dd') : '')}
                                                            locale={ptBR}
                                                            dateFormat="dd/MM/yyyy"
                                                            placeholderText="dd/mm/aaaa"
                                                            minDate={travelDate ? new Date(travelDate) : undefined}
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                                                            required
                                                            id="booking-return-date"
                                                            isClearable
                                                            portalId="root"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-slate-400 mb-1">Hora do regresso *</label>
                                                        <input
                                                            type="time"
                                                            value={returnTime}
                                                            onChange={(e) => setReturnTime(e.target.value)}
                                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500/50"
                                                            required
                                                            id="booking-return-time"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="mt-4">
                                                <label className="block text-xs text-slate-400 mb-1">Passageiros *</label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    max={service?.capacity || 10}
                                                    value={passengers}
                                                    onChange={(e) => setPassengers(Number(e.target.value))}
                                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                                    id="booking-passengers"
                                                />
                                            </div>

                                            <div className="mt-4 p-4 rounded-lg bg-teal-500/10 border border-teal-500/20 text-sm text-teal-400/90 leading-relaxed font-medium">
                                                Nota: Ao submeter os dados, a nossa equipa irá providenciar o melhor veículo com a capacidade adequada e informá-lo da cotação exata o mais rápido possível para a sua aprovação.
                                            </div>
                                        </>
                                    )}
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Observações / Requisitos Especiais</label>
                                        <textarea
                                            value={notes}
                                            onChange={(e) => setNotes(e.target.value)}
                                            rows={3}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50 resize-none"
                                            placeholder="Ex: Cadeira de bebé, muita bagagem extra..."
                                            id="booking-notes"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right - Summary */}
                    <div className="lg:col-span-2">
                        <div className="glass rounded-2xl p-6 sticky top-24">
                            <h3 className="font-semibold mb-4">Resumo do Pedido</h3>

                            {isVehicle && vehicle && <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                                {vehicle.images?.[0]?.url ? (
                                    <div className="w-16 h-12 rounded-lg overflow-hidden ring-1 ring-white/10">
                                        <img src={vehicle.images[0].url} alt={vehicle.model} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                        <Car className="w-6 h-6 text-slate-600" />
                                    </div>
                                )}
                                <div>
                                    <p className="font-medium text-sm">{vehicle.brand} {vehicle.model}</p>
                                    <p className="text-xs text-slate-400">{vehicle.category} · {vehicle.year}</p>
                                </div>
                            </div>
                            }

                            {!isVehicle && service && (
                                <div className="flex justify-between items-center gap-3 mb-4 pb-4 border-b border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-16 h-12 rounded-lg bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden ring-1 ring-white/10">
                                            {isRoundTrip ? (
                                                <div className="absolute inset-0 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                                                    <ArrowLeftRight className="w-6 h-6 text-cyan-400" />
                                                </div>
                                            ) : (
                                                <ArrowLeftRight className="w-6 h-6 text-teal-500" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{service.name}</p>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                <p className="text-xs text-slate-400 font-medium whitespace-nowrap">Até {service.capacity} Passageiros</p>
                                                {isRoundTrip && (
                                                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 tracking-wider uppercase">Ida e Volta</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2 text-sm mb-4">
                                {isVehicle && days > 0 && (
                                    <div className="flex justify-between text-slate-400">
                                        <span>{days} dia{days > 1 ? 's' : ''} × {formatPrice(vehicle?.pricePerDay)} MT</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center py-4 border-t border-white/5 relative group cursor-help transition-all">
                                <span className="font-semibold">{isVehicle ? 'Total' : 'Cotação'}</span>
                                <span className={`text-2xl font-bold ${!isVehicle ? 'text-cyan-400' : 'text-teal-400'}`}>
                                    {isVehicle ? `${formatPrice(totalPrice)} MT` : 'A definir'}
                                </span>
                            </div>

                            {isAuthenticated && (
                                <button
                                    onClick={handleBooking}
                                    disabled={bookVehicle.isPending || bookTransfer.isPending}
                                    className="w-full mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
                                    id="confirm-booking-btn"
                                >
                                    {(bookVehicle.isPending || bookTransfer.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {isVehicle ? 'Confirmar Reserva' : 'Solicitar Cotação'}
                                </button>
                            )}

                            {!isAuthenticated && (
                                <p className="text-center text-sm text-slate-400 mt-4">
                                    Complete a identificação para finalizar
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
