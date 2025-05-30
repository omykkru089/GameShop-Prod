'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { barlow, montserrat } from '../ui/fonts';
import { Juego } from '../lib/definitions';
import GameSkeleton from '../ui/Skeletons/GameSkeleton';
import { useNotification } from './notification';
import { useCart } from '@/context/cart-context';
import { useSearch } from "@/context/search-context";

export function Body({ search }: { search: string }) {
  const [juegos, setGames] = useState<Juego[]>([]); // Inicializa como un array vacío
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<number | null>(null); // Nuevo estado
  const { showNotification } = useNotification();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchJuegos = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/juegos`);
        const data = await res.json();
        setGames(data); // Limita a 6 juegos
      } catch (error) {
        showNotification("Error al cargar los juegos", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJuegos();
  }, [showNotification]);

  if (isLoading) {
    return <div className='grid place-items-center w-full bg-[#0D0D0D]'><div className='grid  p-[20px] bg-[#1f1f1f] pt-[20px] [box-shadow:0px_15px_20px_#640F8C] z-0 mb-[-40px]'><GameSkeleton/><GameSkeleton/><GameSkeleton/></div></div>;
  }

  if (!juegos || juegos.length === 0) {
    return (
      <div className="grid place-items-center w-full bg-[#0D0D0D]">
        <p className="text-white">No hay juegos disponibles.</p>
      </div>
    );
  }

  // Si hay búsqueda, muestra todos los resultados que coincidan
  const juegosFiltrados = search
    ? juegos.filter(j => j.nombre.toLowerCase().includes(search.toLowerCase()))
    : juegos.slice(0, 6); // Si no hay búsqueda, solo muestra los 6 primeros

  if (!juegosFiltrados || juegosFiltrados.length === 0) {
    return (
      <div className="grid place-items-center w-full bg-[#0D0D0D]">
        <p className="text-white">No hay juegos disponibles.</p>
      </div>
    );
  }

  return (
    <div className='grid place-items-center tablet:w-full bg-[#0D0D0D]'>
      {juegosFiltrados.map((juego) => (
 
 <section
  key={juego.id}
  onMouseEnter={() => setHoveredId(juego.id)}
  onMouseLeave={() => setHoveredId(null)}
  className="[box-shadow:0px_15px_20px_#640F8C] grid gap-y-2 pt-[20px] bg-[#1f1f1f] p-[20px] "
><Link href={juego.link[0]} key={juego.id} className=" tablet:w-[650px]
    grid grid-cols-1 grid-rows-[repeat(5,min-content)] gap-y-2
    tablet:grid tablet:grid-cols-3 tablet:grid-rows-4 tablet:gap-x-4 tablet:gap-y-2
       z-0 tablet:mb-[-30px]
  ">
  {/* Imagen y video */}
  <div className="
    tablet:col-span-2 tablet:row-start-1 tablet:row-end-4 tablet:col-start-1
    rounded-[25px] [transition:.3s] hover:scale-[1.02] flex flex-col items-center relative group
    hover:z-10
  ">
    <img
    className="rounded-[25px] col-start-1 col-span-2 row-start-2  pl-2 bg-cover w-full tablet:w-[400px] tablet:h-[220px] z-10 transition-opacity scale-[1.03]"
    src={juego.imagen_de_portada[0]}
    alt={`${juego.nombre} imagen de portada`}
  />
  {/* Video superpuesto solo en hover */}
  {hoveredId === juego.id && (
  <iframe
    className="
      rounded-[25px] bg-cover w-full h-[0px] tablet:absolute tablet:-top-[5px] tablet:left-0 tablet:w-[420px] tablet:h-[230px] 
      opacity-0 pointer-events-none tablet:group-hover:opacity-100 tablet:group-hover:pointer-events-auto tablet:transition-opacity tablet:duration-300
      z-20
    "
    src={juego.video[0]}
    title={`Video de ${juego.nombre}`}
    allow="autoplay; encrypted-media"
  />
  )}
  </div>

  {/* Nombre */}
  <div className="
  flex items-center relative left-4 tablet:left-0 tablet:bg-[#a341ff21] tablet:rounded-lg tablet:justify-center col-start-1 col-span-1 row-start-4  tablet:col-start-3 tablet:row-start-1 tablet:col-span-2 tablet:row-span-1
   tablet:text-xl font-bold text-[#fff] 
">
  {juego.nombre}
</div>

  {/* Precio */}
  <div className="
    flex items-center relative right-8 tablet:right-0  tablet:bg-[#41ff4e21] text-[#5fff54] tablet:text-2xl tablet:rounded-lg tablet:justify-center col-start-2 col-span-2 row-start-4  tablet:col-start-3 tablet:row-start-2 tablet:col-span-2 tablet:row-span-1
      font-bold 
  ">
    {juego.precio}€
  </div>

  {/* Plataforma */}
  <div className={`
    ${montserrat.className}
    flex items-center tablet:bg-[#a341ff21] tablet:rounded-lg tablet:text-xl justify-center tablet:justify-center col-start-1 col-span-2 row-start-3  tablet:col-start-3 tablet:row-start-3 tablet:col-span-2 tablet:row-span-1
      font-bold text-[#fff] border-b-2 pb-2 tablet:pb-0 border-b-purple-200 tablet:border-0
  `}>
    {juego.plataforma.nombre}
  </div>
</Link>
  {/* Botón carrito */}
  <button
    className=" relative bottom-8 tablet:bottom-16 tablet:mb-[-60px]
      z-50 w-[80%]  mx-auto mt-2 bg-[#3CCBFF] rounded-[15px] h-[40px] [box-shadow:0px_0px_7px_lightblue] grid place-content-center
      col-start-1 col-span-2 row-start-5 tablet:col-start-1 tablet:col-span-4 tablet:row-start-4 tablet:row-span-1 tablet:w-full
    "
    onClick={() => addToCart(juego.id, 1)}
  >
    <img
      src="/carro-de-la-compra3.png"
      alt="Icono de carrito"
      className="w-[30px] h-[30px] mx-auto"
    />
  </button>

</section>

))}
      </div>
  );
}