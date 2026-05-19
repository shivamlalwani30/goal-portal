import {
    FaChartPie,
    FaUsers,
    FaBullseye,
    FaCog,
    FaBell,
    FaExclamationTriangle,
    FaRobot,
    FaCrown,
} from "react-icons/fa";

import {
    useState,
} from "react";

import {
    Link,
    useLocation,
} from "react-router-dom";

import TeamsNotificationPanel, {
    NotificationBell,
} from "./TeamsNotificationPanel";

const Sidebar = ({
    darkMode,
}) => {

    const location =
        useLocation();

    const [
        panelOpen,
        setPanelOpen,
    ] = useState(false);

    const navItems = [
        {
            name: "Dashboard",
            icon: <FaBullseye />,
            path: "/",
            badge: null,
        },

        {
            name: "Analytics",
            icon: <FaChartPie />,
            path: "/analytics",
            badge: "AI",
        },

        {
            name: "Team",
            icon: <FaUsers />,
            path: "/team",
            badge: null,
        },

        {
            name: "Notifications",
            icon: <FaBell />,
            path: "/notifications",
            badge: "12",
        },

        {
            name: "Escalations",
            icon:
                <FaExclamationTriangle />,
            path: "/escalations",
            badge: "3",
        },

        {
            name: "Settings",
            icon: <FaCog />,
            path: "/settings",
            badge: null,
        },
    ];

    return (

        <div
            className={`relative w-72 min-h-screen p-8 transition-all duration-500 border-r border-white/10 shadow-2xl overflow-visible ${darkMode
                    ? "bg-gradient-to-b from-gray-950 via-slate-950 to-blue-950 text-white"
                    : "bg-white text-black"
                }`}
        >

            {/* LOGO */}
            <div className="mb-10">

                <div className="flex items-center gap-3">

                    <div className="bg-gradient-to-r from-blue-500 to-cyan-400 p-3 rounded-2xl shadow-xl">

                        <FaRobot className="text-2xl text-white" />

                    </div>

                    <div>

                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent tracking-wide">

                            GoalPortal

                        </h1>

                        <p className="text-xs text-cyan-300 mt-1">
                            AI Enterprise Suite
                        </p>

                    </div>

                </div>

                <p className="text-gray-400 mt-5 text-sm leading-relaxed">

                    Intelligent employee performance,
                    escalation and analytics platform.

                </p>

            </div>

            {/* ENTERPRISE STATUS */}
            <div className="mb-8 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-400/20 p-5 rounded-3xl shadow-xl">

                <div className="flex items-center justify-between mb-4">

                    <h2 className="font-bold text-lg">
                        Enterprise Status
                    </h2>

                    <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-pulse">

                        LIVE

                    </span>

                </div>

                <div className="space-y-3 text-sm">

                    <div className="flex justify-between">

                        <span className="text-gray-300">
                            AI Monitoring
                        </span>

                        <span className="text-green-400">
                            Active
                        </span>

                    </div>

                    <div className="flex justify-between">

                        <span className="text-gray-300">
                            Teams Sync
                        </span>

                        <span className="text-blue-400">
                            Connected
                        </span>

                    </div>

                    <div className="flex justify-between">

                        <span className="text-gray-300">
                            Escalation Engine
                        </span>

                        <span className="text-orange-400">
                            Running
                        </span>

                    </div>

                </div>

            </div>

            {/* NOTIFICATION SECTION */}
            <div className="relative mb-10 flex justify-between items-center bg-white/5 border border-white/10 px-4 py-4 rounded-2xl backdrop-blur-lg shadow-xl hover:bg-white/10 transition-all duration-300">

                <div>

                    <p className="text-sm font-semibold">
                        Teams Notifications
                    </p>

                    <p className="text-xs text-gray-400">
                        Enterprise Activity Feed
                    </p>

                </div>

                <div className="relative">

                    <NotificationBell
                        onClick={() =>
                            setPanelOpen(
                                !panelOpen
                            )
                        }
                    />

                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-2 py-1 rounded-full animate-bounce">

                        5

                    </span>

                </div>

                <div className="fixed left-72 top-24 z-[9999]">

                    <TeamsNotificationPanel
                        isOpen={panelOpen}
                        onClose={() =>
                            setPanelOpen(false)
                        }
                    />

                </div>

            </div>

            {/* NAVIGATION */}
            <div className="flex flex-col gap-4">

                {navItems.map(
                    (item) => (

                        <Link
                            key={item.name}
                            to={item.path}
                            className={`group flex items-center justify-between px-5 py-4 rounded-2xl text-lg font-medium transition-all duration-300 shadow-lg ${location.pathname ===
                                    item.path
                                    ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white scale-[1.03]"
                                    : darkMode
                                        ? "hover:bg-blue-600/30 hover:translate-x-2 text-gray-200"
                                        : "hover:bg-blue-100"
                                }`}
                        >

                            <div className="flex items-center gap-4">

                                <span className="text-2xl group-hover:scale-110 transition-transform duration-300">

                                    {item.icon}

                                </span>

                                {item.name}

                            </div>

                            {item.badge && (

                                <span
                                    className={`text-xs px-3 py-1 rounded-full font-bold ${item.badge === "AI"
                                            ? "bg-purple-500 text-white"
                                            : item.badge === "3"
                                                ? "bg-red-500 text-white"
                                                : "bg-blue-500 text-white"
                                        }`}
                                >

                                    {item.badge}

                                </span>

                            )}

                        </Link>

                    )
                )}

            </div>

            {/* AI ASSISTANT CARD */}
            <div className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 p-6 rounded-3xl shadow-2xl hover:scale-[1.02] transition-all duration-300">

                <div className="flex items-center gap-3 mb-4">

                    <FaRobot className="text-3xl" />

                    <h2 className="text-2xl font-bold">
                        AI Assistant
                    </h2>

                </div>

                <div className="space-y-3 text-sm text-white/90">

                    <p>
                        • AI analyzing employee productivity
                    </p>

                    <p>
                        • Escalation prediction active
                    </p>

                    <p>
                        • Smart KPI insights enabled
                    </p>

                </div>

            </div>

            {/* PREMIUM CARD */}
            <div className="mt-8 bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-3xl shadow-2xl hover:scale-[1.02] transition-all duration-300">

                <div className="flex items-center gap-3 mb-4">

                    <FaCrown className="text-3xl text-white" />

                    <h2 className="text-2xl font-bold">
                        Premium Suite
                    </h2>

                </div>

                <p className="text-white/90 text-sm leading-relaxed">

                    Unlock predictive AI analytics,
                    enterprise integrations and
                    automated escalation workflows.

                </p>

                <button className="mt-5 bg-white text-orange-600 font-bold px-5 py-3 rounded-2xl hover:scale-105 transition duration-300 shadow-xl w-full">

                    Upgrade Enterprise

                </button>

            </div>

        </div>
    );
};

export default Sidebar;