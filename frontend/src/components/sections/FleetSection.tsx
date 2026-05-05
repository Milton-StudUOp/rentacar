import { motion, AnimatePresence } from 'framer-motion';
import { Bus, Users, X, ChevronRight, CheckCircle2, Gauge, Zap } from 'lucide-react';
import { useState } from 'react';
import { getPublicUrl } from '../../utils/assetUrl';

const fleet = [
    {
        name: 'Toyota HiAce',
        category: 'Van Premium',
        capacity: '8–12',
        ideal: 'Executivos · Rotas urbanas',
        img: getPublicUrl('/vehicle-hiace.png'),
        badge: 'Popular',
        badgeColor: 'bg-brand-500',
        specs: { Motor: 'Diesel 2.8L', 'Ar Cond.': 'Sim', Cintos: 'Todos', GPS: 'Sim', Manutenção: 'Semestral' },
    },
    {
        name: 'VW Transporter',
        category: 'Van Premium',
        capacity: '8–12',
        ideal: 'Executivos · Aeroporto',
        img: getPublicUrl('/vehicle-transporter.png'),
        badge: 'Destaque',
        badgeColor: 'bg-amber-500',
        specs: { Motor: 'Diesel 2.0L TDI', 'Ar Cond.': 'Sim', Cintos: 'Todos', GPS: 'Sim', Manutenção: 'Semestral' },
    },
    {
        name: 'Nissan NV350',
        category: 'Van Operacional',
        capacity: '8–12',
        ideal: 'Operações · Indústria',
        img: getPublicUrl('/vehicle-nv350.png'),
        badge: null,
        badgeColor: '',
        specs: { Motor: 'Diesel 2.5L', 'Ar Cond.': 'Sim', Cintos: 'Todos', GPS: 'Sim', Manutenção: 'Semestral' },
    },
    {
        name: 'Toyota Coaster',
        category: 'Minibus Médio',
        capacity: '14–18',
        ideal: 'Grandes equipas · Mineração',
        img: getPublicUrl('/vehicle-coaster.png'),
        badge: 'Elite',
        badgeColor: 'bg-purple-600',
        specs: { Motor: 'Diesel 4.2L', 'Ar Cond.': 'Sim', Cintos: 'Todos', GPS: 'Sim', Manutenção: 'Trimestral' },
    },
    {
        name: 'Rosa Bus',
        category: 'Minibus Médio',
        capacity: '14–18',
        ideal: 'Grandes equipas · Mineração',
        img: getPublicUrl('/vehicle-rosa.png'),
        badge: null,
        badgeColor: '',
        specs: { Motor: 'Diesel 4.9L', 'Ar Cond.': 'Sim', Cintos: 'Todos', GPS: 'Sim', Manutenção: 'Trimestral' },
    },
    {
        name: 'Iveco Daily',
        category: 'Minibus Capacidade',
        capacity: '14–18',
        ideal: 'Logística · Grandes rotas',
        img: getPublicUrl('/vehicle-iveco.png'),
        badge: null,
        badgeColor: '',
        specs: { Motor: 'Diesel 3.0L', 'Ar Cond.': 'Sim', Cintos: 'Todos', GPS: 'Sim', Manutenção: 'Trimestral' },
    },
];

const categories = ['Todos', 'Van Premium', 'Van Operacional', 'Minibus Médio', 'Minibus Capacidade'];

type Vehicle = typeof fleet[0];

/* ── Vehicle card ─────────────────────────────────────── */
function VehicleCard({ v, index, onClick }: { v: Vehicle; index: number; onClick: () => void }) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -8 }}
            onClick={onClick}
            className="group bg-white dark:bg-charcoal-900 rounded-3xl overflow-hidden border border-charcoal-100 dark:border-white/6 shadow-sm hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 cursor-pointer"
        >
            {/* Image */}
            <div className="relative overflow-hidden aspect-video bg-charcoal-50 dark:bg-charcoal-800">
                <img
                    src={v.img}
                    alt={v.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {v.badge && (
                        <span className={`${v.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide`}>
                            {v.badge}
                        </span>
                    )}
                </div>
                <span className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10">
                    {v.capacity} pass.
                </span>

                {/* Hover CTA overlay */}
                <motion.div
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap"
                    initial={false}
                >
                    Ver Especificações <ChevronRight className="w-3 h-3" />
                </motion.div>
            </div>

            {/* Info */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h3 className="font-bold text-lg text-charcoal-900 dark:text-white">{v.name}</h3>
                        <p className="text-xs text-brand-500 font-semibold uppercase tracking-widest mt-0.5">{v.category}</p>
                    </div>
                    <motion.div
                        whileHover={{ rotate: 45 }}
                        className="w-8 h-8 rounded-lg bg-charcoal-50 dark:bg-charcoal-800 flex items-center justify-center group-hover:bg-brand-500 transition-colors duration-300"
                    >
                        <ChevronRight className="w-4 h-4 text-charcoal-400 group-hover:text-white transition-colors" />
                    </motion.div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-charcoal-500 dark:text-charcoal-400 mt-3">
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span>{v.ideal}</span>
                </div>
            </div>
        </motion.div>
    );
}

