'use client'

import React, { useEffect, useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image';
import Link from 'next/link';
import { HomeIcon } from '@heroicons/react/24/outline';
import bcrypt from 'bcryptjs';

const SobreMiPage = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<any | null>(null);
  const [nombre, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!session?.user?.token) return;
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${session.user.token}`,
          },
        });
        if (!res.ok) {
          setUser(null);
          return;
        }
        const currentUser = await res.json();
        setUser(currentUser || null);
        if (currentUser) {
          setName(currentUser.nombre);
          setEmail(currentUser.email);
          setPassword('');
        }
      } catch (err) {
        setUser(null);
      }
    };

    if (session) {
      fetchData();
    }
  }, [session]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (!user || !session?.user?.token) return;
      const updatedFields: { nombre?: string; email?: string; password?: string } = {};

      if (nombre !== user?.nombre) {
        updatedFields.nombre = nombre;
      }
      if (email !== user?.email) {
        updatedFields.email = email;
      }
      if (password) {
        updatedFields.password = await bcrypt.hash(password, 10);
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/users/${user?.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.user.token}`,
          },
          body: JSON.stringify(updatedFields),
        }
      );

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        alert('Usuario actualizado con éxito');
      } else {
        alert('Error al actualizar el usuario (No se ha podido actualizar el usuario)');
      }
    } catch (err) {
      alert('Error al actualizar el usuario (No ha encontrado el usuario)');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  if (!session) {
    return <p>No estás autenticado</p>;
  }

  return (
    <div className='h-screen w-full'>
      {user ? (
        <>
          <header className='h-[50px] w-full flex bg-gray-950'>
            <Link href="/">
              <Image
                src="/GameShop.png"
                alt="icono de la web"
                width={400}
                height={400}
                className='w-[110px] h-[90px] relative top-[-20px] sm:w-[80px] sm:h-[60px]'
              />
            </Link>
            <h1 className='text-white absolute right-[32px] top-[1.5%] text-base sm:text-sm'>{user.nombre}</h1>
          </header>
          <main className='flex h-[93.5%] w-full'>
            <nav className='
              h-full bg-[#ECE4F9] pt-[10px] grid
              w-[60px] sm:w-[100px] lg:w-[150px]
              sm:pt-2
            '>
              <Link
                href="/"
                className='
                  flex items-center font-semibold hover:bg-[#edd7fd] hover:text-[#A167D8]
                  justify-center p-0 sm:justify-start sm:p-2 sm:px-3 lg:justify-start lg:p-2 lg:px-3
                '
              >
                <HomeIcon className='h-7 w-7 mr-0 sm:h-5 sm:w-5 sm:mr-1 lg:h-5 lg:w-5 lg:mr-1' />
                <span className='hidden sm:inline lg:inline'>Home</span>
              </Link>
              <Link
                href="#"
                className='
                  flex items-center text-sm font-semibold hover:bg-[#edd7fd] hover:text-[#A167D8]
                  justify-center p-0 sm:justify-start sm:p-2 sm:px-3 lg:justify-start lg:p-2 lg:px-3
                '
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor"
                  className="w-8 h-8 sm:w-6 sm:h-6 lg:w-6 lg:h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                </svg>
                <button onClick={handleSignOut} className='hidden sm:inline lg:inline w-full'>Cerrar Sesión</button>
              </Link>
            </nav>
            <section className='
              bg-[radial-gradient(ellipse_at_left,_var(--tw-gradient-stops))] from-gray-700 via-gray-900 to-black
              w-full flex flex-col justify-center items-center
              px-1 sm:px-2
            '>
              <h2 className='mb-4 text-[#DDBBF7] border-b-2 border-[#c499ff] text-center text-base sm:text-lg'>Cambia la Información de tu cuenta aquí!👇</h2>
              <form
                onSubmit={handleSubmit}
                className=' [transition:.3s] hover:scale-[1.02]  tablet:bg-[#ffffff21] desktop:bg-[#ffffff21]
                  bg-[#ffffff21] w-[20rem] min-[520px]:w-[25rem] tablet:w-[30rem] desktop:w-[40rem] max-w-[95vw] rounded-3xl flex flex-col justify-center items-center backdrop-filter backdrop-blur-2xl
                  p-2
                  sm:w-[400px] sm:max-w-[90vw] sm:p-4
                  lg:w-[600px] lg:h-[380px] lg:p-0
                '
              >
                <div className='flex flex-col w-full p-2 sm:w-[320px] sm:p-4 lg:w-[500px] mb-[-20px]'>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    placeholder={user.nombre}
                    className='bg-transparent border-2 rounded-xl text-[#edd7fd] border-[#cacaca] placeholder:text-white'
                    value={nombre}
                    onChange={(event) => setName(event.target.value)}
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder={user.email}
                    className='bg-transparent border-2 rounded-xl text-[#edd7fd] border-[#cacaca] placeholder:text-white mt-2'
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Nueva contraseña"
                    className='bg-transparent border-2 rounded-xl text-[#edd7fd] border-[#cacaca] placeholder:text-white mt-2'
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
                >
                  Guardar cambios
                </button>
              </form>
            </section>
          </main>
        </>
      ) : (
        <p>No se encontró el usuario</p>
      )}
    </div>
  );
}

export default SobreMiPage;