//modul untuk mengelola localstorage

export function simpanData(nama, data){
    localStorage.setItem(nama, JSON.stringify(data));
}

export function ambilData(nama){
    const data=localStorage.getItem(nama);

    if (data){
        return JSON.parse(data);
    }
    return null;
}