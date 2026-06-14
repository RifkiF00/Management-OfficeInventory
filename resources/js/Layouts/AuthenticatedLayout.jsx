import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // NavLink component inside sidebar matching the ocean-blue card concept
    const SidebarLink = ({ href, active, children, icon }) => {
        return (
            <Link
                href={href}
                className={`flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-[13px] font-bold tracking-wide transition-all duration-200 ${
                    active
                        ? 'bg-white text-sky-900 shadow-md transform scale-[1.02]'
                        : 'text-sky-100 hover:text-white hover:bg-white/10'
                }`}
            >
                <span className={`w-5 h-5 transition-colors ${active ? 'text-sky-600' : 'text-sky-200'}`}>
                    {icon}
                </span>
                <span>{children}</span>
            </Link>
        );
    };

    // Role-based profile avatar
    const getAvatarIcon = (role) => {
        switch (role) {
            case 'admin':
                return {
                    bg: 'bg-gradient-to-br from-sky-400 to-sky-600 border border-sky-300/20',
                    icon: (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M9 11l2 2 4-4" />
                        </svg>
                    )
                };
            case 'kepala':
                return {
                    bg: 'bg-gradient-to-br from-blue-500 to-sky-700 border border-sky-450/20',
                    icon: (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 14.5l1.5 3h-3l1.5-3z M12 17.5v3.5" />
                        </svg>
                    )
                };
            case 'staf':
            default:
                return {
                    bg: 'bg-gradient-to-br from-teal-400 to-sky-500 border border-teal-300/20',
                    icon: (
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M10 17.5h4v3.5h-4z" />
                        </svg>
                    )
                };
        }
    };

    const userAvatar = getAvatarIcon(user.role);

    return (
        <div className="min-h-screen bg-[#f0f9ff] dark:bg-slate-950 flex flex-col md:flex-row p-4 md:p-6 gap-6 font-sans">
            
            {/* Mobile Navigation Header */}
            <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl shadow-sm">
                <Link href="/dashboard" className="flex items-center space-x-3">
                    <ApplicationLogo className="w-8 h-8 text-sky-600 fill-current" />
                    <span className="font-extrabold text-base text-sky-950 dark:text-white">Inventaris</span>
                </Link>
                <button
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:text-gray-400 focus:outline-none"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Floating Left Sidebar matching the picture concept */}
            <aside className={`fixed md:sticky top-6 bottom-6 left-6 z-40 w-64 bg-[#075985] dark:bg-slate-900 rounded-[2.5rem] p-6 flex flex-col justify-between shadow-2xl transition-all duration-300 md:translate-x-0 ${
                isMobileOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)]'
            }`}>
                <div className="flex flex-col h-full">
                    {/* Brand header */}
                    <div className="flex items-center space-x-3.5 mb-8 pb-6 border-b border-white/10">
                        <div className="p-2.5 bg-white/10 rounded-2xl border border-white/10">
                            <ApplicationLogo className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <span className="font-black text-[13px] text-white leading-none block uppercase tracking-wide">Manajemen</span>
                            <span className="text-[10px] text-sky-200/70 font-bold uppercase tracking-wider mt-1.5 block">Inventaris Kantor</span>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 space-y-2 overflow-y-auto pr-1">
                        <SidebarLink
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                            icon={
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            }
                        >
                            Dashboard
                        </SidebarLink>

                        <SidebarLink
                            href={route('ruangan.index')}
                            active={route().current('ruangan.index')}
                            icon={
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            }
                        >
                            Ruangan
                        </SidebarLink>

                        <SidebarLink
                            href={route('barang.index')}
                            active={route().current('barang.index')}
                            icon={
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            }
                        >
                            Barang
                        </SidebarLink>

                        <SidebarLink
                            href={route('mutasi.index')}
                            active={route().current('mutasi.index')}
                            icon={
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            }
                        >
                            Mutasi Barang
                        </SidebarLink>

                        <SidebarLink
                            href={route('pengadaan.index')}
                            active={route().current('pengadaan.index')}
                            icon={
                                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                                </svg>
                            }
                        >
                            Pengadaan
                        </SidebarLink>

                        {(user.role === 'admin' || user.role === 'kepala') && (
                            <SidebarLink
                                href={route('laporan.index')}
                                active={route().current('laporan.index')}
                                icon={
                                    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                }
                            >
                                Laporan
                            </SidebarLink>
                        )}
                    </nav>

                    {/* Sidebar Footer Link (Logout) */}
                    <div className="pt-6 border-t border-white/10">
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex items-center space-x-3.5 px-4 py-3 w-full rounded-2xl text-[13px] font-bold text-sky-100 hover:text-white hover:bg-white/10 transition duration-200"
                        >
                            <svg className="w-5 h-5 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            <span>Log Out</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Mobile Drawer Overlay */}
            {isMobileOpen && (
                <div
                    onClick={() => setIsMobileOpen(false)}
                    className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-xs md:hidden"
                ></div>
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Horizontal Topbar (White bar matching concept picture) */}
                <div className="bg-white dark:bg-slate-900 px-8 py-4 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center justify-between shadow-sm mb-6">
                    {/* Left: Section Header or Search placeholder */}
                    <div className="flex-1 max-w-xs hidden sm:block">
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <svg className="h-4 w-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                placeholder="Search here..."
                                className="w-full bg-[#f8fafc] dark:bg-slate-800 border-none rounded-2xl pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-sky-500 focus:bg-white transition-colors text-slate-700 dark:text-white"
                                readOnly
                            />
                        </div>
                    </div>

                    {/* Right: Profile Info badge */}
                    <div className="flex items-center space-x-4 ml-auto">
                        <div className="text-right">
                            <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">{user.name}</h4>
                            <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mt-0.5 block">{user.role}</span>
                        </div>
                        <Link href={route('profile.edit')} className="group flex items-center">
                            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-md relative overflow-hidden transition group-hover:scale-105 ${userAvatar.bg}`}>
                                {userAvatar.icon}
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Subtitle / Header Section */}
                {header && (
                    <div className="mb-6 px-4">
                        {header}
                    </div>
                )}

                {/* Main Content Body */}
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}
