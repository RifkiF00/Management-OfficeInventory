import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';

export default function Dashboard({ stats, recent_mutasi, recent_pengadaan }) {
    const auth = usePage().props.auth;

    // Helper to format currency
    const formatIDR = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(val);
    };

    // Date formatting helper
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Dashboard Overview
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Welcome Card banner (Modern corporate style) */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-sky-800 via-sky-900 to-slate-950 p-8 text-white shadow-md border border-sky-950 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="relative z-10">
                        <div className="inline-flex items-center space-x-2 bg-white/10 text-sky-200 px-3.5 py-1.5 rounded-full text-[10px] font-bold tracking-wider uppercase border border-white/10 mb-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>
                            <span>System Active</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-black">Selamat Datang, {auth.user.name}!</h3>
                        <p className="mt-2 text-sky-200/80 text-sm max-w-xl font-medium">
                            Kelola mutasi, pengadaan, dan pendataan barang operasional kantor secara realtime dengan tertib administrasi.
                        </p>
                    </div>
                    <div className="shrink-0 relative z-10 flex items-center justify-center p-3.5 bg-white/10 rounded-2xl border border-white/10 shadow-inner">
                        <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-sky-500/25 text-sky-200 border border-sky-400/20 capitalize">
                            Peran: {auth.user.role}
                        </span>
                    </div>
                </div>

                {/* Statistics Cards (Matching conceptual top cards) */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Ruangan Card */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Ruangan</span>
                                <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">{stats.total_ruangan}</h4>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/45 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                                <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <span>Aktif & Terdaftar</span>
                        </div>
                    </div>

                    {/* Barang Card */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Barang</span>
                                <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">{stats.total_barang}</h4>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-sky-50 dark:bg-sky-950/45 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                                <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                            <span>Stok Terdata</span>
                        </div>
                    </div>

                    {/* Mutasi Card */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Mutasi</span>
                                <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">{stats.total_mutasi}</h4>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/45 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                                <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-bold text-sky-600 dark:text-sky-400">
                            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12" />
                            </svg>
                            <span>Perpindahan Log</span>
                        </div>
                    </div>

                    {/* Pengadaan Pending Card */}
                    <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition hover:shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Pengadaan Pending</span>
                                <h4 className="text-3xl font-black text-slate-900 dark:text-white mt-1.5">{stats.pengadaan_pending}</h4>
                            </div>
                            <div className="w-11 h-11 rounded-2xl bg-amber-50 dark:bg-amber-950/45 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                                <svg className="h-5.5 w-5.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 00-2 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                                </svg>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center text-xs font-bold text-amber-600 dark:text-amber-400">
                            <svg className="w-4 h-4 mr-1 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <span>Butuh Verifikasi</span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area Lists (Two columns structure matching screenshot) */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Mutations List Card */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center">
                                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 mr-2"></span>
                                Mutasi Terakhir
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Realtime</span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recent_mutasi.length === 0 ? (
                                <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">Belum ada aktivitas mutasi barang.</p>
                            ) : (
                                recent_mutasi.map((mutasi) => (
                                    <div key={mutasi.id} className="py-3.5 flex flex-col justify-between sm:flex-row sm:items-center gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-xl px-2 transition">
                                        <div>
                                            <h5 className="font-bold text-sm text-slate-950 dark:text-white">
                                                {mutasi.barang?.nama_barang || 'Barang Terhapus'}
                                            </h5>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Petugas: <span className="font-semibold text-slate-600 dark:text-slate-300">{mutasi.user?.name || 'Sistem'}</span>
                                            </p>
                                            <div className="flex items-center space-x-1.5 mt-2">
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                                    {mutasi.ruangan_asal?.nama_ruangan || 'Asal'}
                                                </span>
                                                <span className="text-[10px] text-slate-350 font-bold">&rarr;</span>
                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-950/45 dark:text-sky-300">
                                                    {mutasi.ruangan_tujuan?.nama_ruangan || 'Tujuan'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start">
                                            <span className="text-xs font-black text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 px-2 py-1 rounded-lg">
                                                {mutasi.jumlah} Unit
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 mt-1 font-mono">{formatDate(mutasi.tanggal_mutasi)}</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Procurement List Card */}
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2"></span>
                                Pengadaan Terakhir
                            </h3>
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Aktivitas</span>
                        </div>
                        <div className="divide-y divide-slate-100 dark:divide-slate-800">
                            {recent_pengadaan.length === 0 ? (
                                <p className="text-xs text-slate-400 dark:text-slate-500 py-6 text-center">Belum ada aktivitas pengajuan pengadaan.</p>
                            ) : (
                                recent_pengadaan.map((pengadaan) => (
                                    <div key={pengadaan.id} className="py-3.5 flex flex-col justify-between sm:flex-row sm:items-center gap-2 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 rounded-xl px-2 transition">
                                        <div>
                                            <h5 className="font-bold text-sm text-slate-950 dark:text-white">
                                                {pengadaan.nama_barang}
                                            </h5>
                                            <p className="text-xs text-slate-400 mt-1">
                                                Pemohon: <span className="font-semibold text-slate-600 dark:text-slate-300">{pengadaan.pemohon?.name || 'Staf'}</span>
                                            </p>
                                            <span className="inline-block text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-50 dark:bg-emerald-950/45 px-2 py-0.5 rounded-lg border border-emerald-100/30">
                                                {formatIDR(pengadaan.estimasi_harga)}
                                            </span>
                                        </div>
                                        <div className="text-left sm:text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                                pengadaan.status === 'Diajukan'
                                                    ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/35 dark:text-amber-400'
                                                    : pengadaan.status === 'Disetujui'
                                                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/35 dark:text-emerald-400'
                                                    : 'bg-rose-100 text-rose-800 dark:bg-rose-900/35 dark:text-rose-400'
                                            }`}>
                                                {pengadaan.status}
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 mt-1.5 font-mono">{pengadaan.jumlah} Unit</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
