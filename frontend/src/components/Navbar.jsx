import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const NAV_LINKS = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Tech Stack', href: '#tech-stack' },
];

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <motion.nav
                initial={{ y: -80 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                    isScrolled
                        ? "py-2.5 bg-surface-900/80 backdrop-blur-2xl border-b border-white/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
                        : "py-5 bg-transparent"
                )}
            >
                <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
                    {/* Logo */}
                    <a href="#" className="flex items-center gap-2.5 group">
                        <div className="relative">
                            <div className="p-2 rounded-xl border border-accent-500/20 group-hover:border-accent-400/30 transition-all duration-300" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.06))' }}>
                                <ShieldCheck className="text-accent-400" size={20} />
                            </div>
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 0 6px rgba(245,158,11,0.5)' }} />
                        </div>
                        <span className="font-display font-bold text-lg tracking-tight">
                            <span className="text-text-primary">Secure</span>
                            <span className="text-accent-400">Q&A</span>
                        </span>
                    </a>

                    {/* Desktop Links */}
                    <div className="hidden md:flex items-center gap-0.5">
                        {NAV_LINKS.map((link) => (
                            <a
                                key={link.label}
                                href={link.href}
                                className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 rounded-lg hover:bg-white/[0.04]"
                            >
                                {link.label}
                            </a>
                        ))}
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            to="/app"
                            className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 btn-primary"
                        >
                            <Sparkles size={14} />
                            Launch App
                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>

                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setIsMobileOpen(!isMobileOpen)}
                        className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/[0.04] transition-colors"
                    >
                        {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </motion.nav>

            {/* Mobile Dropdown */}
            <AnimatePresence>
                {isMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-[56px] left-0 right-0 z-40 md:hidden bg-surface-900/95 backdrop-blur-2xl border-b border-white/[0.04]"
                    >
                        <div className="px-6 py-4 space-y-1">
                            {NAV_LINKS.map((link) => (
                                <a
                                    key={link.label}
                                    href={link.href}
                                    onClick={() => setIsMobileOpen(false)}
                                    className="block px-4 py-3 text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-white/[0.04] rounded-lg transition-colors"
                                >
                                    {link.label}
                                </a>
                            ))}
                            <Link
                                to="/app"
                                onClick={() => setIsMobileOpen(false)}
                                className="flex items-center justify-center gap-2 mt-3 px-5 py-3 rounded-xl text-sm font-semibold btn-primary"
                            >
                                <Sparkles size={14} />
                                Launch App
                                <ArrowRight size={14} />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;
