import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, ArrowLeftRight, Loader2, Upload, Image as ImageIcon } from 'lucide-react';

export default function AdminTransfers() {
    const queryClient = useQueryClient();
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [editServiceId, setEditServiceId] = useState<number | null>(null);
    const [serviceForm, setServiceForm] = useState({ name: '', description: '', vehicleType: '', capacity: 4, imageUrl: '' });
    const [uploadingImage, setUploadingImage] = useState(false);

    const { data: services, isLoading } = useQuery({
        queryKey: ['adminTransferServices'],
        queryFn: () => api.get('/transfers/services').then(r => r.data),
    });

    const saveService = useMutation({
        mutationFn: (data: { name: string; description: string; vehicleType: string; capacity: number; imageUrl: string }) => editServiceId ? api.put(`/transfers/services/${editServiceId}`, data) : api.post('/transfers/services', data),
        onSuccess: () => {
            toast.success(editServiceId ? 'Serviço actualizado!' : 'Serviço criado!');
            queryClient.invalidateQueries({ queryKey: ['adminTransferServices'] });
            resetServiceForm();
        },
        onError: (err: { response?: { data?: { message?: string } } }) => toast.error(err.response?.data?.message || 'Erro ao salvar serviço'),
    });

    const deleteService = useMutation({
        mutationFn: (id: number) => api.delete(`/transfers/services/${id}`),
        onSuccess: () => {
            toast.success('Serviço removido');
            queryClient.invalidateQueries({ queryKey: ['adminTransferServices'] });
        },
    });

    const handleServiceImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0]) return;

        try {
            setUploadingImage(true);
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            const uploadRes = await api.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setServiceForm({ ...serviceForm, imageUrl: uploadRes.data.url });
            toast.success('Imagem carregada!');
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Erro ao carregar imagem');
        } finally {
            setUploadingImage(false);
            if (e.target) e.target.value = '';
        }
    };

    const resetServiceForm = () => {
        setShowServiceForm(false);
        setEditServiceId(null);
        setServiceForm({ name: '', description: '', vehicleType: '', capacity: 4, imageUrl: '' });
    };

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-teal-500" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Transversais (Serviços)</h1>
                    <p className="text-slate-400 mt-1">Gerir opções de viaturas para pedido de Transfer</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => { resetServiceForm(); setShowServiceForm(true); }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold transition-all hover:shadow-lg hover:shadow-cyan-500/20"
                    >
                        <Plus className="w-4 h-4" /> Novo Serviço
                    </button>
                </div>
            </div>

            {/* Service Form Modal */}
            {showServiceForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="glass rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ArrowLeftRight className="w-5 h-5 text-cyan-400" />
                                {editServiceId ? 'Editar Serviço' : 'Novo Serviço'}
                            </h2>
                            <button onClick={resetServiceForm} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
                        </div>
                        <form onSubmit={e => { e.preventDefault(); saveService.mutate(serviceForm); }} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Nome do Serviço *</label>
                                    <input type="text" value={serviceForm.name} onChange={e => setServiceForm({ ...serviceForm, name: e.target.value })} required placeholder="Ex: Transfer Minivan Premium"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Tipo de Viatura *</label>
                                    <input type="text" value={serviceForm.vehicleType} onChange={e => setServiceForm({ ...serviceForm, vehicleType: e.target.value })} required placeholder="Ex: Minivan Luxo"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Capacidade (Lugares) *</label>
                                    <input type="number" value={serviceForm.capacity} onChange={e => setServiceForm({ ...serviceForm, capacity: Number(e.target.value) })} min={1} required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50" />
                                </div>
                                <div className="row-span-2">
                                    <label className="block text-xs text-slate-400 mb-1">Imagem Representativa</label>
                                    <div className="mt-1 relative h-32 rounded-xl border border-white/10 overflow-hidden bg-black/50 group flex items-center justify-center">
                                        {serviceForm.imageUrl ? (
                                            <>
                                                <img src={api.defaults.baseURL?.replace('/api', '') + serviceForm.imageUrl} alt="Service" className="w-full h-full object-cover opacity-60 group-hover:opacity-30 transition-opacity" />
                                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Upload className="w-6 h-6 text-white mb-1" />
                                                    <span className="text-xs font-semibold text-white bg-black/50 px-2 py-1 rounded">Trocar Imagem</span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        if (confirm('Remover esta imagem?')) {
                                                            setServiceForm({ ...serviceForm, imageUrl: '' });
                                                        }
                                                    }}
                                                    className="absolute top-2 right-2 z-20 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                                                    title="Eliminar Imagem"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </>
                                        ) : (
                                            <div className="flex flex-col items-center text-slate-400 group-hover:text-cyan-400 transition-colors">
                                                {uploadingImage ? <Loader2 className="w-6 h-6 animate-spin mb-1" /> : <ImageIcon className="w-6 h-6 mb-1" />}
                                                <span className="text-xs">{uploadingImage ? 'A carregar...' : 'Fazer Upload'}</span>
                                            </div>
                                        )}
                                        <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" onChange={handleServiceImageUpload} disabled={uploadingImage} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Descrição</label>
                                    <textarea value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} rows={3} placeholder="Detalhes opcionais..."
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-500/50 resize-none" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-6">
                                <button type="button" onClick={resetServiceForm} className="flex-1 px-4 py-2.5 rounded-xl border border-white/10 text-sm text-slate-300 hover:bg-white/5 transition-colors">Cancelar</button>
                                <button type="submit" disabled={saveService.isPending || uploadingImage}
                                    className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-cyan-500/20 transition-all">
                                    {saveService.isPending && <Loader2 className="w-4 h-4 animate-spin" />}
                                    {editServiceId ? 'Actualizar Serviço' : 'Criar Serviço'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Services List */}
            {services?.length === 0 ? (
                <div className="glass rounded-2xl p-12 text-center">
                    <ArrowLeftRight className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Nenhum serviço registado</h3>
                    <p className="text-slate-400">Adicione os serviços de opções de transferência clicando em 'Novo Serviço'.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {services?.map((s: { id: number; name: string; description: string; vehicleType: string; capacity: number; imageUrl?: string }) => (
                        <div key={s.id} className="glass rounded-2xl overflow-hidden relative group">
                            {/* Background image if exists */}
                            {s.imageUrl && (
                                <div className="absolute inset-0 z-0">
                                    <img src={api.defaults.baseURL?.replace('/api', '') + s.imageUrl} alt={s.name} className="w-full h-full object-cover opacity-10 grayscale-[50%]" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/90 to-[#0f172a]/40" />
                                </div>
                            )}

                            <div className="relative z-10 p-6 flex flex-col h-full">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 border border-teal-500/20 flex items-center justify-center shadow-lg">
                                        <ArrowLeftRight className="w-6 h-6 text-teal-400" />
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => {
                                                setEditServiceId(s.id);
                                                setServiceForm({ name: s.name, description: s.description || '', vehicleType: s.vehicleType, capacity: s.capacity, imageUrl: s.imageUrl || '' });
                                                setShowServiceForm(true);
                                            }}
                                            className="p-2 rounded-lg bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 hover:text-white transition-colors"
                                            title="Editar Serviço"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => { if (confirm('Remover este serviço? Esta acção afetará as submissões de clientes em aberto.')) deleteService.mutate(s.id); }}
                                            className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 hover:text-red-300 transition-colors"
                                            title="Eliminar Serviço"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-grow">
                                    <h3 className="font-bold text-xl text-white mb-2">{s.name}</h3>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-300 mb-3">
                                        <span className="bg-white/10 px-2 py-1 rounded-md">{s.vehicleType}</span>
                                        <span className="bg-cyan-500/20 text-cyan-300 px-2 py-1 rounded-md">Até {s.capacity} Lugares</span>
                                    </div>
                                    {s.description && <p className="text-sm text-slate-400 line-clamp-3 leading-relaxed">{s.description}</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
