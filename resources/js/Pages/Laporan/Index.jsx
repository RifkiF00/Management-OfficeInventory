import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Index({ barangs, mutasis }) {
    
    const printReport = () => {
        window.print();
    };

    // Date formatting helper
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const getConditionBadge = (cond) => {
        switch (cond) {
            case 'Baik':
                return 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-950/35 dark:text-emerald-400';
            case 'Rusak Ringan':
                return 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-950/35 dark:text-amber-400';
            case 'Rusak Berat':
                return 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-950/35 dark:text-rose-400';
            default:
                return 'bg-slate-50 text-slate-700 border border-slate-100 dark:bg-slate-800 dark:text-slate-300';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between print:hidden">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        Laporan Inventaris Kantor
                    </h2>
                    <button
                        onClick={printReport}
                        className="inline-flex items-center px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition duration-150 shadow-md border-none"
                    >
                        <svg className="h-4.5 w-4.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        Cetak Laporan (PDF)
                    </button>
                </div>
            }
        >
            <Head title="Laporan Inventaris" />

            <div className="space-y-8 py-2 print:py-0 print:bg-white print:text-black">
                
                {/* Printable Document Header (Hidden in Screen View) */}
                <div className="hidden print:block text-center mb-10 border-b-2 border-double border-slate-800 pb-5">
                    <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">Sistem Informasi Inventaris Kantor</h1>
                    <p className="text-sm text-slate-500 mt-1.5 font-medium">Laporan Resmi Kepemilikan & Mutasi Barang Aset Kantor</p>
                    <p className="text-xs text-slate-400 mt-1 font-mono">Tanggal Cetak: {formatDate(new Date())}</p>
                </div>

                {/* Table 1: Daftar Seluruh Barang */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm print:shadow-none print:border-none overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/25 dark:bg-slate-900/50 print:bg-transparent print:border-b-2 print:px-0">
                        <h3 className="text-base font-extrabold text-slate-950 dark:text-white print:text-black">Daftar Seluruh Barang Inventaris</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 print:text-slate-600">Ringkasan kepemilikan dan kondisi barang di seluruh ruangan divisi.</p>
                    </div>
                    
                    <div className="overflow-x-auto print:overflow-visible">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400 print:text-black">
                            <thead className="text-[11px] font-bold text-slate-400 uppercase bg-[#f8fafc] dark:bg-slate-800/40 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 print:bg-slate-100 print:text-black">
                                <tr>
                                    <th scope="col" className="px-6 py-4">No</th>
                                    <th scope="col" className="px-6 py-4">Kode Barang</th>
                                    <th scope="col" className="px-6 py-4">Nama Barang</th>
                                    <th scope="col" className="px-6 py-4">Ruangan</th>
                                    <th scope="col" className="px-6 py-4">Kondisi</th>
                                    <th scope="col" className="px-6 py-4">Jumlah (Stok)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 print:divide-y print:divide-slate-350">
                                {barangs.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500">
                                            Tidak ada data barang.
                                        </td>
                                    </tr>
                                ) : (
                                    barangs.map((item, idx) => (
                                        <tr key={item.id} className="bg-white hover:bg-slate-50/40 dark:bg-slate-900 dark:hover:bg-slate-850/40 transition print:bg-transparent">
                                            <td className="px-6 py-4.5 font-bold text-slate-900 dark:text-white print:text-black">{idx + 1}</td>
                                            <td className="px-6 py-4.5 font-mono text-xs font-bold text-sky-600 dark:text-sky-400 print:text-black">{item.kode_barang}</td>
                                            <td className="px-6 py-4.5 font-bold text-slate-850 dark:text-white print:text-black">{item.nama_barang}</td>
                                            <td className="px-6 py-4.5 font-medium text-slate-700 dark:text-slate-300 print:text-black">{item.ruangan?.nama_ruangan || '-'}</td>
                                            <td className="px-6 py-4.5">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getConditionBadge(item.kondisi)}`}>
                                                    {item.kondisi}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4.5 font-extrabold text-slate-950 dark:text-white print:text-black">{item.jumlah} unit</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Table 2: Riwayat Mutasi */}
                <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm print:shadow-none print:border-none overflow-hidden">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/25 dark:bg-slate-900/50 print:bg-transparent print:border-b-2 print:px-0">
                        <h3 className="text-base font-extrabold text-slate-950 dark:text-white print:text-black">Laporan Mutasi Barang</h3>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 print:text-slate-600">Catatan lengkap perpindahan barang antar ruangan divisi.</p>
                    </div>
                    
                    <div className="overflow-x-auto print:overflow-visible">
                        <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400 print:text-black">
                            <thead className="text-[11px] font-bold text-slate-400 uppercase bg-[#f8fafc] dark:bg-slate-800/40 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 print:bg-slate-100 print:text-black">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Tanggal</th>
                                    <th scope="col" className="px-6 py-4">Barang</th>
                                    <th scope="col" className="px-6 py-4">Dari Ruangan</th>
                                    <th scope="col" className="px-6 py-4">Ke Ruangan</th>
                                    <th scope="col" className="px-6 py-4">Jumlah</th>
                                    <th scope="col" className="px-6 py-4">Petugas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 print:divide-y print:divide-slate-350">
                                {mutasis.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-400 dark:text-slate-500">
                                            Belum ada catatan mutasi barang.
                                        </td>
                                    </tr>
                                ) : (
                                    mutasis.map((m) => (
                                        <tr key={m.id} className="bg-white hover:bg-slate-50/40 dark:bg-slate-900 dark:hover:bg-slate-850/40 transition print:bg-transparent">
                                            <td className="px-6 py-4.5 text-xs font-mono font-bold text-slate-450 dark:text-slate-500 print:text-black whitespace-nowrap">{formatDate(m.tanggal_mutasi)}</td>
                                            <td className="px-6 py-4.5 print:text-black">
                                                <div className="font-bold text-slate-850 dark:text-white">{m.barang?.nama_barang || 'Barang Terhapus'}</div>
                                                <div className="text-[10px] text-sky-600 dark:text-sky-400 font-bold font-mono mt-0.5">{m.barang?.kode_barang || ''}</div>
                                            </td>
                                            <td className="px-6 py-4.5 font-medium text-slate-700 dark:text-slate-300 print:text-black">{m.ruangan_asal?.nama_ruangan || '-'}</td>
                                            <td className="px-6 py-4.5 font-medium text-slate-700 dark:text-slate-300 print:text-black">{m.ruangan_tujuan?.nama_ruangan || '-'}</td>
                                            <td className="px-6 py-4.5 font-extrabold text-slate-950 dark:text-white print:text-black">{m.jumlah} unit</td>
                                            <td className="px-6 py-4.5 font-medium text-slate-700 dark:text-slate-300 print:text-black">{m.user?.name || '-'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
