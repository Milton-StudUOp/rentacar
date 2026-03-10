import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Search, Loader2, Building2, Mail, Car, Save, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface CorporateRequest {
    id: number;
    companyName: string;
    contactName: string;
    phone: string;
    email: string;
    vehicleCategory: string;
    expectedDuration: number;
    expectedPeriod: string;
    status: string;
    notes: string | null;
    createdAt: string;
    vehicle?: {
        brand: string;
        model: string;
        category: string;
        images: Array<{ url: string }>;
    };
    quantity?: number;
    periodDuration?: number;
    periodType?: string;
}

export default function AdminCorporateRequests() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<CorporateRequest | null>(null);
    const [statusFilter, setStatusFilter] = useState('ALL');

    const { data: requests, isLoading } = useQuery({
        queryKey: ['admin-corporate-requests'],
        queryFn: () => api.get('/corporate-requests').then(res => res.data),
    });

    const updateRequest = useMutation({
        mutationFn: (data: { id: number; status: string; notes?: string }) => api.put(`/corporate-requests/${data.id}`, { status: data.status, notes: data.notes }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-corporate-requests'] });
            toast.success('Pedido atualizado com sucesso');
            setSelectedRequest(null);
        },
        onError: () => toast.error('Erro ao atualizar pedido'),
    });

    const deleteRequest = useMutation({
        mutationFn: (id: number) => api.delete(`/corporate-requests/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-corporate-requests'] });
            toast.success('Pedido eliminado');
            setSelectedRequest(null);
        },
        onError: () => toast.error('Erro ao eliminar pedido'),
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'bg-amber-500/20 text-amber-500 border border-amber-500/20';
            case 'QUOTED': return 'bg-blue-500/20 text-blue-500 border border-blue-500/20';
            case 'COMPLETED': return 'bg-green-500/20 text-green-500 border border-green-500/20';
            case 'REJECTED': return 'bg-red-500/20 text-red-500 border border-red-500/20';
            default: return 'bg-slate-500/20 text-slate-300 border border-slate-500/20';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Pendente';
            case 'QUOTED': return 'Cotação Enviada';
            case 'COMPLETED': return 'Concluído';
            case 'REJECTED': return 'Rejeitado';
            default: return status;
        }
    };

    const getPeriodLabel = (period?: string) => {
        if (!period) return '';
        switch (period) {
            case 'DAYS': return 'Dias';
            case 'MONTHS': return 'Meses';
            case 'YEARS': return 'Anos';
            default: return period;
        }
    };

    // Filter Logic
    const filteredRequests = requests?.filter((req: CorporateRequest) => {
        const matchesSearch =
            req.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || req.status === statusFilter;
        return matchesSearch && matchesStatus;
    }) || [];

    if (isLoading) {
        return <div className="p-8 flex items-center justify-center"><Loader2 className="w-8 h-8 text-teal-500 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
                <div className="animate-fade-in-up">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">
                        Corporate & <span className="gradient-text">Frota</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg">Gestão de leads e cotações para empresas</p>
                </div>
            </div>

            {/* Quick Stats & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div onClick={() => setStatusFilter('ALL')} className={`cursor-pointer group p-5 rounded-2xl border transition-all duration-300 ${statusFilter === 'ALL' ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-indigo-500/30'}`}>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Todos</p>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{requests?.length || 0}</p>
                        <Building2 className={`w-8 h-8 ${statusFilter === 'ALL' ? 'text-indigo-400' : 'text-slate-300 dark:text-slate-700'} opacity-50 group-hover:scale-110 transition-transform`} />
                    </div>
                </div>
                <div onClick={() => setStatusFilter('PENDING')} className={`cursor-pointer group p-5 rounded-2xl border transition-all duration-300 ${statusFilter === 'PENDING' ? 'bg-amber-500/10 border-amber-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-amber-500/30'}`}>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pendentes</p>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{requests?.filter((r: CorporateRequest) => r.status === 'PENDING').length || 0}</p>
                        <Loader2 className={`w-8 h-8 ${statusFilter === 'PENDING' ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'} opacity-50 group-hover:scale-110 transition-transform`} />
                    </div>
                </div>

                <div onClick={() => setStatusFilter('QUOTED')} className={`cursor-pointer group p-5 rounded-2xl border transition-all duration-300 ${statusFilter === 'QUOTED' ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-blue-500/30'}`}>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Cotados</p>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{requests?.filter((r: CorporateRequest) => r.status === 'QUOTED').length || 0}</p>
                        <Mail className={`w-8 h-8 ${statusFilter === 'QUOTED' ? 'text-blue-400' : 'text-slate-300 dark:text-slate-700'} opacity-50 group-hover:scale-110 transition-transform`} />
                    </div>
                </div>

                <div onClick={() => setStatusFilter('COMPLETED')} className={`cursor-pointer group p-5 rounded-2xl border transition-all duration-300 ${statusFilter === 'COMPLETED' ? 'bg-green-500/10 border-green-500/30' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-white/10 hover:border-green-500/30'}`}>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Convertidos</p>
                    <div className="flex items-end justify-between mt-2">
                        <p className="text-3xl font-black text-slate-900 dark:text-white">{requests?.filter((r: CorporateRequest) => r.status === 'COMPLETED').length || 0}</p>
                        <Save className={`w-8 h-8 ${statusFilter === 'COMPLETED' ? 'text-green-400' : 'text-slate-300 dark:text-slate-700'} opacity-50 group-hover:scale-110 transition-transform`} />
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Procurar por empresa ou contacto..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl pl-12 pr-4 py-4 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-cyan-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* Data Source Display */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl shadow-xl overflow-hidden transition-colors">
                <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                                <th className="py-5 px-6 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Empresa</th>
                                <th className="py-5 px-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Viatura</th>
                                <th className="py-5 px-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Plano</th>
                                <th className="py-5 px-4 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] text-center">Estado</th>
                                <th className="py-5 px-6 text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {filteredRequests.map((req: CorporateRequest) => (
                                <tr key={req.id} className="group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400 shrink-0">
                                                <Building2 className="w-5 h-5" />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-bold text-slate-900 dark:text-white truncate">{req.companyName}</p>
                                                <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">{req.contactName}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Car className="w-4 h-4 text-cyan-500" /> {req.vehicle?.brand} {req.vehicle?.model}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-600 dark:text-slate-300">
                                        <div className="flex flex-col">
                                            <span className="font-bold">{req.quantity} uni.</span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{req.periodDuration} {getPeriodLabel(req.periodType)}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${getStatusColor(req.status)}`}>
                                            {getStatusLabel(req.status)}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button onClick={() => setSelectedRequest(req)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-teal-500 hover:bg-teal-500/10 transition-all border border-transparent hover:border-teal-500/20 shadow-sm">
                                            <Search className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="lg:hidden divide-y divide-slate-100 dark:divide-white/5">
                    {filteredRequests.map((req: CorporateRequest) => (
                        <div key={req.id} onClick={() => setSelectedRequest(req)} className="p-5 flex flex-col gap-4 hover:bg-slate-50 dark:hover:bg-white/5 active:bg-slate-100 transition-colors cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-600 dark:text-teal-400">
                                        <Building2 className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-slate-900 dark:text-white truncate max-w-[180px]">{req.companyName}</h3>
                                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{req.contactName}</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${getStatusColor(req.status)}`}>
                                    {getStatusLabel(req.status)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-400 px-1">
                                <span className="flex items-center gap-1.5"><Car className="w-3.5 h-3.5 text-cyan-500" /> {req.vehicle?.model}</span>
                                <span>{req.quantity} Viaturas</span>
                                <span className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded text-[10px]">{req.periodDuration} {getPeriodLabel(req.periodType)}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredRequests.length === 0 && (
                    <div className="p-20 text-center text-slate-500">
                        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="text-lg font-bold text-slate-900 dark:text-white mb-1">Nenhum pedido encontrado</p>
                        <p className="text-sm">Tente redefinir os seus termos de pesquisa.</p>
                    </div>
                )}
            </div>

            {/* Modal de Gestão */}
            {selectedRequest && (
                <CorporateRequestModal
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onUpdate={(status: string, notes?: string) => updateRequest.mutate({ id: selectedRequest.id, status, notes })}
                    onDelete={() => { if (confirm('Eliminar este pedido permanentemente?')) deleteRequest.mutate(selectedRequest.id); }}
                />
            )}
        </div>
    );
}

