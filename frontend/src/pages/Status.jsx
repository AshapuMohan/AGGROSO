import React, { useState, useEffect } from 'react';
import { Server, Database, Key, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
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
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between items-start z-10">
                <div className={cn("p-3 rounded-xl", isOk ? "bg-green-50 text-green-600" : isError ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600")}>
                    <Icon size={24} />
                </div>
                {isChecking ? (
                    <RefreshCw size={20} className="text-blue-500 animate-spin" />
                ) : isOk ? (
                    <CheckCircle size={20} className="text-green-500" />
                ) : (
                    <XCircle size={20} className="text-red-500" />
                )}
            </div>

            <div className="z-10">
                <h3 className="text-gray-500 font-medium text-sm mb-1">{title}</h3>
                <p className={cn("text-xl font-bold capitalize", isOk ? "text-gray-900" : isError ? "text-red-600" : "text-blue-600")}>
                    {status}
                </p>
            </div>

            {/* Background Decoration */}
            <div className={cn(
                "absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-5 group-hover:scale-110 transition-transform duration-500",
                isOk ? "bg-green-500" : isError ? "bg-red-500" : "bg-blue-500"
            )} />
        </motion.div>
    );
};

const Status = () => {
    const [statuses, setStatuses] = useState({
        backend: 'Checking...',
        vector_store: 'Checking...',
        llm_key: 'Checking...',
    });

    useEffect(() => {
        checkHealth();
    }, []);

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

    return (
        <div className="max-w-5xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">System Status</h1>
                    <p className="text-gray-500">Real-time health monitoring of system components.</p>
                </div>
                <button
                    onClick={checkHealth}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                >
                    <RefreshCw size={16} /> Refresh
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatusCard
                    index={0}
                    title="Backend API"
                    icon={Server}
                    status={statuses.backend}
                />
                <StatusCard
                    index={1}
                    title="Vector Database"
                    icon={Database}
                    status={statuses.vector_store}
                />
                <StatusCard
                    index={2}
                    title="LLM Connection"
                    icon={Key}
                    status={statuses.llm_key}
                />
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6"
            >
                <h3 className="text-blue-900 font-semibold mb-2">System Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <span className="block text-blue-400 mb-1">Version</span>
                        <span className="font-medium text-blue-800">1.0.0</span>
                    </div>
                    <div>
                        <span className="block text-blue-400 mb-1">Environment</span>
                        <span className="font-medium text-blue-800">Production</span>
                    </div>
                    <div>
                        <span className="block text-blue-400 mb-1">Region</span>
                        <span className="font-medium text-blue-800">Localhost</span>
                    </div>
                    <div>
                        <span className="block text-blue-400 mb-1">Last Checked</span>
                        <span className="font-medium text-blue-800">{new Date().toLocaleTimeString()}</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Status;
