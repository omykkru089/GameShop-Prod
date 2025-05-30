import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
      <footer className="bg-[#151515] w-full tablet:h-[270px] h-auto grid place-items-center relative bottom-[0vh] [box-shadow:0px_0px_10px_#640F8C]">
      <div className="text-[white] no-underline max-w-[600px] w-full tablet:-mt-[40px] grid place-items-center">
        <div className="flex flex-col tablet:flex-col w-full">
          {/* Contenido principal */}
          <div className="hidden tablet:flex flex-row border-b-[#9F86C0_1px_solid] w-full">
            {/* Tablet y escritorio */}
            <section className="flex flex-col">
              <ul>
                <li className="mb-[10px] w-[200px] p-[5px]"><Link href="#" className="hover:[transition:.1s] hover:text-[#9F86C0]">Términos y condiciones</Link></li>
                <li className="mb-[10px] w-[200px] p-[5px]"><Link href="#" className="hover:[transition:.1s] hover:text-[#9F86C0]">Política de privacidad </Link></li>
                <li className="mb-[10px] w-[200px] p-[5px]"><Link href="#" className="hover:[transition:.1s] hover:text-[#9F86C0]">Contacto</Link></li>
                <li className="mb-[10px] w-[200px] p-[5px]"><Link href="#" className="hover:[transition:.1s] hover:text-[#9F86C0]">Programa de afiliación</Link></li>
              </ul>
            </section>
            <section className="flex justify-center items-center">
              <section className="flex flex-col gap-[50px] ml-[150px]">
                <div className="flex flex-row gap-[10px] relative left-0">
                  <Link href="#" className="rounded-[100%] p-[5px] w-[40px] mr-[5px] hover:[transition:.1s] hover:scale-[1.15] bg-[rgba(0,_110,_255,_0.5)]">
                    <Image className="p-0 w-[40px]" src="/icons8-facebook.svg" alt="icon of the social web facebook" width={100} height={100} />
                  </Link>
                  <Link href="#" className="rounded-[100%] p-[5px] w-[40px] mr-[5px] hover:[transition:.1s] hover:scale-[1.15] bg-[rgba(239,_120,_255,_0.5)]">
                    <Image className="p-0 w-[40px]" src="/icons8-instagram.svg" alt="imagen de instagram" width={100} height={100} />
                  </Link>
                  <Link href="#" className="rounded-[100%] p-[5px] w-[40px] mr-[5px] hover:[transition:.1s] hover:scale-[1.15] bg-[rgba(87,_87,_87,_0.5)]">
                    <Image className="p-0 w-[40px]" src="/icons8-twitter.svg" alt="imagen de twitter" width={100} height={100} />
                  </Link>
                  <Link href="#" className="rounded-[100%] p-[5px] w-[40px] mr-[5px] hover:[transition:.1s] hover:scale-[1.15] bg-[rgba(255,_0,_0,_0.5)]">
                    <Image className="p-0 w-[40px]" src="/icons8-youtube.svg" alt="imagen de youtube" width={100} height={100} />
                  </Link>
                </div>
                <div className="flex flex-row relative -left-[20px]">
                  <Link href="#" className="mr-[10px]">
                    <Image className="w-full relative hover:[transition:.1s] hover:scale-105" src="/google.png" alt="imagen de google" width={100} height={100} />
                  </Link>
                  <Link href="#">
                    <Image className="w-full relative hover:[transition:.1s] hover:scale-105" src="/apple.png" alt="imagen de applestore" width={100} height={100} />
                  </Link>
                </div>
              </section>
            </section>
          </div>

          {/* Versión móvil */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 w-full tablet:hidden">
            {/* Columna 1: Términos */}
            <div className="flex flex-col col-span-1 relative left-8">
              <ul>
                <li className="mb-1 w-full p-1"><Link href="#" className="hover:text-[#9F86C0]">Términos y condiciones</Link></li>
                <li className="mb-1 w-full p-1"><Link href="#" className="hover:text-[#9F86C0]">Política de privacidad</Link></li>
                <li className="mb-1 w-full p-1"><Link href="#" className="hover:text-[#9F86C0]">Contacto</Link></li>
                <li className="mb-1 w-full p-1"><Link href="#" className="hover:text-[#9F86C0]">Programa de afiliación</Link></li>
              </ul>
            </div>
            {/* Columna 2: Redes sociales y apps */}
            <div className="flex flex-col items-center col-span-1 gap-2 relative top-8">
              <div className="flex flex-row flex-wrap justify-center gap-2">
                <Link href="#" className="rounded-full p-1 w-8 h-8 flex items-center justify-center bg-[rgba(0,_110,_255,_0.5)]">
                  <Image className="w-6 h-6" src="/icons8-facebook.svg" alt="facebook" width={24} height={24} />
                </Link>
                <Link href="#" className="rounded-full p-1 w-8 h-8 flex items-center justify-center bg-[rgba(239,_120,_255,_0.5)]">
                  <Image className="w-6 h-6" src="/icons8-instagram.svg" alt="instagram" width={24} height={24} />
                </Link>
                <Link href="#" className="rounded-full p-1 w-8 h-8 flex items-center justify-center bg-[rgba(87,_87,_87,_0.5)]">
                  <Image className="w-6 h-6" src="/icons8-twitter.svg" alt="twitter" width={24} height={24} />
                </Link>
                <Link href="#" className="rounded-full p-1 w-8 h-8 flex items-center justify-center bg-[rgba(255,_0,_0,_0.5)]">
                  <Image className="w-6 h-6" src="/icons8-youtube.svg" alt="youtube" width={24} height={24} />
                </Link>
              </div>
              <div className="flex flex-row gap-2 mt-2">
                <Link href="#">
                  <Image className="w-16 h-8 hover:scale-105 transition" src="/google.png" alt="google" width={64} height={32} />
                </Link>
                <Link href="#">
                  <Image className="w-16 h-8 hover:scale-105 transition" src="/apple.png" alt="apple" width={64} height={32} />
                </Link>
              </div>
            </div>
            {/* Fila de idioma, moneda, ubicación */}
            <div className="col-span-2 flex flex-row justify-center items-center gap-2 mt-2">
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span>España</span>
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
              </svg>
              <span>Español</span>
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>EUR</span>
            </div>
            {/* Fila copyright */}
            <div className="col-span-2 flex justify-center items-center mt-2  text-[grey] text-xs">
              Copyright © 2024 GameShop - All rights reserved
            </div>
          </div>

          {/* Tablet y escritorio: fila inferior */}
          <section className="hidden tablet:flex flex-row justify-between relative -bottom-[35px] w-full">
            <div className="text-[grey] flex flex-nowrap text-[15px]">Copyright © 2024 GameShop - All rights reserved</div>
            <Link href="#" className="hover:[transition:.1s] hover:text-[#9F86C0]">
              <div className="flex flex-row gap-[10px] ml-[20px]">
                <svg className="flex items-center relative bottom-0 left-[5px] w-[20px]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg><div>España</div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m10.5 21 5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 0 1 6-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 0 1-3.827-5.802" />
                </svg><div>Español</div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 7.756a4.5 4.5 0 1 0 0 8.488M7.5 10.5h5.25m-5.25 3h5.25M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg><div>EUR</div>
              </div>
            </Link>
          </section>
        </div>
      </div>
    </footer>
    );
  }