"use client";

import { useEffect, useState } from "react";
import { Footer } from "../ui/footer";
import { Header } from "../ui/header";
import Link from "next/link";
import { Juego } from "../lib/definitions";
import Image from "next/image";
import { useCart } from "../../context/cart-context";
import { useNotification } from "../ui/notification";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button} from "@heroui/react";


interface Params {
  id?: string;
  link?: string;
}

export default function DinamicPage({ params }: { readonly params: Params }) {
  const [juego, setJuego] = useState<Juego | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [plataformas, setPlataformas] = useState<string[]>([]);
  const [currentPlatform, setCurrentPlatform] = useState<string | null>(null);
  const { addToCart } = useCart();
  const { showNotification } = useNotification();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchJuego = async () => {
      try {
        let res;
        if (params.link) {
          res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/juegos/link/${params.link}`);
        } else {
          throw new Error("No se proporcionó un parámetro válido para buscar el juego.");
        }

        if (!res.ok) {
          if (res.status === 404) {
            setJuego(null);
            return;
          }
          throw new Error("Error al obtener los datos del juego.");
        }

        const data = await res.json();
        setJuego({
          id: data.id,
          nombre: data.nombre,
          descripcion: data.descripcion,
          categoria: data.categoria?.nombre ?? "Sin categoría",
          plataforma: data.plataforma ?? { id: 0, nombre: "Sin plataforma" },
          precio: data.precio,
          fecha_de_lanzamiento: data.fecha_de_lanzamiento,
          desarrollador: data.desarrollador?.nombre ?? "Desarrollador desconocido",
          editorial: data.editorial?.nombre ?? "Editorial desconocida",
          clasificacion_por_edad: data.clasificacion_por_edad,
          idiomas: data.idiomas,
          imagen_de_portada: data.imagen_de_portada,
          requisitos_del_sistema: Array.isArray(data.requisitos_del_sistema)
            ? data.requisitos_del_sistema
            : JSON.parse(data.requisitos_del_sistema),
          popularidad: data.popularidad,
          link: data.link,
          carrito: data.carrito,
          video: data.video,
          dispositivo: data.dispositivo ?? "Desconocido",
        });

         // Establecer las plataformas relacionadas
         setPlataformas(data.link ?? []);
         setCurrentPlatform(data.plataforma?.nombre ?? null);

      } catch (error) {
        showNotification("Error al cargar los detalles del juego", "error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJuego();
  }, [params.link, showNotification]);

  if (isLoading) {
    return <p>Cargando detalles del juego...</p>;
  }

  if (!juego) {
    return (
      <div className="w-full h-screen bg-black flex flex-col justify-center items-center gap-y-6">
        <h1 className="text-[#fff] text-9xl"><code>Error 404</code></h1>
        <h1 className="text-[#ff1c1c] text-6xl mb-[8rem]"><code>Página no encontrada</code></h1>
        <p className="text-[#fff] text-4xl underline">
          <Link href="/">Volver a la página principal</Link>
        </p>
      </div>
    );
  }

   // Función para convertir links en nombres de plataformas
   const getPlatformName = (link: string): string => {
    if (link.includes("pc")) return "PC";
    if (link.includes("xbox")) return "Xbox";
    if (link.includes("ps4")) return "PlayStation";
    if (link.includes("nintendo")) return "Nintendo";
    return "Plataforma desconocida";
  };

  // Filtrar plataformas para excluir la actual
  const filteredPlatforms = plataformas.filter(
    (platformLink) => getPlatformName(platformLink) !== currentPlatform
  );

  return (
    <>
      <Header search={search} setSearch={setSearch}/>
      <div className="w-full min-h-screen bg-black flex flex-col items-center">
        <div className="w-full max-w-[1000px] mx-auto px-2 tablet:px-6 py-4">
          {/* Galería y datos principales */}
          <section className="flex flex-col desktop:flex-row items-center justify-center gap-8 pt-6">
            {/* Galería */}
  <article className="w-full hidden desktop:flex desktop:w-[50%] flex-col items-center">
    <div className="relative w-full aspect-[15/9] overflow-hidden rounded-[20px] [box-shadow:0px_0px_8px_#B99DE7]">
      <div className="flex w-full h-full overflow-hidden scroll-smooth [scroll-snap-type:x_mandatory]">
        <iframe
          id="img-0"
          className="min-w-full h-[200px] tablet:h-[250px] desktop:h-[300px] object-cover desktop:object-contain [scroll-snap-align:start]"
          src={juego.video[1]}
          title="Trailer"
        ></iframe>
        {Array.isArray(juego.imagen_de_portada) &&
          juego.imagen_de_portada.map((img, idx) => (
            <Image
              key={idx}
              id={`img-${idx + 1}`}
              width={700}
              height={700}
              src={img}
              className="min-w-full h-[200px] tablet:h-[250px] desktop:h-[300px] object-cover [scroll-snap-align:start]"
              alt={`imagen${idx + 1}`}
              unoptimized
            />
          ))}
      </div>
      {/* Paginación galería */}
      <div className="flex absolute bottom-2 left-1/2 -translate-x-1/2 z-10">
        <Link href="#img-0" className="w-3 h-3 rounded-full bg-white mx-1 opacity-70 hover:opacity-100 transition"></Link>
        {Array.isArray(juego.imagen_de_portada) &&
          juego.imagen_de_portada.map((_, idx) => (
            <Link
              key={idx}
              href={`#img-${idx + 1}`}
              className="w-3 h-3 rounded-full bg-white mx-1 opacity-70 hover:opacity-100 transition"
            ></Link>
          ))}
      </div>
    </div>
  </article>

            {/* Info principal */}
            <article className="w-full desktop:w-[50%] bg-[#ece4f92c] rounded-2xl [box-shadow:0px_0px_10px_#B99DE7] p-4 flex flex-col justify-between min-h-[300px]">
              <div className="text-center font-extrabold text-2xl tablet:text-3xl text-white pt-2 [filter:drop-shadow(0px_0px_10px_#50307C)]">
                {juego.nombre}
              </div>
              <div className="border-b-2 border-[#c5c5c5] pb-1 w-4/5 mx-auto my-2"></div>
              <div className="flex flex-col items-center text-[#2C1C43]">
                <div className="flex flex-wrap gap-2 mt-3 bg-[#ffffff5b] p-2 tablet:p-4 rounded-md border-2 border-[#A167D8]">
                  <span className="[filter:drop-shadow(0px_0px_2px_#A167D8)]">
                   <Link href={`${juego.dispositivo.toLowerCase()}`} className="hover:text-[#DDBBF7] transition">
                      {juego?.plataforma?.nombre}
                   </Link>
                  </span>
                  <Image width={100} height={100} src="/check.png" alt="check" className="w-4 h-4 mt-1 [filter:drop-shadow(0px_0px_2px_green)]" />
                  <span className="[filter:drop-shadow(0px_0px_2px_#A167D8)]">En stock</span>
                  <Image width={100} height={100} src="/check.png" alt="check" className="w-4 h-4 mt-1 [filter:drop-shadow(0px_0px_2px_green)]" />
                  <span className="[filter:drop-shadow(0px_0px_2px_#A167D8)]">Descarga digital</span>
                </div>
              </div>
              {/* Dropdown plataformas */}
              <nav className="w-full flex justify-center mt-4">
                <Dropdown className="gap-2 relative">
                  <DropdownTrigger className="flex items-center gap-2 bg-[#9f86c070] rounded-lg p-2">
                    <Button variant="bordered" className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                      Plataformas
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Plataformas disponibles" className="text-white bg-[#9f86c070] rounded-lg p-2">
                    {filteredPlatforms.map((platformLink, index) => (
                      <DropdownItem
                        key={index}
                        href={platformLink}
                        className="hover:bg-[#c8aaef70] transition rounded-lg p-2"
                      >
                        {getPlatformName(platformLink)}
                      </DropdownItem>
                    ))}
                  </DropdownMenu>
                </Dropdown>
              </nav>
              {/* Precio y botón */}
              <div className="flex flex-col items-center mt-4">
                <div className="flex justify-center text-[#19ff38] text-2xl tablet:text-3xl font-bold border rounded-lg pb-1 border-green-300 w-[85px] mb-2 [filter:drop-shadow(0px_0px_4px_green)]">
                  {juego.precio}€
                </div>
                <button
                  onClick={() => addToCart(juego.id, 1)}
                  className="w-full tablet:w-80 text-white cursor-pointer border border-black rounded px-3 py-2 bg-black transition mt-2 hover:-translate-y-1 hover:bg-[#DDBBF7] hover:shadow-md active:translate-y-0"
                >
                  Comprar Ahora!
                </button>
              </div>
            </article>
          </section>

          {/* Descripción */}
          <section className="w-full mt-10 mb-10">
            <div className="border-t-4 border-[#50307c60] w-4/5 mx-auto rounded-full"></div>
            <article className="px-2 pt-5">
              <h3 className="text-2xl tablet:text-3xl font-bold text-[#805facb2] underline mb-2">Descripción</h3>
              <div className="border-b border-[#3e3546] mt-2 mb-3 w-11/12"></div>
              <p className="w-full text-[#6b6b6b] pl-2">{juego.descripcion}</p>
            </article>
          </section>

          {/* Galería extra y requisitos */}
          <section className="mb-8">
            <article className="flex flex-col items-center gap-5">
              <iframe
                className="w-full tablet:w-[700px] desktop:w-[1000px] h-[200px] tablet:h-[350px] desktop:h-[500px] rounded-xl"
                src={juego.video[1]}
                title="Trailer"
              ></iframe>
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-5 w-full">
                {Array.isArray(juego.imagen_de_portada) &&
                  juego.imagen_de_portada.map((imagen, index) => (
                    <Image
                      key={index}
                      width={700}
                      height={700}
                      src={imagen}
                      unoptimized
                      className="w-full object-cover rounded-xl"
                      alt={`Imagen ${index + 1}`}
                    />
                  ))}
              </div>
            </article>
          </section>

          {/* Requisitos */}
          <span className="w-full flex justify-center text-[#DDBBF7] underline font-bold text-2xl tablet:text-3xl mb-5">
            Windows
          </span>
          <section className="w-full flex justify-center mb-8">
            <article className="w-full tablet:w-[70%] desktop:w-[32vw]">
              <h1 className="text-[#805facb2] text-lg tablet:text-xl font-bold">Requisitos Mínimos</h1>
              <ul className="text-[#838383] font-normal text-sm">
                {Array.isArray(juego.requisitos_del_sistema) &&
                  juego.requisitos_del_sistema.map((requisito, index) => (
                    <li key={index} className="mb-1">
                      {requisito}
                    </li>
                  ))}
              </ul>
            </article>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
}