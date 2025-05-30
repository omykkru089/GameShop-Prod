"use client";
import { useEffect, useState } from "react";
import { Header } from "../ui/header";
import { Footer } from "../ui/footer";

type ClavesPorJuego = Record<string, string[]>;

export default function PagoExitosoPage() {
  const [claves, setClaves] = useState<ClavesPorJuego>({});
  const [juegos, setJuegos] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Cargar todos los juegos al montar la página
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/juegos`)
      .then(res => res.json())
      .then(data => setJuegos(data))
      .catch(() => setJuegos([]));
  }, []);

  useEffect(() => {
    const userId = Number(localStorage.getItem("userId") || "1");
    if (userId) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pagos/asignar-claves`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
        .then((res) => res.json())
        .then((data) => setClaves(data))
        .catch(() => setClaves({}));

      const handleBeforeUnload = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/pedidos/pendiente/usuario`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        localStorage.removeItem("carritoItems");
      };
    }
  }, []);

  // Buscar el juego por ID en el array de juegos completos
  const getJuego = (juegoId: string) => {
    const item = juegos.find((j) => String(j.id) === String(juegoId));
    return item
      ? {
          nombre: item.nombre,
          dispositivo: item.dispositivo,
          plataforma: item.plataforma?.nombre || item.plataforma, // por si es string o objeto
        }
      : null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#181818]">
      <Header search={search} setSearch={setSearch} />
      <main className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold text-white mb-6">¡Pago realizado con éxito!</h1>
        {Object.keys(claves).length > 0 ? (
          <div className="rounded-lg shadow p-6 w-full max-w-lg bg-[#232323]">
            <p className="text-lg font-bold mb-4 text-white">Tus claves digitales:</p>
            {Object.entries(claves).map(([juegoId, clavesArr]) => {
              const juego = getJuego(juegoId);
              return (
                <div key={juegoId} className="mb-8">
                  <div className="mb-2 text-purple-300 font-semibold text-lg">
                    {juego
                      ? `${juego.nombre ?? ""} - ${juego.dispositivo ?? ""} - ${juego.plataforma ?? ""}`
                      : "Juego no encontrado"}
                  </div>
                  <div className="flex flex-col gap-2">
                    {Array.isArray(clavesArr) ? (
                      clavesArr.map((clave, idx) => (
                        <div
                          key={idx}
                          className="bg-[#181818] border border-purple-700 rounded px-4 py-2 text-white font-mono tracking-wider text-lg"
                        >
                          {clave}
                        </div>
                      ))
                    ) : (
                      <div className="text-red-400">No hay claves disponibles.</div>
                    )}
                  </div>
                </div>
              );
            })}
            <p className="mt-4 text-sm text-gray-400">Guarda tus claves, no podrás volver a verlas.</p>
          </div>
        ) : (
          <p className="text-white">Procesando tus claves...</p>
        )}
      </main>
      <Footer />
    </div>
  );
}