/* ── Modal ────────────────────────────────────────────── */
function VehicleModal({ v, onClose }: { v: Vehicle; onClose: () => void }) {
    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                    className="absolute inset-0 bg-black/70"
                />

                {/* Panel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onClick={e => e.stopPropagation()}
                    className="relative z-10 bg-white dark:bg-charcoal-900 rounded-3xl max-w-lg w-full overflow-hidden border border-charcoal-200/50 dark:border-white/8 shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
                >
                    {/* Image */}
                    <div className="relative">
                        <img src={v.img} alt={v.name} className="w-full h-52 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-4 left-5">
                            <h3 className="text-2xl font-black text-white">{v.name}</h3>
                            <p className="text-brand-400 text-xs font-bold uppercase tracking-wider">{v.category} · {v.capacity} Passageiros</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-black/30 backdrop-blur-sm flex items-center justify-center hover:bg-black/50 transition-colors border border-white/10"
                        >
                            <X className="w-4 h-4 text-white" />
                        </button>
                    </div>

                    {/* Specs */}
                    <div className="p-6">
                        <div className="flex items-center gap-2 text-xs text-charcoal-500 dark:text-charcoal-400 mb-5">
                            <Gauge className="w-3.5 h-3.5" /> Especificações Técnicas
                        </div>
                        <div className="space-y-3 mb-6">
                            {Object.entries(v.specs).map(([k, val]) => (
                                <div key={k} className="flex justify-between items-center py-2 border-b border-charcoal-50 dark:border-charcoal-800">
                                    <span className="text-sm text-charcoal-500 dark:text-charcoal-400">{k}</span>
                                    <div className="flex items-center gap-1.5">
                                        {val === 'Sim' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />}
                                        <span className="text-sm font-semibold text-charcoal-900 dark:text-white">{val}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Ideal */}
                        <div className="flex items-center gap-2 text-sm text-charcoal-600 dark:text-charcoal-300 mb-6 p-3 bg-charcoal-50 dark:bg-charcoal-800 rounded-xl">
                            <Zap className="w-4 h-4 text-brand-500 shrink-0" />
                            Ideal para: <span className="font-medium">{v.ideal}</span>
                        </div>

                        <motion.a
                            href="#contacto"
                            onClick={onClose}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="block w-full py-3.5 rounded-2xl bg-brand-500 text-white font-bold text-sm text-center hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25"
                        >
                            Solicitar Proposta para este Veículo
                        </motion.a>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default function FleetSection() {
    const [filter, setFilter] = useState('Todos');
    const [modal, setModal] = useState<Vehicle | null>(null);
    const filtered = filter === 'Todos' ? fleet : fleet.filter(v => v.category === filter);

    return (
        <section id="frota" className="py-32 bg-[#FAFAFA] dark:bg-[#0a0a0c] transition-colors relative overflow-hidden">

            {/* Ambient */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-500/15 to-transparent" />
                <div className="absolute -left-32 top-1/3 w-64 h-64 rounded-full"
                    style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.04) 0%, transparent 70%)' }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
                        <Bus className="w-3.5 h-3.5" />
                        Nossa Frota
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-heading font-black text-charcoal-900 dark:text-white mb-4">
                        Viaturas <span className="text-brand-500">de Elite</span>
                    </h2>
                    <p className="text-charcoal-500 dark:text-charcoal-400 text-lg font-light max-w-xl mx-auto">
                        Frota curada para máxima segurança, conforto e imagem corporativa de excelência
                    </p>
                </motion.div>

                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-wrap justify-center gap-2 mb-14"
                >
                    {categories.map(c => (
                        <motion.button
                            key={c}
                            onClick={() => setFilter(c)}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                                filter === c
                                    ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/30'
                                    : 'bg-white dark:bg-charcoal-800 text-charcoal-600 dark:text-charcoal-300 border border-charcoal-200 dark:border-charcoal-700 hover:border-brand-500/40'
                            }`}
                        >
                            {c}
                        </motion.button>
                    ))}
                </motion.div>

                {/* Grid */}
                <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence mode="popLayout">
                        {filtered.map((v, i) => (
                            <VehicleCard key={v.name} v={v} index={i} onClick={() => setModal(v)} />
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {modal && <VehicleModal v={modal} onClose={() => setModal(null)} />}
            </AnimatePresence>
        </section>
    );
}
