import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../lib/api';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, X, Car, Loader2, Image as ImageIcon, Upload } from 'lucide-react';

interface VehicleImage {
    id: number;
    url: string;
    isPrimary: boolean;
}

interface Vehicle {
    id: number;
    brand: string;
    model: string;
    year: number;
    category: string;
    transmission: string;
    fuelType: string;
    seats: number;
    pricePerDay: number | string;
    description: string | null;
    features: string | null;
    images: Array<{ id: number; url: string; isPrimary: boolean }>;
    regions: Array<{ id: number; regionId: number; region: { city: string; province: string } }>;
}

export default function AdminVehicles() {
    const queryClient = useQueryClient();
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const [form, setForm] = useState<Partial<Vehicle>>({
        brand: '', model: '', year: 2024, category: 'SUV', transmission: 'Automática',
        fuelType: 'Gasolina', seats: 5, pricePerDay: 0, description: '', features: '',
    });

    const [showImages, setShowImages] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const { data } = useQuery<{ data: Vehicle[], meta: { total: number } }>({
        queryKey: ['adminVehicles'],
        queryFn: () => api.get('/vehicles?limit=100').then(r => r.data),
    });


    const saveMutation = useMutation({
        mutationFn: (data: Partial<Vehicle>) => editId ? api.put(`/vehicles/${editId}`, data) : api.post('/vehicles', data),
        onSuccess: () => {
            toast.success(editId ? 'Viatura actualizada!' : 'Viatura criada!');
            queryClient.invalidateQueries({ queryKey: ['adminVehicles'] });
            resetForm();
        },
        onError: (err: { response?: { data?: { message?: string } } }) => toast.error(err.response?.data?.message || 'Erro ao guardar'),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/vehicles/${id}`),
        onSuccess: () => {
            toast.success('Viatura removida');
            queryClient.invalidateQueries({ queryKey: ['adminVehicles'] });
        },
        onError: (err: { response?: { data?: { message?: string } } }) => toast.error(err.response?.data?.message || 'Erro'),
    });

    const resetForm = () => {
        setShowForm(false);
        setEditId(null);
        setForm({ brand: '', model: '', year: 2024, category: 'SUV', transmission: 'Automática', fuelType: 'Gasolina', seats: 5, pricePerDay: 0, description: '', features: '' });
    };

    const handleEdit = (v: Vehicle) => {
        setEditId(v.id);
        setForm({
            brand: v.brand, model: v.model, year: v.year, category: v.category,
            transmission: v.transmission, fuelType: v.fuelType, seats: v.seats,
            pricePerDay: Number(v.pricePerDay), description: v.description || '', features: v.features || '',
        });
        setShowForm(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        saveMutation.mutate(form);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !editId) return;

        try {
            setUploadingImage(true);
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('file', file);

            // 1. Upload file
            const uploadRes = await api.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // 2. Link file to vehicle
            await api.post(`/vehicles/${editId}/images`, {
                url: uploadRes.data.url,
                isPrimary: false // Let them set primary later or default
            });

            toast.success('Imagem adicionada com sucesso!');
            queryClient.invalidateQueries({ queryKey: ['adminVehicles'] });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Erro ao carregar imagem');
        } finally {
            setUploadingImage(false);
            if (e.target) e.target.value = ''; // reset input
        }
    };

    const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

    const deleteImage = async (e: React.MouseEvent, imageId: number) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm('Remover esta imagem?')) return;

        setDeletingImageId(imageId);
        try {
            await api.delete(`/vehicles/images/${imageId}`);
            toast.success('Imagem removida');
            await queryClient.invalidateQueries({ queryKey: ['adminVehicles'] });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Erro ao eliminar imagem');
        } finally {
            setDeletingImageId(null);
        }
    };

    // Find current vehicle images when modal is open
    const currentVehicle = data?.data?.find((v: Vehicle) => v.id === editId);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
                <div className="animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
                        Gestão de <span className="gradient-text">Viaturas</span>
                    </h1>
                    <p className="text-slate-400 text-lg">{data?.meta?.total || 0} viaturas registadas na frota</p>
                </div>
                <div className="flex gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                    <button
                        onClick={() => { resetForm(); setShowForm(true); }}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold flex items-center gap-2 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all"
                    >
                        <Plus className="w-5 h-5" /> Nova Viatura
                    </button>
                </div>
            </div>

            {/* Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-dark/80 backdrop-blur-md p-4 animate-fade-in-up">
                    <div className="glass border border-white/10 rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        {/* Soft glow behind modal */}
                        <div className="absolute -top-32 -left-32 w-64 h-64 bg-teal-500/20 rounded-full blur-[100px] pointer-events-none" />

                        <div className="flex items-center justify-between mb-8 relative z-10">
                            <h2 className="text-2xl font-bold">{editId ? 'Editar Viatura' : 'Nova Viatura'}</h2>
                            <button onClick={resetForm} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Marca *</label>
                                    <input type="text" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} required
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Modelo *</label>
                                    <input type="text" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} required
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Ano</label>
                                    <input type="number" value={form.year} onChange={e => setForm({ ...form, year: Number(e.target.value) })}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Categoria</label>
                                    <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all">
                                        <option value="SUV">SUV</option>
                                        <option value="Económico">Económico</option>
                                        <option value="Luxo">Luxo</option>
                                        <option value="Minivan">Minivan</option>
                                        <option value="Sedan">Sedan</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Transmissão</label>
                                    <select value={form.transmission} onChange={e => setForm({ ...form, transmission: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all">
                                        <option value="Automática">Automática</option>
                                        <option value="Manual">Manual</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Combustível</label>
                                    <select value={form.fuelType} onChange={e => setForm({ ...form, fuelType: e.target.value })}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all">
                                        <option value="Gasolina">Gasolina</option>
                                        <option value="Diesel">Diesel</option>
                                        <option value="Híbrido">Híbrido</option>
                                        <option value="Eléctrico">Eléctrico</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Lugares</label>
                                    <input type="number" value={form.seats} onChange={e => setForm({ ...form, seats: Number(e.target.value) })} min={1}
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Preço/dia (MT) *</label>
                                    <input type="number" value={form.pricePerDay} onChange={e => setForm({ ...form, pricePerDay: Number(e.target.value) })} min={0} required
                                        className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Descrição</label>
                                <textarea value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Detalhes opcionais..."
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all resize-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">Características (separadas por vírgula)</label>
                                <textarea value={form.features || ''} onChange={e => setForm({ ...form, features: e.target.value })} rows={3} placeholder="Ar Condicionado, GPS, etc..."
                                    className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all resize-none" />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button type="button" onClick={resetForm} className="flex-1 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm font-semibold text-slate-300 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={saveMutation.isPending}
                                    className="flex-1 px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                    {saveMutation.isPending && <Loader2 className="w-5 h-5 animate-spin" />}
                                    {editId ? 'Guardar Alterações' : 'Adicionar Frota'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Images Modal */}
            {showImages && currentVehicle && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg-dark/80 backdrop-blur-md p-4 animate-fade-in-up">
                    <div className="glass border border-white/10 rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl relative">
                        {/* Soft glow behind modal */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] pointer-events-none" />

                        <div className="flex items-start justify-between mb-8 relative z-10">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-2 mb-1">
                                    <ImageIcon className="w-6 h-6 text-cyan-400" />
                                    Imagens: <span className="text-teal-400">{currentVehicle.brand} {currentVehicle.model}</span>
                                </h2>
                                <p className="text-sm text-slate-400">
                                    Formatos: JPG, PNG, WEBP. Tamanho máximo: 5MB
                                </p>
                            </div>
                            <button onClick={() => { setShowImages(false); setEditId(null); }} className="p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-slate-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Upload Area */}
                        <div className="mb-8 relative z-10">
                            <label
                                htmlFor="image-upload"
                                className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${uploadingImage
                                    ? 'border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                    : 'border-white/20 bg-slate-900/50 hover:border-cyan-500/50 hover:bg-cyan-500/5'
                                    }`}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    {uploadingImage ? (
                                        <>
                                            <div className="relative mb-3">
                                                <div className="absolute inset-0 rounded-full blur bg-cyan-500/50 animate-pulse"></div>
                                                <Loader2 className="w-10 h-10 text-cyan-400 animate-spin relative z-10" />
                                            </div>
                                            <p className="text-sm text-cyan-400 font-semibold tracking-wide">A ENVIAR IMAGEM...</p>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center mb-3 group-hover:bg-slate-700 transition-colors shadow-inner">
                                                <Upload className="w-6 h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                                            </div>
                                            <p className="mb-2 text-sm text-slate-300">
                                                <span className="font-semibold text-cyan-400">Clique</span> ou arraste a imagem para aqui
                                            </p>
                                        </>
                                    )}
                                </div>
                                <input
                                    id="image-upload"
                                    type="file"
                                    className="hidden"
                                    accept="image/jpeg, image/png, image/webp"
                                    onChange={handleImageUpload}
                                    disabled={uploadingImage}
                                />
                            </label>
                        </div>

                        {/* Image Gallery */}
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                                    Imagens guardadas <span className="bg-white/10 px-2 py-0.5 rounded-md text-xs">{currentVehicle.images?.length || 0}</span>
                                </h3>
                            </div>

                            {currentVehicle && currentVehicle.images && currentVehicle.images.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                                    {currentVehicle.images.map((img: VehicleImage) => (
                                        <div key={img.id} className="relative group rounded-2xl overflow-hidden aspect-video bg-black/50 border border-white/10 hover:border-white/20 transition-all shadow-lg">
                                            <img
                                                src={api.defaults.baseURL?.replace('/api', '') + img.url}
                                                alt="Vehicle"
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            {/* Top badges */}
                                            {img.isPrimary && (
                                                <div className="absolute top-3 left-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-wider">
                                                    CAPA
                                                </div>
                                            )}

                                            {/* Hover overlay actions */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 z-10">
                                                <button
                                                    onClick={(e) => deleteImage(e, img.id)}
                                                    disabled={deletingImageId === img.id}
                                                    className="w-10 h-10 bg-red-500 hover:bg-red-600 flex items-center justify-center text-white rounded-xl transition-all hover:scale-110 shadow-lg disabled:opacity-50 disabled:scale-100"
                                                    title="Eliminar Imagem"
                                                >
                                                    {deletingImageId === img.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-slate-900/50 rounded-2xl border-2 border-white/5 border-dashed">
                                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <ImageIcon className="w-8 h-8 text-slate-500" />
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium">A frota precisa de fotografias deslumbrantes.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-slate-400 border-b border-white/5">
                                <th className="text-left py-4 px-4">Viatura</th>
                                <th className="text-left py-4 px-4">Categoria</th>
                                <th className="text-left py-4 px-4">Transmissão</th>
                                <th className="text-right py-4 px-4">Preço/dia</th>
                                <th className="text-center py-4 px-4">Acções</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.data?.map((v: Vehicle) => (
                                <tr key={v.id} className="border-b border-white/5 hover:bg-white/[0.03] transition-all group relative">
                                    <td className="py-4 px-6 relative">
                                        {/* Row left glow indicator */}
                                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="flex items-center gap-4">
                                            {v.images?.[0]?.url ? (
                                                <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-white/10 shrink-0 group-hover:ring-cyan-500/50 transition-all shadow-lg">
                                                    <img src={v.images[0].url} alt={v.model} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-xl bg-slate-800/50 flex items-center justify-center shrink-0 border border-white/5 group-hover:border-white/10 transition-colors">
                                                    <Car className="w-6 h-6 text-slate-500 group-hover:text-slate-400 transition-colors" />
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-sm group-hover:text-cyan-400 transition-colors">{v.brand} {v.model}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-slate-500">{v.year}</span>
                                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                    <span className="text-xs text-slate-500">{v.seats} lugares</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-medium text-slate-300 group-hover:border-white/20 transition-colors">{v.category}</span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-slate-400">{v.transmission}</td>
                                    <td className="py-4 px-6 text-right font-bold text-teal-400">{Number(v.pricePerDay).toLocaleString()} <span className="text-xs text-slate-500 font-normal">MT/dia</span></td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center justify-end gap-2 opacity-100">
                                            <button
                                                onClick={() => {
                                                    setEditId(v.id);
                                                    setShowImages(true);
                                                }}
                                                className="p-2 rounded-xl bg-slate-800/50 hover:bg-cyan-500/10 text-slate-400 hover:text-cyan-400 transition-all border border-white/5 hover:border-cyan-500/30"
                                                title="Gerir Imagens"
                                            >
                                                <ImageIcon className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(v)}
                                                className="p-2 rounded-xl bg-slate-800/50 hover:bg-white/10 text-slate-400 hover:text-white transition-all border border-white/5 hover:border-white/20"
                                                title="Editar"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => { if (confirm('Tem a certeza que deseja remover esta viatura?')) deleteMutation.mutate(v.id); }}
                                                className="p-2 rounded-xl bg-slate-800/50 hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all border border-white/5 hover:border-red-500/30"
                                                title="Eliminar"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
