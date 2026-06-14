import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Index({ ruangans }) {
    const auth = usePage().props.auth;
    const flash = usePage().props.flash;

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editRoom, setEditRoom] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
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

    // Create Room Form
    const { data: addData, setData: setAddData, post: addPost, reset: addReset, errors: addErrors, processing: addProcessing } = useForm({
        nama_ruangan: '',
        kode_ruangan: '',
    });

    // Edit Room Form
    const { data: editData, setData: setEditData, patch: editPatch, reset: editReset, errors: editErrors, processing: editProcessing } = useForm({
        nama_ruangan: '',
        kode_ruangan: '',
    });

    const submitAdd = (e) => {
        e.preventDefault();
        addPost(route('ruangan.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                addReset();
            }
        });
    };

    const openEditModal = (room) => {
        setEditRoom(room);
        setEditData({
            nama_ruangan: room.nama_ruangan,
            kode_ruangan: room.kode_ruangan,
        });
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editPatch(route('ruangan.update', editRoom.id), {
            onSuccess: () => {
                setEditRoom(null);
                editReset();
            }
        });
    };

    const deleteRoom = (id) => {
        if (confirm('Apakah Anda yakin ingin menghapus ruangan ini? Semua barang di dalam ruangan ini mungkin akan kehilangan referensi ruangan.')) {
            useForm().delete(route('ruangan.destroy', id));
        }
    };

    // Filter rooms by search term
    const filteredRuangans = ruangans.filter(room => 
        room.nama_ruangan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        room.kode_ruangan.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        Manajemen Ruangan
                    </h2>
                    {auth.user.role === 'admin' && (
                        <button
                            onClick={() => setIsAddOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-sky-600 border border-transparent rounded-lg font-semibold text-xs text-white uppercase tracking-widest hover:bg-sky-700 active:bg-sky-900 focus:outline-none transition ease-in-out duration-150 shadow-sm"
                        >
                            <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Ruangan
                        </button>
                    )}
                </div>
            }
        >
            <Head title="Ruangan" />

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
                    {/* Search Panel */}
                    <div className="mb-6 overflow-hidden bg-white shadow-sm sm:rounded-xl dark:bg-gray-800">
                        <div className="p-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input
                                    type="search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Cari ruangan berdasarkan nama atau kode..."
                                    className="block w-full pl-10 pr-4 py-2.5 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-sky-500 focus:border-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Table View */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-xl border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700/50 dark:text-gray-300">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">No</th>
                                        <th scope="col" className="px-6 py-4">Kode Ruangan</th>
                                        <th scope="col" className="px-6 py-4">Nama Ruangan</th>
                                        {auth.user.role === 'admin' && (
                                            <th scope="col" className="px-6 py-4 text-right">Aksi</th>
                                        )}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {filteredRuangans.length === 0 ? (
                                        <tr>
                                            <td colSpan={auth.user.role === 'admin' ? 4 : 3} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                                                Tidak ada data ruangan ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredRuangans.map((room, idx) => (
                                            <tr key={room.id} className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-750 transition duration-150">
                                                <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{idx + 1}</td>
                                                <td className="px-6 py-4 font-mono text-xs font-semibold text-sky-600 dark:text-sky-400">{room.kode_ruangan}</td>
                                                <td className="px-6 py-4 text-gray-800 dark:text-gray-200">{room.nama_ruangan}</td>
                                                {auth.user.role === 'admin' && (
                                                    <td className="px-6 py-4 text-right space-x-2">
                                                        <button
                                                            onClick={() => openEditModal(room)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200 rounded-lg text-xs font-semibold transition"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => deleteRoom(room.id)}
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

            {/* Add Room Modal */}
            {isAddOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-950 dark:text-white">Tambah Ruangan Baru</h3>
                            <button onClick={() => setIsAddOpen(false)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={submitAdd}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kode Ruangan</label>
                                    <input
                                        type="text"
                                        value={addData.kode_ruangan}
                                        onChange={(e) => setAddData('kode_ruangan', e.target.value)}
                                        placeholder="Contoh: R-101"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    {addErrors.kode_ruangan && <p className="text-rose-500 text-xs mt-1">{addErrors.kode_ruangan}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Ruangan</label>
                                    <input
                                        type="text"
                                        value={addData.nama_ruangan}
                                        onChange={(e) => setAddData('nama_ruangan', e.target.value)}
                                        placeholder="Contoh: Ruang Kepala Bagian"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    {addErrors.nama_ruangan && <p className="text-rose-500 text-xs mt-1">{addErrors.nama_ruangan}</p>}
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

            {/* Edit Room Modal */}
            {editRoom && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 dark:bg-gray-800 dark:border-gray-700 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-gray-950 dark:text-white">Ubah Ruangan</h3>
                            <button onClick={() => setEditRoom(null)} className="text-gray-400 hover:text-gray-600">&times;</button>
                        </div>
                        <form onSubmit={submitEdit}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Kode Ruangan</label>
                                    <input
                                        type="text"
                                        value={editData.kode_ruangan}
                                        onChange={(e) => setEditData('kode_ruangan', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    {editErrors.kode_ruangan && <p className="text-rose-500 text-xs mt-1">{editErrors.kode_ruangan}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nama Ruangan</label>
                                    <input
                                        type="text"
                                        value={editData.nama_ruangan}
                                        onChange={(e) => setEditData('nama_ruangan', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-black focus:border-sky-500 focus:ring-sky-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        required
                                    />
                                    {editErrors.nama_ruangan && <p className="text-rose-500 text-xs mt-1">{editErrors.nama_ruangan}</p>}
                                </div>
                            </div>
                            <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setEditRoom(null)}
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
