import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, Lock, Eye, EyeOff, Loader2, CheckCircle, KeyRound } from 'lucide-react';
import { useState } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const inputCls = "w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/20 focus:outline-none transition-all pr-12";

export default function Profile() {
    const { user, loading, isAuthenticated } = useAuth();
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);

    if (loading) return null;
    if (!isAuthenticated) return <Navigate to="/" />;

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) { toast.error('As novas senhas não coincidem'); return; }
        if (passwordForm.newPassword.length < 6) { toast.error('A nova senha deve ter pelo menos 6 caracteres'); return; }
        setChangingPassword(true);
        try {
            await api.post('/auth/change-password', { currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
            toast.success('Senha alterada com sucesso!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Erro ao alterar senha');
        } finally { setChangingPassword(false); }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pt-24 pb-16 transition-colors duration-300">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white">Meu Perfil</h1>
                    <p className="text-gray-500 dark:text-zinc-400 mt-1">Gerencie as informações da sua conta</p>
                </motion.div>

                {/* Profile Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-none mb-5">

                    {/* Avatar Row */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-8 pb-8 border-b border-gray-100 dark:border-white/5">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-500 to-rose-600 flex items-center justify-center shadow-lg shadow-brand-500/25 shrink-0">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white">{user?.name}</h2>
                            <p className="text-gray-500 dark:text-zinc-400 text-sm mt-0.5">{user?.email || 'Sem email'}</p>
                            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-500 text-xs font-bold uppercase tracking-wider">
                                {user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                            </span>
                        </div>
                    </div>

                    {/* Info fields */}
                    <div className="space-y-4">
                        {[
                            { icon: Mail, label: 'Email', value: user?.email || 'Não definido' },
                            { icon: Phone, label: 'Telefone', value: user?.phone || 'Não definido' },
                            { icon: Shield, label: 'Tipo de conta', value: user?.role === 'ADMIN' ? 'Administrador' : 'Cliente' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-100 dark:border-white/5">
                                <div className="w-9 h-9 rounded-lg bg-white dark:bg-zinc-700 border border-gray-200 dark:border-white/8 flex items-center justify-center shrink-0">
                                    <item.icon className="w-4 h-4 text-gray-500 dark:text-zinc-400" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-0.5">{item.label}</p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Security Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-2xl p-6 sm:p-8 shadow-sm dark:shadow-none">

                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                <KeyRound className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 dark:text-white">Segurança</h3>
                                <p className="text-xs text-gray-500 dark:text-zinc-400">Altere a sua senha de acesso</p>
                            </div>
                        </div>
                        {!showPasswordForm && (
                            <button onClick={() => setShowPasswordForm(true)}
                                className="px-4 py-2 rounded-xl text-sm font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all">
                                Alterar Senha
                            </button>
                        )}
                    </div>

                    {showPasswordForm && (
                        <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            onSubmit={handleChangePassword} className="space-y-4">

                            {/* Current Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Senha Actual</label>
                                <div className="relative">
                                    <input type={showCurrent ? 'text' : 'password'} value={passwordForm.currentPassword}
                                        onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} required className={inputCls} placeholder="••••••••" />
                                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors">
                                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Nova Senha</label>
                                <div className="relative">
                                    <input type={showNew ? 'text' : 'password'} value={passwordForm.newPassword}
                                        onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required minLength={6} className={inputCls} placeholder="Mínimo 6 caracteres" />
                                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-zinc-200 transition-colors">
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Confirmar Nova Senha</label>
                                <input type="password" value={passwordForm.confirmPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} required className={inputCls.replace('pr-12', '')} placeholder="Repita a nova senha" />
                            </div>

                            {passwordForm.newPassword && passwordForm.confirmPassword && (
                                <div className={`flex items-center gap-1.5 text-xs font-medium ${passwordForm.newPassword === passwordForm.confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    {passwordForm.newPassword === passwordForm.confirmPassword ? 'As senhas coincidem' : 'As senhas não coincidem'}
                                </div>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={() => { setShowPasswordForm(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                                    className="flex-1 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-zinc-300 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={changingPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                                    className="flex-1 py-3 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/25 disabled:opacity-50 flex items-center justify-center gap-2">
                                    {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                    Confirmar Alteração
                                </button>
                            </div>
                        </motion.form>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
