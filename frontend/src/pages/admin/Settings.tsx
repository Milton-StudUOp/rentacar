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
        <div className="space-y-6 max-w-3xl transition-colors duration-300">
            <div className="animate-fade-in-up">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 text-slate-900 dark:text-white transition-colors">Definições</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1 transition-colors text-sm md:text-lg">Configurações do sistema e conta</p>
            </div>

            {/* Profile */}
            <div className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-6 transition-colors">
                <div className="flex items-center gap-3 mb-6 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center transition-colors">
                        <User className="w-5 h-5 text-teal-600 dark:text-teal-400 transition-colors" />
                    </div>
                    <h2 className="font-semibold text-slate-900 dark:text-white transition-colors">Perfil do Administrador</h2>
                </div>

                <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-amber-500/20 transition-colors">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white transition-colors">{user?.name}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 transition-colors">{user?.email}</p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-medium mt-1 transition-colors">
                            <Shield className="w-3 h-3" /> Administrador
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 tracking-wider uppercase transition-colors">Nome</label>
                        <input type="text" defaultValue={user?.name} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 tracking-wider uppercase transition-colors">Email</label>
                        <input type="email" defaultValue={user?.email || ''} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 tracking-wider uppercase transition-colors">Telefone</label>
                        <input type="tel" defaultValue={user?.phone} className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all" />
                    </div>
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-6 transition-colors">
                <div className="flex items-center gap-3 mb-6 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center transition-colors">
                        <Bell className="w-5 h-5 text-violet-600 dark:text-violet-400 transition-colors" />
                    </div>
                    <h2 className="font-semibold text-slate-900 dark:text-white transition-colors">Notificações</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-colors">
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">Notificações por Email</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Receber alertas de novas reservas por email</p>
                        </div>
                        <button
                            onClick={() => setEmailNotifs(!emailNotifs)}
                            className={`w-12 h-7 rounded-full transition-all relative ${emailNotifs ? 'bg-teal-500 shadow-inner' : 'bg-slate-300 dark:bg-white/10'}`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all ${emailNotifs ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-colors">
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">Notificações por SMS</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Receber alertas por SMS para reservas urgentes</p>
                        </div>
                        <button
                            onClick={() => setSmsNotifs(!smsNotifs)}
                            className={`w-12 h-7 rounded-full transition-all relative ${smsNotifs ? 'bg-teal-500 shadow-inner' : 'bg-slate-300 dark:bg-white/10'}`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all ${smsNotifs ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 transition-colors">
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">Confirmação automática</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Confirmar reservas automaticamente (sem revisão manual)</p>
                        </div>
                        <button
                            onClick={() => setAutoConfirm(!autoConfirm)}
                            className={`w-12 h-7 rounded-full transition-all relative ${autoConfirm ? 'bg-teal-500 shadow-inner' : 'bg-slate-300 dark:bg-white/10'}`}
                        >
                            <div className={`w-5 h-5 rounded-full bg-white shadow absolute top-1 transition-all ${autoConfirm ? 'left-6' : 'left-1'}`} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Security */}
            <div className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-6 transition-colors">
                <div className="flex items-center gap-3 mb-6 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center transition-colors">
                        <Key className="w-5 h-5 text-red-600 dark:text-red-400 transition-colors" />
                    </div>
                    <h2 className="font-semibold text-slate-900 dark:text-white transition-colors">Segurança</h2>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 tracking-wider uppercase transition-colors">Senha actual</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 tracking-wider uppercase transition-colors">Nova senha</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 tracking-wider uppercase transition-colors">Confirmar nova senha</label>
                        <input type="password" placeholder="••••••••" className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all" />
                    </div>
                </div>
            </div>

            {/* Regional */}
            <div className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-6 transition-colors">
                <div className="flex items-center gap-3 mb-6 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center transition-colors">
                        <Globe className="w-5 h-5 text-cyan-600 dark:text-cyan-400 transition-colors" />
                    </div>
                    <h2 className="font-semibold text-slate-900 dark:text-white transition-colors">Configurações Regionais</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 tracking-wider uppercase transition-colors">Moeda</label>
                        <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all">
                            <option value="MZN">MZN — Metical</option>
                            <option value="USD">USD — Dólar</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 tracking-wider uppercase transition-colors">Idioma</label>
                        <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all">
                            <option value="pt-MZ">Português (Moçambique)</option>
                            <option value="en">English</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 tracking-wider uppercase transition-colors">Fuso horário</label>
                        <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all">
                            <option value="Africa/Maputo">África/Maputo (CAT, UTC+2)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 tracking-wider uppercase transition-colors">Formato de data</label>
                        <select className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-transparent transition-all">
                            <option value="dd/mm/yyyy">DD/MM/AAAA</option>
                            <option value="mm/dd/yyyy">MM/DD/AAAA</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSave}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold hover:from-teal-400 hover:to-cyan-400 transition-all shadow-lg shadow-teal-500/25"
                >
                    Guardar Alterações
                </button>
            </div>
        </div>
    );
}
