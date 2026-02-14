import React, { useState, useEffect } from 'react';
import { Upload, FileText, Send, Bot, User, Loader2, Paperclip, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const Home = () => {
    const [documents, setDocuments] = useState([]);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    // Chat State
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hello! I am your private knowledge assistant. Upload a document to get started or ask me anything about your existing files.' }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);

    useEffect(() => {
        loadDocuments();
    }, []);

    const loadDocuments = async () => {
        try {
            const res = await fetch(`${API_BASE}/documents`);
            const data = await res.json();
            setDocuments(data.documents || []);
        } catch (err) {
            console.error("Failed to load docs", err);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setUploadStatus('Uploading...');

        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Upload failed');

            await res.json();
            setUploadStatus('Success');
            loadDocuments();
            setTimeout(() => setUploadStatus(''), 3000);
        } catch (err) {
            setUploadStatus('Error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleReset = async () => {
        if (!window.confirm("Are you sure you want to clear all documents and history?")) return;

        try {
            await fetch(`${API_BASE}/reset`, { method: 'DELETE' });
            setDocuments([]);
            setMessages([
                { role: 'assistant', content: 'Knowledge base cleared. You can upload new documents now.' }
            ]);
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

            const botMsg = {
                role: 'assistant',
                content: data.answer,
                sources: data.sources
            };
            setMessages(prev => [...prev, botMsg]);
        } catch (err) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error." }]);
        } finally {
            setIsThinking(false);
        }
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-6rem)]">
            {/* Left Panel: Documents */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full lg:w-1/3 flex flex-col gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-primary-600" /> Documents
                    </h2>
                    <button
                        onClick={handleReset}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Clear Knowledge Base"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                {/* Upload Area */}
                <div className="relative group border-2 border-dashed border-gray-200 rounded-xl hover:border-primary-400 transition-colors bg-gray-50 hover:bg-primary-50">
                    <input
                        type="file"
                        onChange={handleUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={isUploading}
                    />
                    <div className="flex flex-col items-center justify-center py-8 text-center px-4">
                        {isUploading ? (
                            <Loader2 className="animate-spin text-primary-600 mb-2" />
                        ) : (
                            <Upload className="text-gray-400 group-hover:text-primary-600 mb-2 transition-colors" />
                        )}
                        <p className="text-sm font-medium text-gray-600">
                            {isUploading ? "Processing..." : "Drop PDF/TXT here (Replaces current)"}
                        </p>
                        {uploadStatus && <p className="text-xs mt-2 text-primary-600 font-semibold">{uploadStatus}</p>}
                    </div>
                </div>

                {/* File List */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                    <AnimatePresence>
                        {documents.length === 0 ? (
                            <p className="text-gray-400 text-sm italic text-center mt-4">No documents yet.</p>
                        ) : (
                            documents.map((doc, idx) => (
                                <motion.div
                                    key={doc}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100 group hover:border-primary-200 transition-all"
                                >
                                    <div className="p-2 bg-white rounded-md shadow-sm text-primary-600">
                                        <FileText size={16} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 truncate flex-1">{doc}</span>
                                </motion.div>
                            ))
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>

            {/* Right Panel: Chat */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex-1 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 backdrop-blur">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Bot className="text-primary-600" /> Assistant
                    </h2>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">Online</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {messages.map((msg, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className={cn(
                                "flex gap-4 max-w-[85%]",
                                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                            )}
                        >
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                                msg.role === 'user' ? "bg-primary-600 text-white" : "bg-white border border-gray-200 text-primary-600"
                            )}>
                                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                            </div>

                            <div className="space-y-2">
                                <div className={cn(
                                    "p-4 rounded-2xl shadow-sm text-sm leading-relaxed",
                                    msg.role === 'user'
                                        ? "bg-primary-600 text-white rounded-tr-sm"
                                        : "bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-sm"
                                )}>
                                    {msg.content}
                                </div>
                                {msg.sources && msg.sources.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {msg.sources.map((src, i) => (
                                            <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-md border border-gray-200 flex items-center gap-1">
                                                <Paperclip size={10} /> {src}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                    {isThinking && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex gap-4"
                        >
                            <div className="w-8 h-8 rounded-full bg-white border border-gray-200 text-primary-600 flex items-center justify-center shrink-0 shadow-sm">
                                <Bot size={16} />
                            </div>
                            <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl rounded-tl-sm flex gap-1 items-center">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 bg-white border-t border-gray-100">
                    <form onSubmit={handleSend} className="relative flex items-center gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question about your documents..."
                            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isThinking}
                            className="absolute right-2 p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                            <Send size={16} />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
