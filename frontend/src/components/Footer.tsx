import { Link } from 'react-router-dom';
import { Car, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#080b14] border-t border-white/5 mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center">
                                <Car className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold gradient-text">RentaCar</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                            A melhor plataforma de aluguer de viaturas e transfers em Moçambique.
                            Explore o país com conforto e segurança.
                        </p>
                        <div className="flex flex-col gap-2 mt-4 text-sm text-slate-400">
                            <span className="flex items-center gap-2"><Phone className="w-4 h-4" /> +258 84 000 0000</span>
                            <span className="flex items-center gap-2"><Mail className="w-4 h-4" /> info@rentacar.co.mz</span>
                            <span className="flex items-center gap-2"><MapPin className="w-4 h-4" /> Maputo, Moçambique</span>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4">Navegação</h4>
                        <div className="flex flex-col gap-2">
                            <Link to="/" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Início</Link>
                            <Link to="/vehicles" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Viaturas</Link>
                            <Link to="/transfers" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Transfers</Link>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4">Conta</h4>
                        <div className="flex flex-col gap-2">
                            <Link to="/my-bookings" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Minhas Reservas</Link>
                            <Link to="/profile" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">Perfil</Link>
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/5 mt-8 pt-8 text-center">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} RentaCar Moçambique. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
}
