import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { Users, Mail, Phone, Shield, Calendar, Search, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface ClientData {
    id: number;
    name: string;
    email: string | null;
    phone: string;
    role: string;
    bookings: Array<{ status: string; totalPrice: number }>;
    totalSpent: number;
}

export default function AdminClients() {
    const [search, setSearch] = useState('');

    const { data, isLoading } = useQuery({
        queryKey: ['adminClients'],
        queryFn: () => api.get('/users/clients').then(r => r.data),
    });

    const filtered = data?.filter((u: ClientData) =>
        !search || u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()) ||
        u.phone?.includes(search)
    ) || [];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">Clientes</h1>
                    <p className="text-gray-500 dark:text-zinc-400 mt-1 text-sm">{filtered.length} cliente{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm">
                    <div className="text-center">
                        <div className="font-black text-2xl text-gray-900 dark:text-white">{data?.length || 0}</div>
                        <div className="text-xs text-gray-500 dark:text-zinc-400">Total</div>
                    </div>
                    <div className="w-px h-8 bg-gray-200 dark:bg-white/8" />
                    <div className="text-center">
                        <div className="font-black text-2xl text-brand-500">{data?.filter((u: ClientData) => u.bookings?.length > 0).length || 0}</div>
                        <div className="text-xs text-gray-500 dark:text-zinc-400">Com reservas</div>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500" />
                <input type="text" placeholder="Pesquisar por nome, email ou telefone..."
                    value={search} onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/20 transition-all shadow-sm"
                    id="search-clients" />
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="animate-pulse bg-gray-200 dark:bg-zinc-800 h-48 rounded-2xl" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-white/6">
                    <Users className="w-16 h-16 text-gray-300 dark:text-zinc-700 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Nenhum cliente encontrado</h3>
                    <p className="text-gray-500 dark:text-zinc-400">Os clientes aparecerão aqui quando fizerem reservas</p>
                </div>
            ) : (
                <motion.div initial="hidden" animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((u: ClientData) => (
                        <motion.div key={u.id}
                            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                            whileHover={{ y: -4 }}
                            className="group bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-5 hover:border-brand-500/25 hover:shadow-lg hover:shadow-brand-500/8 transition-all duration-300">
                            <div className="flex items-start gap-3.5 mb-4">
                                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-rose-600 flex items-center justify-center text-white text-base font-black shrink-0 shadow-lg shadow-brand-500/25 group-hover:scale-110 transition-transform">
                                    {u.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-bold text-gray-900 dark:text-white truncate text-sm">{u.name}</h3>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold mt-1 ${u.role === 'ADMIN' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' : 'bg-brand-500/8 text-brand-600 dark:text-brand-400 border border-brand-500/15'}`}>
                                        <Shield className="w-2.5 h-2.5" />
                                        {u.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm mb-4">
                                {u.email && (
                                    <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
                                        <Mail className="w-3.5 h-3.5 shrink-0" />
                                        <span className="truncate">{u.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400">
                                    <Phone className="w-3.5 h-3.5 shrink-0" />
                                    <span>{u.phone}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3.5 border-t border-gray-100 dark:border-white/5 text-sm">
                                <div className="flex items-center gap-1.5 text-gray-500 dark:text-zinc-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{u.bookings?.length || 0} reserva{(u.bookings?.length || 0) !== 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                                    <TrendingUp className="w-3.5 h-3.5" />
                                    <span>{(u.totalSpent || 0).toLocaleString()} MT</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </div>
    );
}
