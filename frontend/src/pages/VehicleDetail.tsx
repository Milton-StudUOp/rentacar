import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { Fuel, Users, Settings, Calendar, MapPin, ArrowRight, Check, Building2, ChevronRight, Bus } from 'lucide-react';
import { motion } from 'framer-motion';
import ImageCarousel from '../components/ImageCarousel';
import CorporateRequestModal from '../components/CorporateRequestModal';

export default function VehicleDetail() {
    const { id } = useParams();
    const [isCorporateModalOpen, setIsCorporateModalOpen] = useState(false);

    const { data: vehicle, isLoading } = useQuery({
        queryKey: ['vehicle', id],
        queryFn: () => api.get(`/vehicles/${id}`).then(r => r.data),
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pt-24 transition-colors">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                    <div className="animate-pulse space-y-6">
                        <div className="bg-gray-200 dark:bg-zinc-800 aspect-video rounded-3xl" />
                        <div className="bg-gray-200 dark:bg-zinc-800 h-10 w-64 rounded-xl" />
                        <div className="bg-gray-200 dark:bg-zinc-800 h-6 w-96 rounded-xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (!vehicle) return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center transition-colors">
            <div className="text-center">
                <Bus className="w-16 h-16 text-gray-300 dark:text-zinc-700 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Viatura não encontrada</h2>
            </div>
        </div>
    );

    const features = vehicle.features?.split(',').map((f: string) => f.trim()) || [];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 transition-colors duration-300">

            {/* ── Hero Image Bar ───────────── */}
            <div className="bg-zinc-900 relative overflow-hidden aspect-[21/8] sm:aspect-[21/7]">
                <ImageCarousel images={vehicle.images} autoPlay interval={4000} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Breadcrumb overlaid */}
                <div className="absolute top-6 left-6 sm:left-10 flex items-center gap-2 text-sm text-white/70">
                    <Link to="/vehicles" className="hover:text-white transition-colors flex items-center gap-1">
                        <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Viaturas
                    </Link>
                    <ChevronRight className="w-3.5 h-3.5" />
                    <span className="text-white font-medium">{vehicle.brand} {vehicle.model}</span>
                </div>

                {/* Brand badge */}
                <div className="absolute top-5 right-6 sm:right-10">
                    <span className="px-4 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-sm font-bold border border-white/20">
                        {vehicle.brand}
                    </span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* ── Left — Details ─────────────────── */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Vehicle title */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                            <span className="inline-block px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold uppercase tracking-widest mb-3">
                                {vehicle.category}
                            </span>
                            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white">{vehicle.brand} {vehicle.model}</h1>
                            <p className="text-gray-500 dark:text-zinc-400 mt-1 text-lg">{vehicle.year}</p>
                        </motion.div>

                        {/* Specs grid */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                            className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { icon: Settings, label: 'Transmissão', value: vehicle.transmission },
                                { icon: Fuel, label: 'Combustível', value: vehicle.fuelType },
                                { icon: Users, label: 'Lugares', value: vehicle.seats },
                                { icon: Calendar, label: 'Ano', value: vehicle.year },
                            ].map((spec, i) => (
                                <div key={i} className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-4 text-center group hover:border-brand-500/30 transition-all">
                                    <spec.icon className="w-5 h-5 text-brand-500 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">{spec.value}</p>
                                    <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{spec.label}</p>
                                </div>
                            ))}
                        </motion.div>

                        {/* Description */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
                            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-6 shadow-sm dark:shadow-none">
                            {vehicle.description && (
                                <p className="text-gray-600 dark:text-zinc-300 leading-relaxed mb-6">{vehicle.description}</p>
                            )}

                            {/* Features */}
                            {features.length > 0 && (
                                <div>
                                    <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-4">Características</h3>
                                    <div className="grid grid-cols-2 gap-2.5">
                                        {features.map((f: string, i: number) => (
                                            <div key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-zinc-300">
                                                <Check className="w-4 h-4 text-brand-500 shrink-0" />
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Regions */}
                            {vehicle.regions?.length > 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-100 dark:border-white/5">
                                    <h3 className="font-bold text-sm text-gray-900 dark:text-white uppercase tracking-wider mb-3">Disponível em</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {vehicle.regions.map((vr: { id: number; region: { city: string; province: string } }) => (
                                            <span key={vr.id} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-white/6 text-sm text-gray-700 dark:text-zinc-300">
                                                <MapPin className="w-3 h-3 text-brand-500" />
                                                {vr.region.city}, {vr.region.province}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* ── Right — Booking Card ───────────── */}
                    <div>
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-6 lg:sticky lg:top-24 shadow-sm dark:shadow-none">

                            {/* Price */}
                            <div className="text-center mb-6 pb-6 border-b border-gray-100 dark:border-white/5">
                                <div className="text-5xl font-black text-brand-500">{Number(vehicle.pricePerDay).toLocaleString()}</div>
                                <p className="text-gray-500 dark:text-zinc-400 text-sm mt-1">MT por dia</p>
                            </div>

                            {/* CTAs */}
                            <div className="space-y-3 mb-6">
                                <Link
                                    to={`/checkout/vehicle/${vehicle.id}`}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25"
                                    id="reserve-vehicle-btn"
                                >
                                    Reservar Agora <ArrowRight className="w-4 h-4" />
                                </Link>

                                <button
                                    onClick={() => setIsCorporateModalOpen(true)}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl border-2 border-gray-200 dark:border-white/12 bg-transparent text-gray-800 dark:text-white font-bold hover:border-brand-500/40 hover:bg-brand-500/5 transition-all"
                                >
                                    <Building2 className="w-4 h-4 text-brand-500" />
                                    Solicitar Proposta para este Veículo
                                </button>
                            </div>

                            {/* Guarantees */}
                            <div className="space-y-3 pt-5 border-t border-gray-100 dark:border-white/5">
                                {['Seguro incluído', 'Assistência 24h', 'Cancelamento flexível'].map((item, i) => (
                                    <div key={i} className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600 dark:text-zinc-400">{item}</span>
                                        <Check className="w-4 h-4 text-green-500" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <CorporateRequestModal
                isOpen={isCorporateModalOpen}
                onClose={() => setIsCorporateModalOpen(false)}
                vehicleId={vehicle.id}
                vehicleName={`${vehicle.brand} ${vehicle.model}`}
            />
        </div>
    );
}
