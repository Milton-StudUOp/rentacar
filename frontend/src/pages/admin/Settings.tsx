import { useAuth } from '../../hooks/useAuth';
import { User, Shield, Key, Bell, Globe } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminSettings() {
    const { user } = useAuth();
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [smsNotifs, setSmsNotifs] = useState(true);
    const [autoConfirm, setAutoConfirm] = useState(false);

    const handleSave = () => {
        toast.success('Definições guardadas com sucesso!');
    };

    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h1 className="text-3xl font-bold">Definições</h1>
                <p className="text-slate-400 mt-1">Configurações do sistema e conta</p>
            </div>

            {/* Profile */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-teal-400" />
                    </div>
                    <h2 className="font-semibold">Perfil do Administrador</h2>
                </div>

                <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-amber-500/20">
                        {user?.name?.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{user?.name}</h3>
                        <p className="text-sm text-slate-400">{user?.email}</p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium mt-1">
                            <Shield className="w-3 h-3" /> Administrador
                        </span>
                    </div>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Nome</label>
                        <input type="text" defaultValue={user?.name} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50" />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Email</label>
                        <input type="email" defaultValue={user?.email || ''} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50" />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Telefone</label>
                        <input type="tel" defaultValue={user?.phone} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50" />
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-violet-400" />
                    </div>
                    <h2 className="font-semibold">Notificações</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div>
                            <p className="text-sm font-medium">Notificações por Email</p>
                            <p className="text-xs text-slate-400">Receber alertas de novas reservas por email</p>
                        </div>
                        <button
                            onClick={() => setEmailNotifs(!emailNotifs)}
                            className={`w-12 h-7 rounded-full transition-all relative ${emailNotifs ? 'bg-teal-500' : 'bg-white/10'}`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all ${emailNotifs ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div>
                            <p className="text-sm font-medium">Notificações por SMS</p>
                            <p className="text-xs text-slate-400">Receber alertas por SMS para reservas urgentes</p>
                        </div>
                        <button
                            onClick={() => setSmsNotifs(!smsNotifs)}
                            className={`w-12 h-7 rounded-full transition-all relative ${smsNotifs ? 'bg-teal-500' : 'bg-white/10'}`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all ${smsNotifs ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                        <div>
                            <p className="text-sm font-medium">Confirmação automática</p>
                            <p className="text-xs text-slate-400">Confirmar reservas automaticamente (sem revisão manual)</p>
                        </div>
                        <button
                            onClick={() => setAutoConfirm(!autoConfirm)}
                            className={`w-12 h-7 rounded-full transition-all relative ${autoConfirm ? 'bg-teal-500' : 'bg-white/10'}`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all ${autoConfirm ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">
                        <Key className="w-5 h-5 text-red-400" />
                    </div>
                    <h2 className="font-semibold">Segurança</h2>
                </div>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Senha actual</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50" />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Nova senha</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50" />
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Confirmar nova senha</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50" />
                    </div>
                </div>
            </div>

            {/* Regional */}
            <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-cyan-400" />
                    </div>
                    <h2 className="font-semibold">Configurações Regionais</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Moeda</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50">
                            <option value="MZN">MZN — Metical</option>
                            <option value="USD">USD — Dólar</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Idioma</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50">
                            <option value="pt-MZ">Português (Moçambique)</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Fuso horário</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50">
                            <option value="Africa/Maputo">África/Maputo (CAT, UTC+2)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-slate-400 mb-1">Formato de data</label>
                        <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-teal-500/50">
                            <option value="dd/mm/yyyy">DD/MM/AAAA</option>
                            <option value="mm/dd/yyyy">MM/DD/AAAA</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className="px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/25"
                >
                    Guardar Alterações
                </button>
            </div>
        </div>
    );
}
