import{
    tambahTugas as tambahTugasModul,
    hapusTugas as hapusTugasModul,
    toggleSelesai as toggleSelesaiModul,
    editTugas as editTugasModul
} from"./tugas.js";

import{
    tambahCatatan as tambahCatatanModul
}from"./catatan.js";

import{
    simpanData,
    ambilData
}from"./storage.js";

import{
    ambilKutipan as ambilKutipanModul
}from"./api.js";

import{
    ambilCuaca as ambilCuacaModul
}from"./api.js";


//2-seleksi manipulasi dom
const app = document.getElementById("app");

const judul = document.createElement("h2");
judul.textContent = "selamat datang di dailyboard!";
app.appendChild(judul);

judul.style.color= "black";       //mengubah gaya elemen lewat js

const tugas= document.createElement("section");
app.appendChild(tugas);

const catatan= document.createElement("section");
app.appendChild(catatan);

const cuaca= document.createElement("section");
app.appendChild(cuaca);


//3-event handling
const tombol=document.createElement("button");
tombol.textContent = "klik saya";
app.appendChild(tombol);

tombol.addEventListener("click", () => {
    alert("tombol berhasil di klik");
});

//event pada input
const input=document.getElementById("namaTugas");
const tombolTambah=document.getElementById("tambah");


input.addEventListener("input",(e) => {
    console.log("nilai input: ", e.target.value);
});

tombolTambah.addEventListener("click",()=> {
    console.log("nama tugas: ", input.value)
});


//4-menampilkan daftar tugas
let daftarTugas = [
    {id: 1, nama: "belajar javascript", selesai: false},
    {id: 2, nama: "olahraga pagi", selesai: false}
];

//5-tambah dan hapus tugas
let nextId = 1;

function tambahTugas(nama){
    daftarTugas=tambahTugasModul(daftarTugas, nama);
    simpanKeStorage();
    renderTugas();
}


function hapusTugas(id){
    daftarTugas=hapusTugasModul(daftarTugas, id);
    simpanKeStorage();
    renderTugas();
}

tombolTambah.addEventListener("click", () => {
    daftarTugas=tambahTugasModul(daftarTugas, input.value);
    simpanKeStorage();
    renderTugas();
    input.value = "";
});



//6-tandai selesai dan filter tugas

function toggleSelesai(id){
    daftarTugas=toggleSelesaiModul(daftarTugas, id);
    simpanKeStorage();
    renderTugas();
}

//filter tugas
function renderTugas(filter="semua"){
    const list=document.getElementById("daftar-tugas");
    list.innerHTML="";

    const tugasTersaring=daftarTugas.filter((t)=>{
        if (filter === "selesai") return t.selesai;
        if (filter === "belum") return !t.selesai;
        return true;
    });

    

    tugasTersaring.forEach((tugas)=>{
        const li=document.createElement("li");
        li.draggable=true;
        li.textContent=tugas.nama;

        const tombolHapus=document.createElement("button");
        tombolHapus.textContent="Hapus";

        tombolHapus.addEventListener("click",()=>{
            daftarTugas=hapusTugasModul(daftarTugas, tugas.id);
            simpanKeStorage();
            renderTugas();
        })

        li.style.textDecoration=tugas.selesai?"line-through": "none";

        li.addEventListener("click", ()=>{
            daftarTugas=toggleSelesaiModul(daftarTugas,tugas.id);
            simpanKeStorage();
            renderTugas();
        });
        
        li.addEventListener("dblclick", () => {
        const namaBaru = prompt("Masukkan nama tugas baru:", tugas.nama
    );

    if (namaBaru !== null && validasiInput(namaBaru)) {
        daftarTugas=editTugasModul(
            daftarTugas,tugas.id,namaBaru
        );
        simpanKeStorage();
        renderTugas();
    }
});

        li.appendChild(tombolHapus);
        list.appendChild(li);

    });
}    
    document.getElementById("filter-semua").addEventListener("click", () => {
    renderTugas("semua");
    });
    document.getElementById("filter-selesai").addEventListener("click", () => {
    renderTugas("selesai");
    });
    document.getElementById("filter-belum").addEventListener("click", () => {
    renderTugas("belum");
    });


//7-menyimpan data ke localStorage

function simpanKeStorage(){
    simpanData("daftarTugas", daftarTugas);
}

   function muatDariStorage(){
    const data = ambilData("daftarTugas");

    if(data){
        daftarTugas = data;
    }
}
muatDariStorage();

if(daftarTugas.length>0) {
    nextId=Math.max(...daftarTugas.map(t=>t.id))+1;
}
renderTugas();


//8-fitur catatan cepat(notes)
let daftarCatatan=[];


function simpanCatatanKeStorage(){
    simpanData("daftarCatatan", daftarCatatan);
}

function muatCatatanDariStorage(){
    const data= ambilData("daftarCatatan");

    if(data){
        daftarCatatan=data;
    }
}



function tambahCatatan(isi){
    daftarCatatan=tambahCatatanModul(daftarCatatan, isi);
    simpanKeStorage();
    renderTugas();
}

function renderCatatan(){
    const container=document.getElementById("daftar-catatan");
    container.innerHTML="";

    daftarCatatan.forEach((catatan) => {
        const div=document.createElement("div");
        div.className="catatan-item";
        div.innerHTML= `<p>${catatan.isi}</p><small>${catatan.tanggal}</small>
        <button class="hapus-catatan">Hapus</button>`;

        const tombolHapus=div.querySelector(".hapus-catatan");

        tombolHapus.addEventListener("click", ()=>{
            daftarCatatan=daftarCatatan.filter(
                (item)=>item!==catatan
            );

            simpanCatatanKeStorage();
            renderCatatan();
        });
                        
        container.appendChild(div);
    });
}
    const textarea = document.getElementById("isiCatatan");
    const tombolCatatan = document.getElementById("tambahCatatan");
    

    tombolCatatan.addEventListener("click", () => {
        daftarCatatan = tambahCatatanModul(
    daftarCatatan,
    textarea.value
);
simpanCatatanKeStorage();
renderCatatan();
        textarea.value = "";
    });