interface ModalProps {
    request: CorporateRequest;
    onClose: () => void;
    onUpdate: (status: string, notes?: string) => void;
    onDelete: () => void;
}

function CorporateRequestModal({ request, onClose, onUpdate, onDelete }: ModalProps) {
    const [notes, setNotes] = useState(request.notes || '');
    const [status, setStatus] = useState(request.status);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fade-in transition-all">
            <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh] transition-colors">

                {/* Header Decoration */}
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 pointer-events-none" />

                {/* Modal Header */}
                <div className="relative flex items-center justify-between p-8 border-b border-slate-100 dark:border-white/5 shrink-0 z-10 transition-colors">
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                            <Building2 className="w-7 h-7 text-teal-600 dark:text-teal-400" /> {request.companyName}
                        </h2>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" /> Submetido em {new Date(request.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10 shadow-sm">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="relative p-8 overflow-y-auto space-y-8 z-10 custom-scrollbar transition-colors">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                Viatura & Plano <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                            </h3>
                            {request.vehicle && (
                                <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-4 border border-slate-200 dark:border-white/5 flex gap-4 transition-colors">
                                    {request.vehicle.images?.[0]?.url ? (
                                        <img src={api.defaults.baseURL?.replace('/api', '') + request.vehicle.images[0].url} className="w-20 h-20 object-cover rounded-xl shadow-lg border border-slate-200 dark:border-white/10" alt="Vehicle" />
                                    ) : (
                                        <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center border border-white/10"><Car className="w-8 h-8 text-slate-500" /></div>
                                    )}
                                    <div className="min-w-0">
                                        <p className="font-black text-slate-900 dark:text-white text-lg">{request.vehicle.brand} {request.vehicle.model}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-cyan-500/10 text-[10px] font-black uppercase rounded text-cyan-600 dark:text-cyan-400">{request.vehicle.category}</span>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-4 border border-slate-200 dark:border-white/5 transition-colors">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Unidades</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">{request.quantity} <span className="text-xs font-medium text-slate-500">uni.</span></p>
                                </div>
                                <div className="bg-slate-50 dark:bg-black/20 rounded-2xl p-4 border border-slate-200 dark:border-white/5 transition-colors">
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Duração</p>
                                    <p className="text-xl font-black text-slate-900 dark:text-white">{request.periodDuration} <span className="text-xs font-medium text-slate-500">{request.periodType}</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                Contactos Diretos <div className="h-px flex-1 bg-slate-100 dark:bg-white/5" />
                            </h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 transition-colors">
                                    <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest">Email Corporativo</p>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{request.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-black/20 rounded-xl border border-slate-200 dark:border-white/5 transition-colors">
                                    <div className="min-w-0 px-2">
                                        <p className="text-[9px] text-slate-500 font-black uppercase tracking-widest truncate">Responsável: {request.contactName}</p>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">Tel: {request.phone}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-black/10 rounded-3xl p-6 border border-slate-200 dark:border-white/5 space-y-6 transition-colors">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1 transition-colors">Estado da Negociação</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-3.5 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 appearance-none shadow-sm transition-all"
                                >
                                    <option value="PENDING">Pendente (Recebido)</option>
                                    <option value="QUOTED">Cotação Enviada</option>
                                    <option value="COMPLETED">Negócio Fechado</option>
                                    <option value="REJECTED">Rejeitado/Cancelado</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1 transition-colors">Notas Estratégicas (CRM)</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    rows={4}
                                    placeholder="Descreva aqui o histórico do contacto com esta empresa..."
                                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none shadow-sm transition-all"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="relative p-7 border-t border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-black/30 flex flex-wrap-reverse gap-4 justify-end items-center shrink-0 z-10 transition-colors">
                    <button
                        onClick={onDelete}
                        className="mr-auto flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-red-500/10 text-red-500 hover:bg-red-500/10 font-bold transition-all group active:scale-95"
                    >
                        <Trash2 className="w-5 h-5" /> Eliminar Lead
                    </button>

                    <button onClick={onClose} className="px-7 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-white/5 font-bold transition-all active:scale-95">
                        Cancelar
                    </button>
                    <button
                        onClick={() => onUpdate(status, notes)}
                        className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:scale-105 active:scale-95 text-white font-black flex items-center gap-3 shadow-xl shadow-teal-500/20 hover:shadow-cyan-500/30 transition-all"
                    >
                        <Save className="w-5 h-5" /> Guardar CRM
                    </button>
                </div>
            </div>
        </div>
    );
}
