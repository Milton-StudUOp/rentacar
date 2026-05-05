import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { Bus, Filter, ArrowRight, SlidersHorizontal, MapPin, X } from 'lucide-react';
import { useState } from 'react';
import ImageCarousel from '../components/ImageCarousel';
import Flatpickr from 'react-flatpickr';
import { Portuguese } from 'flatpickr/dist/l10n/pt';
import 'flatpickr/dist/flatpickr.css';
import { format } from 'date-fns';

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
    images: Array<{ id: number; url: string; isPrimary: boolean }>;
    regions: Array<{ region: { city: string } }>;
}

const inputCls = "w-full bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/20 transition-all";

export default function Vehicles() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [showFilters, setShowFilters] = useState(false);
    const regionId = searchParams.get('regionId') || '';
    const category = searchParams.get('category') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const page = Number(searchParams.get('page') || '1');

    const { data, isLoading } = useQuery({
        queryKey: ['vehicles', regionId, category, startDate, endDate, page],
        queryFn: () => api.get('/vehicles', { params: { regionId, category, startDate, endDate, page, limit: 12 } }).then(r => r.data),
    });

    const { data: regions } = useQuery({
        queryKey: ['regions'],
        queryFn: () => api.get('/regions').then(r => r.data),
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => api.get('/vehicles/categories').then(r => r.data),
    });

    const updateFilter = (key: string, value: string) => {
        const newParams = new URLSearchParams(searchParams);
        if (value) newParams.set(key, value); else newParams.delete(key);
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    const hasFilters = !!(regionId || category || startDate || endDate);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">

            {/* ── Page Header ─────────────────────── */}
            <div className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-white/6 pt-24 pb-10 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold uppercase tracking-widest mb-4">
                                <Bus className="w-3.5 h-3.5" /> Frota Corporativa
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                                Viaturas <span className="text-brand-500">Disponíveis</span>
                            </h1>
                            <p className="text-gray-500 dark:text-zinc-400 mt-2">
                                {data?.meta?.total || 0} viaturas encontradas
                            </p>
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all lg:hidden ${showFilters ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-200'}`}
                        >
                            {showFilters ? <X className="w-4 h-4" /> : <SlidersHorizontal className="w-4 h-4" />}
                            Filtros {hasFilters && <span className="w-2 h-2 rounded-full bg-brand-500 inline-block" />}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex gap-8">

                    {/* ── Sidebar Filters ──────────────────── */}
                    <AnimatePresence>
                        {(showFilters || true) && (
                            <motion.aside
                                initial={false}
                                className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}
                            >
                                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-5 sticky top-24 shadow-sm dark:shadow-none transition-colors">
                                    <div className="flex items-center justify-between mb-5">
                                        <h3 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                                            <Filter className="w-4 h-4 text-brand-500" /> Filtros
                                        </h3>
                                        {hasFilters && (
                                            <button onClick={() => setSearchParams({})}
                                                className="text-xs text-brand-500 font-semibold hover:text-brand-600 transition-colors">
                                                Limpar
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Região</label>
                                            <select value={regionId} onChange={(e) => updateFilter('regionId', e.target.value)} className={inputCls} id="filter-region">
                                                <option value="">Todas as regiões</option>
                                                {regions?.map((r: { id: number; city: string; province: string }) => (
                                                    <option key={r.id} value={r.id}>{r.city}, {r.province}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Categoria</label>
                                            <select value={category} onChange={(e) => updateFilter('category', e.target.value)} className={inputCls} id="filter-category">
                                                <option value="">Todas</option>
                                                {categories?.map((c: string) => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Data início</label>
                                            <Flatpickr
                                                value={startDate}
                                                onChange={([date]) => updateFilter('startDate', date ? format(date, 'yyyy-MM-dd') : '')}
                                                options={{ locale: Portuguese, dateFormat: 'd/m/Y', altInput: true, altFormat: 'd/m/Y' }}
                                                className={inputCls} placeholder="dd/mm/aaaa"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Data fim</label>
                                            <Flatpickr
                                                value={endDate}
                                                onChange={([date]) => updateFilter('endDate', date ? format(date, 'yyyy-MM-dd') : '')}
                                                options={{ locale: Portuguese, dateFormat: 'd/m/Y', altInput: true, altFormat: 'd/m/Y', minDate: startDate || undefined }}
                                                className={inputCls} placeholder="dd/mm/aaaa"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.aside>
                        )}
                    </AnimatePresence>

                    {/* ── Vehicle Grid ─────────────────────── */}
                    <div className="flex-1 min-w-0">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/6">
                                        <div className="animate-pulse bg-gray-200 dark:bg-zinc-800 aspect-video" />
                                        <div className="p-5 space-y-3">
                                            <div className="animate-pulse bg-gray-200 dark:bg-zinc-800 h-5 w-3/4 rounded-lg" />
                                            <div className="animate-pulse bg-gray-200 dark:bg-zinc-800 h-4 w-1/2 rounded-lg" />
                                            <div className="animate-pulse bg-gray-200 dark:bg-zinc-800 h-8 w-full rounded-xl mt-4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : data?.data?.length === 0 ? (
                            <div className="text-center py-24 bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200 dark:border-white/6">
                                <Bus className="w-16 h-16 text-gray-300 dark:text-zinc-700 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Nenhuma viatura disponível</h3>
                                <p className="text-gray-500 dark:text-zinc-400">Tente ajustar os filtros de pesquisa</p>
                            </div>
                        ) : (
                            <>
                                <motion.div
                                    initial="hidden" animate="visible"
                                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.07 } } }}
                                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                                >
                                    {data?.data?.map((v: Vehicle) => (
                                        <motion.div key={v.id}
                                            variants={{ hidden: { opacity: 0, y: 20, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } } }}
                                            whileHover={{ y: -6 }}
                                        >
                                            <Link to={`/vehicles/${v.id}`}
                                                className="group flex flex-col bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl overflow-hidden hover:border-brand-500/30 hover:shadow-xl hover:shadow-brand-500/8 transition-all duration-400">
                                                <div className="aspect-video relative overflow-hidden shrink-0 bg-gray-100 dark:bg-zinc-800">
                                                    <ImageCarousel images={v.images} autoPlay interval={3000} />
                                                    <div className="absolute top-3 right-3 z-30 px-3 py-1 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md text-gray-800 dark:text-white text-xs font-bold border border-gray-200/50 dark:border-white/10">
                                                        {v.category}
                                                    </div>
                                                </div>
                                                <div className="p-5 flex-1 flex flex-col">
                                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-brand-500 dark:group-hover:text-brand-400 transition-colors">
                                                        {v.brand} {v.model}
                                                    </h3>
                                                    <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">
                                                        {v.year} · {v.transmission} · {v.seats} lugares
                                                    </p>
                                                    {v.regions?.length > 0 && (
                                                        <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1.5 flex items-center gap-1">
                                                            <MapPin className="w-3 h-3 shrink-0" />
                                                            {v.regions.map((r: { region: { city: string } }) => r.region.city).join(', ')}
                                                        </p>
                                                    )}
                                                    <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-100 dark:border-white/5">
                                                        <div>
                                                            <span className="text-2xl font-black text-brand-500">{Number(v.pricePerDay).toLocaleString()}</span>
                                                            <span className="text-xs text-gray-500 dark:text-zinc-400 ml-1">MT/dia</span>
                                                        </div>
                                                        <span className="flex items-center gap-1 text-xs font-semibold text-brand-500 group-hover:gap-2 transition-all">
                                                            Solicitar <ArrowRight className="w-3.5 h-3.5" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Pagination */}
                                {data?.meta?.totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-10">
                                        {[...Array(data.meta.totalPages)].map((_, i) => (
                                            <button key={i}
                                                onClick={() => { const p = new URLSearchParams(searchParams); p.set('page', String(i + 1)); setSearchParams(p); }}
                                                className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${page === i + 1 ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30' : 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/8 text-gray-600 dark:text-zinc-300 hover:border-brand-500/30'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
