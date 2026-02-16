import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, LayoutDashboard, Menu, X, ShieldCheck, ChevronLeft, ChevronRight, Sparkles, Home, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const NAV_ITEMS = [
    { icon: MessageSquare, label: 'Chat & Upload', to: '/app' },
    { icon: LayoutDashboard, label: 'System Status', to: '/app/status' },
];

const SidebarItem = ({ icon: Icon, label, to, active, collapsed }) => (
    <Link
        to={to}
        className={cn(
            "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
            collapsed && "justify-center px-3",
            active
                ? "bg-accent-500/10 text-accent-400"
                : "text-text-secondary hover:bg-surface-400/30 hover:text-text-primary"
        )}
    >
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-7 rounded-r-full"
                style={{ background: 'linear-gradient(to bottom, #f59e0b, #d97706)' }}
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
        )}

        <Icon
            size={20}
            className={cn(
                "shrink-0 transition-all duration-300",
                active ? "text-accent-400" : "text-text-muted group-hover:text-text-secondary"
            )}
        />

        {!collapsed && (
            <motion.span
                initial={{ opacity: 0, x: -4 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -4 }}
                className="text-sm font-medium whitespace-nowrap"
            >
                {label}
            </motion.span>
        )}
    </Link>
);

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    const currentPage = NAV_ITEMS.find(i => i.to === location.pathname);

    return (
        <div className="flex h-screen bg-surface-900 overflow-hidden font-sans text-text-primary">

            {/* ─── Desktop Sidebar ─── */}
            <motion.aside
                initial={false}
                animate={{ width: isSidebarOpen ? 260 : 76 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="hidden md:flex flex-col h-full z-30 relative bg-surface-800/80 backdrop-blur-xl border-r border-white/[0.04]"
            >
                {/* Logo */}
                <div className="h-16 flex items-center px-5 border-b border-white/[0.04]">
                    <div className="flex items-center gap-3 min-w-0">
                        <div className="relative shrink-0">
                            <div className="p-2 rounded-xl border border-accent-500/20" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.08))' }}>
                                <ShieldCheck className="text-accent-400" size={22} />
                            </div>
                            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 0 6px rgba(245,158,11,0.5)' }} />
                        </div>
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.div
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -8 }}
                                    transition={{ duration: 0.2 }}
                                    className="flex items-baseline gap-0.5 overflow-hidden"
                                >
                                    <span className="font-display font-bold text-lg text-text-primary tracking-tight">Secure</span>
                                    <span className="font-display font-bold text-lg text-accent-400 tracking-tight">Q&A</span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1.5 mt-2">
                    {NAV_ITEMS.map((item) => (
                        <SidebarItem
                            key={item.to}
                            icon={item.icon}
                            label={item.label}
                            to={item.to}
                            active={location.pathname === item.to}
                            collapsed={!isSidebarOpen}
                        />
                    ))}
                </nav>

                {/* Collapse Toggle */}
                <div className="p-3 border-t border-white/[0.04]">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl text-text-muted hover:text-text-secondary hover:bg-surface-400/20 transition-all duration-200"
                    >
                        {isSidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                        {isSidebarOpen && <span className="text-xs font-medium">Collapse</span>}
                    </button>
                </div>
            </motion.aside>

            {/* ─── Mobile Overlay ─── */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <motion.div
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed left-0 top-0 bottom-0 w-[280px] z-50 bg-surface-800 border-r border-white/[0.04] flex flex-col md:hidden"
                        >
                            <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.04]">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-xl border border-accent-500/20" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.08))' }}>
                                        <ShieldCheck className="text-accent-400" size={22} />
                                    </div>
                                    <span className="font-display font-bold text-lg text-text-primary">Secure<span className="text-accent-400">Q&A</span></span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-400/20 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <nav className="flex-1 p-3 space-y-1.5 mt-2">
                                {NAV_ITEMS.map((item) => (
                                    <Link key={item.to} to={item.to} onClick={() => setIsMobileMenuOpen(false)} className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                                        location.pathname === item.to ? "bg-accent-500/10 text-accent-400" : "text-text-secondary hover:bg-surface-400/30 hover:text-text-primary"
                                    )}>
                                        <item.icon size={20} />
                                        <span className="text-sm font-medium">{item.label}</span>
                                    </Link>
                                ))}
                            </nav>
                            <div className="p-4 border-t border-white/[0.04]">
                                <div className="flex items-center gap-2 text-text-muted text-xs">
                                    <Sparkles size={12} className="text-accent-500" />
                                    <span>v1.0.0 — Production</span>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ─── Main Content ─── */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">

                {/* ═══ TOP NAVBAR (App Route) ═══ */}
                <header className="h-14 shrink-0 flex items-center justify-between px-5 border-b border-white/[0.04] bg-surface-800/60 backdrop-blur-xl z-10">
                    {/* Left: mobile hamburger + breadcrumb */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-400/20 transition-colors"
                        >
                            <Menu size={20} />
                        </button>

                        {/* Back to home link */}
                        <Link to="/" className="flex items-center gap-1.5 text-text-muted hover:text-text-secondary transition-colors group">
                            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
                            <span className="text-xs font-medium hidden sm:inline">Home</span>
                        </Link>

                        <div className="w-px h-5 bg-white/[0.06] hidden sm:block" />

                        {/* Current page */}
                        <div className="flex items-center gap-2">
                            {currentPage && <currentPage.icon size={16} className="text-accent-400" />}
                            <span className="text-sm font-semibold text-text-primary">
                                {currentPage?.label || 'SecureQ&A'}
                            </span>
                        </div>
                    </div>

                    {/* Right: branding + status */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-500/30 border border-white/[0.04]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-50" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500" />
                            </span>
                            <span className="text-xs text-text-muted font-medium">Connected</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="p-1 rounded-md border border-accent-500/15" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.05))' }}>
                                <ShieldCheck className="text-accent-400" size={16} />
                            </div>
                            <span className="font-display font-bold text-sm text-text-primary hidden sm:inline">Secure<span className="text-accent-400">Q&A</span></span>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 relative">
                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
