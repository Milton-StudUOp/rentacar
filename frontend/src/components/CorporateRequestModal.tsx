import React, { useState } from 'react';
import { X, Building2, ArrowRight, Loader2 } from 'lucide-react';
import api from '../lib/api';
import toast from 'react-hot-toast';

interface CorporateRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    vehicleId: number;
    vehicleName: string;
}

export default function CorporateRequestModal({ isOpen, onClose, vehicleId, vehicleName }: CorporateRequestModalProps) {
    const [formData, setFormData] = useState({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        quantity: 1,
        periodType: 'MONTHS',
        periodDuration: 1,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/corporate-requests', { ...formData, vehicleId });
            setIsSuccess(true);
            toast.success('Pedido Submetido com Sucesso!', { duration: 5000 });
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            toast.error(err.response?.data?.message || 'Erro ao submeter pedido.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        onClose();
        if (isSuccess) {
            setTimeout(() => {
                setIsSuccess(false);
                setFormData({ companyName: '', contactName: '', email: '', phone: '', quantity: 1, periodType: 'MONTHS', periodDuration: 1 });
            }, 300);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={handleClose} />
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#0a0d18] md:bg-white/95 md:dark:bg-[#0a0d18]/95 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-3xl shadow-[0_32px_128px_-16px_rgba(0,0,0,0.5)] overflow-hidden animate-fade-in-up">

                {/* Header Decoration */}
                <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-br from-teal-500/10 to-cyan-600/10 pointer-events-none" />
                <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-600/5 rounded-full blur-[100px]" />

                <div className="relative p-7 sm:p-10 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar">
                    {/* Close Btn */}
                    <button
                        onClick={handleClose}
                        className="absolute top-6 right-6 p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-500 dark:text-slate-400 transition-all border border-slate-200 dark:border-white/10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="mb-10 pr-12">
                        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-5">
                            <Building2 className="w-3.5 h-3.5" /> Canal Corporativo
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Solicitar Cotação</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            Interesse na viatura <span className="text-teal-600 dark:text-teal-400 font-extrabold italic">{vehicleName}</span>.
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="py-16 flex flex-col items-center justify-center text-center">
                            <div className="w-24 h-24 bg-teal-500 text-white rounded-3xl rotate-12 flex items-center justify-center mb-8 shadow-xl shadow-teal-500/40">
                                <svg className="w-12 h-12 -rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-3">Obrigado!</h3>
                            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-sm mb-10">Recebemos o pedido da sua empresa. Um dos nossos gestores de conta contactará em breve.</p>

                            <button
                                onClick={handleClose}
                                className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-black font-black rounded-2xl hover:scale-105 transition-all shadow-xl active:scale-95"
                            >
                                FECHAR JANELA
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                    Identificação da Empresa <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Entidade / Empresa</label>
                                        <input type="text" required value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                                            placeholder="ex: ACME Moçambique, S.A." />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Responsável</label>
                                        <input type="text" required value={formData.contactName} onChange={e => setFormData({ ...formData, contactName: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                                            placeholder="Nome completo" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Contacto Telefónico</label>
                                        <input type="tel" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                                            placeholder="+258..." />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Email Corporativo</label>
                                        <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm"
                                            placeholder="email@empresa.co.mz" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                                    Plano de Aluguer <div className="h-px flex-1 bg-slate-200 dark:bg-white/5" />
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Qtd. Viaturas</label>
                                        <input type="number" min="1" required value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: Number(e.target.value) })}
                                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Unidade</label>
                                        <select value={formData.periodType} onChange={e => setFormData({ ...formData, periodType: e.target.value })}
                                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm appearance-none">
                                            <option value="DAYS">Dias</option>
                                            <option value="MONTHS">Meses</option>
                                            <option value="YEARS">Anos</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 ml-1">Duração</label>
                                        <input type="number" min="1" required value={formData.periodDuration} onChange={e => setFormData({ ...formData, periodDuration: Number(e.target.value) })}
                                            className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-white/10 rounded-2xl px-5 py-4 text-base text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all shadow-sm" />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full flex items-center justify-center gap-3 px-8 py-5 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-black text-lg transition-all shadow-xl shadow-teal-500/25 active:scale-[0.98] disabled:opacity-50"
                            >
                                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                    <>SOLICITAR COTAÇÃO CORPORATIVA <ArrowRight className="w-6 h-6" /></>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
