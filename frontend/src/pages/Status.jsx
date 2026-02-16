import React, { useState, useEffect } from 'react';
import { Server, Database, Key, CheckCircle2, XCircle, RefreshCw, Activity, Shield, Cpu, Globe, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const StatusCard = ({ title, icon: Icon, status, index }) => {
    const isOk = status === 'running' || status === 'available' || status === 'present';
    const isError = status === 'down' || status === 'error' || status === 'missing' || status === 'Unreachable';
    const isChecking = status === 'Checking...';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={cn(
                "relative rounded-2xl p-6 flex flex-col gap-4 overflow-hidden group transition-all duration-300 bg-surface-800/60 backdrop-blur-xl",
                isOk && "border border-success-500/15 hover:border-success-500/25 glow-success",
                isError && "border border-danger-500/15 hover:border-danger-500/25 glow-danger",
                !isOk && !isError && "border-glow"
            )}
        >
            <div className="flex justify-between items-start z-10">
                <div className={cn(
                    "p-3 rounded-xl transition-all duration-300",
                    isOk ? "bg-success-500/10 text-success-400" :
                        isError ? "bg-danger-500/10 text-danger-400" :
                            "bg-accent-500/10 text-accent-400"
                )}>
                    <Icon size={24} />
                </div>
                {isChecking ? (
                    <RefreshCw size={18} className="text-accent-400 animate-spin" />
                ) : isOk ? (
                    <div className="flex items-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success-400 opacity-50" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-success-500" />
                        </span>
                        <CheckCircle2 size={18} className="text-success-400" />
                    </div>
                ) : (
                    <XCircle size={18} className="text-danger-400" />
                )}
            </div>
            <div className="z-10">
                <h3 className="text-text-muted font-medium text-sm mb-1.5">{title}</h3>
                <p className={cn(
                    "text-xl font-display font-bold capitalize",
                    isOk ? "text-success-400" : isError ? "text-danger-400" : "text-accent-300"
                )}>{status}</p>
            </div>
            <div className={cn(
                "absolute -right-8 -bottom-8 w-28 h-28 rounded-full opacity-[0.03] group-hover:opacity-[0.06] group-hover:scale-110 transition-all duration-700",
                isOk ? "bg-success-500" : isError ? "bg-danger-500" : "bg-accent-500"
            )} />
        </motion.div>
    );
};

const Status = () => {
    const [statuses, setStatuses] = useState({ backend: 'Checking...', vector_store: 'Checking...', llm_key: 'Checking...' });

    useEffect(() => { checkHealth(); }, []);

    const checkHealth = async () => {
        setStatuses({ backend: 'Checking...', vector_store: 'Checking...', llm_key: 'Checking...' });
        try {
            const res = await fetch(`${API_BASE}/health`);
            const data = await res.json();
            setStatuses(data);
        } catch (err) {
            setStatuses({ backend: 'Unreachable', vector_store: 'Unknown', llm_key: 'Unknown' });
        }
    };

    const infoItems = [
        { icon: Shield, label: 'Version', value: '1.0.0' },
        { icon: Globe, label: 'Environment', value: 'Production' },
        { icon: Cpu, label: 'Region', value: 'Localhost' },
        { icon: Clock, label: 'Last Checked', value: new Date().toLocaleTimeString() },
    ];

    return (
        <div className="max-w-5xl mx-auto py-4">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h1 className="font-display text-2xl font-bold text-text-primary flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg border border-accent-500/15" style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(217,119,6,0.05))' }}>
                            <Activity size={18} className="text-accent-400" />
                        </div>
                        System Status
                    </h1>
                    <p className="text-text-muted text-sm mt-1 ml-10">Real-time health monitoring of system components</p>
                </div>
                <button onClick={checkHealth}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary bg-surface-800/60 backdrop-blur-xl border-glow hover:bg-surface-500/30 transition-all duration-200"
                >
                    <RefreshCw size={15} /> Refresh
                </button>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                <StatusCard index={0} title="Backend API" icon={Server} status={statuses.backend} />
                <StatusCard index={1} title="Vector Database" icon={Database} status={statuses.vector_store} />
                <StatusCard index={2} title="LLM Connection" icon={Key} status={statuses.llm_key} />
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="rounded-2xl p-6 border-glow bg-surface-800/60 backdrop-blur-xl"
            >
                <h3 className="font-display text-base font-bold text-text-primary mb-5 flex items-center gap-2">
                    <Cpu size={16} className="text-accent-400" /> System Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {infoItems.map((item, idx) => (
                        <motion.div key={item.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + idx * 0.05 }} className="flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-text-muted">
                                <item.icon size={13} className="text-accent-500/50" />
                                <span className="text-xs font-medium uppercase tracking-wider">{item.label}</span>
                            </div>
                            <span className="text-sm font-semibold text-text-primary pl-5">{item.value}</span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

export default Status;
