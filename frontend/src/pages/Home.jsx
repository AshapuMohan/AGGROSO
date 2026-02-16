import React, { useState, useEffect, useRef } from 'react';
import { Upload, FileText, Send, Bot, User, Loader2, Paperclip, Trash2, Sparkles, FileUp, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const Home = () => {
    const [documents, setDocuments] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I\'m your private knowledge assistant. Upload a document to get started, then ask me anything about it.' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    useEffect(() => { loadDocuments(); }, []);
    useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isThinking]);

    const loadDocuments = async () => {
        try {
            const res = await fetch(`${API_BASE}/documents`);
            const data = await res.json();
            setDocuments(data.documents || []);
        } catch (err) { console.error("Failed to load docs", err); }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploading(true);
        setUploadStatus('Indexing document...');
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Upload failed');
            await res.json();
            setUploadStatus('Indexed successfully');
            loadDocuments();
            setTimeout(() => setUploadStatus(''), 3000);
        } catch (err) {
            setUploadStatus('Upload failed');
            setTimeout(() => setUploadStatus(''), 3000);
        } finally { setIsUploading(false); }
    };

    const handleReset = async () => {
        if (!window.confirm("Clear all documents and conversation history?")) return;
        try {
            await fetch(`${API_BASE}/reset`, { method: 'DELETE' });
            setDocuments([]);
            setMessages([{ role: 'assistant', content: 'Knowledge base cleared. Upload a new document to begin.' }]);
        } catch (err) {
            console.error("Failed to reset", err);
            alert("Failed to reset knowledge base.");
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        const userMsg = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);
        try {
            const res = await fetch(`${API_BASE}/ask`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: userMsg.content })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.answer, sources: data.sources }]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
        } finally { setIsThinking(false); }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-7.5rem)]">

            {/* ─── Left Panel: Documents ─── */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full lg:w-[340px] xl:w-[380px] flex flex-col gap-4 rounded-2xl p-5 border-glow bg-surface-800/60 backdrop-blur-xl shrink-0"
            >
                <div className="flex items-center justify-between">
                    <h2 className="font-display text-lg font-bold text-text-primary flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg border border-accent-500/15" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.05))' }}>
                            <FileText size={16} className="text-accent-400" />
                        </div>
                        Documents
                    </h2>
                    <button
                        onClick={handleReset}
                        className="p-2 rounded-lg text-text-muted hover:text-danger-400 hover:bg-danger-500/10 transition-all duration-200"
                        title="Clear Knowledge Base"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>

                {/* Upload Dropzone */}
                <div
                    className={cn(
                        "relative group rounded-xl transition-all duration-300 overflow-hidden",
                        isDragOver
                            ? "border-2 border-accent-400 bg-accent-500/8"
                            : "border-2 border-dashed border-surface-300/30 hover:border-accent-500/25 bg-surface-600/30 hover:bg-accent-500/[0.03]"
                    )}
                    onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragOver(false); }}
                >
                    <input type="file" onChange={handleUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={isUploading} accept=".txt,.pdf,.docx" />
                    <div className="flex flex-col items-center justify-center py-7 px-4 text-center">
                        {isUploading ? (
                            <Loader2 className="animate-spin text-accent-400 mb-2" size={24} />
                        ) : (
                            <div className="p-3 rounded-xl bg-surface-500/30 group-hover:bg-accent-500/10 transition-all duration-300 mb-2">
                                <FileUp className="text-text-muted group-hover:text-accent-400 transition-colors duration-300" size={22} />
                            </div>
                        )}
                        <p className="text-sm font-medium text-text-secondary mt-1">
                            {isUploading ? "Processing document..." : "Drop PDF, TXT or DOCX"}
                        </p>
                        <p className="text-xs text-text-muted mt-1">{isUploading ? "" : "Replaces existing document"}</p>
                        {uploadStatus && (
                            <motion.p
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "text-xs mt-2 font-semibold px-3 py-1 rounded-full",
                                    uploadStatus.includes('failed') ? "text-danger-400 bg-danger-500/10" : "text-success-400 bg-success-500/10"
                                )}
                            >{uploadStatus}</motion.p>
                        )}
                    </div>
                </div>

                {/* File List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    <AnimatePresence>
                        {documents.length === 0 ? (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-8 text-center">
                                <div className="p-3 rounded-xl bg-surface-500/20 mb-3"><FileText size={20} className="text-text-muted" /></div>
                                <p className="text-text-muted text-sm">No documents yet</p>
                                <p className="text-text-muted text-xs mt-1">Upload a file to begin</p>
                            </motion.div>
                        ) : (
                            documents.map((doc, idx) => (
                                <motion.div key={doc} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-600/30 border border-white/[0.04] group hover:border-accent-500/15 hover:bg-surface-500/30 transition-all duration-200"
                                >
                                    <div className="p-2 rounded-lg bg-surface-500/40 text-accent-400 group-hover:bg-accent-500/10 transition-colors"><FileText size={14} /></div>
                                    <span className="text-sm font-medium text-text-secondary truncate flex-1 group-hover:text-text-primary transition-colors">{doc}</span>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* ─── Right Panel: Chat ─── */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex-1 flex flex-col rounded-2xl border-glow bg-surface-800/60 backdrop-blur-xl overflow-hidden min-h-0"
            >
                {/* Chat Header */}
                <div className="px-5 py-3.5 border-b border-white/[0.04] flex justify-between items-center bg-surface-700/30 shrink-0">
                    <h2 className="font-display text-base font-bold text-text-primary flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg border border-accent-500/15" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.05))' }}>
                            <MessageCircle size={16} className="text-accent-400" />
                        </div>
                        Assistant
                    </h2>
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-50" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500" />
                        </span>
                        <span className="text-xs text-success-400 font-medium">Online</span>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-5 space-y-5 min-h-0">
                    {messages.map((msg, idx) => (
                        <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                            className={cn("flex gap-3 max-w-[88%]", msg.role === 'user' ? "ml-auto flex-row-reverse" : "")}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-xl flex items-center justify-center shrink-0",
                                msg.role === 'user'
                                    ? "text-surface-900 shadow-[0_0_12px_rgba(245,158,11,0.2)]"
                                    : "bg-surface-500/40 border border-white/[0.06] text-accent-400"
                            )} style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)' } : {}}>
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>

                            <div className="space-y-2 min-w-0">
                                <div className={cn(
                                    "p-4 rounded-2xl text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "text-surface-900 rounded-tr-md shadow-[0_4px_15px_rgba(245,158,11,0.15)]"
                                        : "bg-surface-600/40 border border-white/[0.04] text-text-primary rounded-tl-md"
                                )} style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)' } : {}}>
                                    {msg.content}
                                </div>
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {msg.sources.map((src, i) => (
                                            <span key={i} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-surface-500/30 border border-white/[0.04] text-text-muted hover:text-accent-300 hover:border-accent-500/15 transition-colors cursor-default">
                                                <Paperclip size={10} className="text-accent-500/50" /> {src}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}

                    {isThinking && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                            <div className="w-8 h-8 rounded-xl bg-surface-500/40 border border-white/[0.06] text-accent-400 flex items-center justify-center shrink-0"><Bot size={14} /></div>
                            <div className="bg-surface-600/40 border border-white/[0.04] p-4 rounded-2xl rounded-tl-md flex gap-1.5 items-center">
                                <span className="w-2 h-2 bg-accent-400/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-accent-400/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-accent-400/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </motion.div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <div className="p-4 bg-surface-700/20 border-t border-white/[0.04] shrink-0">
                    <form onSubmit={handleSend} className="relative flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about your documents..."
                            className="w-full pl-4 pr-14 py-3.5 bg-surface-600/40 border border-white/[0.06] rounded-xl text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-500/30 focus:shadow-[0_0_0_3px_rgba(245,158,11,0.06)] transition-all duration-200"
                        />
                        <button type="submit" disabled={!input.trim() || isThinking}
                            className="absolute right-2 p-2.5 rounded-lg text-surface-900 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 btn-primary disabled:shadow-none disabled:transform-none"
                        >
                            <Send size={15} />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
