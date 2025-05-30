"use client";

import { useEffect, useState } from "react";
import { Header } from "../ui/header";
import { Footer } from "../ui/footer";
import { Juego } from "@/app/lib/definitions";
import Link from "next/link";

export default function XboxPage() {
  const [juegos, setJuegos] = useState<Juego[]>([]);
  const [plataformas, setPlataformas] = useState<string[]>([]);
  const [currentPlatform, setCurrentPlatform] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(""); // Añadido
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/juegos`);
      const data: Juego[] = await res.json();
      const juegosXbox = data.filter((juego: Juego) => juego.dispositivo === "Xbox");
      setJuegos(juegosXbox);

      const plataformasXbox = Array.from(new Set(juegosXbox.map((juego) => juego.plataforma.nombre)));
      setPlataformas(plataformasXbox);
    };

    fetchData();
  }, []);

  // Filtrar por plataforma
  const filteredJuegos = currentPlatform
    ? juegos.filter((juego) => juego.plataforma.nombre === currentPlatform)
    : juegos;

  // Filtrar por búsqueda
  const finalFilteredJuegos = search.trim() !== ""
    ? filteredJuegos.filter((juego) =>
        juego.nombre.toLowerCase().includes(search.toLowerCase())
      )
    : filteredJuegos;

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJuegos = finalFilteredJuegos.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(finalFilteredJuegos.length / itemsPerPage);

  return (
    <div>
      <Header search={search} setSearch={setSearch} />
      <main className="bg-[#0D0D0D] min-h-screen text-[#fff]">
        <div className="container mx-auto px-4 py-8">
          <nav className="grid place-content-center [transition:all_0.5s]">
  <h1 className="text-2xl font-bold mb-4 grid place-content-center">Juegos de Xbox</h1>
  <ul
    className="
      flex flex-wrap justify-center gap-2
      bg-[#ffffff36] p-4 mb-12 rounded-lg shadow-md
      w-full max-w-[500px] mx-auto
      tablet:gap-6 [transition:all_0.5s]
    "
  >
    {plataformas.map((plataforma, index) => (
      <li key={index}>
        <button
          onClick={() => {
            setCurrentPlatform(plataforma === currentPlatform ? null : plataforma);
            setCurrentPage(1); // Reiniciar a la primera página
          }}
          className={`${
            plataforma === currentPlatform
              ? "text-purple-400 font-medium transition-all"
              : "text-white font-normal transition-all"
          }`}
        >
          {plataforma}
        </button>
      </li>
    ))}
  </ul>
</nav>
          <section
            className="
              grid 
              grid-cols-1 
              min-[480px]:grid-cols-[220px_220px]
              min-[480px]:relative
              min-[760px]:right-0
              min-[480px]:right-[30%]
              [transition:all_0.5s]
              tablet:grid-cols-3
              desktop:grid-cols-4
              gap-2 
              w-full 
              
              
            "
          >
            {currentJuegos.map((juego) => (
              <article
                key={juego.id}
                className="
                  rounded-lg 
                  [transition:all_0.5s]
                  overflow-hidden 
                  mb-4 
                  w-full 
                  h-[180px] 
                  min-[480px]:h-[170px] 
                  tablet:h-[200px] 
                  tablet:w-[230px]
                  flex flex-col
                "
              >
                <Link href={`${juego.link[0]}`}>
                  <img
                    src={juego.imagen_de_portada[0]}
                    alt={juego.nombre}
                    className="w-full h-[140px] object-cover rounded-t-md"
                  />
                </Link>
                <div className="flex justify-between items-center px-2 py-1">
                  <h3 className="text-base font-normal truncate">{juego.nombre}</h3>
                  <p className="text-base font-semibold">{juego.precio}€</p>
                </div>
              </article>
            ))}
          </section>
          <div className="pagination grid place-content-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-4 py-2 ${
                  currentPage === index + 1 ? "bg-purple-600 rounded text-white" : "bg-gray-200"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}