import React, { useState } from 'react';
import { Mail, Key, ShieldCheck, ArrowRight, Loader2, CheckCircle2, ChevronLeft, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Step = 'REQUEST' | 'VERIFY' | 'RESET' | 'SUCCESS';

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
    { id: 'REQUEST', label: 'Email', icon: Mail },
    { id: 'VERIFY', label: 'Código', icon: ShieldCheck },
    { id: 'RESET', label: 'Nova Senha', icon: Key },
];

const inputCls = "w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-zinc-500 focus:outline-none focus:border-brand-500/60 focus:ring-1 focus:ring-brand-500/20 transition-all";

const slideAnim = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
    exit: { opacity: 0, x: -30, transition: { duration: 0.25 } },
};

export default function PasswordReset() {
    const [step, setStep] = useState<Step>('REQUEST');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRequest = async (e: React.FormEvent) => {
        e.preventDefault(); setIsLoading(true);
        try { await api.post('/auth/forgot-password', { email }); toast.success('Código enviado para o seu email!'); setStep('VERIFY'); }
        catch (err: unknown) { const e = err as { response?: { data?: { message?: string } } }; toast.error(e.response?.data?.message || 'Erro ao enviar código.'); }
        finally { setIsLoading(false); }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault(); setIsLoading(true);
        try { await api.post('/auth/verify-code', { email, code }); toast.success('Código verificado!'); setStep('RESET'); }
        catch (err: unknown) { const e = err as { response?: { data?: { message?: string } } }; toast.error(e.response?.data?.message || 'Código inválido ou expirado.'); }
        finally { setIsLoading(false); }
    };

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) { toast.error('As senhas não coincidem.'); return; }
        if (newPassword.length < 6) { toast.error('A senha deve ter pelo menos 6 caracteres.'); return; }
        setIsLoading(true);
        try { await api.post('/auth/reset-password', { email, code, newPassword }); setStep('SUCCESS'); toast.success('Senha redefinida com sucesso!'); }
        catch (err: unknown) { const e = err as { response?: { data?: { message?: string } } }; toast.error(e.response?.data?.message || 'Erro ao redefinir senha.'); }
        finally { setIsLoading(false); }
    };

    const currentStepIndex = steps.findIndex(s => s.id === step);

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-zinc-950 relative overflow-hidden transition-colors">
            {/* Ambient glows */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.06) 0%, transparent 60%)' }} />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(200,16,46,0.04) 0%, transparent 60%)' }} />

            <div className="w-full max-w-md relative z-10">
                {/* Back link */}
                <div className="mb-8 flex justify-center">
                    <Link to="/checkout/vehicle/0" className="flex items-center gap-2 text-gray-500 dark:text-zinc-400 hover:text-brand-500 transition-colors group text-sm font-medium">
                        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Voltar ao Login
                    </Link>
                </div>

                {/* Progress Steps */}
                {step !== 'SUCCESS' && (
                    <div className="flex items-center justify-center gap-2 mb-8">
                        {steps.map((s, i) => (
                            <React.Fragment key={s.id}>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${i === currentStepIndex ? 'bg-brand-500 text-white' : i < currentStepIndex ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-zinc-800 text-gray-500 dark:text-zinc-400'}`}>
                                    {i < currentStepIndex ? <CheckCircle2 className="w-3 h-3" /> : <s.icon className="w-3 h-3" />}
                                    {s.label}
                                </div>
                                {i < steps.length - 1 && <div className={`h-px w-6 transition-colors ${i < currentStepIndex ? 'bg-green-500' : 'bg-gray-200 dark:bg-zinc-800'}`} />}
                            </React.Fragment>
                        ))}
                    </div>
                )}

                {/* Card */}
                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/6 rounded-3xl shadow-xl shadow-gray-100 dark:shadow-none overflow-hidden">
                    <AnimatePresence mode="wait">

                        {step === 'REQUEST' && (
                            <motion.div key="request" variants={slideAnim} initial="hidden" animate="visible" exit="exit" className="p-8">
                                <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                    <Mail className="w-7 h-7 text-brand-500" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">Esqueceu a senha?</h2>
                                <p className="text-gray-500 dark:text-zinc-400 text-center text-sm mb-8">Introduza o seu email e enviaremos um código para redefinir a sua senha.</p>
                                <form onSubmit={handleRequest} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                                                className={`${inputCls} pl-10`} placeholder="exemplo@empresa.com" />
                                        </div>
                                    </div>
                                    <button type="submit" disabled={isLoading}
                                        className="w-full py-4 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 group disabled:opacity-70">
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><span>Enviar Código</span><ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 'VERIFY' && (
                            <motion.div key="verify" variants={slideAnim} initial="hidden" animate="visible" exit="exit" className="p-8">
                                <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                    <ShieldCheck className="w-7 h-7 text-brand-500" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">Verificar Código</h2>
                                <p className="text-gray-500 dark:text-zinc-400 text-center text-sm mb-8">
                                    Introduza o código enviado para <span className="text-brand-500 font-semibold">{email}</span>
                                </p>
                                <form onSubmit={handleVerify} className="space-y-5">
                                    <input type="text" required maxLength={6} value={code} onChange={e => setCode(e.target.value)}
                                        className={`${inputCls} text-center tracking-[12px] text-2xl font-black`} placeholder="000000" />
                                    <button type="submit" disabled={isLoading}
                                        className="w-full py-4 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 disabled:opacity-70">
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verificar Agora'}
                                    </button>
                                    <button type="button" onClick={() => setStep('REQUEST')} className="w-full py-2 text-sm text-gray-500 dark:text-zinc-400 hover:text-brand-500 transition-colors">
                                        Reenviar código
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 'RESET' && (
                            <motion.div key="reset" variants={slideAnim} initial="hidden" animate="visible" exit="exit" className="p-8">
                                <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center mb-6 mx-auto">
                                    <Lock className="w-7 h-7 text-brand-500" />
                                </div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white text-center mb-2">Nova Senha</h2>
                                <p className="text-gray-500 dark:text-zinc-400 text-center text-sm mb-8">Defina a sua nova senha de acesso.</p>
                                <form onSubmit={handleReset} className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Nova Senha</label>
                                        <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className={inputCls} placeholder="Mínimo 6 caracteres" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 dark:text-zinc-400 mb-1.5 uppercase tracking-wider">Confirmar Senha</label>
                                        <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputCls} placeholder="Repita a nova senha" />
                                    </div>
                                    {newPassword && confirmPassword && (
                                        <p className={`text-xs flex items-center gap-1.5 ${newPassword === confirmPassword ? 'text-green-500' : 'text-red-500'}`}>
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                            {newPassword === confirmPassword ? 'As senhas coincidem' : 'As senhas não coincidem'}
                                        </p>
                                    )}
                                    <button type="submit" disabled={isLoading}
                                        className="w-full py-4 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 disabled:opacity-70">
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Redefinir Senha'}
                                    </button>
                                </form>
                            </motion.div>
                        )}

                        {step === 'SUCCESS' && (
                            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 text-center">
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                                    className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                                </motion.div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">Tudo pronto!</h2>
                                <p className="text-gray-500 dark:text-zinc-400 mb-8">A sua senha foi alterada com sucesso. Já pode aceder à sua conta.</p>
                                <Link to="/checkout/vehicle/0" className="block w-full py-4 rounded-2xl bg-brand-500 text-white font-bold hover:bg-brand-600 transition-colors shadow-lg shadow-brand-500/25">
                                    Ir para Login
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {step === 'REQUEST' && (
                    <p className="mt-6 text-center text-sm text-gray-500 dark:text-zinc-400">
                        Não tem conta?{' '}
                        <Link to="/checkout/vehicle/0" className="text-brand-500 font-bold hover:text-brand-600 transition-colors">Registe-se</Link>
                    </p>
                )}
            </div>
        </div>
    );
}
