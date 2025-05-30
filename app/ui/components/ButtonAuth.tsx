"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import UserSkeleton from "../Skeletons/UserSkeleton";
import { Suspense, useEffect, useState } from "react";
import { useCart } from "@/context/cart-context";
import { Save } from "lucide-react";
import Image from "next/image";

export default function ButtonAuth() {
  const { items, fetchCart } = useCart(); // Obtener los elementos del carrito y la función para cargar el carrito
  const { data: session, status } = useSession();
  const [itemCount, setItemCount] = useState(0); // Estado para el número total de juegos en el carrito

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/"; // Redirigir a la pantalla de inicio
  };

  if (status === "loading") {
    return (
      <Suspense>
        <div className="ml-[2.08rem]">
          <UserSkeleton />
        </div>
      </Suspense>
    );
  }

  if (session) {
    const isAdmin = session.user?.role === "admin";
    return (
      <div className="flex items-center justify-center gap-[20px] ">
        {/* Botón de administración para usuarios admin */}
        {isAdmin && (
          <>
          <Link href="/panel-de-administracion" className=" mr-[90px] p-[0.35rem] rounded-[5px] hover:[transition:.1s] hover:bg-[#9f86c0d3] absolute right-[100px]"><button>
              <Image
                src="/iconAdmin.png"
                alt="icono admin"
                width={80}
                height={80}
                className="w-20 min-[1180px]:hidden"></Image>
            </button></Link>
          <Link
            href="/panel-de-administracion"
            className="min-[1180px]:bg-[#9f86c070] mr-[90px] p-[0.35rem] rounded-[5px] hover:[transition:.1s] hover:bg-[#9f86c0d3] absolute right-[100px]"
          >
            
            <button className="movil:hidden min-[1180px]:inline  text-white">
              Administración
              </button>
          </Link>
          </>
        )}

        {/* Icono del carrito con el contador dinámico */}
        <div className="relative w-[38px] h-[38px] right-[100px] rounded-sm movil:bottom-4 tablet:bottom-0">
          <Link href="/carrito">
            <img
              src="/carrito-de-compras (1).png"
              alt="iconcarrito"
              className="w-full h-full object-contain relative bottom-[0px]"
            />
            <div className="relative text-[#bb88ff] bg-[#ebdcff] rounded-full w-[20px] h-[20px] grid place-content-center bottom-[40px] left-[25px]">
              {itemCount}
            </div>
          </Link>
        </div>

        {/* Menú desplegable del usuario */}
        <div className="relative right-[105px] bottom-[15px] w-0 h-[20px] mt-0 text-white z-50">
          <ul className="relative flex items-center z-50">
            <li className="relative group  movil:bottom-4 tablet:bottom-0 z-50">
              <Link
                href="/sobre-mi"
                className="flex items-center hover:text-gray-300"
              >
                <button className="h-[65px] w-[48px] pb-30 pb-[4.85rem]">
                  <img
                    src="https://i.fmfile.com/1955hQ3IQgfpfJAh42Rec/IconUser2.png"
                    alt="iconUser"
                    className="h-[50px] w-full z-50"
                  />
                </button>
              </Link>
              <ul className="absolute z-50 right-0 w-[135.5px] hidden bg-[#ddbbf770] rounded-b-md shadow-lg  group-hover:block">
                <li>
                  <div className="block px-4 py-2 z-50 ">{session.user?.email}</div>
                </li>
                <li>
                  <Link
                    href="/sobre-mi"
                    className="block z-50  px-4 py-2 hover:bg-[#ddbbf790]"
                  >
                    Sobre mi
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="block z-50 px-4 py-2 hover:bg-[#ddbbf790] rounded-b-md"
                  >
                    <button onClick={handleSignOut}>Cerrar Sesión</button>
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Si no hay sesión, mostrar botones de inicio de sesión y registro
  return (
    <>
      <Link href={"/login"} className="ml-[35px] desktop:inline tablet:bottom-4">
        <button
          id="login"
          className="desktop:bg-[#9f86c070] mr-[20px] desktop:p-[0.35rem] rounded-[5px] [transition:.40s] hover:[transition:.1s] hover:bg-[#9f86c0d3] right-[110px] top-[25px] "
        >
          <Image src='/iconlogin.png' alt="icono login" width={80} height={80} className="desktop:hidden tablet:w-12 movil:w-12 [transition:.100s] "></Image>
          <span className="desktop:inline movil:hidden [transition:.3s] text-white">Iniciar Sesión</span>
        </button>
      </Link>

      <Link href={"/register"}>
        <button
          id="register"
          className="desktop:bg-[#9f86c070] mr-[20px] desktop:p-[0.35rem] rounded-[5px] [transition:.40s] hover:[transition:.1s] hover:bg-[#9f86c0d3]  right-[10px] top-[25px]"
        >
          <Image src='/iconregister.png' alt="icono register" width={80} height={80} className="desktop:hidden tablet:w-12 movil:w-12 [transition:.100]"></Image>
          <span className="desktop:inline movil:hidden [transition:.3s] text-white">Registrarse</span>
        </button>
      </Link>
    </>
  );
}