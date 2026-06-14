import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ barangs, ruangans, filters }) {
    const auth = usePage().props.auth;
    const flash = usePage().props.flash;

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editBarang, setEditBarang] = useState(null);
    const [toast, setToast] = useState(null);

    // Filter states
    const [search, setSearch] = useState(filters.search || '');
    const [ruanganId, setRuanganId] = useState(filters.ruangan_id || '');
    const [kondisi, setKondisi] = useState(filters.kondisi || '');

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

    // Handle filter application
    useEffect(() => {
        const timeOutId = setTimeout(() => {
            router.get(
                route('barang.index'),
                { search, ruangan_id: ruanganId, kondisi },
                { preserveState: true, replace: true }
            );
        }, 300);
        return () => clearTimeout(timeOutId);
    }, [search, ruanganId, kondisi]);

    // Add form
    const { data: addData, setData: setAddData, post: addPost, reset: addReset, errors: addErrors, processing: addProcessing } = useForm({
        nama_barang: '',
        kode_barang: '',
        ruangan_id: '',
        kondisi: 'Baik',
        jumlah: 0,
        deskripsi: '',
    });

    // Edit form
    const { data: editData, setData: setEditData, patch: editPatch, reset: editReset, errors: editErrors, processing: editProcessing } = useForm({
        nama_barang: '',
        kode_barang: '',
        ruangan_id: '',
        kondisi: 'Baik',
        jumlah: 0,
        deskripsi: '',
    });

    const submitAdd = (e) => {
        e.preventDefault();
        addPost(route('barang.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                addReset();
            }
        });
    };

    const openEditModal = (item) => {
        setEditBarang(item);
        setEditData({
            nama_barang: item.nama_barang,
            kode_barang: item.kode_barang,
            ruangan_id: item.ruangan_id,
            kondisi: item.kondisi,
            jumlah: item.jumlah,
            deskripsi: item.deskripsi || '',
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editPatch(route('barang.update', editBarang.id), {
            onSuccess: () => {
                setEditBarang(null);
                editReset();
            }
        });
    };

    const deleteBarang = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus barang inventaris ini?')) {
            router.delete(route('barang.destroy', id));
        }
    };

    // Get condition badge styling
    const getConditionBadge = (cond) => {
        switch (cond) {
            case 'Baik':
                return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/35 dark:text-emerald-300';
            case 'Rusak Ringan':
                return 'bg-amber-100 text-amber-800 dark:bg-amber-900/35 dark:text-amber-300';
            case 'Rusak Berat':
                return 'bg-rose-100 text-rose-800 dark:bg-rose-900/35 dark:text-rose-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Daftar Inventaris Barang
                    </h2>
                    {auth.user.role === 'admin' && (
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-sky-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-sky-700 active:bg-sky-900 focus:outline-none transition ease-in-out duration-150 shadow-sm"
                        >
                            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Barang
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Barang" />

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
                    {/* Search and Filters Panel */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {/* Search */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 mb-2">Pencarian</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="search"
                                            value={search}
                                            onChange={(e) => setSearch(e.target.value)}
                                            placeholder="Cari kode atau nama barang..."
                                            className="block w-full pl-9 pr-4 py-2 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Room Filter */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 mb-2">Filter Ruangan</label>
                                    <select
                                        value={ruanganId}
                                        onChange={(e) => setRuanganId(e.target.value)}
                                        className="block w-full py-2 px-3 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="">Semua Ruangan</option>
                                        {ruangans.map((r) => (
                                            <option key={r.id} value={r.id}>{r.nama_ruangan} ({r.kode_ruangan})</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Condition Filter */}
                                <div>
                                    <label className="block text-xs font-semibold text-gray-500 uppercase dark:text-gray-400 mb-2">Filter Kondisi</label>
                                    <select
                                        value={kondisi}
                                        onChange={(e) => setKondisi(e.target.value)}
                                        className="block w-full py-2 px-3 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="">Semua Kondisi</option>
                                        <option value="Baik">Baik</option>
                                        <option value="Rusak Ringan">Rusak Ringan</option>
                                        <option value="Rusak Berat">Rusak Berat</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-300">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Kode</th>
                                        <th scope="col" className="px-6 py-4">Nama Barang</th>
                                        <th scope="col" className="px-6 py-4">Ruangan</th>
                                        <th scope="col" className="px-6 py-4">Kondisi</th>
                                        <th scope="col" className="px-6 py-4">Jumlah</th>
                                        <th scope="col" className="px-6 py-4">Keterangan</th>
                                        {auth.user.role === 'admin' && (
                                            <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {barangs.length === 0 ? (
                                        <tr>
                                            <td colSpan={auth.user.role === 'admin' ? 7 : 6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                Tidak ada data barang ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        barangs.map((item) => (
                                            <tr key={item.id} className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-750 transition duration-150">
                                                <td className="px-6 py-4 font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">{item.kode_barang}</td>
                                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">{item.nama_barang}</td>
                                                <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{item.ruangan?.nama_ruangan || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getConditionBadge(item.kondisi)}`}>
                                                        {item.kondisi}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-bold text-gray-900 dark:text-white">{item.jumlah} unit</td>
                                                <td className="px-6 py-4 max-w-xs truncate text-gray-500 dark:text-gray-400" title={item.deskripsi}>
                                                    {item.deskripsi || '-'}
                                                </td>
                                                {auth.user.role === 'admin' && (
                                                    <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                                        <button
                                                            onClick={() => openEditModal(item)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-semibold transition"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => deleteBarang(item.id)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-semibold transition"
                                                        >
                                                            Hapus
                                                        </button>
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

            {/* Add Barang Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-950 dark:text-white">Tambah Barang Baru</h3>
                            <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={submitAdd}>
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kode Barang</label>
                                    <input
                                        type="text"
                                        value={addData.kode_barang}
                                        onChange={(e) => setAddData('kode_barang', e.target.value)}
                                        placeholder="Contoh: B-A01"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    {addErrors.kode_barang && <p className="text-rose-500 text-xs mt-1">{addErrors.kode_barang}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Barang</label>
                                    <input
                                        type="text"
                                        value={addData.nama_barang}
                                        onChange={(e) => setAddData('nama_barang', e.target.value)}
                                        placeholder="Contoh: Laptop ThinkPad L14"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    {addErrors.nama_barang && <p className="text-rose-500 text-xs mt-1">{addErrors.nama_barang}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ruangan Penempatan</label>
                                    <select
                                        value={addData.ruangan_id}
                                        onChange={(e) => setAddData('ruangan_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    >
                                        <option value="">Pilih Ruangan</option>
                                        {ruangans.map((r) => (
                                            <option key={r.id} value={r.id}>{r.nama_ruangan} ({r.kode_ruangan})</option>
                                        ))}
                                    </select>
                                    {addErrors.ruangan_id && <p className="text-rose-500 text-xs mt-1">{addErrors.ruangan_id}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kondisi</label>
                                        <select
                                            value={addData.kondisi}
                                            onChange={(e) => setAddData('kondisi', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        >
                                            <option value="Baik">Baik</option>
                                            <option value="Rusak Ringan">Rusak Ringan</option>
                                            <option value="Rusak Berat">Rusak Berat</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah (Stok)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={addData.jumlah}
                                            onChange={(e) => setAddData('jumlah', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        />
                                        {addErrors.jumlah && <p className="text-rose-500 text-xs mt-1">{addErrors.jumlah}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keterangan / Deskripsi</label>
                                    <textarea
                                        value={addData.deskripsi}
                                        onChange={(e) => setAddData('deskripsi', e.target.value)}
                                        rows="3"
                                        placeholder="Spesifikasi barang atau detail tambahan..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsAddOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-150 dark:border-gray-600 dark:text-gray-300 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={addProcessing}
                                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-sm text-white font-semibold transition disabled:opacity-50"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Barang Modal */}
            {editBarang && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-950 dark:text-white">Ubah Barang</h3>
                            <button onClick={() => setEditBarang(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={submitEdit}>
                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kode Barang</label>
                                    <input
                                        type="text"
                                        value={editData.kode_barang}
                                        onChange={(e) => setEditData('kode_barang', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    {editErrors.kode_barang && <p className="text-rose-500 text-xs mt-1">{editErrors.kode_barang}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Barang</label>
                                    <input
                                        type="text"
                                        value={editData.nama_barang}
                                        onChange={(e) => setEditData('nama_barang', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    {editErrors.nama_barang && <p className="text-rose-500 text-xs mt-1">{editErrors.nama_barang}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ruangan Penempatan</label>
                                    <select
                                        value={editData.ruangan_id}
                                        onChange={(e) => setEditData('ruangan_id', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    >
                                        <option value="">Pilih Ruangan</option>
                                        {ruangans.map((r) => (
                                            <option key={r.id} value={r.id}>{r.nama_ruangan} ({r.kode_ruangan})</option>
                                        ))}
                                    </select>
                                    {editErrors.ruangan_id && <p className="text-rose-500 text-xs mt-1">{editErrors.ruangan_id}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kondisi</label>
                                        <select
                                            value={editData.kondisi}
                                            onChange={(e) => setEditData('kondisi', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        >
                                            <option value="Baik">Baik</option>
                                            <option value="Rusak Ringan">Rusak Ringan</option>
                                            <option value="Rusak Berat">Rusak Berat</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah (Stok)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={editData.jumlah}
                                            onChange={(e) => setEditData('jumlah', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        />
                                        {editErrors.jumlah && <p className="text-rose-500 text-xs mt-1">{editErrors.jumlah}</p>}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Keterangan / Deskripsi</label>
                                    <textarea
                                        value={editData.deskripsi}
                                        onChange={(e) => setEditData('deskripsi', e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setEditBarang(null)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-150 dark:border-gray-600 dark:text-gray-300 transition"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={editProcessing}
                                    className="px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-lg text-sm text-white font-semibold transition disabled:opacity-50"
                                >
                                    Simpan Perubahan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
