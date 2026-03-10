import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, ArrowLeftRight, Loader2, Upload, Image as ImageIcon, Save } from 'lucide-react';

interface TransferImage {
    id: number;
    url: string;
    isPrimary: boolean;
}

interface TransferService {
    id: number;
    name: string;
    description: string;
    vehicleType: string;
    capacity: number;
    images: TransferImage[];
}

export default function AdminTransfers() {
    const queryClient = useQueryClient();
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [editServiceId, setEditServiceId] = useState<number | null>(null);
    const [serviceForm, setServiceForm] = useState({ name: '', description: '', vehicleType: '', capacity: 4 });
    const [showImages, setShowImages] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const { data: services, isLoading } = useQuery({
        queryKey: ['adminTransferServices'],
        queryFn: () => api.get('/transfers/services').then(r => r.data),
    });

    const saveService = useMutation({
        mutationFn: (data: { name: string; description: string; vehicleType: string; capacity: number }) => editServiceId ? api.put(`/transfers/services/${editServiceId}`, data) : api.post('/transfers/services', data),
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

    const setFormAndSync = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: string) => {
        const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
        setServiceForm({ ...serviceForm, [field]: value });
    };

    const resetServiceForm = () => {
        setShowServiceForm(false);
        setEditServiceId(null);
        setServiceForm({ name: '', description: '', vehicleType: '', capacity: 4 });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !editServiceId) return;

        try {
            setUploadingImage(true);
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            // 1. Upload file
            const uploadRes = await api.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // 2. Link file to transfer service
            await api.post(`/transfers/services/${editServiceId}/images`, {
                url: uploadRes.data.url,
                isPrimary: false
            });

            toast.success('Imagem adicionada!');
            queryClient.invalidateQueries({ queryKey: ['adminTransferServices'] });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Erro ao carregar imagem');
        } finally {
            setUploadingImage(false);
            if (e.target) e.target.value = '';
        }
    };

    const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

    const deleteImage = async (imageId: number) => {
        if (!confirm('Remover esta imagem?')) return;
        setDeletingImageId(imageId);
        try {
            await api.delete(`/transfers/images/${imageId}`);
            toast.success('Imagem removida');
            queryClient.invalidateQueries({ queryKey: ['adminTransferServices'] });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Erro ao eliminar imagem');
        } finally {
            setDeletingImageId(null);
        }
    };

    const setPrimaryImage = async (imageId: number) => {
        if (!editServiceId) return;
        try {
            await api.patch(`/transfers/services/${editServiceId}/images/${imageId}/primary`);
            toast.success('Imagem principal definida');
            queryClient.invalidateQueries({ queryKey: ['adminTransferServices'] });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Erro ao definir imagem principal');
        }
    };

    const currentService = services?.find((s: TransferService) => s.id === editServiceId);

    if (isLoading) {
        return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-teal-500" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="animate-fade-in-up">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">Transfers <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-cyan-500">(Serviços)</span></h1>
                    <p className="text-slate-400 mt-1 text-sm md:text-lg">Gerir opções de viaturas para pedido de Transfer</p>
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
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 animate-fade-in">
                    <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/80 backdrop-blur-md" onClick={resetServiceForm} />
                    <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up flex flex-col max-h-[90vh] transition-colors">

                        {/* Header Decoration */}
                        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 pointer-events-none" />

                        <div className="relative flex items-center justify-between p-6 md:p-8 border-b border-slate-100 dark:border-white/5 shrink-0 z-10 transition-colors">
                            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                                <ArrowLeftRight className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                                {editServiceId ? 'Editar Serviço' : 'Novo Serviço'}
                            </h2>
                            <button onClick={resetServiceForm} className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={e => { e.preventDefault(); saveService.mutate(serviceForm); }} className="relative p-6 md:p-8 overflow-y-auto space-y-6 z-10 transition-colors">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Nome do Serviço *</label>
                                        <input type="text" value={serviceForm.name} onChange={e => setFormAndSync(e, 'name')} required placeholder="Ex: Transfer Minivan Premium"
                                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Tipo de Viatura *</label>
                                        <input type="text" value={serviceForm.vehicleType} onChange={e => setFormAndSync(e, 'vehicleType')} required placeholder="Ex: Minivan Luxo"
                                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Capacidade (Lugares) *</label>
                                        <input type="number" value={serviceForm.capacity} onChange={e => setFormAndSync(e, 'capacity')} min={1} required
                                            className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Gestão de Imagens</label>
                                    <div className="relative h-[216px] rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-slate-50 dark:bg-black/20 group flex flex-col items-center justify-center transition-all shadow-sm border-dashed">
                                        {editServiceId ? (
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="flex gap-2">
                                                    {currentService?.images?.slice(0, 3).map((img: TransferImage) => (
                                                        <div key={img.id} className="w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-white/10">
                                                            <img src={api.defaults.baseURL?.replace('/api', '') + img.url} className="w-full h-full object-cover" alt="Service" />
                                                        </div>
                                                    ))}
                                                    {(currentService?.images?.length || 0) > 3 && (
                                                        <div className="w-12 h-12 rounded-lg bg-slate-200 dark:bg-white/5 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                            +{(currentService?.images?.length || 0) - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setShowImages(true)}
                                                    className="px-6 py-2.5 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 text-xs font-black uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-all flex items-center gap-2"
                                                >
                                                    <ImageIcon className="w-4 h-4" /> Gerir Galeria
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="text-center p-6">
                                                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                                                    <ImageIcon className="w-6 h-6 text-slate-400" />
                                                </div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Crie primeiro o serviço para depois adicionar imagens</p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1">Descrição</label>
                                    <textarea value={serviceForm.description} onChange={e => setFormAndSync(e, 'description')} rows={3} placeholder="Descreva os diferenciais deste serviço (ex: Wi-Fi, Águas, Ar Condicionado)..."
                                        className="w-full bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-white/10 rounded-2xl px-4 py-4 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none shadow-sm transition-all" />
                                </div>
                            </div>

                            <div className="flex flex-wrap-reverse gap-4 pt-4 md:justify-end">
                                <button type="button" onClick={resetServiceForm} className="flex-1 md:flex-none px-8 py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-all active:scale-95">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={saveService.isPending}
                                    className="flex-1 md:flex-none px-10 py-3.5 rounded-2xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-black flex items-center justify-center gap-3 shadow-xl shadow-teal-500/20 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                                    {saveService.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                    {editServiceId ? 'Actualizar Serviço' : 'Criar Serviço'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Images Management Modal */}
            {showImages && currentService && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 dark:bg-black/80 backdrop-blur-md p-4 animate-fade-in-up transition-colors">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative transition-colors">
                        <div className="flex items-start justify-between mb-8 relative z-10 transition-colors">
                            <div>
                                <h2 className="text-2xl font-black flex items-center gap-2 mb-1 text-slate-900 dark:text-white transition-colors">
                                    <ImageIcon className="w-6 h-6 text-teal-600 dark:text-teal-400 transition-colors" />
                                    Imagens: <span className="text-teal-600 dark:text-teal-400 transition-colors uppercase tracking-tight">{currentService.name}</span>
                                </h2>
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">
                                    Gerencie a galeria visual deste serviço de transfer
                                </p>
                            </div>
                            <button onClick={() => setShowImages(false)} className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Upload Area */}
                        <div className="mb-8 relative z-10">
                            <label className={`flex flex-col items-center justify-center w-full h-44 border-2 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ${uploadingImage ? 'border-teal-500 bg-teal-500/5' : 'border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-black/20 hover:border-teal-500/50 hover:bg-teal-500/5'}`}>
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {uploadingImage ? (
                                        <>
                                            <Loader2 className="w-10 h-10 text-teal-600 dark:text-teal-400 animate-spin mb-3" />
                                            <p className="text-xs font-black uppercase tracking-widest text-teal-600 dark:text-teal-400">A carregar...</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-14 h-14 rounded-2xl bg-slate-200/50 dark:bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <Upload className="w-6 h-6 text-slate-400" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-600 dark:text-slate-300">
                                                <span className="text-teal-600">Clique</span> para fazer upload de nova foto
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploadingImage} />
                            </label>
                        </div>

                        {/* Gallery Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                            {currentService.images?.map((img: TransferImage) => (
                                <div key={img.id} className="relative group rounded-2xl overflow-hidden aspect-video bg-slate-100 dark:bg-black/20 border border-slate-200 dark:border-white/10 shadow-sm">
                                    <img src={api.defaults.baseURL?.replace('/api', '') + img.url} alt="Gallery" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        {!img.isPrimary && (
                                            <button onClick={() => setPrimaryImage(img.id)} className="p-2 bg-teal-500 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg" title="Definir como Principal">
                                                <Save className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button onClick={() => deleteImage(img.id)} disabled={deletingImageId === img.id} className="p-2 bg-red-500 text-white rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg" title="Eliminar Foto">
                                            {deletingImageId === img.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                        </button>
                                    </div>
                                    {img.isPrimary && (
                                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-teal-500 text-white text-[8px] font-black uppercase tracking-widest shadow-lg">
                                            Principal
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Services List */}
            {services?.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl p-16 text-center transition-colors shadow-sm">
                    <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-400">
                        <ArrowLeftRight className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Nenhum serviço registado</h3>
                    <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Adicione os serviços de opções de transferência clicando em 'Novo Serviço'.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {services?.map((s: TransferService) => (
                        <div key={s.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden relative group flex flex-col hover:border-teal-500/30 transition-all hover:shadow-2xl hover:shadow-teal-500/5 duration-500">
                            {/* Image Header with Actions */}
                            <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-slate-800/50 flex items-center justify-center transition-colors">
                                {s.images && s.images.length > 0 ? (
                                    <>
                                        <img src={api.defaults.baseURL?.replace('/api', '') + (s.images.find(i => i.isPrimary)?.url || s.images[0].url)} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60 dark:opacity-90" />
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 opacity-60">
                                        <ArrowLeftRight className="w-16 h-16 mb-2" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sem Imagem</span>
                                    </div>
                                )}

                                {/* Overlay Action Buttons */}
                                <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20">
                                    <button
                                        onClick={() => {
                                            setEditServiceId(s.id);
                                            setShowImages(true);
                                        }}
                                        className="p-2.5 rounded-xl bg-white/90 dark:bg-cyan-500/90 backdrop-blur-md hover:bg-white dark:hover:bg-cyan-500 text-cyan-600 dark:text-white transition-all shadow-xl hover:scale-110 active:scale-95"
                                        title="Gerir Fotos"
                                    >
                                        <ImageIcon className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => {
                                            setEditServiceId(s.id);
                                            setServiceForm({ name: s.name, description: s.description || '', vehicleType: s.vehicleType, capacity: s.capacity });
                                            setShowServiceForm(true);
                                        }}
                                        className="p-2.5 rounded-xl bg-white/90 dark:bg-teal-500/90 backdrop-blur-md hover:bg-white dark:hover:bg-teal-500 text-teal-600 dark:text-white transition-all shadow-xl hover:scale-110 active:scale-95"
                                        title="Editar Serviço"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => { if (confirm('Remover este serviço? Esta acção afetará as submissões de clientes em aberto.')) deleteService.mutate(s.id); }}
                                        className="p-2.5 rounded-xl bg-white/90 dark:bg-red-500/90 backdrop-blur-md hover:bg-white dark:hover:bg-red-500 text-red-600 dark:text-white transition-all shadow-xl hover:scale-110 active:scale-95"
                                        title="Eliminar Serviço"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="relative z-10 p-8 flex flex-col flex-1 transition-colors">
                                <h3 className="font-black text-2xl text-slate-900 dark:text-white mb-3 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors leading-tight">{s.name}</h3>
                                <div className="flex flex-wrap items-center gap-2 mb-6">
                                    <span className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400">{s.vehicleType}</span>
                                    <span className="bg-teal-500/10 text-teal-600 dark:text-teal-300 border border-teal-500/20 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Até {s.capacity} Lugares</span>
                                </div>
                                {s.description && <p className="text-sm font-medium text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mt-auto border-t border-slate-100 dark:border-white/5 pt-4">{s.description}</p>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Mobile FAB */}
            <button
                onClick={() => { resetServiceForm(); setShowServiceForm(true); }}
                className="md:hidden fixed bottom-[90px] right-4 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-xl shadow-teal-500/30 flex items-center justify-center transition-transform active:scale-95"
            >
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
}
