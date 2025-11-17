import React from "react";

type MarineResponse = {
  latitude: number;
  longitude: number;
  hourly?: {
    time?: string[];
    wave_height?: number[];
    wave_direction?: number[];
    wave_period?: number[];
    [key: string]: any;
  };
  hourly_units?: Record<string, string>;
};

async function fetchMarine(lat: number, lon: number) {
  const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=wave_height,wave_direction,wave_period&timezone=auto`;
  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text().catch(() => "<no body>");
    throw new Error(`Gagal mengambil data marine: status=${res.status} ${res.statusText} body=${text}`);
  }

  return (await res.json()) as MarineResponse;
}

type WeatherResponse = {
  hourly?: { time?: string[]; windspeed_10m?: number[]; winddirection_10m?: number[];[k: string]: any };
  hourly_units?: Record<string, string>;
};

async function fetchWind(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=windspeed_10m,winddirection_10m&timezone=auto`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const text = await res.text().catch(() => "<no body>");
    throw new Error(`Gagal mengambil data wind: status=${res.status} ${res.statusText} body=${text}`);
  }
  return (await res.json()) as WeatherResponse;
}

export const revalidate = 0;

const DEFAULT_COORDS = { lat: -8.409518, lon: 115.188919 }; // Bali (contoh)




export default async function ExplorePage({
  searchParams,
}: {
  searchParams?: { lat?: string; lon?: string };
}) {
  const lat = searchParams?.lat ? Number(searchParams.lat) : DEFAULT_COORDS.lat;
  const lon = searchParams?.lon ? Number(searchParams.lon) : DEFAULT_COORDS.lon;

  let marine: MarineResponse | null = null;
  let fetchError: string | null = null;

  try {
    marine = await fetchMarine(lat, lon);
  } catch (e: any) {
    console.error(e);
    fetchError = e?.message ?? "Error fetching marine data";
  }

  const unsplashCollection = "928423";
  const imageUrls = Array.from({ length: 6 }).map((_, i) =>
    `https://source.unsplash.com/collection/${unsplashCollection}/800x600?sig=${i}`
  );

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Explore — Beach & Surf Conditions</h1>
      <p className="mt-2">
        Menampilkan data gelombang untuk koordinat: {lat}, {lon}.
      </p>

      {fetchError ? (
        <div className="mt-4 text-red-600">Gagal mengambil data kondisi laut: {fetchError}</div>
      ) : (
        marine && (
          <section className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border rounded p-4">
              <h2 className="font-semibold">Data: (hourly sample)</h2>
              <p className="text-sm text-gray-600">
                Latitude: {marine.latitude} — Longitude: {marine.longitude}
              </p>

              {marine.hourly && marine.hourly.wave_height ? (
                <>
                  <p className="mt-3">
                    <strong>Wave height (first hourly value):</strong>{" "}
                    {marine.hourly.wave_height[0]} {marine.hourly_units?.wave_height ?? "m"}
                  </p>
                  <p>
                    <strong>Wave direction (first hourly value):</strong>{" "}
                    {marine.hourly.wave_direction?.[0]} {marine.hourly_units?.wave_direction ?? "°"}
                  </p>
                  <p>
                    <strong>Wind speed (first hourly value):</strong>{" "}
                    {marine.hourly.wind_speed?.[0]} {marine.hourly_units?.wind_speed ?? "m/s"}
                  </p>
                  <p className="mt-2 text-sm text-gray-600">
                    Data disediakan oleh Open-Meteo (Marine Weather API).
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-600">Tidak ada data gelombang tersedia untuk koordinat ini.</p>
              )}
            </div>

            <div className="border rounded p-4">
              <h2 className="font-semibold">Beach photos</h2>
              <p className="text-sm text-gray-600">Ilustrasi pantai — diambil dari Unsplash collection.</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                {imageUrls.map((url, idx) => (
                  <img key={idx} src={url} alt={`Beach ${idx + 1}`} className="w-full h-40 object-cover rounded" />
                ))}
              </div>
            </div>
          </section>
        )
      )}

      <p className="mt-6 text-sm text-gray-500">
        Catatan: Open-Meteo menyediakan endpoint Marine untuk wave height/direction/period tanpa API key. Jika kamu
        ingin info surf lebih spesifik (spot-by-spot, cams), beberapa layanan lain memerlukan API key/berbayar.
      </p>
    </main>
  );
}
