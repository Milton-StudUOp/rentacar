import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../hooks/useAuth';
import { Navigate, Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { Car, ArrowLeftRight, Calendar, Clock, XCircle, Loader2, CheckCircle2, Truck, RotateCcw, Star, MessageSquare, Search, UploadCloud, FileText } from 'lucide-react';
import { formatPrice } from '../lib/utils';

const statusMap: Record<string, { label: string; color: string }> = {
    PENDING: { label: 'Pendente', color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-transparent' },
    CONFIRMED: { label: 'Aguardando Pagamento', color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-transparent' },
    PAID: { label: 'Pago – A confirmar', color: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-transparent' },
    AWAITING_DELIVERY: { label: 'Aguardando Entrega', color: 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-transparent' },
    DELIVERED: { label: 'Aguardando Devolução', color: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-transparent' },
    CANCELLED: { label: 'Cancelada', color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-transparent' },
    COMPLETED: { label: 'Concluída', color: 'text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-transparent' },
};

interface Booking {
    id: number;
    type: 'VEHICLE' | 'TRANSFER';
    status: string;
    totalPrice: number;
    notes?: string;
    rating?: number;
    ratingComment?: string;
    clientArchived: boolean;
    vehicleBooking?: {
        startDate: string;
        endDate: string;
        vehicle: {
            brand: string;
            model: string;
            images: { url: string }[];
        };
    };
    transferBooking?: {
        origin: string;
        destination: string;
        travelDate: string;
        travelTime: string;
        isRoundTrip: boolean;
        returnDate?: string;
        returnTime?: string;
    };
    payment?: {
        reference?: string;
    };
}

export default function MyBookings() {
    const { isAuthenticated, loading } = useAuth();
    const queryClient = useQueryClient();

    const [confirmPay, setConfirmPay] = useState<number | null>(null);
    const [receiptFile, setReceiptFile] = useState<File | null>(null);
    const [confirmCancel, setConfirmCancel] = useState<number | null>(null);

    const [ratings, setRatings] = useState<Record<number, { stars: number; comment: string }>>({});

    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');
    const [historySearch, setHistorySearch] = useState('');

    const { data: bookings, isLoading } = useQuery<Booking[]>({
        queryKey: ['myBookings', activeTab],
        queryFn: () => api.get(`/bookings/my?archived=${activeTab === 'history'}`).then(r => r.data),
        enabled: isAuthenticated,
    });

    let displayedBookings = bookings || [];
    if (activeTab === 'history') {
        if (!historySearch.trim()) {
            displayedBookings = [];
        } else {
            const term = historySearch.toLowerCase();
            displayedBookings = displayedBookings.filter((b: Booking) => {
                const model = b.vehicleBooking?.vehicle?.model?.toLowerCase() || '';
                const brand = b.vehicleBooking?.vehicle?.brand?.toLowerCase() || '';
                const route = `${b.transferBooking?.origin || ''} ${b.transferBooking?.destination || ''}`.toLowerCase();
                return model.includes(term) || brand.includes(term) || route.includes(term) || String(b.id) === term;
            });
        }
    }

    const cancelMutation = useMutation({
        mutationFn: (id: number) => api.put(`/bookings/${id}/cancel`),
        onSuccess: () => {
            toast.success('Reserva cancelada.');
            setConfirmCancel(null);
            queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        },
        onError: (err: { response?: { data?: { message?: string } } }) => {
            toast.error(err.response?.data?.message || 'Erro ao cancelar');
            setConfirmCancel(null);
        },
    });

    const uploadReceiptMutation = useMutation({
        mutationFn: async ({ id, file }: { id: number; file: File }) => {
            const formData = new FormData();
            formData.append('file', file);
            const uploadRes = await api.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            await api.post(`/bookings/${id}/receipt`, { receiptUrl: uploadRes.data.url });
            return api.put(`/bookings/${id}/mark-paid`);
        },
        onSuccess: () => {
            toast.success('Comprovativo enviado! O administrador irá verificar em breve.');
            setConfirmPay(null);
            setReceiptFile(null);
            queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        },
        onError: (err: { response?: { data?: { message?: string } } }) => {
            toast.error(err.response?.data?.message || 'Erro ao enviar comprovativo');
        },
    });

    const rateMutation = useMutation({
        mutationFn: ({ id, rating, comment }: { id: number; rating: number; comment?: string }) =>
            api.put(`/bookings/${id}/rate`, { rating, comment }),
        onSuccess: () => {
            toast.success('Avaliação enviada com sucesso! Obrigado.');
            queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        },
        onError: (err: { response?: { data?: { message?: string } } }) => toast.error(err.response?.data?.message || 'Erro ao enviar avaliação'),
    });

    const archiveMutation = useMutation({
        mutationFn: (id: number) => api.put(`/bookings/${id}/archive`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myBookings'] });
        },
        onError: (err: { response?: { data?: { message?: string } } }) => toast.error(err.response?.data?.message || 'Erro ao arquivar'),
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-teal-600 dark:text-teal-400" />
        </div>
    );
    if (!isAuthenticated) return <Navigate to="/" />;

    return (
        <div className="min-h-screen py-8 transition-colors duration-300">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white transition-colors">Minhas Reservas</h1>

                <div className="flex gap-8 mb-8 border-b border-slate-200 dark:border-slate-800 transition-colors">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'active' ? 'border-cyan-600 dark:border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                        Reservas Activas
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-4 px-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'history' ? 'border-cyan-600 dark:border-cyan-500 text-cyan-600 dark:text-cyan-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'}`}
                    >
                        Histórico
                    </button>
                </div>

                {activeTab === 'history' && (
                    <div className="mb-6 relative">
                        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400 dark:text-slate-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Pesquisar histórico por viatura, datas ou código..."
                            value={historySearch}
                            onChange={e => setHistorySearch(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
                        />
                    </div>
                )}

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="animate-pulse bg-slate-200 dark:bg-slate-800 h-32 rounded-2xl transition-colors" />)}
                    </div>
                ) : !displayedBookings?.length ? (
                    <div className="text-center py-20 bg-white dark:bg-[#1a1d2e] rounded-3xl border border-slate-200 dark:border-white/5 transition-colors">
                        <Calendar className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4 transition-colors" />
                        <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white transition-colors">
                            {activeTab === 'history' && !historySearch.trim()
                                ? 'Pesquise para ver o histórico'
                                : 'Nenhuma reserva encontrada'}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 mb-6 transition-colors">
                            {activeTab === 'history' && !historySearch.trim()
                                ? 'Use a barra de pesquisa acima para procurar reservas antigas.'
                                : 'Ainda não tem reservas com estes critérios.'}
                        </p>
                        {activeTab === 'active' && (
                            <Link to="/vehicles" className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold flex items-center justify-center gap-2 max-w-max mx-auto shadow-lg shadow-teal-500/20 hover:from-teal-600 hover:to-cyan-600 dark:hover:from-teal-400 dark:hover:to-cyan-400 transition-all">
                                <Car className="w-5 h-5" /> Explorar Viaturas
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayedBookings.map((b: Booking) => {
                            const status = statusMap[b.status] || statusMap.PENDING;
                            const isVehicle = b.type === 'VEHICLE';
                            return (
                                <div key={b.id} className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md rounded-2xl p-6 shadow-md hover:shadow-xl dark:shadow-none transition-all">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                        <div className="flex items-start gap-4">
                                            {isVehicle && b.vehicleBooking?.vehicle?.images?.[0]?.url ? (
                                                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-1 ring-slate-200 dark:ring-white/10 transition-colors">
                                                    <img src={b.vehicleBooking.vehicle.images[0].url} alt={b.vehicleBooking.vehicle.model} className="w-full h-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shrink-0 transition-colors">
                                                    {isVehicle
                                                        ? <Car className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                                                        : <ArrowLeftRight className="w-6 h-6 text-slate-400 dark:text-slate-500" />}
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase ${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                    <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 transition-colors">#{b.id}</span>
                                                </div>
                                                {isVehicle ? (
                                                    <>
                                                        <h3 className="font-semibold text-slate-900 dark:text-white transition-colors">
                                                            {b.vehicleBooking?.vehicle?.brand} {b.vehicleBooking?.vehicle?.model}
                                                        </h3>
                                                        <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-1 transition-colors">
                                                            <Calendar className="w-3 h-3" />
                                                            {new Date(b.vehicleBooking?.startDate || '').toLocaleDateString('pt-MZ')} —{' '}
                                                            {new Date(b.vehicleBooking?.endDate || '').toLocaleDateString('pt-MZ')}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-semibold text-slate-900 dark:text-white transition-colors">
                                                                {b.transferBooking?.origin} → {b.transferBooking?.destination}
                                                            </h3>
                                                            {b.transferBooking?.isRoundTrip && (
                                                                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-50 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 tracking-wider uppercase border border-cyan-200 dark:border-cyan-500/30 transition-colors">Ida e Volta</span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col gap-1 mt-2 lg:flex-row lg:items-center lg:gap-3 transition-colors">
                                                            <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 transition-colors">
                                                                <span className="text-xs font-semibold text-teal-600 dark:text-teal-400 uppercase tracking-widest w-8 transition-colors">Ida:</span>
                                                                <Calendar className="w-3.5 h-3.5 -mt-0.5" />
                                                                {new Date(b.transferBooking?.travelDate || '').toLocaleDateString('pt-MZ')}
                                                                <Clock className="w-3.5 h-3.5 ml-1 -mt-0.5" />
                                                                {b.transferBooking?.travelTime}
                                                            </p>
                                                            {b.transferBooking?.isRoundTrip && b.transferBooking?.returnDate && (
                                                                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2 transition-colors">
                                                                    <span className="hidden lg:inline text-slate-300 dark:text-slate-600 transition-colors">|</span>
                                                                    <span className="text-xs font-semibold text-cyan-600 dark:text-cyan-400 uppercase tracking-widest w-12 lg:w-auto transition-colors">Volta:</span>
                                                                    <Calendar className="w-3.5 h-3.5 -mt-0.5" />
                                                                    {new Date(b.transferBooking.returnDate).toLocaleDateString('pt-MZ')}
                                                                    <Clock className="w-3.5 h-3.5 ml-1 -mt-0.5" />
                                                                    {b.transferBooking.returnTime}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="text-right">
                                                <div className="text-xl font-bold text-teal-600 dark:text-teal-400 transition-colors">
                                                    {b.type === 'TRANSFER' && b.totalPrice === 0 ? (
                                                        <span className="text-amber-500 dark:text-amber-400 italic text-base transition-colors">A definir</span>
                                                    ) : (
                                                        `${formatPrice(b.totalPrice)} MT`
                                                    )}
                                                </div>
                                            </div>

                                            {(b.status === 'PENDING' || b.status === 'CONFIRMED') && (
                                                confirmCancel === b.id ? (
                                                    <div className="flex items-center gap-2 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-3 py-2 transition-colors">
                                                        <span className="text-xs text-red-600 dark:text-red-300 transition-colors">Cancelar reserva?</span>
                                                        <button
                                                            onClick={() => cancelMutation.mutate(b.id)}
                                                            disabled={cancelMutation.isPending}
                                                            className="px-2 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-500 dark:bg-red-500 dark:hover:bg-red-400 transition-colors"
                                                        >
                                                            {cancelMutation.isPending ? '...' : 'Sim'}
                                                        </button>
                                                        <button
                                                            onClick={() => setConfirmCancel(null)}
                                                            className="px-2 py-1 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                                                        >
                                                            Não
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setConfirmCancel(b.id)}
                                                        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                                                    >
                                                        <XCircle className="w-4 h-4" />
                                                        Cancelar
                                                    </button>
                                                )
                                            )}
                                        </div>
                                    </div>

                                    {b.status === 'CONFIRMED' && (
                                        <div className="mt-4 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/5 border border-blue-200 dark:border-blue-500/20 transition-colors">
                                            <h4 className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2 transition-colors">
                                                <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-[10px] transition-colors">💳</span>
                                                Instruções de Pagamento
                                            </h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 transition-colors">
                                                A sua reserva foi confirmada! Para garantir a viatura, efectue uma transferência bancária para a conta abaixo.{' '}
                                                <strong className="text-slate-900 dark:text-white transition-colors">Use o código de referência como descrição/motivo da transferência.</strong>
                                            </p>
                                            <div className="grid sm:grid-cols-2 gap-4">
                                                <div className="space-y-1.5 text-sm font-mono text-slate-500 dark:text-slate-400 transition-colors">
                                                    <p>Banco: <span className="text-slate-900 dark:text-slate-200 transition-colors">Millennium BIM</span></p>
                                                    <p>Titular: <span className="text-slate-900 dark:text-slate-200 transition-colors">Rent-a-Car MZ Lda</span></p>
                                                    <p>NIB: <span className="text-slate-900 dark:text-slate-200 transition-colors">0001 0000 0000 0000 000 00</span></p>
                                                </div>
                                                <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl text-center border border-slate-200 dark:border-slate-800 transition-colors">
                                                    <span className="block text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1 transition-colors">Referência de Pagamento</span>
                                                    <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-[0.3em] transition-colors">
                                                        {b.payment?.reference || '···'}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/5 transition-colors">
                                                {confirmPay === b.id ? (
                                                    <div className="flex flex-col gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors">
                                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors">
                                                            Anexe o seu comprovativo de pagamento (PDF, JPG, PNG)
                                                        </p>

                                                        <div className="relative group">
                                                            <input
                                                                type="file"
                                                                accept="image/*,application/pdf"
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                                                                disabled={uploadReceiptMutation.isPending}
                                                            />
                                                            <div className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl transition-all ${receiptFile ? 'border-cyan-500/50 bg-cyan-50 dark:bg-cyan-500/5' : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50 group-hover:border-slate-400 dark:group-hover:border-slate-500'}`}>
                                                                {receiptFile ? (
                                                                    <>
                                                                        <FileText className="w-8 h-8 text-cyan-500 dark:text-cyan-400 mb-2 transition-colors" />
                                                                        <p className="text-sm font-medium text-slate-900 dark:text-white text-center truncate w-full px-4 transition-colors">{receiptFile.name}</p>
                                                                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 transition-colors">{(receiptFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <UploadCloud className="w-8 h-8 text-slate-400 dark:text-slate-500 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors mb-2" />
                                                                        <p className="text-sm text-slate-500 dark:text-slate-400 text-center transition-colors">Clique ou arraste o ficheiro para aqui</p>
                                                                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 transition-colors">Máx. 5MB</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="flex gap-2 justify-end">
                                                            <button
                                                                onClick={() => { setConfirmPay(null); setReceiptFile(null); }}
                                                                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 text-sm hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                                                                disabled={uploadReceiptMutation.isPending}
                                                            >
                                                                Cancelar
                                                            </button>
                                                            <button
                                                                onClick={() => uploadReceiptMutation.mutate({ id: b.id, file: receiptFile! })}
                                                                disabled={!receiptFile || uploadReceiptMutation.isPending}
                                                                className="px-6 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                                            >
                                                                {uploadReceiptMutation.isPending
                                                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> A enviar...</>
                                                                    : <><UploadCloud className="w-4 h-4" /> Enviar Comprovativo</>
                                                                }
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                                                        <p className="text-xs text-slate-500 dark:text-slate-500 transition-colors">
                                                            Após efectuar o pagamento, anexe o comprovativo para verificação.
                                                        </p>
                                                        <button
                                                            onClick={() => setConfirmPay(b.id)}
                                                            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-semibold hover:from-emerald-600 hover:to-green-600 dark:hover:from-emerald-400 dark:hover:to-green-400 transition-all shadow-lg shadow-emerald-500/25 shrink-0"
                                                        >
                                                            💳 Anexar Comprovativo
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    {b.status === 'PAID' && (
                                        <div className="mt-4 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-500/5 border border-yellow-200 dark:border-yellow-500/20 flex items-start gap-3 transition-colors">
                                            <CheckCircle2 className="w-5 h-5 text-yellow-500 dark:text-yellow-400 shrink-0 mt-0.5 transition-colors" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-yellow-700 dark:text-yellow-400 transition-colors">Pagamento Enviado</h4>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 transition-colors">
                                                    {b.payment?.reference && (
                                                        <>Referência: <span className="font-mono text-slate-700 dark:text-slate-300 transition-colors">{b.payment.reference}</span> · </>
                                                    )}
                                                    O administrador está a verificar o seu pagamento. Se for rejeitado, a reserva volta ao estado anterior para nova tentativa.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {b.status === 'AWAITING_DELIVERY' && (
                                        <div className="mt-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 flex items-start gap-3 transition-colors">
                                            <CheckCircle2 className="w-5 h-5 text-orange-500 dark:text-orange-400 shrink-0 mt-0.5 transition-colors" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-orange-700 dark:text-orange-400 transition-colors">Pagamento Confirmado</h4>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 transition-colors">
                                                    O seu pagamento foi verificado. A viatura será entregue em breve pelo nosso serviço.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {b.status === 'DELIVERED' && (
                                        <div className="mt-4 p-4 rounded-xl bg-purple-50 dark:bg-purple-500/5 border border-purple-200 dark:border-purple-500/20 flex items-start gap-3 transition-colors">
                                            <Truck className="w-5 h-5 text-purple-500 dark:text-purple-400 shrink-0 mt-0.5 transition-colors" />
                                            <div>
                                                <h4 className="text-sm font-semibold text-purple-700 dark:text-purple-400 transition-colors">Viatura Entregue</h4>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 transition-colors">
                                                    A viatura está consigo. Quando devolver, o administrador irá confirmar a devolução e encerrar a reserva.
                                                </p>
                                            </div>
                                        </div>
                                    )}

                                    {b.status === 'COMPLETED' && (
                                        <div className="mt-4 p-5 rounded-xl bg-cyan-50 dark:bg-cyan-500/5 border border-cyan-200 dark:border-cyan-500/20 transition-colors">
                                            <div className="flex items-start gap-3 mb-4">
                                                <RotateCcw className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5 transition-colors" />
                                                <div>
                                                    <h4 className="text-sm font-semibold text-cyan-700 dark:text-cyan-400 transition-colors">Reserva Concluída</h4>
                                                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 transition-colors">
                                                        {b.rating
                                                            ? 'Obrigado por utilizar os nossos serviços e pela sua avaliação!'
                                                            : 'Viatura devolvida com sucesso. Obrigado por utilizar os nossos serviços! Por favor, avalie a sua experiência.'
                                                        }
                                                    </p>
                                                </div>
                                            </div>

                                            {b.rating ? (
                                                <div className="bg-white dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 transition-colors">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`w-5 h-5 ${(b.rating || 0) >= star ? 'text-yellow-400 fill-current' : 'text-slate-300 dark:text-slate-700 transition-colors'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                    {b.ratingComment && (
                                                        <div className="relative">
                                                            <MessageSquare className="absolute top-3 left-3 w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors" />
                                                            <div className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-3 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                                                                {b.ratingComment}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : activeTab === 'active' ? (
                                                <div className="bg-white dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700/50 transition-colors">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        {[1, 2, 3, 4, 5].map((star) => {
                                                            const currentRating = ratings[b.id]?.stars || 0;
                                                            return (
                                                                <button
                                                                    key={star}
                                                                    onClick={() => setRatings(prev => ({ ...prev, [b.id]: { ...prev[b.id], stars: star } }))}
                                                                    className={`p-1 transition-colors ${star <= currentRating ? 'text-yellow-400' : 'text-slate-300 dark:text-slate-600 hover:text-yellow-400/50'}`}
                                                                >
                                                                    <Star className="w-6 h-6 fill-current" />
                                                                </button>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="relative mb-4">
                                                        <MessageSquare className="absolute top-3 left-3 w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors" />
                                                        <textarea
                                                            value={ratings[b.id]?.comment || ''}
                                                            onChange={(e) => setRatings(prev => ({ ...prev, [b.id]: { ...prev[b.id], comment: e.target.value } }))}
                                                            placeholder="Deixe um comentário (opcional)..."
                                                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none h-20 transition-colors"
                                                        />
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => rateMutation.mutate({
                                                                id: b.id,
                                                                rating: ratings[b.id]?.stars || 5,
                                                                comment: ratings[b.id]?.comment
                                                            })}
                                                            disabled={rateMutation.isPending}
                                                            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2 flex-1"
                                                        >
                                                            {rateMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Avaliar e Fechar'}
                                                        </button>
                                                        <button
                                                            onClick={() => archiveMutation.mutate(b.id)}
                                                            disabled={archiveMutation.isPending}
                                                            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors flex-1"
                                                        >
                                                            Apenas Fechar
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
