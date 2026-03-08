import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { Users, Mail, Phone, Shield, Calendar, Search } from 'lucide-react';
import { useState } from 'react';

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
        <div className="space-y-6 transition-colors duration-300">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 text-slate-900 dark:text-white transition-colors">Clientes</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors">{filtered.length} cliente{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Pesquisar por nome, email ou telefone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-teal-500/50 shadow-sm transition-colors"
                    id="search-clients"
                />
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="animate-pulse bg-slate-200 dark:bg-white/5 h-48 rounded-2xl transition-colors" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20 bg-white/50 dark:bg-slate-900/20 rounded-2xl border border-slate-200 dark:border-white/5 transition-colors">
                    <Users className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4 transition-colors" />
                    <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white transition-colors">Nenhum cliente encontrado</h3>
                    <p className="text-slate-500 dark:text-slate-400 transition-colors">Os clientes aparecerão aqui quando fizerem reservas</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((u: ClientData) => (
                        <div key={u.id} className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-6 hover:bg-slate-50 dark:hover:bg-white/10 transition-all duration-300 group">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg shadow-teal-500/20 group-hover:scale-110 transition-transform">
                                    {u.name?.charAt(0)?.toUpperCase() || '?'}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{u.name}</h3>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 transition-colors ${u.role === 'ADMIN' ? 'bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20' : 'bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20'
                                        }`}>
                                        <Shield className="w-2.5 h-2.5" />
                                        {u.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2.5 text-sm mb-4">
                                {u.email && (
                                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 transition-colors">
                                        <Mail className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 transition-colors" />
                                        <span className="truncate">{u.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 transition-colors">
                                    <Phone className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 transition-colors" />
                                    <span>{u.phone}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-white/5 text-sm transition-colors">
                                <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 transition-colors">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{u.bookings?.length || 0} reserva{(u.bookings?.length || 0) !== 1 ? 's' : ''}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 transition-colors">{u.totalSpent?.toLocaleString() || 0}</span>
                                    <span className="text-slate-400 dark:text-slate-500 text-xs ml-1 transition-colors">MT</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
