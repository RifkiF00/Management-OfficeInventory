import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ mutasis, barangs, ruangans }) {
    const auth = usePage().props.auth;
    const flash = usePage().props.flash;

    const [isOpen, setIsOpen] = useState(false);
    const [toast, setToast] = useState(null);

    // Show toast for flash messages
    useEffect(() => {
        if (flash?.success) {
            setToast({ type: 'success', message: flash.success });
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        } else if (flash?.error) {
            setToast({ type: 'error', message: flash.error });
            const timer = setTimeout(() => setToast(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    // Mutation Form
    const { data, setData, post, reset, errors, processing } = useForm({
        barang_id: '',
        ruangan_tujuan_id: '',
        jumlah: 1,
        keterangan: '',
    });

    const submit = (e) => {
        e.preventDefault();
        
        // Find selected item to client-side validate quantity
        const selectedItem = barangs.find(b => b.id === parseInt(data.barang_id));
        if (selectedItem && selectedItem.jumlah < data.jumlah) {
            alert(`Stok tidak mencukupi! Stok saat ini: ${selectedItem.jumlah}`);
            return;
        }

        post(route('mutasi.store'), {
            onSuccess: () => {
                setIsOpen(false);
                reset();
            }
        });
    };

    // Date formatting helper
    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Mutasi Barang (Perpindahan Inventaris)
                    </h2>
                    {(auth.user.role === 'admin' || auth.user.role === 'staf') && (
                        <button
                            onClick={() => setIsOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-sky-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-sky-700 active:bg-sky-900 focus:outline-none transition ease-in-out duration-150 shadow-sm"
                        >
                            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                            </svg>
                            Mutasi Barang
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Mutasi Barang" />

            {/* Toast Alert */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-bounce">
                    <div className={`rounded-lg p-4 shadow-lg flex items-center ${
                        toast.type === 'success' 
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 dark:bg-emerald-900/90 dark:text-emerald-200' 
                            : 'bg-rose-50 border border-rose-200 text-rose-800 dark:bg-rose-900/90 dark:text-rose-200'
                    }`}>
                        <span className="font-semibold text-sm mr-2">{toast.type === 'success' ? 'Sukses!' : 'Gagal!'}</span>
                        <span className="text-sm">{toast.message}</span>
                    </div>
                </div>
            )}

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Mutation History Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Riwayat Mutasi Barang</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Daftar pencatatan perpindahan barang antar ruangan kantor.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-300">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Waktu Mutasi</th>
                                        <th scope="col" className="px-6 py-4">Kode Barang</th>
                                        <th scope="col" className="px-6 py-4">Nama Barang</th>
                                        <th scope="col" className="px-6 py-4">Dari Ruangan</th>
                                        <th scope="col" className="px-6 py-4">Ke Ruangan</th>
                                        <th scope="col" className="px-6 py-4">Jumlah</th>
                                        <th scope="col" className="px-6 py-4">Petugas</th>
                                        <th scope="col" className="px-6 py-4">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {mutasis.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                Belum ada catatan mutasi barang.
                                            </td>
                                        </tr>
                                    ) : (
                                        mutasis.map((m) => (
                                            <tr key={m.id} className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-750 transition duration-150">
                                                <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-400 font-mono whitespace-nowrap">{formatDate(m.tanggal_mutasi)}</td>
                                                <td className="px-6 py-4 font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">{m.barang?.kode_barang || 'TRHPS'}</td>
                                                <td className="px-6 py-4 font-semibold text-gray-950 dark:text-white">{m.barang?.nama_barang || 'Barang Terhapus'}</td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                                                        {m.ruangan_asal?.nama_ruangan || 'Asal'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-xs px-2.5 py-1 rounded-md bg-sky-50 text-sky-700 dark:bg-sky-900/35 dark:text-sky-300">
                                                        {m.ruangan_tujuan?.nama_ruangan || 'Tujuan'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{m.jumlah} unit</td>
                                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{m.user?.name || 'Sistem'}</td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate" title={m.keterangan}>
                                                    {m.keterangan || '-'}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mutation Form Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-950 dark:text-white">Form Pemindahan / Mutasi Barang</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={submit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pilih Barang</label>
                                    <select
                                        value={data.barang_id}
                                        onChange={(e) => setData('barang_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    >
                                        <option value="">Pilih barang yang ingin dipindah</option>
                                        {barangs.map((b) => (
                                            <option key={b.id} value={b.id}>
                                                {b.nama_barang} ({b.kode_barang}) - [Stok: {b.jumlah}]
                                            </option>
                                        ))}
                                    </select>
                                    {errors.barang_id && <p className="text-rose-500 text-xs mt-1">{errors.barang_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ruangan Tujuan</label>
                                    <select
                                        value={data.ruangan_tujuan_id}
                                        onChange={(e) => setData('ruangan_tujuan_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    >
                                        <option value="">Pilih ruangan tujuan</option>
                                        {ruangans.map((r) => (
                                            <option key={r.id} value={r.id}>
                                                {r.nama_ruangan} ({r.kode_ruangan})
                                            </option>
                                        ))}
                                    </select>
                                    {errors.ruangan_tujuan_id && <p className="text-rose-500 text-xs mt-1">{errors.ruangan_tujuan_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah Unit Dipindahkan</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={data.jumlah}
                                        onChange={(e) => setData('jumlah', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    {errors.jumlah && <p className="text-rose-500 text-xs mt-1">{errors.jumlah}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keterangan Alasan</label>
                                    <textarea
                                        value={data.keterangan}
                                        onChange={(e) => setData('keterangan', e.target.value)}
                                        rows="3"
                                        placeholder="Tulis alasan perpindahan barang (misal: Ruangan lama direnovasi)..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    ></textarea>
                                    {errors.keterangan && <p className="text-rose-500 text-xs mt-1">{errors.keterangan}</p>}
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-150 dark:border-gray-600 dark:text-gray-300 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-sm text-white font-semibold transition disabled:opacity-50"
                                >
                                    Eksekusi Mutasi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
