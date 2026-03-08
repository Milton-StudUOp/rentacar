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
                <div className="skeleton h-96 rounded-2xl mb-8" />
                <div className="skeleton h-10 w-64 rounded mb-4" />
                <div className="skeleton h-6 w-96 rounded" />
            </div>
        );
    }

    if (!vehicle) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold">Viatura não encontrada</h2>
            </div>
        );
    }

    const features = vehicle.features?.split(',').map((f: string) => f.trim()) || [];

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
                    <Link to="/vehicles" className="hover:text-teal-400">Viaturas</Link>
                    <span>/</span>
                    <span className="text-white">{vehicle.brand} {vehicle.model}</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left - Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Image */}
                        <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl relative overflow-hidden ring-1 ring-white/10 shadow-2xl">
                            <ImageCarousel images={vehicle.images} autoPlay interval={4000} />

                            {/* Overlay Badges */}
                            <div className="absolute top-4 right-4 z-30 flex gap-2">
                                <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-semibold shadow-sm border border-white/10">
                                    {vehicle.brand}
                                </span>
                            </div>
                        </div>

                        {/* Info */}
                        <div className="glass rounded-2xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <span className="px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-medium">{vehicle.category}</span>
                                    <h1 className="text-3xl font-bold mt-3">{vehicle.brand} {vehicle.model}</h1>
                                    <p className="text-slate-400 mt-1">{vehicle.year}</p>
                                </div>
                            </div>

                            {vehicle.description && (
                                <p className="text-slate-300 leading-relaxed mb-6">{vehicle.description}</p>
                            )}

                            {/* Specs */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                                <div className="glass rounded-xl p-4 text-center">
                                    <Settings className="w-5 h-5 text-teal-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium">{vehicle.transmission}</p>
                                    <p className="text-xs text-slate-400">Transmissão</p>
                                </div>
                                <div className="glass rounded-xl p-4 text-center">
                                    <Fuel className="w-5 h-5 text-teal-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium">{vehicle.fuelType}</p>
                                    <p className="text-xs text-slate-400">Combustível</p>
                                </div>
                                <div className="glass rounded-xl p-4 text-center">
                                    <Users className="w-5 h-5 text-teal-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium">{vehicle.seats}</p>
                                    <p className="text-xs text-slate-400">Lugares</p>
                                </div>
                                <div className="glass rounded-xl p-4 text-center">
                                    <Calendar className="w-5 h-5 text-teal-400 mx-auto mb-2" />
                                    <p className="text-sm font-medium">{vehicle.year}</p>
                                    <p className="text-xs text-slate-400">Ano</p>
                                </div>
                            </div>

                            {/* Features */}
                            {features.length > 0 && (
                                <div>
                                    <h3 className="font-semibold mb-3 text-sm text-slate-300">Características</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        {features.map((f: string, i: number) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                                                <Check className="w-4 h-4 text-teal-400 shrink-0" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Regions */}
                            {vehicle.regions?.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-white/5">
                                    <h3 className="font-semibold mb-3 text-sm text-slate-300">Disponível em</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {vehicle.regions.map((vr: { id: number; region: { city: string; province: string } }) => (
                                            <span key={vr.id} className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 text-sm text-slate-300">
                                                <MapPin className="w-3 h-3 text-teal-400" />
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
                        <div className="glass rounded-2xl p-6 sticky top-24">
                            <div className="text-center mb-6">
                                <div className="text-4xl font-bold text-teal-400">{Number(vehicle.pricePerDay).toLocaleString()}</div>
                                <p className="text-slate-400 text-sm">MT por dia</p>
                            </div>

                            <Link
                                to={`/checkout/vehicle/${vehicle.id}`}
                                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/25"
                                id="reserve-vehicle-btn"
                            >
                                Reservar Agora
                                <ArrowRight className="w-4 h-4" />
                            </Link>

                            <div className="mt-6 space-y-3 text-sm">
                                <div className="flex items-center justify-between text-slate-400">
                                    <span>Seguro incluído</span>
                                    <Check className="w-4 h-4 text-green-400" />
                                </div>
                                <div className="flex items-center justify-between text-slate-400">
                                    <span>Assistência 24h</span>
                                    <Check className="w-4 h-4 text-green-400" />
                                </div>
                                <div className="flex items-center justify-between text-slate-400">
                                    <span>Cancelamento flexível</span>
                                    <Check className="w-4 h-4 text-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
