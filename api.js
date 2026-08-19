// Modul untuk mengambil data dari API

export async function ambilKutipan() {
    const res = await fetch(
        "https://dummyjson.com/quotes/random"
    );

    if (!res.ok) {
        throw new Error("Gagal mengambil kutipan");
    }

    const data = await res.json();

    return data.quote + " - " + data.author;
}

export async function ambilCuaca(kota) {
    const url =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(kota)}&count=1&language=id&format=json`;

    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Gagal mengambil data");
    }

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
        throw new Error("Kota tidak ditemukan");
    }

    const lokasi = data.results[0];

    const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${lokasi.latitude}&longitude=${lokasi.longitude}&current=temperature_2m`;

    const weatherRes = await fetch(weatherUrl);
    const weatherData = await weatherRes.json();

    return {
        nama: lokasi.name,
        suhu: weatherData.current.temperature_2m
    };
}