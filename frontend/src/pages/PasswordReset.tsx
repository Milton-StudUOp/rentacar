import React, { useState } from 'react';
import { Mail, Key, ShieldCheck, ArrowRight, Loader2, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';

type Step = 'REQUEST' | 'VERIFY' | 'RESET' | 'SUCCESS';

export default function PasswordReset() {
    const [step, setStep] = useState<Step>('REQUEST');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            toast.success('Código enviado para o seu email!');
            setStep('VERIFY');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Erro ao enviar código.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await api.post('/auth/verify-code', { email, code });
            toast.success('Código verificado!');
            setStep('RESET');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Código inválido ou expirado.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error('As senhas não coincidem.');
            return;
        }
        if (newPassword.length < 6) {
            toast.error('A senha deve ter pelo menos 6 caracteres.');
            return;
        }

        setIsLoading(true);
        try {
            await api.post('/auth/reset-password', { email, code, newPassword });
            setStep('SUCCESS');
            toast.success('Senha redefinida com sucesso!');
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            toast.error(error.response?.data?.message || 'Erro ao redefinir senha.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 dark:bg-[#0c0f1a]">
            {/* Background elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-md relative z-10 transition-all duration-500">
                {/* Logo or Back Link */}
                <div className="mb-8 flex justify-center">
                    <Link to="/checkout/vehicle/0" className="flex items-center gap-2 text-slate-500 hover:text-teal-600 transition-colors group">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-sm font-medium">Voltar ao Login</span>
                    </Link>
                </div>

                <div className="bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 rounded-3xl shadow-2xl shadow-teal-500/10 transition-all duration-500">
                    {step === 'REQUEST' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                <Mail className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">Esqueceu a senha?</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Introduza o seu email e enviaremos um código para redefinir a sua senha.</p>

                            <form onSubmit={handleRequest} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all dark:text-white"
                                            placeholder="exemplo@email.com"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            Enviar Código
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 'VERIFY' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                <ShieldCheck className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">Verificar Código</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Introduza o código de 6 dígitos enviado para <span className="text-teal-600 dark:text-teal-400 font-semibold">{email}</span>.</p>

                            <form onSubmit={handleVerify} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Código de Recuperação</label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all dark:text-white text-center tracking-[10px] text-xl font-bold"
                                            placeholder="000000"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verificar Agora'}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStep('REQUEST')}
                                    className="w-full py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-teal-600 transition-colors"
                                >
                                    Reenviar código
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 'RESET' && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-16 h-16 bg-teal-500/10 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                <Key className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center mb-2">Nova Senha</h2>
                            <p className="text-slate-500 dark:text-slate-400 text-center mb-8">Defina a sua nova senha de acesso.</p>

                            <form onSubmit={handleReset} className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Nova Senha</label>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all dark:text-white"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300 ml-1">Confirmar Senha</label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full px-4 py-3 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all dark:text-white"
                                        placeholder="••••••••"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-lg shadow-teal-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                                >
                                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Redefinir Senha'}
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 'SUCCESS' && (
                        <div className="animate-in fade-in zoom-in duration-500 text-center">
                            <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                                <CheckCircle2 className="w-10 h-10 text-teal-600 dark:text-teal-400" />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Tudo pronto!</h2>
                            <p className="text-slate-500 dark:text-slate-400 mb-8">A sua senha foi alterada com sucesso. Já pode aceder à sua conta.</p>

                            <Link
                                to="/checkout/vehicle/0"
                                className="inline-block w-full py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-xl font-bold shadow-lg shadow-teal-500/25 transition-all"
                            >
                                Ir para Login
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer simple link */}
                {step === 'REQUEST' && (
                    <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        Não tem conta? <Link to="/checkout/vehicle/0" className="text-teal-600 dark:text-teal-400 font-bold underline underline-offset-4">Registe-se</Link>
                    </p>
                )}
            </div>
        </div>
    );
}
