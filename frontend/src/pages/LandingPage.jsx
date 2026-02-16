import React from 'react';
import { Link } from 'react-router-dom';
import {
    ShieldCheck, ArrowRight, Upload, Brain, MessageSquare, Zap,
    Database, Lock, FileText, Search, Cpu, Globe, Sparkles,
    ChevronRight, Star, Shield, CloudLightning, Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';

const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-40px' },
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

const FEATURES = [
    { icon: Lock, title: 'Private & Secure', desc: 'Your documents never leave your infrastructure. Fully air-gapped RAG pipeline with zero data retention.' },
    { icon: Brain, title: 'AI-Powered RAG', desc: 'Retrieval-Augmented Generation with NVIDIA NIM ensures answers are grounded strictly in your content.' },
    { icon: Zap, title: 'Lightning Fast', desc: 'Sub-second semantic search with ChromaDB vectors. Ask questions and get instant, sourced answers.' },
    { icon: FileText, title: 'Multi-Format Support', desc: 'Upload PDF, TXT, or DOCX files. Automatic chunking and indexing with smart overlap strategies.' },
    { icon: Search, title: 'Semantic Search', desc: 'NVIDIA nv-embedqa-e5-v5 embeddings understand meaning, not just keywords. Find exactly what matters.' },
    { icon: Shield, title: 'Strict Grounding', desc: 'Hallucination-free answers. The AI only responds with information found in your uploaded documents.' },
];

const STEPS = [
    { num: '01', icon: Upload, title: 'Upload Document', desc: 'Drag & drop your PDF, TXT, or DOCX. The system chunks and indexes it instantly.' },
    { num: '02', icon: Brain, title: 'AI Processes', desc: 'NVIDIA embeddings convert your content into semantic vectors stored in ChromaDB.' },
    { num: '03', icon: MessageSquare, title: 'Ask Anything', desc: 'Get instant, accurate answers grounded in your documents with source citations.' },
];

const TECH = [
    { icon: CloudLightning, name: 'FastAPI', desc: 'High-perf backend' },
    { icon: Database, name: 'ChromaDB', desc: 'Vector database' },
    { icon: Cpu, name: 'NVIDIA NIM', desc: 'LLM inference' },
    { icon: Layers, name: 'React + Vite', desc: 'Modern frontend' },
    { icon: Brain, name: 'Llama 3.1 70B', desc: 'Language model' },
    { icon: Globe, name: 'RAG Pipeline', desc: 'Grounded answers' },
];

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-surface-900 text-text-primary overflow-x-hidden">
            <Navbar />

            {/* ═══════════════════════ HERO ═══════════════════════ */}
            <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 px-6">
                {/* Background effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] animate-glow" style={{ background: 'rgba(245,158,11,0.04)' }} />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[100px] animate-glow" style={{ background: 'rgba(217,119,6,0.03)', animationDelay: '1.5s' }} />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[150px]" style={{ background: 'rgba(245,158,11,0.015)' }} />
                    {/* Grid */}
                    <div className="absolute inset-0 opacity-[0.025]" style={{
                        backgroundImage: 'linear-gradient(rgba(245,158,11,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.3) 1px, transparent 1px)',
                        backgroundSize: '60px 60px'
                    }} />
                </div>

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <motion.div {...fadeUp(0)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-accent text-xs font-medium text-accent-300 mb-8">
                        <Sparkles size={13} className="text-accent-400" />
                        Powered by NVIDIA NIM & Llama 3.1
                        <Star size={11} className="text-accent-500" />
                    </motion.div>

                    <motion.h1 {...fadeUp(0.1)} className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-[1.08] tracking-tight mb-6">
                        Your Private
                        <br />
                        <span className="text-accent-400">Knowledge</span> Assistant
                    </motion.h1>

                    <motion.p {...fadeUp(0.2)} className="text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed mb-10">
                        Upload documents. Ask questions. Get instant, accurate answers
                        grounded strictly in your content — with full source citations.
                    </motion.p>

                    <motion.div {...fadeUp(0.3)} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to="/app"
                            className="group flex items-center gap-2.5 px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:-translate-y-1 btn-primary"
                        >
                            <Sparkles size={18} />
                            Get Started Free
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <a href="#features"
                            className="flex items-center gap-2 px-8 py-4 rounded-2xl border-glow text-text-secondary hover:text-text-primary font-semibold text-base transition-all duration-300 hover:-translate-y-0.5 bg-surface-800/40 backdrop-blur-md"
                        >
                            Learn More
                            <ChevronRight size={16} />
                        </a>
                    </motion.div>

                    <motion.div {...fadeUp(0.45)} className="mt-16 flex flex-wrap justify-center gap-8 sm:gap-16">
                        {[
                            { value: '< 1s', label: 'Query Time' },
                            { value: '100%', label: 'Grounded' },
                            { value: '3', label: 'File Formats' },
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="font-display font-bold text-3xl text-accent-400">{stat.value}</div>
                                <div className="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>

                {/* Scroll indicator */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <div className="w-6 h-10 rounded-full border-2 border-surface-300/20 flex justify-center pt-2">
                        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 bg-accent-400 rounded-full" />
                    </div>
                </motion.div>
            </section>

            {/* ═══════════════════════ FEATURES ═══════════════════════ */}
            <section id="features" className="py-24 px-6 relative">
                <div className="max-w-6xl mx-auto">
                    <motion.div {...fadeUp()} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-accent text-xs font-medium text-accent-300 mb-4">
                            <Zap size={12} /> Features
                        </div>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">Everything You Need</h2>
                        <p className="text-text-secondary max-w-xl mx-auto">Enterprise-grade document intelligence with privacy at the core.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {FEATURES.map((f, i) => (
                            <motion.div key={f.title} {...fadeUp(i * 0.08)}
                                className="group relative rounded-2xl p-6 border-glow bg-surface-800/50 backdrop-blur-xl hover:glow-accent transition-all duration-500"
                            >
                                <div className="p-3 rounded-xl border border-accent-500/12 w-fit mb-4 group-hover:border-accent-500/20 transition-all duration-300" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(217,119,6,0.04))' }}>
                                    <f.icon size={22} className="text-accent-400" />
                                </div>
                                <h3 className="font-display font-bold text-lg text-text-primary mb-2">{f.title}</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">{f.desc}</p>
                                <div className="absolute -top-10 -right-10 w-20 h-20 bg-accent-500/0 group-hover:bg-accent-500/[0.03] rounded-full blur-2xl transition-all duration-700 pointer-events-none" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ HOW IT WORKS ═══════════════════════ */}
            <section id="how-it-works" className="py-24 px-6 relative">
                <div className="absolute inset-0 bg-surface-800/30 pointer-events-none" />
                <div className="relative max-w-5xl mx-auto">
                    <motion.div {...fadeUp()} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-accent text-xs font-medium text-accent-300 mb-4">
                            <Layers size={12} /> Process
                        </div>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">How It Works</h2>
                        <p className="text-text-secondary max-w-xl mx-auto">Three simple steps to unlock your document intelligence.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                        <div className="hidden md:block absolute top-[72px] left-[16.66%] right-[16.66%] h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(245,158,11,0.15), transparent)' }} />
                        {STEPS.map((step, i) => (
                            <motion.div key={step.num} {...fadeUp(i * 0.15)}
                                className="relative rounded-2xl p-8 border-glow bg-surface-800/50 backdrop-blur-xl text-center group hover:glow-accent transition-all duration-500"
                            >
                                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl border border-accent-500/15 mb-5 mx-auto group-hover:border-accent-500/25 transition-all duration-300" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.05))' }}>
                                    <step.icon size={24} className="text-accent-400" />
                                </div>
                                <div className="absolute top-4 right-4 font-display font-bold text-4xl text-surface-400/10 group-hover:text-accent-500/8 transition-colors duration-500">{step.num}</div>
                                <h3 className="font-display font-bold text-lg text-text-primary mb-2">{step.title}</h3>
                                <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ TECH STACK ═══════════════════════ */}
            <section id="tech-stack" className="py-24 px-6 relative">
                <div className="max-w-5xl mx-auto">
                    <motion.div {...fadeUp()} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-accent text-xs font-medium text-accent-300 mb-4">
                            <Cpu size={12} /> Technology
                        </div>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">Built With the Best</h2>
                        <p className="text-text-secondary max-w-xl mx-auto">Enterprise-grade technologies powering your knowledge assistant.</p>
                    </motion.div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {TECH.map((t, i) => (
                            <motion.div key={t.name} {...fadeUp(i * 0.06)}
                                className="group rounded-2xl p-5 border-glow bg-surface-800/50 backdrop-blur-xl text-center hover:glow-accent transition-all duration-500"
                            >
                                <div className="p-2.5 rounded-xl border border-accent-500/12 w-fit mx-auto mb-3 group-hover:border-accent-500/20 transition-all duration-300" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(217,119,6,0.04))' }}>
                                    <t.icon size={20} className="text-accent-400" />
                                </div>
                                <div className="font-semibold text-sm text-text-primary mb-0.5">{t.name}</div>
                                <div className="text-xs text-text-muted">{t.desc}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════ CTA ═══════════════════════ */}
            <section className="py-24 px-6 relative">
                <motion.div {...fadeUp()} className="max-w-4xl mx-auto relative rounded-3xl overflow-hidden">
                    <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.06), rgba(217,119,6,0.03), rgba(10,10,12,0.8))' }} />
                    <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(245,158,11,0.06)' }} />
                    <div className="absolute bottom-0 left-0 w-36 h-36 rounded-full blur-3xl pointer-events-none" style={{ background: 'rgba(217,119,6,0.05)' }} />

                    <div className="relative z-10 py-16 px-8 sm:px-16 text-center border border-white/[0.04] rounded-3xl bg-surface-800/40 backdrop-blur-xl">
                        <div className="p-3 rounded-2xl border border-accent-500/20 w-fit mx-auto mb-6" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(217,119,6,0.06))', boxShadow: '0 0 30px rgba(245,158,11,0.08)' }}>
                            <ShieldCheck size={28} className="text-accent-400" />
                        </div>
                        <h2 className="font-display font-bold text-3xl sm:text-4xl mb-4">Ready to Get Started?</h2>
                        <p className="text-text-secondary max-w-lg mx-auto mb-8 text-lg">Upload your first document and experience the power of private, AI-driven knowledge retrieval.</p>
                        <Link to="/app"
                            className="group inline-flex items-center gap-2.5 px-10 py-4 rounded-2xl font-semibold text-base transition-all duration-300 hover:-translate-y-1 btn-primary"
                        >
                            <Sparkles size={18} />
                            Launch SecureQ&A
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* ═══════════════════════ FOOTER ═══════════════════════ */}
            <footer className="border-t border-white/[0.04] py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-lg border border-accent-500/15" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.05))' }}>
                                <ShieldCheck className="text-accent-400" size={18} />
                            </div>
                            <span className="font-display font-bold text-base">
                                <span className="text-text-primary">Secure</span>
                                <span className="text-accent-400">Q&A</span>
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            {[{ label: 'Features', href: '#features' }, { label: 'How It Works', href: '#how-it-works' }, { label: 'Tech Stack', href: '#tech-stack' }].map((link) => (
                                <a key={link.label} href={link.href} className="text-sm text-text-muted hover:text-text-primary transition-colors">{link.label}</a>
                            ))}
                        </div>
                        <div className="text-text-muted text-sm">© {new Date().getFullYear()} SecureQ&A</div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
