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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Clientes</h1>
                    <p className="text-slate-400 mt-1">{filtered.length} cliente{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                    type="text"
                    placeholder="Pesquisar por nome, email ou telefone..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500/50"
                    id="search-clients"
                />
            </div>

            {/* Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="skeleton h-48 rounded-2xl" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-20">
                    <Users className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Nenhum cliente encontrado</h3>
                    <p className="text-slate-400">Os clientes aparecerão aqui quando fizerem reservas</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map((u: ClientData) => (
                        <div key={u.id} className="glass rounded-2xl p-6 hover:bg-white/5 transition-all group">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-lg shadow-teal-500/20">
                                    {u.name?.charAt(0)?.toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-white truncate group-hover:text-teal-400 transition-colors">{u.name}</h3>
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold mt-1 ${u.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-400' : 'bg-teal-500/10 text-teal-400'
                                        }`}>
                                        <Shield className="w-2.5 h-2.5" />
                                        {u.role === 'ADMIN' ? 'Admin' : 'Cliente'}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2.5 text-sm mb-4">
                                {u.email && (
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                        <span className="truncate">{u.email}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                                    <span>{u.phone}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/5 text-sm">
                                <div className="flex items-center gap-1.5 text-slate-400">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>{u.bookings.length} reserva{u.bookings.length !== 1 ? 's' : ''}</span>
                                </div>
                                <div>
                                    <span className="font-semibold text-emerald-400">{u.totalSpent.toLocaleString()}</span>
                                    <span className="text-slate-500 text-xs ml-1">MT</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
