import Link from 'next/link';


import Image from 'next/image';
import { Header } from '../ui/header';
import { Footer } from '../ui/footer';
import "./styles/csspage.css"
export default function Page() {
  
  return (
    
      <main className='w-full h-full bg-[#1f1f1f] '>
        
        <Header></Header>
        
        <section className='flex items-center justify-center gap-[50px] pt-[20px]'>

          <article>
          <div className="relative max-w-[500px]">
            <div className="flex [aspect-ratio:15/9] overflow-hidden [scroll-snap-type:x_mandatory] rounded-[20px] [box-shadow:0px_0px_8px_#B99DE7]">
              <iframe id='img-0' className='w-[300px] h-[300px] flex-[1_0_100%] object-cover [scroll-snap-align:start]' width="500px" height="300px" src="https://www.youtube.com/embed/x3tedlWs1XY?si=niKt8x_f-kNItjot?&playlist=x3tedlWs1XY&autoplay=0&loop=1" title="Trailer-Borderlands-2" ></iframe>
              <Image id="img-1" width={700} height={700} src="/call-of-duty-black-ops-ii-pc-imagen-1.jpg" className='w-[300px] h-[300px] flex-[1_0_100%] object-cover [scroll-snap-align:start]' alt='imagen1'></Image>
              <Image id="img-2" width={700} height={700} src="/call-of-duty-black-ops-ii-pc-imagen-2.jpg" className='w-[300px] h-[300px] flex-[1_0_100%] object-cover [scroll-snap-align:start]' alt='imagen1'></Image>
              <Image id="img-3" width={700} height={700} src="/call-of-duty-black-ops-ii-pc-imagen-3.jpg" className='w-[300px] h-[300px] flex-[1_0_100%] object-cover [scroll-snap-align:start]' alt='imagen1'></Image>
              <Image id="img-4" width={700} height={700} src="/call-of-duty-black-ops-ii-pc-imagen-4.jpg" className='w-[300px] h-[300px] flex-[1_0_100%] object-cover [scroll-snap-align:start]' alt='imagen1'></Image>
            </div>
            <div className="flex absolute bottom-[3%] left-2/4 [transform:translatex(-50%)] z-[1]">
              <Link href="#img-0" className='relative w-[15px] h-[15px] rounded-[50%] bg-[white] mr-[15px] opacity-[70%] [transition:opacity_ease_250rem] hover:opacity-100'></Link>
              <Link href="#img-1" className='relative w-[15px] h-[15px] rounded-[50%] bg-[white] mr-[15px] opacity-[70%] [transition:opacity_ease_250rem] hover:opacity-100'></Link>
              <Link href="#img-2" className='relative w-[15px] h-[15px] rounded-[50%] bg-[white] mr-[15px] opacity-[70%] [transition:opacity_ease_250rem] hover:opacity-100'></Link>
              <Link href="#img-3" className='relative w-[15px] h-[15px] rounded-[50%] bg-[white] mr-[15px] opacity-[70%] [transition:opacity_ease_250rem] hover:opacity-100'></Link>
              <Link href="#img-4" className='relative w-[15px] h-[15px] rounded-[50%] bg-[white] mr-[15px] opacity-[70%] [transition:opacity_ease_250rem] hover:opacity-100'></Link>
            </div>
            
          </div>
          </article>
          <article>
          <div className='w-[400px] h-[300px] bg-[#ece4f92c] rounded-[2rem] [box-shadow:0px_0px_10px_#B99DE7] relative'>
            <div className=' relative grid place-content-center font-extrabold text-3xl text-[#fff] pt-2 [filter:drop-shadow(0px_0px_10px_#50307C)] '>Call of Duty Black ops 2</div>
            <div className='border-b-[2px] border-[#c5c5c5] pb-1 w-[80%] relative left-[10%]'></div>
              <div className='grid place-content-center w-full text-[#2C1C43]'>
                <div className=' flex gap-2 mt-3 bg-[#ffffff5b] p-4 rounded-md border-[3px] border-[solid] border-[#A167D8] relative'>
                  <span className='[filter:drop-shadow(0px_0px_2px_#A167D8)] '><Link href="#" className='hover:text-[#DDBBF7] [transition:0.2s]'>Steam</Link></span> 
                  <img src="/check.png" alt="check" className='w-2.5 h-2.5 pt-[7px] mr-[-4px] [filter:drop-shadow(0px_0px_2px_green)]'/>
                  <span className='flex flex-row top [filter:drop-shadow(0px_0px_2px_#A167D8)]'>En stock</span> 
                  <img src="/check.png" alt="check" className='w-2.5 h-2.5 pt-[7px] mr-[-4px] [filter:drop-shadow(0px_0px_2px_green)]'/>
                  <span className='flex flex-row [filter:drop-shadow(0px_0px_2px_#A167D8)]'>Descarga digital</span>
                </div>
              </div>

              <nav className="text-white pt-4 flex justify-around mb-[-40px]">
                <ul className="flex items-center space-x-6 w-[120px] bg-[#ddbbf770] p-2 rounded-t-md">
                   {/* <!-- Menú dropdown de Plataforma --> */}
                  <li className="relative group">
                    <Link href="#" className="flex items-center hover:text-gray-300">
                      Plataforma
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                     </svg>
                    </Link>
                    <ul className="absolute z-20 left-[-7.5%] w-[135.5px] hidden bg-[#ddbbf770] rounded-b-md shadow-lg group-hover:block">
                      <li><Link href="#" className="block px-4 py-2 hover:bg-[#ddbbf790]">Xbox</Link></li>
                      <li><Link href="#" className="block px-4 py-2 hover:bg-[#ddbbf790]">PC</Link></li>
                      <li><Link href="#" className="block px-4 py-2 hover:bg-[#ddbbf790] rounded-b-md">PlayStation</Link></li>
                    </ul>
                  </li>
                </ul>
                <ul className="flex items-center space-x-6 w-[120px] bg-[#ddbbf770] p-2 rounded-t-md">
                   {/* <!-- Menú dropdown de Plataforma --> */}
                  <li className="relative group">
                    <Link href="#" className="flex items-center hover:text-gray-300">
                      Ediciones
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                     </svg>
                    </Link>
                    <ul className="absolute z-20 left-[-8.7%]  w-[135.5px] hidden pt-0 bg-[#ddbbf770] rounded-b-md  shadow-lg group-hover:block">
                      <li><Link href="#" className="block px-4 py-2 hover:bg-[#ddbbf790] rounded-b-md">Standard</Link></li>
                    </ul>
                  </li>
                </ul>
              </nav>              
              <div className=' relative flex justify-center text-[#19ff38] text-3xl font-bold top-14 mb-[15px] border-[1px] rounded-lg pb-[2px] border-green-300 w-[85px] left-[40%] '><span className='[filter:drop-shadow(0px_0px_4px_green)]'>60€</span></div>
              <div className='grid place-content-center relative top-[24%]'><button className="w-80 text-[#fff] cursor-pointer border-[1px] border-[solid] border-[black] rounded-[4px] px-[0.3em] py-[0.3em] bg-[black] [transition:0.2s] mt-[-15px] hover:-translate-x-[0] hover:-translate-y-1 hover:bg-[#DDBBF7] hover:[box-shadow:0_0.25rem_#000] active:translate-x-[0] active:[box-shadow:none]">Comprar Ahora!</button></div>
    
            </div>  
          </article>
        </section>
        <section className=' w-[100%] mb-10 '>
        <div className='border-t-[3px] border-[#50307c60] mt-[40px] w-[80%] ml-[10%] rounded-full'></div>
          <article className='ml-[10%] pt-5 '>
            <h3 className='text-3xl font-bold text-[#805facb2] underline mb-2'>Descripcion</h3> 
            <div className='border-b-[1px] border-[#3e3546] mt-2 mb-3 w-[89%]'></div>
            <p className='w-[80%] text-[#6b6b6b] pl-[20px]'>Call of Duty: Black Ops 2 es un shooter en primera persona desarrollado por Treyarch y lanzado en 2012. Es la primera entrega de la saga en presentar una historia no lineal con múltiples finales, ambientada en dos períodos: la Guerra Fría de los años 80 y un futuro en 2025. La trama sigue a David Mason en su lucha contra Raúl Menéndez, un terrorista que busca desatar el caos global. Con un innovador modo multijugador, armas futuristas y el regreso del popular modo Zombis, el juego ofrece una experiencia intensa y variada. Introduce elementos estratégicos en la campaña, permitiendo elecciones que afectan la narrativa. Su multijugador incluye clases personalizables y mapas dinámicos, consolidándolo como uno de los títulos más icónicos de la franquicia Call of Duty.
            </p> 
          </article>
        </section >
        <section className='mb-[20px]'>
          <article className='grid place-content-center gap-5'>
          <iframe className='w-[1000px] h-[500px] rounded-xl' width="1000px" height="300px" src="https://www.youtube.com/embed/x3tedlWs1XY?si=niKt8x_f-kNItjot" title="Trailer-Borderlands-2"></iframe>
          <div className='grid grid-cols-2 gap-5'>
          <Image width={700} height={700} src="/call-of-duty-black-ops-ii-pc-imagen-1.jpg" className='w-[500px]  object-cover rounded-xl' alt='imagen1'></Image>
          <Image width={700} height={700} src="/call-of-duty-black-ops-ii-pc-imagen-2.jpg" className='w-[500px]  object-cover rounded-xl' alt='imagen2'></Image>
          <Image width={700} height={700} src="/call-of-duty-black-ops-ii-pc-imagen-3.jpg" className='w-[500px]  object-cover rounded-xl' alt='imagen3'></Image>
          <Image width={700} height={700} src="/call-of-duty-black-ops-ii-pc-imagen-4.jpg" className='w-[500px]  object-cover rounded-xl' alt='imagen3'></Image>
          </div>
          </article>

        </section>
        <span className='w-full  flex justify-center  align-middle text-[#DDBBF7] underline font-bold text-3xl mb-5'>Windows</span>
        <section className='w-full flex justify-center align-middle relative left-[-19%] gap-6 mb-[30px]'>
          
          <article className='w-[32vw]'>
            <h1 className='text-[#805facb2] text-xl font-bold'>Requisitos Minimos</h1>
            <ul className='text-[#838383] font-normal text-sm '>
              <li className='mb-[2px]'>OS *:Windows Vista SP2 or Windows 7.</li>
              <li className='mb-[2px]'>Processor:Intel Core2 Duo E8200 2.66 GHz or AMD Phenom X3 8750 2.4 GHz</li>
              <li className='mb-[2px]'>Memory:2 GB for 32-bit OS or 4 GB for 64-bit OS</li>
              <li className='mb-[2px]'>Graphics:Nvidia GeForce 8800GT 512 MB or ATI Radeon HD 3870 512 MB</li>
              <li className='mb-[2px]'>DirectX:Version 9.0c</li>
              <li className='mb-[2px]'>Hard Drive:16 GB</li>
              <li className='mb-[2px]'>ound:DirectX 11.0c compatible</li>
              <li>Additional:Broadband connection required for activation and multiplayer gameplay</li>
            </ul>
          </article>
        </section>
        
        <footer ><Footer></Footer></footer>
      </main>
       
  );
}
