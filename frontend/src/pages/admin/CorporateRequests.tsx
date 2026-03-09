import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { Search, Loader2, Building2, User, Phone, Mail, Car, Save, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminCorporateRequests() {
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
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

    const getPeriodLabel = (period: string) => {
        switch (period) {
            case 'DAYS': return 'Dias';
            case 'MONTHS': return 'Meses';
            case 'YEARS': return 'Anos';
            default: return period;
        }
    };

    // Filter Logic
    const filteredRequests = requests?.filter((req: any) => {
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
        <div className="p-4 md:p-8 pb-24 md:pb-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">Corporate & Frota</h1>
                    <p className="text-slate-400 mt-1">Gestão de leads e cotações para empresas</p>
                </div>
            </div>

            {/* Quick Stats & Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div onClick={() => setStatusFilter('ALL')} className={`cursor-pointer glass rounded-2xl p-5 border-l-4 ${statusFilter === 'ALL' ? 'border-l-indigo-500 bg-white/10' : 'border-l-slate-700 hover:bg-white/5'} transition-colors`}>
                    <p className="text-sm text-slate-400 font-medium">Todos</p>
                    <p className="text-2xl font-bold text-white mt-1">{requests?.length || 0}</p>
                </div>
                <div onClick={() => setStatusFilter('PENDING')} className={`cursor-pointer glass rounded-2xl p-5 border-l-4 ${statusFilter === 'PENDING' ? 'border-l-amber-500 bg-amber-500/10' : 'border-l-slate-700 hover:bg-amber-500/5'} transition-colors`}>
                    <p className="text-sm text-slate-400 font-medium">Pendentes</p>
                    <p className="text-2xl font-bold text-white mt-1">{requests?.filter((r: any) => r.status === 'PENDING').length || 0}</p>
                </div>
                <div onClick={() => setStatusFilter('QUOTED')} className={`cursor-pointer glass rounded-2xl p-5 border-l-4 ${statusFilter === 'QUOTED' ? 'border-l-blue-500 bg-blue-500/10' : 'border-l-slate-700 hover:bg-blue-500/5'} transition-colors`}>
                    <p className="text-sm text-slate-400 font-medium">Cotados</p>
                    <p className="text-2xl font-bold text-white mt-1">{requests?.filter((r: any) => r.status === 'QUOTED').length || 0}</p>
                </div>
                <div onClick={() => setStatusFilter('COMPLETED')} className={`cursor-pointer glass rounded-2xl p-5 border-l-4 ${statusFilter === 'COMPLETED' ? 'border-l-green-500 bg-green-500/10' : 'border-l-slate-700 hover:bg-green-500/5'} transition-colors`}>
                    <p className="text-sm text-slate-400 font-medium">Convertidos</p>
                    <p className="text-2xl font-bold text-white mt-1">{requests?.filter((r: any) => r.status === 'COMPLETED').length || 0}</p>
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
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cyan-500/50 transition-colors"
                    />
                </div>
            </div>

            {/* Grid of Leads */}
            {filteredRequests.length === 0 ? (
                <div className="glass rounded-3xl p-12 text-center text-slate-400">
                    <Building2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-medium text-white mb-2">Nenhum pedido encontrado</p>
                    <p>Experimente pesquisar com outros termos ou remover os filtros.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRequests.map((req: any) => (
                        <div key={req.id} onClick={() => setSelectedRequest(req)} className="glass rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-500/30 transition-all group flex flex-col h-full bg-slate-900/50">

                            {/* Card Header (Vehicle Background) */}
                            <div className="h-32 relative bg-black/40">
                                {req.vehicle?.images?.[0]?.url && (
                                    <>
                                        <img src={api.defaults.baseURL?.replace('/api', '') + req.vehicle.images[0].url} alt="Vehicle" className="w-full h-full object-cover opacity-50 grayscale-[20%] group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent" />
                                    </>
                                )}
                                <div className="absolute top-4 right-4">
                                    <span className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(req.status)} backdrop-blur-md`}>
                                        {getStatusLabel(req.status)}
                                    </span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-white font-bold truncate flex items-center gap-2"><Car className="w-4 h-4 shrink-0 text-cyan-400" /> {req.vehicle?.brand} {req.vehicle?.model}</p>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-5 flex-1 flex flex-col">
                                <h3 className="text-xl font-bold text-white mb-4 line-clamp-1">{req.companyName}</h3>

                                <div className="space-y-3 mb-6 flex-1">
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0"><User className="w-4 h-4 text-slate-400" /></div>
                                        <span className="truncate">{req.contactName}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Phone className="w-4 h-4 text-slate-400" /></div>
                                        <span>{req.phone}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-slate-300">
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Mail className="w-4 h-4 text-slate-400" /></div>
                                        <span className="truncate">{req.email}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-auto">
                                    <div className="bg-white/5 rounded-lg p-2.5 text-center">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Quantidade</p>
                                        <p className="text-white font-semibold">{req.quantity} uni.</p>
                                    </div>
                                    <div className="bg-white/5 rounded-lg p-2.5 text-center">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Duração</p>
                                        <p className="text-white font-semibold">{req.periodDuration} {getPeriodLabel(req.periodType)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de Gestão */}
            {selectedRequest && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
                    <div className="relative w-full max-w-3xl glass border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5 bg-white/5">
                            <div>
                                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                    <Building2 className="w-6 h-6 text-cyan-400" /> {selectedRequest.companyName}
                                </h2>
                                <p className="text-sm text-slate-400 mt-1">Submetido a {new Date(selectedRequest.createdAt).toLocaleString('pt-PT')}</p>
                            </div>
                            <button onClick={() => setSelectedRequest(null)} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 overflow-y-auto space-y-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Informação da Viatura Pedida */}
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                    <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-4">Interesse Mapeado</h3>
                                    {selectedRequest.vehicle && (
                                        <div className="flex gap-4">
                                            {selectedRequest.vehicle.images?.[0]?.url ? (
                                                <img src={api.defaults.baseURL?.replace('/api', '') + selectedRequest.vehicle.images[0].url} className="w-24 h-24 object-cover rounded-xl border border-white/10" />
                                            ) : (
                                                <div className="w-24 h-24 bg-white/5 rounded-xl flex items-center justify-center border border-white/10"><Car className="w-8 h-8 text-slate-500" /></div>
                                            )}
                                            <div>
                                                <p className="font-bold text-white text-lg">{selectedRequest.vehicle.brand} {selectedRequest.vehicle.model}</p>
                                                <span className="inline-block mt-2 px-2.5 py-1 bg-white/10 text-xs font-semibold rounded-md text-slate-300">{selectedRequest.vehicle.category}</span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div>
                                            <label className="text-xs text-slate-500 uppercase font-bold">Unidades Escudo</label>
                                            <p className="text-white font-medium text-lg mt-0.5">{selectedRequest.quantity} <span className="text-sm text-slate-400">viaturas</span></p>
                                        </div>
                                        <div>
                                            <label className="text-xs text-slate-500 uppercase font-bold">Período Previsto</label>
                                            <p className="text-white font-medium text-lg mt-0.5">{selectedRequest.periodDuration} <span className="text-sm text-slate-400">{getPeriodLabel(selectedRequest.periodType)}</span></p>
                                        </div>
                                    </div>
                                </div>

                                {/* Dados da Empresa */}
                                <div className="bg-white/5 rounded-2xl p-5 border border-white/5 space-y-4">
                                    <h3 className="text-sm font-bold text-amber-500 uppercase tracking-wider mb-2">Dados de Contacto</h3>

                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><User className="w-5 h-5 text-slate-300" /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">Ponto de Contacto</p>
                                            <p className="text-white font-medium">{selectedRequest.contactName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Phone className="w-5 h-5 text-slate-300" /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">Telemóvel / Sede</p>
                                            <p className="text-white font-medium">{selectedRequest.phone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0"><Mail className="w-5 h-5 text-slate-300" /></div>
                                        <div>
                                            <p className="text-xs text-slate-500 font-bold uppercase mb-0.5">Email Profissional</p>
                                            <p className="text-white font-medium">{selectedRequest.email}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gestão CRM */}
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
                                <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-4">Gestão do Negócio</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-400 mb-2">Estado Atual</label>
                                        <select
                                            value={selectedRequest.status}
                                            onChange={(e) => setSelectedRequest({ ...selectedRequest, status: e.target.value })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 appearance-none"
                                        >
                                            <option value="PENDING">Pendente (Recebido)</option>
                                            <option value="QUOTED">Cotação Enviada</option>
                                            <option value="COMPLETED">Negócio Fechado</option>
                                            <option value="REJECTED">Rejeitado/Cancelado</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-xs font-bold text-slate-400 mb-2">Notas Internas (Admin)</label>
                                        <textarea
                                            value={selectedRequest.notes || ''}
                                            onChange={(e) => setSelectedRequest({ ...selectedRequest, notes: e.target.value })}
                                            rows={3}
                                            placeholder="Ex: Liguei hoje e enviei proposta de desconto..."
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-500 resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Modal Footer Actions */}
                        <div className="p-6 border-t border-white/5 bg-black/20 flex flex-wrap-reverse gap-3 justify-end items-center">
                            <button
                                onClick={() => { if (confirm('Apagar pedido de empresa definitivamente?')) deleteRequest.mutate(selectedRequest.id) }}
                                disabled={deleteRequest.isPending}
                                className="mr-auto px-4 py-3 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 flex items-center gap-2 font-semibold transition-colors disabled:opacity-50"
                            >
                                <Trash2 className="w-5 h-5" /> Eliminar Lead
                            </button>

                            <button onClick={() => setSelectedRequest(null)} className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 font-semibold transition-colors">
                                Cancelar
                            </button>
                            <button
                                onClick={() => updateRequest.mutate({ id: selectedRequest.id, status: selectedRequest.status, notes: selectedRequest.notes })}
                                disabled={updateRequest.isPending}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-400 hover:to-cyan-400 text-white font-bold flex items-center gap-2 shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50"
                            >
                                {updateRequest.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Guardar Alterações</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

