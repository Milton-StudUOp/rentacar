import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Fuel, Users, Settings, Calendar, MapPin, ArrowRight, Check } from 'lucide-react';
import ImageCarousel from '../components/ImageCarousel';

export default function VehicleDetail() {
    const { id } = useParams();

    const { data: vehicle, isLoading } = useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => api.get(`/vehicles/${id}`).then(r => r.data),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="animate-pulse bg-slate-200 dark:bg-white/5 h-96 rounded-2xl mb-8 transition-colors" />
                <div className="animate-pulse bg-slate-200 dark:bg-white/5 h-10 w-64 rounded mb-4 transition-colors" />
                <div className="animate-pulse bg-slate-200 dark:bg-white/5 h-6 w-96 rounded transition-colors" />
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">Viatura não encontrada</h2>
            </div>
        );
    }

    const features = vehicle.features?.split(',').map((f: string) => f.trim()) || [];

    return (
        <div className="min-h-screen py-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-6 transition-colors">
                    <Link to="/vehicles" className="hover:text-teal-600 dark:hover:text-teal-400 transition-colors">Viaturas</Link>
                    <span>/</span>
                    <span className="text-slate-900 dark:text-white transition-colors">{vehicle.brand} {vehicle.model}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image */}
                        <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl relative overflow-hidden ring-1 ring-slate-200 dark:ring-white/10 shadow-2xl transition-colors">
                            <ImageCarousel images={vehicle.images} autoPlay interval={4000} />

                            {/* Overlay Badges */}
                            <div className="absolute top-4 right-4 z-30 flex gap-2">
                                <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white md:bg-white/80 md:dark:bg-black/50 md:text-slate-900 md:dark:text-white text-xs font-semibold shadow-sm border border-white/20 dark:border-white/10 transition-colors">
                                    {vehicle.brand}
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-6 sm:p-8 transition-colors">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20 text-xs font-medium transition-colors">{vehicle.category}</span>
                                    <h1 className="text-3xl font-bold mt-3 text-slate-900 dark:text-white transition-colors">{vehicle.brand} {vehicle.model}</h1>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">{vehicle.year}</p>
                                </div>
                            </div>

                            {vehicle.description && (
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6 transition-colors">{vehicle.description}</p>
                            )}

                            {/* Specs */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-center transition-colors">
                                    <Settings className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-2 transition-colors" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">{vehicle.transmission}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Transmissão</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-center transition-colors">
                                    <Fuel className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-2 transition-colors" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">{vehicle.fuelType}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Combustível</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-center transition-colors">
                                    <Users className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-2 transition-colors" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">{vehicle.seats}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Lugares</p>
                                </div>
                                <div className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl p-4 text-center transition-colors">
                                    <Calendar className="w-5 h-5 text-teal-600 dark:text-teal-400 mx-auto mb-2 transition-colors" />
                                    <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">{vehicle.year}</p>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Ano</p>
                                </div>
                            </div>

                            {/* Features */}
                            {features.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-3 text-sm text-slate-900 dark:text-slate-300 transition-colors">Características</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {features.map((f: string, i: number) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 transition-colors">
                                                <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0 transition-colors" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Regions */}
                            {vehicle.regions?.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-slate-200 dark:border-white/5 transition-colors">
                                    <h3 className="font-semibold mb-3 text-sm text-slate-900 dark:text-slate-300 transition-colors">Disponível em</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {vehicle.regions.map((vr: { id: number; region: { city: string; province: string } }) => (
                                            <span key={vr.id} className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-sm text-slate-700 dark:text-slate-300 transition-colors">
                                                <MapPin className="w-3 h-3 text-teal-600 dark:text-teal-400 transition-colors" />
                                                {vr.region.city}, {vr.region.province}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right - Booking Card */}
                    <div>
                        <div className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-6 lg:sticky lg:top-24 transition-colors">
                            <div className="text-center mb-6">
                                <div className="text-5xl font-bold text-teal-600 dark:text-teal-400 transition-colors">{Number(vehicle.pricePerDay).toLocaleString()}</div>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 transition-colors">MT por dia</p>
                            </div>

                            <Link
                                to={`/checkout/vehicle/${vehicle.id}`}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-600 hover:to-cyan-600 dark:hover:from-teal-400 dark:hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/25"
                                id="reserve-vehicle-btn"
                            >
                                Reservar Agora
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <div className="mt-8 space-y-4 text-sm border-t border-slate-200 dark:border-white/5 pt-6 transition-colors">
                                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 transition-colors">
                                    <span>Seguro incluído</span>
                                    <Check className="w-4 h-4 text-emerald-500 dark:text-green-400 transition-colors" />
                                </div>
                                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 transition-colors">
                                    <span>Assistência 24h</span>
                                    <Check className="w-4 h-4 text-emerald-500 dark:text-green-400 transition-colors" />
                                </div>
                                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400 transition-colors">
                                    <span>Cancelamento flexível</span>
                                    <Check className="w-4 h-4 text-emerald-500 dark:text-green-400 transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
