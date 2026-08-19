//modul untuk mengelola catatan

export function tambahCatatan(daftar, isi){
    return[...daftar, {id:Date.now(), isi:isi, tanggal:new Date().toLocaleDateString()

    }
    ];
}