muatCatatanDariStorage();
renderCatatan();

//9-edit data dan validasi input
   
function editTugas(id, namaBaru){
    daftarTugas=editTugasModul(daftarTugas, id, namaBaru);
    simpanKeStorage();
    renderTugas();
}

function validasiInput(nilai){
    if (nilai.trim()===""){
        alert("input tidak boleh kosong!");
        return false;
    }
    if(nilai.length>100){
        alert("input maksimal 100 karakter!");
        return false;
    }
    return true;
}

   async function tampilkanKutipan(){
    try {
        const kutipan = await ambilKutipanModul();

        document.getElementById("kutipan-harian").textContent = kutipan;
    } catch (error) {
        console.error("gagal mengambil kutipan:", error);
    }
}
tampilkanKutipan();
    


//11-widget cuaca dengan geocoding-API

const inputKota = document.getElementById("namaKota");
const tombolCuaca = document.getElementById("cariCuaca");

tombolCuaca.addEventListener("click", async()=>{
    try{
        document.getElementById("info-cuaca").textContent="Memuat cuaca...";

        const data=await ambilCuacaModul(inputKota.value);

        document.getElementById("info-cuaca").innerHTML=`<p>${data.nama}:${data.suhu}°C</p>`;
    }catch(error){
        document.getElementById("info-cuaca").textContent=error.message;
    }
});

//12-menggabungkan beberapa sumber data

async function muatSemuaWidget() {
  document.getElementById("status").textContent = "Memuat data...";

  try {
    const [dataKutipan, dataCuaca] = await Promise.all([
      ambilKutipanModul(),ambilCuacaModul("Jakarta")
    ]);

    console.log("hasil cuaca: ", dataCuaca);
    document.getElementById("kutipan-harian").textContent =dataKutipan;
    document.getElementById("info-cuaca").innerHTML = `<p>${dataCuaca.nama}: ${dataCuaca.suhu}°C</p>`;
    document.getElementById("status").textContent =
      "Data berhasil dimuat";
  } catch (error) {
    console.error("Gagal memuat widget:", error);
    document.getElementById("status").textContent =
      "Gagal memuat data";
  }
}

window.addEventListener("DOMContentLoaded", muatSemuaWidget);

//13-drag and drop untuk urutan tugas
function aktifkanDragDropBaru() {
    const list = document.getElementById("daftar-tugas");

    list.addEventListener("dragstart", (e) => {
        const item = e.target.closest("li");

        if (!item) return;


        const index = Array.from(list.children).indexOf(item);
        e.dataTransfer.setData("text/plain", index);
    });

    list.addEventListener("dragover", (e) => {
        e.preventDefault();
    });

    list.addEventListener("drop", (e) => {
        e.preventDefault();

        const indexLama = Number(
            e.dataTransfer.getData("text/plain")
        );

        const itemTujuan = e.target.closest("li");

        if (!itemTujuan) return;

        let indexBaru = Array.from(list.children).indexOf(itemTujuan);

        if (indexLama === indexBaru) return;

        const tugasDipindahkan = daftarTugas.splice(indexLama, 1)[0];

        if (indexLama < indexBaru) {
            indexBaru--;
        }

        daftarTugas.splice(indexBaru, 0, tugasDipindahkan);

        simpanKeStorage();
        renderTugas();

    });
}

aktifkanDragDropBaru();

//debounce
function debounce(fn, delay=300){
    let timer;

    return(...args)=>{
        clearTimeout(timer);

        timer=setTimeout(()=>{
            fn(...args);
        }, delay);
    };
}

const cariTugasDebounced = debounce((kataKunci) => {
    const hasil = daftarTugas.filter((tugas) =>
        tugas.nama.toLowerCase().includes(kataKunci.toLowerCase())
    );

    const list = document.getElementById("daftar-tugas");
    list.innerHTML = "";

    hasil.forEach((tugas) => {
        const li = document.createElement("li");
        li.draggable = true;
        li.textContent = tugas.nama;

        li.style.textDecoration =
            tugas.selesai ? "line-through" : "none";

        li.addEventListener("click", () => {
            toggleSelesai(tugas.id);
        });

        li.addEventListener("dblclick", () => {
            const namaBaru = prompt(
                "Masukkan nama tugas baru:",
                tugas.nama
            );

            if (namaBaru !== null && validasiInput(namaBaru)) {
                editTugas(tugas.id, namaBaru);
            }
        });

        list.appendChild(li);
    });
}, 300);

document.getElementById("cari-tugas").addEventListener("input", (e)=>{
    const kataKunci=e.target.value;

    cariTugasDebounced(kataKunci);
});

//14-dark mode dan pencarian

const toggleTema = document.getElementById("toggle-tema");

toggleTema.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const modeAktif =
        document.body.classList.contains("dark-mode");
    localStorage.setItem(
        "tema",
        modeAktif ? "gelap" : "terang"
    );
});

// Menerapkan tema
window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("tema") === "gelap") {
        document.body.classList.add("dark-mode");
    }
});


const tombolRefresh=document.getElementById("refresh-kutipan");
    tombolRefresh.addEventListener("click", ()=>{
    location.reload();
})