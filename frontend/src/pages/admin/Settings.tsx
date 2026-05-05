import { useAuth } from '../../hooks/useAuth';
import { User, Shield, Key, Bell, Globe } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const inputCls = "w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 transition-all";
const selectCls = "w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500/50 transition-all";

export default function AdminSettings() {
    const { user } = useAuth();
    const [emailNotifs, setEmailNotifs] = useState(true);
    const [smsNotifs, setSmsNotifs] = useState(true);
    const [autoConfirm, setAutoConfirm] = useState(false);

    const handleSave = () => { toast.success('Definições guardadas com sucesso!'); };

    const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
        <button onClick={onChange}
            className={`w-12 h-6 rounded-full transition-all relative border ${value ? 'bg-brand-500 border-brand-600' : 'bg-gray-200 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600'}`}>
            <div className={`w-4 h-4 rounded-full bg-white shadow absolute top-0.5 transition-all ${value ? 'left-7' : 'left-0.5'}`} />
        </button>
    );

    return (
        <div className="space-y-6 max-w-3xl">
            {/* Header */}
            <div>
                <h1 className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 dark:text-white">Definições</h1>
                <p className="text-gray-500 dark:text-zinc-400 mt-1 text-sm">Configurações do sistema e conta</p>
            </div>

            {/* Profile */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-6 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-brand-500" />
                    </div>
                    <h2 className="font-bold text-gray-900 dark:text-white">Perfil do Administrador</h2>
                </div>

                <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-white/5">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-rose-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-brand-500/25">
                        {user?.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">{user?.name}</h3>
                        <p className="text-sm text-gray-500 dark:text-zinc-400">{user?.email}</p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-500 text-xs font-bold mt-1">
                            <Shield className="w-3 h-3" /> Administrador
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    {[
                        { label: 'Nome', type: 'text', def: user?.name || '' },
                        { label: 'Email', type: 'email', def: user?.email || '' },
                        { label: 'Telefone', type: 'tel', def: user?.phone || '' },
                    ].map(f => (
                        <div key={f.label}>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">{f.label}</label>
                            <input type={f.type} defaultValue={f.def} className={inputCls} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Notifications */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-6 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-violet-500" />
                    </div>
                    <h2 className="font-bold text-gray-900 dark:text-white">Notificações</h2>
                </div>

                <div className="space-y-3">
                    {[
                        { label: 'Notificações por Email', desc: 'Receber alertas de novas reservas por email', value: emailNotifs, onChange: () => setEmailNotifs(!emailNotifs) },
                        { label: 'Notificações por SMS', desc: 'Receber alertas por SMS para reservas urgentes', value: smsNotifs, onChange: () => setSmsNotifs(!smsNotifs) },
                        { label: 'Confirmação automática', desc: 'Confirmar reservas automaticamente sem revisão manual', value: autoConfirm, onChange: () => setAutoConfirm(!autoConfirm) },
                    ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-white/5">
                            <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.label}</p>
                                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5">{item.desc}</p>
                            </div>
                            <Toggle value={item.value} onChange={item.onChange} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Security */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-6 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <Key className="w-5 h-5 text-red-500" />
                    </div>
                    <h2 className="font-bold text-gray-900 dark:text-white">Segurança</h2>
                </div>
                <div className="space-y-4">
                    {['Senha actual', 'Nova senha', 'Confirmar nova senha'].map(label => (
                        <div key={label}>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">{label}</label>
                            <input type="password" placeholder="••••••••" className={inputCls} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Regional */}
            <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-6 shadow-sm dark:shadow-none">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-cyan-500" />
                    </div>
                    <h2 className="font-bold text-gray-900 dark:text-white">Configurações Regionais</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        { label: 'Moeda', options: ['MZN — Metical', 'USD — Dólar'] },
                        { label: 'Idioma', options: ['Português (Moçambique)', 'English'] },
                        { label: 'Fuso horário', options: ['África/Maputo (CAT, UTC+2)'] },
                        { label: 'Formato de data', options: ['DD/MM/AAAA', 'MM/DD/AAAA'] },
                    ].map(f => (
                        <div key={f.label}>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">{f.label}</label>
                            <select className={selectCls}>
                                {f.options.map(o => <option key={o}>{o}</option>)}
                            </select>
                        </div>
                    ))}
                </div>
            </div>

            {/* Save */}
            <div className="flex justify-end pt-2">
                <button onClick={handleSave}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25">
                    Guardar Alterações
                </button>
            </div>
        </div>
    );
}
