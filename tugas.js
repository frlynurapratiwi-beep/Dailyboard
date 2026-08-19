//memecah kode menjadi modul terpisah menggunakan ES modules
//tugas.js
// Modul untuk mengelola tugas

export function tambahTugas(daftar, nama) {
    return [
        ...daftar,
        {
            id: Date.now(),
            nama: nama,
            selesai: false
        }
    ];
}

export function hapusTugas(daftar, id) {
    return daftar.filter((t) => t.id !== id);
}

export function toggleSelesai(daftar, id) {
    return daftar.map((t) =>
        t.id === id
            ? { ...t, selesai: !t.selesai }
            : t
    );
}

export function editTugas(daftar, id, namaBaru) {
    return daftar.map((t) =>
        t.id === id
            ? { ...t, nama: namaBaru }
            : t
    );
}