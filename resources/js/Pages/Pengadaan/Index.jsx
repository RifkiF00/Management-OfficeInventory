import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ pengadaans, ruangans }) {
    const auth = usePage().props.auth;
    const flash = usePage().props.flash;

    const [isRequestOpen, setIsRequestOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
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

    // Request form (Staf)
    const { data: reqData, setData: setReqData, post: reqPost, reset: reqReset, errors: reqErrors, processing: reqProcessing } = useForm({
        nama_barang: '',
        jumlah: 1,
        estimasi_harga: 0,
        keterangan: '',
    });

    // Approval form (Kepala)
    const { data: appData, setData: setAppData, patch: appPatch, reset: appReset, errors: appErrors, processing: appProcessing } = useForm({
        status: 'Disetujui',
        ruangan_id: '',
    });

    const submitRequest = (e) => {
        e.preventDefault();
        reqPost(route('pengadaan.store'), {
            onSuccess: () => {
                setIsRequestOpen(false);
                reqReset();
            }
        });
    };

    const openApproveModal = (req) => {
        setSelectedRequest(req);
        appReset();
    };

    const submitApproval = (e) => {
        e.preventDefault();
        appPatch(route('pengadaan.update-status', selectedRequest.id), {
            onSuccess: () => {
                setSelectedRequest(null);
                appReset();
            }
        });
    };

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
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Pengadaan Barang
                    </h2>
                    {auth.user.role === 'staf' && (
                        <button
                            onClick={() => setIsRequestOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-sky-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-sky-700 active:bg-sky-900 focus:outline-none transition ease-in-out duration-150 shadow-sm"
                        >
                            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                            Ajukan Pengadaan
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Pengadaan Barang" />

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
                    {/* Procurement Request Table */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Daftar Pengajuan Pengadaan</h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {auth.user.role === 'staf' 
                                    ? 'Daftar pengadaan barang yang telah Anda ajukan.' 
                                    : 'Daftar pengajuan pengadaan barang dari staf kantor.'}
                            </p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-300">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Tgl Pengajuan</th>
                                        <th scope="col" className="px-6 py-4">Nama Barang</th>
                                        <th scope="col" className="px-6 py-4">Jumlah</th>
                                        <th scope="col" className="px-6 py-4">Estimasi Harga</th>
                                        <th scope="col" className="px-6 py-4">Pemohon</th>
                                        <th scope="col" className="px-6 py-4">Status</th>
                                        <th scope="col" className="px-6 py-4">Pemeriksa / Tanggal</th>
                                        <th scope="col" className="px-6 py-4">Keterangan</th>
                                        {auth.user.role === 'kepala' && (
                                            <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {pengadaans.length === 0 ? (
                                        <tr>
                                            <td colSpan={auth.user.role === 'kepala' ? 9 : 8} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                Belum ada pengajuan pengadaan barang.
                                            </td>
                                        </tr>
                                    ) : (
                                        pengadaans.map((p) => (
                                            <tr key={p.id} className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-750 transition duration-150">
                                                <td className="px-6 py-4 text-xs font-mono whitespace-nowrap text-gray-600 dark:text-gray-400">{formatDate(p.created_at)}</td>
                                                <td className="px-6 py-4 font-semibold text-gray-950 dark:text-white">{p.nama_barang}</td>
                                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{p.jumlah} unit</td>
                                                <td className="px-6 py-4 font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{formatIDR(p.estimasi_harga)}</td>
                                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{p.pemohon?.name || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                        p.status === 'Diajukan'
                                                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/35 dark:text-amber-400'
                                                            : p.status === 'Disetujui'
                                                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/35 dark:text-emerald-400'
                                                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900/35 dark:text-rose-400'
                                                    }`}>
                                                        {p.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-gray-600 dark:text-gray-400">
                                                    {p.penyetuju ? (
                                                        <div>
                                                            <div className="font-semibold text-gray-700 dark:text-gray-300">{p.penyetuju.name}</div>
                                                            <div>{formatDate(p.tanggal_pengadaan)}</div>
                                                        </div>
                                                    ) : '-'}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 dark:text-gray-400 max-w-xs truncate" title={p.keterangan}>
                                                    {p.keterangan || '-'}
                                                </td>
                                                {auth.user.role === 'kepala' && (
                                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                                        {p.status === 'Diajukan' ? (
                                                            <button
                                                                onClick={() => openApproveModal(p)}
                                                                className="inline-flex items-center px-3 py-1.5 bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200 rounded-lg text-xs font-semibold transition"
                                                            >
                                                                Verifikasi
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-gray-450 italic">Selesai</span>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Request Modal (Staf) */}
            {isRequestOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-950 dark:text-white">Pengajuan Pengadaan Baru</h3>
                            <button onClick={() => setIsRequestOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={submitRequest}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Barang</label>
                                    <input
                                        type="text"
                                        value={reqData.nama_barang}
                                        onChange={(e) => setReqData('nama_barang', e.target.value)}
                                        placeholder="Contoh: AC Panasonic 2 PK"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    {reqErrors.nama_barang && <p className="text-rose-500 text-xs mt-1">{reqErrors.nama_barang}</p>}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={reqData.jumlah}
                                            onChange={(e) => setReqData('jumlah', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        />
                                        {reqErrors.jumlah && <p className="text-rose-500 text-xs mt-1">{reqErrors.jumlah}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Estimasi Harga (Rp)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={reqData.estimasi_harga}
                                            onChange={(e) => setReqData('estimasi_harga', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        />
                                        {reqErrors.estimasi_harga && <p className="text-rose-500 text-xs mt-1">{reqErrors.estimasi_harga}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keterangan Pengadaan</label>
                                    <textarea
                                        value={reqData.keterangan}
                                        onChange={(e) => setReqData('keterangan', e.target.value)}
                                        rows="3"
                                        placeholder="Tulis alasan atau keperluan pengadaan barang..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    ></textarea>
                                    {reqErrors.keterangan && <p className="text-rose-500 text-xs mt-1">{reqErrors.keterangan}</p>}
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsRequestOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-150 dark:border-gray-600 dark:text-gray-300 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={reqProcessing}
                                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-sm text-white font-semibold transition disabled:opacity-50"
                                >
                                    Kirim Pengajuan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Approval / Rejection Modal (Kepala Bagian) */}
            {selectedRequest && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-950 dark:text-white">Verifikasi Pengadaan Barang</h3>
                            <button onClick={() => setSelectedRequest(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={submitApproval}>
                            <div className="p-6 space-y-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-700/35 rounded-lg">
                                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">{selectedRequest.nama_barang}</h4>
                                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                                        <span>Jumlah: {selectedRequest.jumlah} unit</span>
                                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Total: {formatIDR(selectedRequest.estimasi_harga)}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 italic bg-white dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700">
                                        Ket: {selectedRequest.keterangan || '-'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tindakan</label>
                                    <div className="flex items-center space-x-6">
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="Disetujui"
                                                checked={appData.status === 'Disetujui'}
                                                onChange={(e) => setAppData('status', e.target.value)}
                                                className="text-sky-600 focus:ring-sky-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm text-gray-800 dark:text-gray-200 font-semibold">Setujui</span>
                                        </label>
                                        <label className="inline-flex items-center cursor-pointer">
                                            <input
                                                type="radio"
                                                name="status"
                                                value="Ditolak"
                                                checked={appData.status === 'Ditolak'}
                                                onChange={(e) => setAppData('status', e.target.value)}
                                                className="text-sky-600 focus:ring-sky-500 border-gray-300"
                                            />
                                            <span className="ml-2 text-sm text-gray-800 dark:text-gray-200 font-semibold">Tolak</span>
                                        </label>
                                    </div>
                                </div>

                                {appData.status === 'Disetujui' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ruangan Penempatan Barang</label>
                                        <select
                                            value={appData.ruangan_id}
                                            onChange={(e) => setAppData('ruangan_id', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required={appData.status === 'Disetujui'}
                                        >
                                            <option value="">Pilih Ruangan Penempatan</option>
                                            {ruangans.map((r) => (
                                                <option key={r.id} value={r.id}>
                                                    {r.nama_ruangan} ({r.kode_ruangan})
                                                </option>
                                            ))}
                                        </select>
                                        {appErrors.ruangan_id && <p className="text-rose-500 text-xs mt-1">{appErrors.ruangan_id}</p>}
                                    </div>
                                )}
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setSelectedRequest(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-150 dark:border-gray-600 dark:text-gray-300 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={appProcessing}
                                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-sm text-white font-semibold transition disabled:opacity-50"
                                >
                                    Kirim Keputusan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
