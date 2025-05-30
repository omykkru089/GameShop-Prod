"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const LoginPage = () => {
  const [errors, setErrors] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors([]);

    const responseNextAuth = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (responseNextAuth?.error) {
      setErrors(responseNextAuth.error.split(","));
      return;
    }

    router.push("/");
  };

  return (
    <div className="grid place-items-center bg-[url('/fondo-registro2.webp')] w-full h-screen bg-cover font-['montserrat',_sans-serif]">
      <div className="w-full h-screen grid place-items-center">
      <div className="grid place-items-center flex flex-col bg-[#1800252f] w-[300px] h-[270px] [box-shadow:0px_0px_30px_black] rounded-[15px] backdrop-filter backdrop-blur-md">
      <h1 className="mt-[5px] pt-[10px] text-[white] text-[20px] font-bold">Iniciar Sesión</h1>
      <form onSubmit={handleSubmit} className="flex flex-col w-4/5 gap-[10px]">
        <input
          type="email"
          placeholder="Correo"
          name="email"
          className="w-full p-[10px] text-[14px] text-[#fff] tracking-[1px] mb-[10px] border-0 border-b-2 border-white outline-[none] bg-transparent border-b-[1px_solid_#fff] placeholder:tracking-[2px]  placeholder-white"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <input
          type="password"
          placeholder="Contraseña"
          name="password"
          className="w-full p-[10px] text-[14px] text-[#fff] tracking-[1px] mb-[10px] border-0 border-b-2 border-white outline-[none] bg-transparent border-b-[1px_solid_#fff] placeholder:tracking-[2px]  placeholder-white"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <p className="text-[#d9c0fa] text-[12px] font-bold">No tienes cuenta?<span className="text-[#fff]"> Entonces</span> <Link href="/register" className="underline text-[#b2a3c5]">Registrate</Link>!</p>
        <button
          type="submit"
          className="text-[#fff] cursor-pointer border-[1px] border-[solid] border-[black] rounded-[4px] py-[0.3em] bg-[black] [transition:0.2s] mt-[5px] hover:-translate-x-[0] hover:-translate-y-1 hover:bg-[#d690ff] hover:[box-shadow:0_0.25rem_#000] active:translate-x-[0] active:[box-shadow:none]"
        >
          Iniciar Sesión
        </button>
        
      </form>
      </div>
      </div>  

      {errors.length > 0 && (
        <div className="relative -top-[55vh] left-[25vw] bg-[rgba(255,_139,_139,_0.74)] border-[2px] border-[solid] border-[red] rounded-[15px] p-[5px] text-[rgb(182,_0,_0)] font-bold backdrop-filter backdrop-blur-[2px] [box-shadow:0px_0px_15px_red] text-[16px]">
          <ul >
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default LoginPage;