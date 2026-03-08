import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../lib/api';
import { Car, Filter, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import ImageCarousel from '../components/ImageCarousel';
import DatePicker from 'react-datepicker';
import { ptBR } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
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
        if (value) newParams.set(key, value);
        else newParams.delete(key);
        newParams.set('page', '1');
        setSearchParams(newParams);
    };

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Viaturas Disponíveis</h1>
                        <p className="text-slate-400 mt-1">
                            {data?.meta?.total || 0} viaturas encontradas
                        </p>
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl glass text-sm lg:hidden"
                    >
                        <Filter className="w-4 h-4" /> Filtros
                    </button>
                </div>

                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`w-64 shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                        <div className="glass rounded-2xl p-5 sticky top-24 space-y-5">
                            <h3 className="font-semibold text-sm text-slate-300">Filtros</h3>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Região</label>
                                <select
                                    value={regionId}
                                    onChange={(e) => updateFilter('regionId', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                    id="filter-region"
                                >
                                    <option value="">Todas</option>
                                    {regions?.map((r: { id: number; city: string; province: string }) => (
                                        <option key={r.id} value={r.id}>{r.city}, {r.province}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Categoria</label>
                                <select
                                    value={category}
                                    onChange={(e) => updateFilter('category', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                    id="filter-category"
                                >
                                    <option value="">Todas</option>
                                    {categories?.map((c: string) => (
                                        <option key={c} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Data início</label>
                                <DatePicker
                                    selected={startDate ? new Date(startDate) : null}
                                    onChange={(date: Date | null) => updateFilter('startDate', date ? format(date, 'yyyy-MM-dd') : '')}
                                    selectsStart
                                    startDate={startDate ? new Date(startDate) : undefined}
                                    endDate={endDate ? new Date(endDate) : undefined}
                                    locale={ptBR}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="dd/mm/aaaa"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                    id="filter-start-date"
                                    isClearable
                                    portalId="root"
                                />
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Data fim</label>
                                <DatePicker
                                    selected={endDate ? new Date(endDate) : null}
                                    onChange={(date: Date | null) => updateFilter('endDate', date ? format(date, 'yyyy-MM-dd') : '')}
                                    selectsEnd
                                    startDate={startDate ? new Date(startDate) : undefined}
                                    endDate={endDate ? new Date(endDate) : undefined}
                                    minDate={startDate ? new Date(startDate) : undefined}
                                    locale={ptBR}
                                    dateFormat="dd/MM/yyyy"
                                    placeholderText="dd/mm/aaaa"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-teal-500/50"
                                    id="filter-end-date"
                                    isClearable
                                    portalId="root"
                                />
                            </div>

                            {(regionId || category || startDate || endDate) && (
                                <button
                                    onClick={() => setSearchParams({})}
                                    className="w-full text-sm text-red-400 hover:text-red-300 py-2"
                                >
                                    Limpar filtros
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Grid */}
                    <div className="flex-1">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="rounded-2xl overflow-hidden">
                                        <div className="skeleton aspect-video" />
                                        <div className="p-5 space-y-3">
                                            <div className="skeleton h-5 w-3/4 rounded" />
                                            <div className="skeleton h-4 w-1/2 rounded" />
                                            <div className="skeleton h-8 w-1/3 rounded" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : data?.data?.length === 0 ? (
                            <div className="text-center py-20">
                                <Car className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold mb-2">Nenhuma viatura encontrada</h3>
                                <p className="text-slate-400">Tente ajustar os filtros de pesquisa</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {data?.data?.map((v: Vehicle) => (
                                        <Link
                                            key={v.id}
                                            to={`/vehicles/${v.id}`}
                                            className="glass rounded-2xl overflow-hidden group hover:border-teal-500/20 transition-all flex flex-col"
                                        >
                                            <div className="aspect-video relative overflow-hidden shrink-0">
                                                <ImageCarousel images={v.images} autoPlay interval={3000} />
                                                <div className="absolute top-3 right-3 z-30 px-3 py-1 rounded-full bg-teal-500/20 backdrop-blur-md text-teal-400 text-xs font-semibold shadow-sm border border-teal-500/10">
                                                    {v.category}
                                                </div>
                                            </div>
                                            <div className="p-5 flex-1 flex flex-col">
                                                <h3 className="font-semibold text-lg group-hover:text-teal-400 transition-colors">
                                                    {v.brand} {v.model}
                                                </h3>
                                                <p className="text-sm text-slate-400 mt-1">
                                                    {v.year} · {v.transmission} · {v.fuelType} · {v.seats} lugares
                                                </p>
                                                {v.regions?.length > 0 && (
                                                    <p className="text-xs text-slate-500 mt-2">
                                                        📍 {v.regions.map((r: { region: { city: string } }) => r.region.city).join(', ')}
                                                    </p>
                                                )}
                                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                                                    <div>
                                                        <span className="text-2xl font-bold text-teal-400">{Number(v.pricePerDay).toLocaleString()}</span>
                                                        <span className="text-sm text-slate-400"> MT/dia</span>
                                                    </div>
                                                    <span className="text-xs text-teal-400 font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                                                        Reservar <ArrowRight className="w-3 h-3" />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {/* Pagination */}
                                {data?.meta?.totalPages > 1 && (
                                    <div className="flex justify-center gap-2 mt-8">
                                        {[...Array(data.meta.totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => {
                                                    const newParams = new URLSearchParams(searchParams);
                                                    newParams.set('page', String(i + 1));
                                                    setSearchParams(newParams);
                                                }}
                                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${page === i + 1
                                                    ? 'bg-teal-500 text-white'
                                                    : 'glass text-slate-300 hover:bg-white/5'
                                                    }`}
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
