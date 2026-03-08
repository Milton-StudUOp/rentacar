import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { User, Mail, Phone, Shield, Lock, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import api from '../lib/api';
import toast from 'react-hot-toast';

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
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('As novas senhas não coincidem');
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            toast.error('A nova senha deve ter pelo menos 6 caracteres');
            return;
        }
        setChangingPassword(true);
        try {
            await api.post('/auth/change-password', {
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            toast.success('Senha alterada com sucesso!');
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setShowPasswordForm(false);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Erro ao alterar senha');
        } finally {
            setChangingPassword(false);
        }
    };

    return (
        <div className="min-h-screen py-8 transition-colors duration-300">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white transition-colors">Meu Perfil</h1>

                <div className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-6 sm:p-8 transition-colors">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8 pb-8 border-b border-slate-200 dark:border-white/5 transition-colors">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20 shrink-0">
                            <User className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white transition-colors">{user?.name}</h2>
                            <span className="inline-block mt-2 sm:mt-1 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20 text-xs font-medium transition-colors">
                                {user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 transition-colors">
                                <Mail className="w-5 h-5 text-slate-400 dark:text-slate-400 transition-colors" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Email</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate transition-colors">{user?.email || 'Não definido'}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 transition-colors">
                                <Phone className="w-5 h-5 text-slate-400 dark:text-slate-400 transition-colors" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Telefone</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">{user?.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 transition-colors">
                                <Shield className="w-5 h-5 text-slate-400 dark:text-slate-400 transition-colors" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Tipo de conta</p>
                                <p className="text-sm font-medium text-slate-900 dark:text-white transition-colors">{user?.role === 'ADMIN' ? 'Administrador' : 'Cliente'}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Change Section */}
                <div className="bg-white/90 dark:bg-white/5 border border-slate-200 dark:border-white/10 backdrop-blur-md shadow-xl shadow-slate-200/50 dark:shadow-none rounded-2xl p-6 sm:p-8 mt-6 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center shrink-0 transition-colors">
                                <Lock className="w-5 h-5 text-amber-500 dark:text-amber-400 transition-colors" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-900 dark:text-white transition-colors">Segurança</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">Altere a sua senha de acesso</p>
                            </div>
                        </div>
                        {!showPasswordForm && (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="px-4 py-2 rounded-xl text-sm font-medium bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20 transition-all w-full sm:w-auto"
                            >
                                Alterar Senha
                            </button>
                        )}
                    </div>

                    {showPasswordForm && (
                        <form onSubmit={handleChangePassword} className="space-y-4 animate-fade-in-up">
                            <div>
                                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block transition-colors">Senha Actual</label>
                                <div className="relative">
                                    <input
                                        type={showCurrent ? 'text' : 'password'}
                                        value={passwordForm.currentPassword}
                                        onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        required
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500/50 focus:outline-none transition-colors pr-12"
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                        {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block transition-colors">Nova Senha</label>
                                <div className="relative">
                                    <input
                                        type={showNew ? 'text' : 'password'}
                                        value={passwordForm.newPassword}
                                        onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500/50 focus:outline-none transition-colors pr-12"
                                        placeholder="Mínimo 6 caracteres"
                                    />
                                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors">
                                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 dark:text-slate-400 mb-1 block transition-colors">Confirmar Nova Senha</label>
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    required
                                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500/50 focus:outline-none transition-colors"
                                    placeholder="Repita a nova senha"
                                />
                            </div>
                            {passwordForm.newPassword && passwordForm.confirmPassword && (
                                <div className={`flex items-center gap-2 text-xs ${passwordForm.newPassword === passwordForm.confirmPassword ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'} transition-colors`}>
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    {passwordForm.newPassword === passwordForm.confirmPassword ? 'As senhas coincidem' : 'As senhas não coincidem'}
                                </div>
                            )}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => { setShowPasswordForm(false); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }}
                                    className="w-full sm:flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors order-2 sm:order-1"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={changingPassword || passwordForm.newPassword !== passwordForm.confirmPassword}
                                    className="w-full sm:flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-600 hover:to-orange-600 dark:hover:from-amber-400 dark:hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25 disabled:opacity-50 flex items-center justify-center gap-2 order-1 sm:order-2"
                                >
                                    {changingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
                                    Confirmar Alteração
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
