import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Menu, X, Rocket, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const SidebarItem = ({ icon: Icon, label, to, active }) => (
    <Link
        to={to}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group",
            active
                ? "bg-primary-50 text-primary-700 font-medium shadow-sm"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
    >
        <Icon size={20} className={cn("transition-colors", active ? "text-primary-600" : "text-gray-500 group-hover:text-gray-700")} />
        <span>{label}</span>
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute left-0 w-1 h-8 bg-primary-600 rounded-r-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            />
        )}
    </Link>
);

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const location = useLocation();

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
            {/* Sidebar */}
            <motion.aside
                initial={{ width: 260 }}
                animate={{ width: isSidebarOpen ? 260 : 80 }}
                className="bg-white border-r border-gray-200 shadow-sm z-20 flex flex-col h-full transition-all duration-300 relative hidden md:flex"
            >
                <div className="h-16 flex items-center px-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-600 p-1.5 rounded-lg">
                            <ShieldCheck className="text-white" size={20} />
                        </div>
                        {isSidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-bold text-lg tracking-tight text-gray-800"
                            >
                                Secure<span className="text-primary-600">Q&A</span>
                            </motion.span>
                        )}
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <SidebarItem
                        icon={MessageSquare}
                        label={isSidebarOpen ? "Chat & Upload" : ""}
                        to="/"
                        active={location.pathname === "/"}
                    />
                    <SidebarItem
                        icon={LayoutDashboard}
                        label={isSidebarOpen ? "System Status" : ""}
                        to="/status"
                        active={location.pathname === "/status"}
                    />
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 rounded-md hover:bg-gray-100 text-gray-500 w-full flex justify-center"
                    >
                        {isSidebarOpen ? <Menu size={20} /> : <Menu size={20} />}
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden relative">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-10">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary-600 p-1.5 rounded-lg">
                            <ShieldCheck className="text-white" size={20} />
                        </div>
                        <span className="font-bold text-lg tracking-tight text-gray-800">SecureQ&A</span>
                    </div>
                    <button className="p-2 text-gray-600">
                        <Menu size={24} />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
