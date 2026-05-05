import { Link } from 'react-router-dom';
import { Bus, Phone, Mail, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-charcoal-900 text-white mt-auto">
            {/* CTA Band */}
            <div className="bg-brand-500">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                        <p className="text-white/90 text-sm font-medium">Precisa de uma proposta personalizada para a sua empresa?</p>
                        <p className="text-white font-bold text-lg">Resposta garantida em 48 horas úteis.</p>
                    </div>
                    <Link
                        to="/about"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-500 font-bold text-sm hover:bg-charcoal-50 transition-all group shadow-lg"
                    >
                        Pedir Proposta
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2.5 mb-6 group">
                            <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-shadow">
                                <Bus className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="text-lg font-extrabold text-white tracking-tight">
                                    NovaDrive
                                </span>
                                <span className="text-[9px] font-medium text-charcoal-500 uppercase tracking-[0.2em]">
                                    Rent-a-Car
                                </span>
                            </div>
                        </Link>
                        <p className="text-charcoal-400 text-sm leading-relaxed max-w-xs mb-6">
                            Soluções integradas de mobilidade empresarial em Moçambique.
                            Parceiro estratégico de transporte corporativo.
                        </p>
                        <p className="text-xs text-charcoal-500 italic">
                            "Nós cuidamos das viaturas, você cuida do negócio."
                        </p>
                    </div>

                    {/* Delegações */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Delegações</h4>
                        <div className="space-y-5">
                            <div>
                                <p className="text-brand-400 font-semibold text-sm mb-1">Maputo</p>
                                <p className="text-charcoal-400 text-sm flex items-start gap-2">
                                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                    Av. Julius Nyerere, N° 1450, Sommerschield
                                </p>
                            </div>
                            <div>
                                <p className="text-brand-400 font-semibold text-sm mb-1">Nampula</p>
                                <p className="text-charcoal-400 text-sm flex items-start gap-2">
                                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                    Av. Eduardo Mondlane, N° 320, Bairro Central
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contactos */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Contactos</h4>
                        <div className="flex flex-col gap-4 text-sm text-charcoal-400">
                            <a href="tel:+258847820288" className="flex items-center gap-2.5 hover:text-brand-400 transition-colors">
                                <Phone className="w-4 h-4" /> +258 84 78 20 288
                            </a>
                            <a href="mailto:geral@novadrive.co.mz" className="flex items-center gap-2.5 hover:text-brand-400 transition-colors">
                                <Mail className="w-4 h-4" /> geral@novadrive.co.mz
                            </a>
                            <span className="flex items-center gap-2.5">
                                <Clock className="w-4 h-4" /> Seg – Sex: 07h00 – 18h00
                            </span>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-bold mb-6 text-sm uppercase tracking-wider">Navegação</h4>
                        <div className="flex flex-col gap-3">
                            <Link to="/" className="text-charcoal-400 hover:text-brand-400 text-sm transition-colors">Início</Link>
                            <Link to="/vehicles" className="text-charcoal-400 hover:text-brand-400 text-sm transition-colors">Frota</Link>
                            <Link to="/about" className="text-charcoal-400 hover:text-brand-400 text-sm transition-colors">Sobre Nós</Link>
                            <Link to="/my-bookings" className="text-charcoal-400 hover:text-brand-400 text-sm transition-colors">Minhas Reservas</Link>
                            <Link to="/profile" className="text-charcoal-400 hover:text-brand-400 text-sm transition-colors">Perfil</Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-charcoal-500 text-sm">
                        © {new Date().getFullYear()} NovaDrive Moçambique. Todos os direitos reservados.
                    </p>
                    <a
                        href="https://www.novadrive.co.mz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-charcoal-500 hover:text-brand-400 text-sm transition-colors"
                    >
                        www.novadrive.co.mz
                    </a>
                </div>
            </div>
        </footer>
    );
}
